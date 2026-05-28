import fs from "node:fs";
import path from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { pageImageJobs } from "../src/image-manifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "site", "assets", "generated");
const rawDir = path.join(outDir, "raw");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const powershell = trimmed.match(/^\$env:([^=]+)=(.*)$/);
    const normal = trimmed.match(/^([^=]+)=(.*)$/);
    const key = powershell ? powershell[1] : normal ? normal[1] : null;
    let value = powershell ? powershell[2] : normal ? normal[2] : "";
    if (!key) continue;
    value = value.trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function slugFilter(jobs) {
  const only = argValue("--only", "");
  if (!only) return jobs;
  const wanted = new Set(only.split(",").map((item) => item.trim()).filter(Boolean));
  return jobs.filter((job) => wanted.has(job.slug));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 240)}`);
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}: ${JSON.stringify(json).slice(0, 600)}`);
  }
  return json;
}

function firstResultUrl(info) {
  const candidates = [
    info?.data?.resultUrls,
    info?.data?.response?.resultUrls,
    info?.data?.response?.imageUrls,
    info?.data?.imageUrls,
    info?.data?.images,
    info?.resultUrls,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate[0]) return candidate[0];
    if (typeof candidate === "string" && candidate.startsWith("http")) return candidate;
  }
  const resultJson = info?.data?.resultJson || info?.data?.response?.resultJson;
  if (typeof resultJson === "string") {
    try {
      return firstResultUrl(JSON.parse(resultJson));
    } catch {
      return "";
    }
  }
  return "";
}

async function createTask(job, apiKey) {
  const body = {
    model: "nano-banana-pro",
    callBackUrl: "",
    input: {
      prompt: job.prompt,
      image_input: job.imageInput || [],
      aspect_ratio: "16:9",
      resolution: "1K",
      output_format: "png",
    },
  };
  const json = await requestJson("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const taskId = json?.data?.taskId || json?.taskId || json?.data?.id;
  if (!taskId) throw new Error(`No taskId returned for ${job.slug}: ${JSON.stringify(json).slice(0, 600)}`);
  return taskId;
}

async function pollTask(taskId, apiKey) {
  const maxPolls = Number(argValue("--polls", "80"));
  for (let i = 0; i < maxPolls; i += 1) {
    const json = await requestJson(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const state = String(json?.data?.state || json?.data?.status || json?.status || "").toLowerCase();
    const url = firstResultUrl(json);
    if (url) return url;
    if (["fail", "failed", "error"].includes(state)) {
      throw new Error(`Task failed ${taskId}: ${JSON.stringify(json).slice(0, 800)}`);
    }
    await wait(5000);
  }
  throw new Error(`Timed out waiting for task ${taskId}`);
}

async function download(url, file) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed ${response.status} for ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(file, buffer);
}

async function optimize(input, output) {
  const branded = input.replace(/\.png$/i, ".branded.png");
  await compositeExactLogo(input, branded);
  const ffmpegArgs = [
    "-y",
    "-i",
    branded,
    "-vf",
    "scale='min(1600,iw)':-2",
    "-c:v",
    "libwebp",
    "-quality",
    "82",
    "-compression_level",
    "6",
    output,
  ];
  const { spawn } = await import("node:child_process");
  await new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", ffmpegArgs, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

async function compositeExactLogo(input, output) {
  const logo = path.join(root, "site", "apple-touch-icon.png");
  const { spawn } = await import("node:child_process");
  const filter =
    "[1:v]scale=92:-1[shirt];" +
    "[1:v]scale=170:-1[truck];" +
    "[0:v][shirt]overlay=W*0.68:H*0.28[tmp];" +
    "[tmp][truck]overlay=W*0.12:H*0.48";
  await new Promise((resolve, reject) => {
    const child = spawn(
      "ffmpeg",
      ["-y", "-i", input, "-i", logo, "-filter_complex", filter, "-frames:v", "1", output],
      { stdio: "ignore" }
    );
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`logo composite exited ${code}`))));
  });
}

async function main() {
  loadEnv();
  const apiKey = process.env.KIE_KEY;

  fs.mkdirSync(rawDir, { recursive: true });
  const limit = Number(argValue("--limit", "0"));
  const force = hasArg("--force");
  let jobs = slugFilter(pageImageJobs());
  if (limit > 0) jobs = jobs.slice(0, limit);

  const manifest = [];
  for (const job of jobs) {
    const rawFile = path.join(rawDir, `${job.slug}.png`);
    const webpFile = path.join(outDir, `${job.slug}.webp`);
    if (hasArg("--optimize-existing")) {
      if (!fs.existsSync(rawFile)) {
        manifest.push({ ...job, status: "missing-raw", file: webpFile });
        continue;
      }
      await optimize(rawFile, webpFile);
      manifest.push({ ...job, status: "optimized-existing", file: webpFile });
      continue;
    }
    if (!force && fs.existsSync(webpFile)) {
      manifest.push({ ...job, status: "exists", file: webpFile });
      continue;
    }
    if (!apiKey) throw new Error("KIE_KEY is missing from .env or environment.");
    console.log(`Generating ${job.slug}`);
    const taskId = await createTask(job, apiKey);
    const imageUrl = await pollTask(taskId, apiKey);
    await download(imageUrl, rawFile);
    await optimize(rawFile, webpFile);
    manifest.push({ ...job, status: "generated", taskId, file: webpFile });
  }

  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Image batch complete: ${manifest.length} assets`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
