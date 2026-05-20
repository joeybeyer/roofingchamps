const fs = require("fs");
const path = require("path");
const { brand, services, cities, marketCopy, problemPages } = require("./site-data");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "site");
const builtPages = [];

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const urlFor = (slug = "") => `/${slug ? `${slug}/` : ""}`;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(slug, html, options = {}) {
  const dir = slug ? path.join(out, slug) : out;
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, "index.html"), html);
  if (options.index !== false) {
    builtPages.push({
      slug,
      url: `${brand.domain}${slug ? `/${slug}/` : "/"}`,
      priority: options.priority || (slug ? "0.70" : "1.00"),
    });
  }
}

function page(title, description, body, schema = [], slug = "") {
  const schemaBlocks = schema.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
  const canonical = `${brand.domain}${slug ? `/${slug}/` : "/"}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${brand.domain}/assets/roofing-champs-hero.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/styles.css">
  ${schemaBlocks}
</head>
<body>
  ${header()}
  <main>${body}</main>
  ${footer()}
  <div class="mobile-stick"><a href="${brand.phoneHref}">Call Now for Roofing Help</a></div>
  <script src="/assets/app.js"></script>
</body>
</html>`;
}

function header() {
  return `<header class="site-header">
  <a class="brand" href="/">
    <span class="brand-mark">RC</span>
    <span><strong>Roofing Champs</strong><small>Fast roofing help</small></span>
  </a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav id="site-nav" class="site-nav">
    <a href="/roof-repair/">Roof Repair</a>
    <a href="/emergency-roof-repair/">Emergency Help</a>
    <a href="/roof-replacement/">Replacement</a>
    <a href="/service-areas/">Service Areas</a>
    <a href="/how-it-works/">How It Works</a>
  </nav>
  <a class="header-call" href="${brand.phoneHref}">Call Now</a>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div>
    <a class="brand footer-brand" href="/"><span class="brand-mark">RC</span><span><strong>Roofing Champs</strong><small>${brand.promise}</small></span></a>
    <p>Roofing Champs helps homeowners request roofing estimates for leaks, storm damage, inspections, repairs, and replacements. We do not use fake local addresses or fake reviews.</p>
  </div>
  <div>
    <h2>Services</h2>
    ${services.slice(0, 6).map((service) => `<a href="/${service.slug}/">${service.name}</a>`).join("")}
  </div>
  <div>
    <h2>Company</h2>
    <a href="/about/">About</a>
    <a href="/how-it-works/">How It Works</a>
    <a href="/service-areas/">Service Areas</a>
    <a href="/partner-disclosure/">Partner Disclosure</a>
    <a href="/privacy-policy/">Privacy Policy</a>
    <a href="/terms/">Terms</a>
  </div>
</footer>`;
}

function quoteForm(city = "") {
  return `<form class="quote-form" data-quote-form>
  <div class="form-head">
    <p class="eyebrow">Free roofing estimate request</p>
    <h2>Tell us what is happening with your roof.</h2>
    <p>No obligation. Your property location helps confirm service availability.</p>
  </div>
  <label>What do you need help with?
    <select name="service_requested">
      <option>Roof leak</option>
      <option>Storm damage</option>
      <option>Missing shingles</option>
      <option>Roof replacement</option>
      <option>Roof inspection</option>
      <option>Not sure</option>
    </select>
  </label>
  <label>How soon do you need help?
    <select name="urgency">
      <option>Emergency / ASAP</option>
      <option>This week</option>
      <option>Within 2 weeks</option>
      <option>Just comparing quotes</option>
    </select>
  </label>
  <div class="field-grid">
    <label>City<input name="city" value="${esc(city)}"></label>
    <label>ZIP<input name="zip" inputmode="numeric"></label>
  </div>
  <div class="field-grid">
    <label>Name<input name="name" autocomplete="name"></label>
    <label>Phone<input name="phone" autocomplete="tel"></label>
  </div>
  <label>Email<input name="email" type="email" autocomplete="email"></label>
  <label>Notes<textarea name="notes" rows="3" placeholder="Leak location, roof age, visible damage, or timing"></textarea></label>
  <p class="consent">By submitting this form, you agree to be contacted about your roofing request by phone, text, or email. Consent is not a condition of purchase.</p>
  <button class="btn primary" type="submit">Get My Roofing Estimate</button>
</form>`;
}

