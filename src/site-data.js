const brand = {
  name: "Roofing Champs",
  domain: "https://www.roofingchamps.net",
  phone: "(555) 013-ROOF",
  phoneHref: "tel:+15550137663",
  promise: "Fast roofing help from trusted local roofing professionals.",
};

const services = [
  {
    slug: "roof-repair",
    name: "Roof Repair",
    h1: "Roof Repair Help for Homeowners",
    description:
      "Small roofing problems can turn into expensive interior damage. Roofing Champs helps homeowners request repair estimates for leaks, missing shingles, flashing issues, and storm damage.",
    problems: ["Roof leaks", "Missing shingles", "Damaged flashing", "Water stains", "Wind damage"],
  },
  {
    slug: "emergency-roof-repair",
    name: "Emergency Roof Repair",
    h1: "Emergency Roof Repair Help for Homeowners",
    description:
      "When water is entering your home or storm damage needs fast attention, Roofing Champs helps you start an urgent roofing request.",
    problems: ["Active leaks", "Storm openings", "Ceiling water", "Lifted shingles", "Urgent inspections"],
  },
  {
    slug: "roof-leak-repair",
    name: "Roof Leak Repair",
    h1: "Roof Leak Repair Help for Homeowners",
    description:
      "Roofing Champs helps homeowners request help when rainwater, attic moisture, ceiling stains, or flashing failures point to a roof leak.",
    problems: ["Water stains", "Attic moisture", "Skylight leaks", "Flashing leaks", "Interior dripping"],
  },
  {
    slug: "roof-replacement",
    name: "Roof Replacement",
    h1: "Roof Replacement Estimate Help",
    description:
      "If your roof is old, leaking repeatedly, or showing widespread damage, Roofing Champs helps you request replacement estimates from local roofing professionals.",
    problems: ["Old roof materials", "Repeated leaks", "Widespread shingle loss", "Sagging areas", "Major storm damage"],
  },
  {
    slug: "storm-damage-roof-repair",
    name: "Storm Damage Roof Repair",
    h1: "Storm Damage Roofing Help",
    description:
      "Wind, rain, hail, and debris can damage shingles, flashing, vents, gutters, and roof valleys. Roofing Champs helps homeowners request storm damage inspections and estimates.",
    problems: ["Wind damage", "Hail damage", "Debris impact", "Lifted shingles", "Damaged vents"],
  },
  {
    slug: "roof-inspection",
    name: "Roof Inspection",
    h1: "Roof Inspection Help for Homeowners",
    description:
      "Roofing Champs helps homeowners request roof inspections before leaks spread, after storms, before selling, or when roof age becomes a concern.",
    problems: ["Pre-sale checks", "Storm checks", "Old roof review", "Leak tracing", "Replacement planning"],
  },
  {
    slug: "shingle-roof-repair",
    name: "Shingle Roof Repair",
    h1: "Shingle Roof Repair Help",
    description:
      "Missing, cracked, curled, or lifted shingles can expose your home to water damage. Roofing Champs helps homeowners request shingle roof repair estimates.",
    problems: ["Missing shingles", "Cracked shingles", "Granule loss", "Lifted tabs", "Wind damage"],
  },
  {
    slug: "flat-roof-repair",
    name: "Flat Roof Repair",
    h1: "Flat Roof Repair Help",
    description:
      "Flat and low-slope roofs need attention around drainage, seams, flashing, and roof penetrations. Roofing Champs helps homeowners request flat roof repair support.",
    problems: ["Ponding water", "Drainage issues", "Membrane wear", "Seam leaks", "Flashing damage"],
  },
];

