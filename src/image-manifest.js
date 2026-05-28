const { services, cities, problemPages, paaPages } = require("./site-data");

const cityScene = {
  CA: "a warm California residential street with dry light, tile and shingle roofs, and a clean branded service truck parked in the driveway",
  NJ: "a New Jersey residential street with mature trees, pitched asphalt roofs, and a clean branded service truck parked near the curb",
};

const baseStyle =
  "photorealistic editorial website hero image, 16:9 landscape, natural light, realistic people, professional roofing context, conversion-focused, no text overlays, no watermark";

const logoReferenceUrl =
  "https://raw.githubusercontent.com/joeybeyer/roofingchamps/main/site/apple-touch-icon.png";

const realLogoRule =
  "Use the provided Roofing Champs logo reference exactly for any visible uniform patch, shirt emblem, vehicle door logo, or vehicle branding. Do not invent a different crest, badge, text mark, mascot, or alternate logo. If the logo would be too small to render accurately, keep it simple and avoid readable text.";

const brandedImage = (job) => ({
  ...job,
  imageInput: [logoReferenceUrl],
});

function pageImageJobs() {
  const jobs = [];

  jobs.push(brandedImage({
    slug: "home",
    title: "Roofing Champs homepage",
    prompt:
      `${baseStyle}. ${realLogoRule} A Roofing Champs employee in a navy polo with the real Roofing Champs logo on the chest stands beside a homeowner and points toward the estimate form area off frame. A navy service truck with matching real Roofing Champs logo branding is visible in the driveway. The employee looks left toward where page copy and CTA will appear. Trustworthy, local home-service feel.`,
  }));

  services.forEach((service, index) => {
    const commercial = service.slug.startsWith("commercial-");
    const setting = commercial
      ? "a low-slope commercial roof and building exterior with HVAC curbs, roof drains, and a branded service truck at ground level"
      : "a residential home exterior with visible rooflines and a branded service truck in the driveway";
    jobs.push(brandedImage({
      slug: service.slug,
      title: service.name,
      prompt:
        `${baseStyle}. ${realLogoRule} Unique service page image for ${service.name}. Scene: ${setting}. Show one or two Roofing Champs employees wearing navy uniforms with the real Roofing Champs logo on the chest. Include a navy truck or van with matching real Roofing Champs logo branding. Show the service context through props: ${service.problems.slice(0, 3).join(", ")}. People should look toward the left side of the frame where the CTA will be. Variant ${index + 1}, different angle and composition from other pages.`,
    }));
  });

  cities.forEach((city, index) => {
    jobs.push(brandedImage({
      slug: city.slug,
      title: `${city.city} ${city.stateAbbr}`,
      prompt:
        `${baseStyle}. ${realLogoRule} Local roofing service hero for ${city.city}, ${city.stateAbbr}. Scene: ${cityScene[city.stateAbbr]}. Show a Roofing Champs employee in a navy uniform with the real Roofing Champs logo speaking with a homeowner, with a navy branded service vehicle using the same real logo visible. Include subtle local roofing conditions, no readable street signs, no text. Person on the right looks left toward website copy and CTA. Variant ${index + 1}.`,
    }));
  });

  problemPages.forEach((problem, index) => {
    jobs.push(brandedImage({
      slug: problem.slug,
      title: problem.title,
      prompt:
        `${baseStyle}. ${realLogoRule} Roofing problem guidance image for ${problem.title}. Show a Roofing Champs employee in a navy branded uniform inspecting or explaining a roof issue safely from ladder or ground level, with homeowner nearby and a branded navy service truck using the real Roofing Champs logo visible. The image should clearly imply ${problem.title.toLowerCase()} without dramatic disaster, no text, no gore, no unsafe roof walking. Employee gaze points left toward CTA. Variant ${index + 1}.`,
    }));
  });

  paaPages.forEach((item, index) => {
    jobs.push(brandedImage({
      slug: item.slug,
      title: item.question,
      prompt:
        `${baseStyle}. ${realLogoRule} FAQ answer page image for the question: ${item.question}. Show a Roofing Champs employee in navy uniform with the real Roofing Champs logo using a clipboard/tablet to explain roofing options to a homeowner. Include a branded navy service vehicle using the same real logo and relevant roof details. Calm educational mood, no text overlays, no charts. Person looks left toward page answer and CTA. Variant ${index + 1}.`,
    }));
  });

  cities
    .filter((city) => ["Culver City", "Gilroy", "Oakdale", "San Jose", "San Pedro", "Torrance", "Turlock", "Van Nuys", "Winnetka", "Elizabeth", "Sewell", "Turnersville", "Vineland", "West Caldwell", "Williamstown"].includes(city.city))
    .forEach((city, index) => {
      const citySlug = city.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      jobs.push(brandedImage({
        slug: `roof-replacement-${citySlug}-${city.stateAbbr.toLowerCase()}`,
        title: `Roof replacement ${city.city}`,
        prompt:
          `${baseStyle}. ${realLogoRule} Roof replacement planning image for ${city.city}, ${city.stateAbbr}. Show Roofing Champs crew members in navy uniforms with the real Roofing Champs logo beside a branded navy service truck using the same real logo, reviewing shingles or roofing materials with a homeowner. Residential roof visible, clean jobsite, no text. Main employee looks left toward the CTA. Variant ${index + 1}.`,
      }));
    });

  return jobs;
}

module.exports = { pageImageJobs };