function hero({ kicker, h1, description, cta = "Get My Free Roofing Estimate", city = "" }) {
  return `<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">${esc(kicker)}</p>
    <h1>${esc(h1)}</h1>
    <p class="hero-text">${esc(description)}</p>
    <div class="hero-actions">
      <a class="btn primary" href="#quote-form">${esc(cta)}</a>
      <a class="btn secondary" href="${brand.phoneHref}">Call Now for Roofing Help</a>
    </div>
    <ul class="trust-list">
      <li>Fast help for leaks and storm damage</li>
      <li>Repair and replacement estimate requests</li>
      <li>${city ? `Local roofing support for ${esc(city)} homeowners` : "Simple online request process"}</li>
      <li>Emergency leak help available</li>
    </ul>
  </div>
  <figure class="hero-visual">
    <img src="/assets/roofing-champs-hero.png" alt="Roofing professional speaking with a homeowner outside a suburban home">
  </figure>
</section>`;
}

function trustBar() {
  return `<section class="trust-bar">
  <span>Roof repair, replacement, and inspections</span>
  <span>Emergency leak help available</span>
  <span>Fast estimate requests</span>
  <span>Homeowner-friendly process</span>
</section>`;
}

function serviceCards() {
  return `<div class="card-grid services-grid">${services.slice(0, 8).map((service) => `<article class="card">
    <h3>${service.name}</h3>
    <p>${service.description}</p>
    <a href="/${service.slug}/">View service</a>
  </article>`).join("")}</div>`;
}

function faqBlock(faqs) {
  return `<section class="section faq"><div class="section-head"><p class="eyebrow">Answers for homeowners</p><h2>Frequently Asked Questions</h2></div>${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>`;
}

function home() {
  const body = `${hero({
    kicker: "Roofing estimates for leaks, storm damage, and replacements",
    h1: "Fast Roofing Help When Your Home Cannot Wait",
    description:
      "Leaks, storm damage, missing shingles, or an aging roof? Roofing Champs helps homeowners request fast roofing estimates from local roofing professionals.",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">How Roofing Champs helps</p><h2>Start with the problem, then request the right roofing help.</h2><p>Tell us whether you are dealing with a leak, missing shingles, storm damage, an old roof, or another concern. Roofing Champs helps route your request so you can review repair, inspection, or replacement options.</p><div class="mini-list"><span>Roof leaks</span><span>Storm damage</span><span>Replacement estimates</span><span>Roof inspections</span></div></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Roofing services</p><h2>Roofing problems we help homeowners start solving</h2></div>${serviceCards()}</section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Local service pages</p><h2>Roofing help by city</h2></div><div class="link-grid">${cities.slice(0, 12).map((city) => `<a href="${city.url}">${city.city}, ${city.stateAbbr}</a>`).join("")}</div><a class="text-link" href="/service-areas/">View all service areas</a></section>
  ${faqBlock([
    ["What does Roofing Champs do?", "Roofing Champs helps homeowners request roofing estimates for repairs, leaks, storm damage, inspections, and replacements."],
    ["Can I request emergency leak help?", "Yes. If water is actively entering your home, start a roofing request as soon as possible."],
    ["Do I need repair or replacement?", "That depends on roof age, damage severity, leak history, and whether the problem is isolated or widespread."],
    ["Does Roofing Champs use fake local addresses?", "No. City pages use service-area information and do not rely on fake physical offices."],
  ])}`;
  writePage("", page("Roofing Champs | Fast Roofing Help for Homeowners", brand.promise, body, baseSchema(), ""), { priority: "1.00" });
}