const cities = [
  ["Cape May", "New Jersey", "NJ", "08204", "Cape May County", "coastal-nj", ["North Cape May", "Villas", "Vineland", "Newfield"]],
  ["Elizabeth", "New Jersey", "NJ", "07208", "Union County", "inland-nj", ["West Caldwell", "Stanhope", "Sewell", "Vineland"]],
  ["Newfield", "New Jersey", "NJ", "08344", "Gloucester County", "inland-nj", ["Vineland", "Williamstown", "Sewell", "Turnersville"]],
  ["North Cape May", "New Jersey", "NJ", "08204", "Cape May County", "coastal-nj", ["Cape May", "Villas", "Vineland", "Newfield"]],
  ["Sewell", "New Jersey", "NJ", "08080", "Gloucester County", "inland-nj", ["Turnersville", "Williamstown", "Woodbury Heights", "Vineland"]],
  ["Stanhope", "New Jersey", "NJ", "07874", "Sussex County", "inland-nj", ["West Caldwell", "Elizabeth", "Sewell", "Vineland"]],
  ["Turnersville", "New Jersey", "NJ", "08012", "Gloucester County", "inland-nj", ["Sewell", "Williamstown", "Woodbury Heights", "Vineland"]],
  ["Villas", "New Jersey", "NJ", "08251", "Cape May County", "coastal-nj", ["Cape May", "North Cape May", "Vineland", "Newfield"]],
  ["Vineland", "New Jersey", "NJ", "08360", "Cumberland County", "inland-nj", ["Newfield", "Williamstown", "Sewell", "Cape May"]],
  ["West Caldwell", "New Jersey", "NJ", "07006", "Essex County", "inland-nj", ["Elizabeth", "Stanhope", "Sewell", "Vineland"]],
  ["Williamstown", "New Jersey", "NJ", "08094", "Gloucester County", "inland-nj", ["Turnersville", "Sewell", "Woodbury Heights", "Vineland"]],
  ["Woodbury Heights", "New Jersey", "NJ", "08097", "Gloucester County", "inland-nj", ["Sewell", "Turnersville", "Williamstown", "Vineland"]],
  ["Culver City", "California", "CA", "90232", "Los Angeles County", "southern-ca", ["Torrance", "San Pedro", "Van Nuys", "Winnetka"]],
  ["Gilroy", "California", "CA", "95020", "Santa Clara County", "central-ca", ["San Jose", "Turlock", "Oakdale", "Culver City"]],
  ["Oakdale", "California", "CA", "95361", "Stanislaus County", "central-ca", ["Turlock", "Gilroy", "San Jose", "Van Nuys"]],
  ["San Jose", "California", "CA", "95148", "Santa Clara County", "central-ca", ["Gilroy", "Turlock", "Oakdale", "Culver City"]],
  ["San Pedro", "California", "CA", "90731", "Los Angeles County", "southern-ca", ["Torrance", "Culver City", "Van Nuys", "Winnetka"]],
  ["Torrance", "California", "CA", "90503", "Los Angeles County", "southern-ca", ["San Pedro", "Culver City", "Van Nuys", "Winnetka"]],
  ["Turlock", "California", "CA", "95380", "Stanislaus County", "central-ca", ["Oakdale", "Gilroy", "San Jose", "Van Nuys"]],
  ["Van Nuys", "California", "CA", "91406", "Los Angeles County", "southern-ca", ["Winnetka", "Culver City", "Torrance", "San Pedro"]],
  ["Winnetka", "California", "CA", "91306", "Los Angeles County", "southern-ca", ["Van Nuys", "Culver City", "Torrance", "San Pedro"]],
].map(([city, state, stateAbbr, zip, county, market, nearby]) => {
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    city,
    state,
    stateAbbr,
    zip,
    county,
    market,
    nearby,
    slug: `roof-repair-${citySlug}-${stateAbbr.toLowerCase()}`,
    url: `/roof-repair-${citySlug}-${stateAbbr.toLowerCase()}/`,
    title: `Roof Repair ${city} ${stateAbbr} | Roofing Champs`,
    h1: `Fast Roofing Help in ${city}, ${stateAbbr}`,
    meta: `Leaks, storm damage, or missing shingles? Roofing Champs helps ${city} homeowners request fast roofing estimates from local roofing professionals.`,
  };
});

const marketCopy = {
  "coastal-nj": {
    issues: ["Salt air", "Coastal moisture", "Wind-driven rain", "Flashing corrosion"],
    local:
      "Homes near the South Jersey coast can face roof wear from salt air, coastal moisture, wind-driven rain, and seasonal storms. Shingles, flashing, roof edges, vents, and gutters may deteriorate faster when exposed to repeated moisture and high winds.",
    faq:
      "Yes. Coastal moisture, salt air, wind-driven rain, and storms can accelerate wear on shingles, flashing, vents, and roof edges.",
  },
  "inland-nj": {
    issues: ["Freeze-thaw cycles", "Heavy rain", "Winter leaks", "Aging asphalt shingles"],
    local:
      "Roofs in this part of New Jersey deal with seasonal rain, winter freeze-thaw cycles, wind, and aging asphalt shingles. Missing shingles, cracked flashing, clogged gutters, and worn roof valleys can all lead to leaks if they are not handled quickly.",
    faq:
      "Common issues include missing shingles, leaks, flashing damage, storm damage, clogged gutters, aging roof materials, and ventilation problems.",
  },
  "southern-ca": {
    issues: ["UV exposure", "Dry heat", "Seasonal rain", "Flat and low-slope roof wear"],
    local:
      "Many Southern California homes deal with roof wear from sun exposure, dry heat, seasonal rain, and aging roof materials. Flat and low-slope roofs also need attention around drainage, flashing, seams, and roof penetrations.",
    faq:
      "Yes. Long-term UV exposure and heat can dry out roofing materials, weaken shingles, and contribute to cracking or surface wear.",
  },
  "central-ca": {
    issues: ["Heat exposure", "Seasonal rain", "Tile roof wear", "Expansion and contraction"],
    local:
      "Roofs in Central and Northern California can wear down from heat, sun exposure, seasonal rain, and years of expansion and contraction. Tile, shingle, and low-slope roofs each have different repair needs.",
    faq:
      "Heat and sun exposure can cause roofing materials to expand, contract, dry out, and lose protective granules over time.",
  },
};

const problemPages = [
  ["roof-leaking-after-rain", "Roof Leaking After Rain", "What to Do When Your Roof Leaks After Rain"],
  ["missing-shingles", "Missing Shingles", "What to Do About Missing Shingles"],
  ["storm-damaged-roof", "Storm Damaged Roof", "What to Do About Storm Roof Damage"],
  ["water-stains-on-ceiling", "Water Stains on Ceiling", "What to Do About Ceiling Water Stains"],
  ["roof-flashing-damage", "Roof Flashing Damage", "What to Do About Roof Flashing Damage"],
  ["flat-roof-ponding-water", "Flat Roof Ponding Water", "What to Do About Ponding Water on a Flat Roof"],
  ["old-roof-repair-or-replace", "Old Roof: Repair or Replace", "Should You Repair or Replace an Old Roof?"],
].map(([slug, title, h1]) => ({ slug, title, h1 }));

module.exports = { brand, services, cities, marketCopy, problemPages };