function cityPage(city) {
  const market = marketCopy[city.market];
  const faqs = [
    [`Can I request roof repair help in ${city.city}?`, `Yes. Roofing Champs helps ${city.city} homeowners request roofing help for leaks, missing shingles, storm damage, worn flashing, and other repair needs.`],
    [`What are common roofing problems in ${city.city}?`, market.faq],
    ["Can I get help with an emergency roof leak?", "Yes. If water is actively entering your home, you should request help as soon as possible."],
    ["How do I know if my roof needs repair or replacement?", "A roof may need repair if the damage is limited to a small area. Replacement may be better for older roofs, repeated leaks, sagging areas, or widespread damage."],
    ["Do roofers inspect storm damage?", "Yes. A roof inspection can help identify wind, hail, rain, or debris damage that may not be visible from the ground."],
    ["What information should I have ready before requesting an estimate?", "Have the property address, roof issue, approximate roof age, urgency, and contact details ready."],
  ];
  const body = `${hero({ kicker: `Trusted roofing help for ${city.city} homeowners`, h1: city.h1, description: city.meta, city: city.city })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm(city.city)}<div><p class="eyebrow">${city.county}</p><h2>Roofing Help for ${city.city} Homeowners</h2><p>Leaks, storm damage, missing shingles, or an aging roof can quickly turn into a stressful problem. Roofing Champs helps homeowners request fast roofing estimates from local roofing professionals who handle repairs, inspections, storm damage, and replacement projects.</p><p>Whether you noticed water stains after heavy rain, shingles missing after wind, or signs that your roof is reaching the end of its service life, getting the issue checked early can help prevent more expensive damage.</p></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Services in ${city.city}</p><h2>Roof Repair, Replacement, and Inspection Requests</h2></div>${serviceCards()}</section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Local roof conditions</p><h2>Common Roofing Problems in ${city.city}</h2></div><p class="wide-copy">${market.local} Roofing Champs helps local homeowners request inspections and estimates before small roof problems become interior water damage.</p><div class="mini-list">${market.issues.map((issue) => `<span>${issue}</span>`).join("")}</div></section>
  <section class="section two-col"><article><h2>Emergency Roof Leak Help</h2><p>A roof leak should be handled quickly, especially if water is entering the attic, ceiling, walls, or electrical areas. Even a small leak can lead to mold, insulation damage, stained ceilings, and structural issues.</p><a class="btn primary" href="#quote-form">Get Help With a Roof Leak</a></article><article><h2>Storm Damage Roofing Help</h2><p>High winds, heavy rain, hail, and flying debris can damage shingles, flashing, vents, gutters, skylights, and roof valleys. Some storm damage is obvious, while other damage may not be visible from the ground.</p><a class="btn secondary" href="/storm-damage-roof-repair/">Request Storm Damage Help</a></article></section>
  <section class="section two-col band"><article><h2>Do You Need Roof Repair or Roof Replacement?</h2><p>Not every roofing issue requires a full replacement. Some problems can be handled with targeted repair, especially when the roof is otherwise in good condition. Widespread leaks, repeated repairs, old materials, sagging areas, or major storm damage may point toward replacement.</p></article><article><h2>How Roofing Champs Works</h2><ol class="steps"><li>Tell us what is happening with your roof.</li><li>Share your property location.</li><li>Request roofing help and review practical options.</li></ol></article></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Nearby communities</p><h2>Roofing Help Near ${city.city}</h2></div><p>Roofing Champs helps homeowners in ${city.city} and nearby communities request roofing estimates for repairs, replacements, inspections, and storm damage.</p><div class="link-grid">${city.nearby.map((name) => {
    const target = cities.find((item) => item.city === name);
    return target ? `<a href="${target.url}">${target.city}, ${target.stateAbbr}</a>` : `<span>${name}</span>`;
  }).join("")}</div></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Request Roofing Help in ${city.city}</h2><p>Tell us what is happening with your roof and start a free estimate request.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(city.slug, page(city.title, city.meta, body, citySchema(city, faqs), city.slug), { priority: "0.85" });
}

function servicePage(service) {
  const faqs = [
    [`When do homeowners need ${service.name.toLowerCase()}?`, `Homeowners often request ${service.name.toLowerCase()} when they see leaks, visible roof wear, storm damage, or warning signs that should be inspected.`],
    ["Can Roofing Champs help with urgent requests?", "Yes. Roofing Champs helps homeowners start requests for urgent leaks, storm damage, inspections, repairs, and replacement estimates."],
    ["What affects roofing prices?", "Roofing costs vary based on roof size, slope, materials, access, damage severity, decking condition, flashing, ventilation, and project type."],
    ["What happens after I submit a request?", "Your request includes the roofing issue, urgency, property location, and contact details so the next step can be handled clearly."],
  ];
  const body = `${hero({ kicker: `${service.name} estimate requests`, h1: service.h1, description: service.description, cta: service.slug.includes("emergency") ? "Get Help With a Roof Leak" : "Request Roofing Help" })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">When homeowners need this</p><h2>Common Problems This Service Solves</h2><p>${service.description}</p><div class="mini-list">${service.problems.map((problem) => `<span>${problem}</span>`).join("")}</div></div></section>
  <section class="section two-col band"><article><h2>Repair, Inspection, or Replacement Options</h2><p>A small isolated problem may only need targeted repair. Repeated leaks, widespread damage, older materials, or structural concerns may require a larger replacement conversation.</p></article><article><h2>How Roofing Champs Helps</h2><ol class="steps"><li>Tell us the roofing issue.</li><li>Share the property location.</li><li>Request help for repairs, inspections, or replacement options.</li></ol></article></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Service areas</p><h2>Popular local pages</h2></div><div class="link-grid">${cities.slice(0, 8).map((city) => `<a href="${city.url}">${city.city}, ${city.stateAbbr}</a>`).join("")}</div></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Request ${service.name} Help</h2><p>Start a roofing estimate request and get the next step moving.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(service.slug, page(`${service.name} | Roofing Champs`, service.description, body, serviceSchema(service, faqs), service.slug), { priority: "0.80" });
}

function trustPage(slug, title, h1, copy) {
  const body = `${hero({ kicker: "Roofing help made simple", h1, description: copy, cta: "Start My Roofing Request" })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><h2>${h1}</h2><p>${copy}</p><p>Roofing Champs keeps the process clear: describe the issue, share the property location, and request help for repair, inspection, storm damage, or replacement options.</p></div></section>`;
  writePage(slug, page(`${title} | Roofing Champs`, copy, body, baseSchema(), slug), { priority: "0.55" });
}

function serviceAreas() {
  const body = `${hero({ kicker: "Roofing help by city", h1: "Roofing Champs Service Areas", description: "Roofing Champs helps homeowners in selected New Jersey and California communities request roofing estimates for repairs, replacements, inspections, and storm damage." })}
  ${trustBar()}
  <section class="section"><div class="section-head"><p class="eyebrow">New Jersey</p><h2>New Jersey Service Areas</h2></div><div class="link-grid">${cities.filter((city) => city.stateAbbr === "NJ").map((city) => `<a href="${city.url}">${city.city}, NJ</a>`).join("")}</div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">California</p><h2>California Service Areas</h2></div><div class="link-grid">${cities.filter((city) => city.stateAbbr === "CA").map((city) => `<a href="${city.url}">${city.city}, CA</a>`).join("")}</div></section>`;
  writePage("service-areas", page("Service Areas | Roofing Champs", "View Roofing Champs service-area pages for New Jersey and California roofing estimate requests.", body, baseSchema(), "service-areas"), { priority: "0.80" });
}

function problemPage(problem) {
  const body = `${hero({ kicker: "Roofing problem guidance", h1: problem.h1, description: `${problem.title} can point to leaks, storm damage, aging materials, or roof components that need professional attention. Roofing Champs helps homeowners request roofing help before damage spreads.`, cta: "Request Roofing Help" })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><h2>Why This Problem Should Not Be Ignored</h2><p>Roofing problems can move from the exterior into insulation, ceilings, walls, and electrical areas. Getting the issue checked early can help homeowners compare repair, inspection, or replacement options.</p><h2>Can You Fix It Yourself?</h2><p>Homeowners may be able to spot warning signs from the ground, but roof walking, leak tracing, flashing repair, and storm damage evaluation are usually safer for roofing professionals.</p></div></section>
  ${faqBlock([
    [`What causes ${problem.title.toLowerCase()}?`, "Possible causes include age, weather, flashing failure, damaged shingles, roof penetrations, drainage issues, or storm impact."],
    ["When should I request roofing help?", "Request help quickly if water is entering the home, damage is spreading, or you are not sure whether the roof is safe."],
    ["Could this mean I need a new roof?", "Possibly. Replacement depends on roof age, extent of damage, leak history, material condition, and inspection findings."],
  ])}`;
  writePage(problem.slug, page(`${problem.title}: What Homeowners Should Do | Roofing Champs`, `Learn what homeowners should do about ${problem.title.toLowerCase()} and when to request roofing help.`, body, baseSchema(), problem.slug), { priority: "0.65" });
}

function utilityFiles() {
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${builtPages
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${brand.domain}/sitemap.xml
`;

  const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;

  fs.writeFileSync(path.join(out, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(out, "robots.txt"), robots);
  fs.writeFileSync(path.join(out, "_headers"), headers);
}

function notFoundPage() {
  const body = `${hero({
    kicker: "Page not found",
    h1: "This Roofing Champs Page Is Not Available",
    description:
      "The page may have moved, but you can still request roofing help for leaks, storm damage, inspections, repairs, and replacement estimates.",
    cta: "Start My Roofing Request",
  })}
  <section id="quote-form" class="section split">${quoteForm()}<div><h2>Find Roofing Help</h2><p>Use the main service pages or service-area page to continue.</p><div class="link-grid"><a href="/roof-repair/">Roof Repair</a><a href="/emergency-roof-repair/">Emergency Roof Repair</a><a href="/roof-replacement/">Roof Replacement</a><a href="/service-areas/">Service Areas</a></div></div></section>`;
  fs.writeFileSync(
    path.join(out, "404.html"),
    page("Page Not Found | Roofing Champs", "Find Roofing Champs roofing help pages and request a roofing estimate.", body, baseSchema(), "404")
  );
}

function baseSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brand.name,
      url: brand.domain,
      logo: `${brand.domain}/assets/roofing-champs-logo.svg`,
      contactPoint: { "@type": "ContactPoint", telephone: brand.phone, contactType: "customer service" },
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: brand.name, url: brand.domain },
  ];
}

function citySchema(city, faqs) {
  return [
    ...baseSchema(),
    {
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "@id": `${brand.domain}${city.url}#roofingcontractor`,
      name: brand.name,
      url: `${brand.domain}${city.url}`,
      image: `${brand.domain}/assets/roofing-champs-hero.png`,
      telephone: brand.phone,
      priceRange: "$$",
      areaServed: [{ "@type": "City", name: city.city, addressRegion: city.stateAbbr, postalCode: city.zip }],
      serviceType: services.slice(0, 6).map((service) => service.name),
      parentOrganization: { "@type": "Organization", name: brand.name, url: brand.domain },
    },
    faqSchema(faqs),
  ];
}

function serviceSchema(service, faqs) {
  return [
    ...baseSchema(),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      provider: { "@type": "Organization", name: brand.name, url: brand.domain },
      areaServed: cities.map((city) => ({ "@type": "City", name: city.city, addressRegion: city.stateAbbr })),
    },
    faqSchema(faqs),
  ];
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

home();
services.forEach(servicePage);
cities.forEach(cityPage);
serviceAreas();
problemPages.forEach(problemPage);
trustPage("about", "About", "About Roofing Champs", "Roofing Champs helps homeowners get fast roofing help when leaks, storm damage, missing shingles, or old roof materials create stress.");
trustPage("how-it-works", "How It Works", "How Roofing Champs Works", "Tell us what is happening with your roof, share the property location, and request roofing help for repairs, inspections, storm damage, or replacement options.");
trustPage("contact", "Contact", "Contact Roofing Champs", "Start a roofing request online or call for roofing help. Roofing Champs makes the next step clear for homeowners.");
trustPage("reviews", "Reviews", "Roofing Champs Reviews", "Real customer feedback should be added only when it is available. This page is ready for verified reviews and homeowner comments.");
trustPage("partner-disclosure", "Partner Disclosure", "Partner Disclosure", "Roofing Champs may connect homeowners with roofing professionals or service providers. Consent is not a condition of purchase.");
trustPage("privacy-policy", "Privacy Policy", "Privacy Policy", "This page explains how Roofing Champs may collect and use information submitted through roofing request forms.");
trustPage("terms", "Terms", "Terms of Use", "These terms describe use of the Roofing Champs website and roofing request process.");
notFoundPage();
utilityFiles();

console.log(`Built ${cities.length + services.length + problemPages.length + 8} pages in ${out}`);
