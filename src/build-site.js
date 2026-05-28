const fs = require("fs");
const path = require("path");
const { brand, services, cities, marketCopy, problemPages, paaPages } = require("./site-data");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "site");
const builtPages = [];

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const urlFor = (slug = "") => `/${slug ? `${slug}/` : ""}`;

function assetSlug(slug = "") {
  return slug || "home";
}

function pageHeroImage(slug = "") {
  const name = assetSlug(slug);
  const generated = path.join(out, "assets", "generated", `${name}.webp`);
  if (fs.existsSync(generated)) {
    return `/assets/generated/${name}.webp`;
  }
  const homeGenerated = path.join(out, "assets", "generated", "home.webp");
  if (fs.existsSync(homeGenerated)) {
    return "/assets/generated/home.webp";
  }
  return "/apple-touch-icon.png?v=1";
}

const cityProfiles = {
  "Cape May": {
    observed: "Cape May roofs sit close to salt air, wind-driven rain, and seasonal shore storms, so edge metal, flashing, and shingle tabs deserve closer review than a generic inland checklist.",
    repair: "Choose repair when a small shingle field, pipe boot, or flashing joint explains one leak after a coastal rain.",
    inspect: "Choose inspection when staining appears after wind-driven rain but the roof surface looks intact from the ground.",
    replace: "Choose replacement when salt exposure, repeated wind lift, and age show up across several slopes.",
    compare: "Compare by storm date, damaged slope count, attic moisture, roof age, and whether the leak appears only during wind-driven rain.",
    features: ["Edge metal matters when coastal wind pushes rain under roof edges.", "Flashing matters around chimneys and wall transitions where salt air accelerates corrosion.", "Shingle adhesion matters when gusts lift tabs before they fully tear away.", "Vent boots matter when rubber dries and cracks after repeated sun and salt exposure."],
  },
  Elizabeth: {
    observed: "Elizabeth homes often combine older roof assemblies, tight lots, and heavy rain runoff, so water can move from gutters, party-wall edges, and aging flashing into interior stains.",
    repair: "Choose repair when one flashing seam, vent boot, or gutter-edge defect explains a contained leak.",
    inspect: "Choose inspection when stains appear below shared walls, valleys, or roof edges where water can travel before showing indoors.",
    replace: "Choose replacement when older shingles, repeated leaks, and soft decking show that patching one spot will not reset the roof.",
    compare: "Compare by roof age, leak room, prior patch count, gutter condition, and whether neighboring rooflines shed water onto the same area.",
    features: ["Gutter edges matter when dense rooflines concentrate runoff.", "Decking matters when older roofs have absorbed repeated moisture.", "Flashing matters where walls and roof sections meet.", "Ventilation matters when older attic spaces trap heat and shorten shingle life."],
  },
  Newfield: {
    observed: "Newfield roofs see inland New Jersey rain, winter freeze-thaw, and tree debris, which makes valleys, gutters, and aging asphalt shingles common failure points.",
    repair: "Choose repair when a single valley, missing shingle group, or clogged-edge leak explains the damage.",
    inspect: "Choose inspection when water stains follow freeze-thaw weather and the exact opening is not visible.",
    replace: "Choose replacement when brittle shingles, repeated leaks, and granule loss appear across multiple roof planes.",
    compare: "Compare by valley debris, shingle brittleness, roof age, attic staining, and whether leaks happen after snow melt or heavy rain.",
    features: ["Valleys matter when leaves slow drainage.", "Starter shingles matter when wind reaches roof edges.", "Underlayment matters after freeze-thaw cycles open small gaps.", "Gutter flow matters when backed-up water reaches fascia and decking."],
  },
  "North Cape May": {
    observed: "North Cape May roofs face coastal moisture without always looking storm damaged from the street, so small flashing and edge failures can create oversized interior symptoms.",
    repair: "Choose repair when one roof edge, vent boot, or lifted shingle course matches the leak location.",
    inspect: "Choose inspection when ceiling marks appear after coastal wind but shingles still look mostly flat.",
    replace: "Choose replacement when repeated coastal moisture has weakened shingles, flashing, and roof edges across the system.",
    compare: "Compare by wind direction, edge exposure, leak timing, roof age, and whether moisture appears in attic insulation.",
    features: ["Drip edge matters when wind pushes rain under perimeter shingles.", "Pipe boots matter when salt and sun crack rubber collars.", "Fasteners matter when corrosion loosens metal details.", "Attic ventilation matters when coastal humidity lingers after storms."],
  },
  Sewell: {
    observed: "Sewell roofs are inland Gloucester County roofs where heavy rain, winter cycling, and mature trees can turn small shingle or flashing problems into attic moisture.",
    repair: "Choose repair when one damaged slope, boot, or flashing joint matches the indoor stain.",
    inspect: "Choose inspection when the roof has tree cover, attic dampness, or leak symptoms that move with wind direction.",
    replace: "Choose replacement when multiple slopes show curling, granule loss, and repeat leak history.",
    compare: "Compare by shingle condition, tree debris, attic moisture, roof age, and whether the same area was patched before.",
    features: ["Step flashing matters where additions meet the main roof.", "Shingle granules matter when asphalt is aging.", "Ridge ventilation matters when attic heat accelerates wear.", "Valley metal matters when leaves hold water."],
  },
  Stanhope: {
    observed: "Stanhope roofs deal with northern New Jersey freeze-thaw, snow melt, and wooded surroundings, so ice-edge symptoms and valley drainage need careful separation.",
    repair: "Choose repair when one ice-damaged edge, flashing point, or valley section explains the leak.",
    inspect: "Choose inspection when water appears after thawing weather and the leak path could begin uphill.",
    replace: "Choose replacement when older shingles crack, leak in several rooms, or show widespread winter wear.",
    compare: "Compare by snow-melt timing, roof pitch, attic insulation, ice-edge staining, and prior winter repairs.",
    features: ["Ice barrier matters near eaves where thawed water can refreeze.", "Valley drainage matters on wooded lots.", "Attic insulation matters when heat loss contributes to ice edges.", "Flashing matters where roof planes meet walls."],
  },
  Turnersville: {
    observed: "Turnersville roofs often combine suburban asphalt shingles, tree debris, and inland storm rain, so valleys and roof penetrations need close review.",
    repair: "Choose repair when a contained penetration, valley, or shingle patch explains the leak.",
    inspect: "Choose inspection when storm rain exposes a stain but the affected slope has multiple possible entry points.",
    replace: "Choose replacement when age, curling shingles, and leaks on more than one slope appear together.",
    compare: "Compare by damaged slope count, roof age, tree coverage, valley condition, and whether water entered during wind or steady rain.",
    features: ["Pipe boots matter around plumbing vents.", "Valleys matter where leaves slow water.", "Flashing matters around dormers and walls.", "Starter courses matter when wind reaches the roof edge."],
  },
  Villas: {
    observed: "Villas roofs share the coastal moisture profile of lower Cape May County, where wind-driven rain can expose weak edges, vents, and older shingle seals.",
    repair: "Choose repair when one coastal wind-facing edge or vent detail explains the water entry.",
    inspect: "Choose inspection when a leak only appears during directional rain or after a shore storm.",
    replace: "Choose replacement when salt air, UV, and storm exposure have aged shingles across several slopes.",
    compare: "Compare by wind-facing slope, roof age, shingle adhesion, attic moisture, and prior storm repairs.",
    features: ["Shingle seal strips matter when gusts lift tabs.", "Drip edge matters on exposed coastal perimeters.", "Vent boots matter when rubber collars crack.", "Flashing metal matters when corrosion starts around joints."],
  },
  Vineland: {
    observed: "Vineland roofs see inland South Jersey heat, rain, and winter cycling, so asphalt wear, valleys, and flashing failures often show up before major visible roof loss.",
    repair: "Choose repair when one flashing detail, valley, or shingle section explains an isolated stain.",
    inspect: "Choose inspection when granule loss and attic moisture appear before an obvious opening.",
    replace: "Choose replacement when heat-aged shingles, repeated leaks, and multiple worn slopes appear together.",
    compare: "Compare by granule loss, roof age, leak count, valley drainage, and whether the attic shows widespread staining.",
    features: ["Granules matter when sun exposure weakens asphalt.", "Valley drainage matters during heavy rain.", "Decking matters after repeated moisture.", "Ventilation matters when summer heat accelerates aging."],
  },
  "West Caldwell": {
    observed: "West Caldwell roofs face North Jersey rain, winter weather, and mature neighborhood tree cover, so drainage and flashing issues need to be separated from roof-wide age.",
    repair: "Choose repair when a localized flashing, gutter-edge, or shingle defect matches the leak.",
    inspect: "Choose inspection when tree debris, freeze-thaw, and attic staining create more than one possible source.",
    replace: "Choose replacement when older materials show cracking, curling, and recurring leaks across the home.",
    compare: "Compare by tree canopy, roof age, leak history, gutter flow, and winter edge symptoms.",
    features: ["Gutter flow matters under tree cover.", "Step flashing matters near walls and chimneys.", "Starter shingles matter along wind-facing edges.", "Ventilation matters when attic moisture persists."],
  },
  Williamstown: {
    observed: "Williamstown roofs often see inland rain, freeze-thaw, and wooded-lot debris, which makes valleys, gutters, and older asphalt surfaces important decision points.",
    repair: "Choose repair when one roof valley, missing shingle group, or flashing joint explains the issue.",
    inspect: "Choose inspection when water shows after rain but tree debris or roof age creates multiple possible paths.",
    replace: "Choose replacement when multiple slopes show aging, repeated leaks, and brittle shingles.",
    compare: "Compare by shingle brittleness, valley debris, roof age, attic staining, and prior repair count.",
    features: ["Valley clearing matters when leaves hold moisture.", "Underlayment matters when shingles are brittle.", "Flashing matters around roof-wall transitions.", "Ridge ventilation matters when attic heat shortens shingle life."],
  },
  "Woodbury Heights": {
    observed: "Woodbury Heights roofs share the Gloucester County pattern of inland rain, freeze-thaw, and suburban tree cover, so valley drainage and shingle age are central checks.",
    repair: "Choose repair when one roof edge, valley, or flashing point explains the symptom.",
    inspect: "Choose inspection when a ceiling mark appears after rain and there are several possible water paths.",
    replace: "Choose replacement when age, prior patches, and leaks on separate slopes show a roof-wide pattern.",
    compare: "Compare by roof age, leak recurrence, valley debris, attic moisture, and whether the same area was patched before.",
    features: ["Valleys matter when runoff concentrates between roof planes.", "Fascia edges matter when gutters back up.", "Step flashing matters near walls.", "Decking matters when leaks have repeated over time."],
  },
  "Culver City": {
    observed: "Culver City roofs face Southern California UV, dry heat, and seasonal rain, so brittle shingles, cracked sealants, and low-slope drainage deserve more attention than snow-load issues.",
    repair: "Choose repair when one cracked sealant joint, lifted shingle area, or flat-roof seam explains the leak.",
    inspect: "Choose inspection when the first rain after a dry stretch exposes staining without obvious storm damage.",
    replace: "Choose replacement when UV wear, repeated rain leaks, and brittle materials appear across several slopes.",
    compare: "Compare by roof age, low-slope ponding, sealant cracking, leak timing after first rain, and prior patch history.",
    features: ["Sealants matter when dry heat causes cracking.", "Flat-roof seams matter when seasonal rain ponds.", "Shingle brittleness matters after long UV exposure.", "Drainage scuppers matter when debris blocks low-slope flow."],
  },
  Gilroy: {
    observed: "Gilroy roofs see heat, sun, seasonal rain, and expansion-contraction, so tile movement, shingle granule loss, and flashing cracks need separate checks.",
    repair: "Choose repair when a small tile/shingle area, cracked flashing, or roof penetration matches the leak.",
    inspect: "Choose inspection when seasonal rain follows heat exposure and the roof has several aged details.",
    replace: "Choose replacement when roof age, surface wear, and leaks across multiple sections appear together.",
    compare: "Compare by material type, sun exposure, expansion cracks, roof age, and whether leaks follow the first heavy rain.",
    features: ["Expansion joints matter when heat movement opens small gaps.", "Tile underlayment matters when tiles shift.", "Granules matter on asphalt roofs exposed to sun.", "Flashing matters where movement stresses joints."],
  },
  Oakdale: {
    observed: "Oakdale roofs face Central Valley heat, sun, seasonal rain, and agricultural dust, so surface aging and drainage details can fail before dramatic storm damage appears.",
    repair: "Choose repair when one sun-aged shingle section, vent boot, or drainage point explains the leak.",
    inspect: "Choose inspection when roof materials look dry or brittle and rain reveals a hidden path.",
    replace: "Choose replacement when heat aging, repeated leaks, and widespread granule loss show across the roof.",
    compare: "Compare by roof age, sun-facing slope, attic heat, granule loss, and leak timing after dry months.",
    features: ["Ventilation matters during long heat exposure.", "Granule retention matters on sun-facing slopes.", "Pipe boots matter when rubber dries.", "Drainage matters when dust and debris slow water flow."],
  },
  "San Jose": {
    observed: "San Jose roofs can combine tile, asphalt, low-slope sections, heat, and seasonal rain, so the correct repair depends on material and water path.",
    repair: "Choose repair when one cracked tile, flashing point, or shingle area matches the interior symptom.",
    inspect: "Choose inspection when mixed roof materials or low-slope areas create more than one likely source.",
    replace: "Choose replacement when multiple slopes show age, repeated leaks, and material breakdown.",
    compare: "Compare by roof material, slope type, leak count, roof age, and whether water appears after the first rain cycle.",
    features: ["Tile underlayment matters when tiles crack or shift.", "Low-slope drainage matters during seasonal rain.", "Flashing matters around penetrations.", "Ventilation matters when attic heat ages materials."],
  },
  "San Pedro": {
    observed: "San Pedro roofs face coastal air, sun, and marine moisture, so corrosion, edge details, and low-slope drainage need close attention.",
    repair: "Choose repair when one corroded flashing point, vent boot, or roof edge explains the leak.",
    inspect: "Choose inspection when marine moisture and seasonal rain create staining without an obvious missing shingle.",
    replace: "Choose replacement when corrosion, UV wear, and repeated leaks affect several roof areas.",
    compare: "Compare by corrosion signs, wind-facing edge, roof age, low-slope drainage, and prior leak locations.",
    features: ["Metal flashing matters in marine air.", "Low-slope seams matter when water drains slowly.", "Edge details matter during wind-driven rain.", "Sealants matter when sun and salt dry them out."],
  },
  Torrance: {
    observed: "Torrance roofs share Southern California sun exposure with coastal moisture, so sealant cracks, flat-roof seams, and edge details are common decision points.",
    repair: "Choose repair when a single seam, flashing joint, or sun-aged shingle section explains the issue.",
    inspect: "Choose inspection when seasonal rain exposes a stain but the roof has several vulnerable details.",
    replace: "Choose replacement when UV aging, moisture exposure, and repeat leaks show across more than one section.",
    compare: "Compare by roof age, coastal exposure, seam condition, drainage path, and whether leaks recur after patches.",
    features: ["Flat-roof seams matter when ponding persists.", "Sealants matter under UV exposure.", "Flashing matters around roof penetrations.", "Drip edges matter when wind pushes rain under the perimeter."],
  },
  Turlock: {
    observed: "Turlock roofs face Central Valley heat, seasonal rain, and long dry periods, so brittle materials and first-rain leaks need careful diagnosis.",
    repair: "Choose repair when one boot, flashing point, or sun-facing shingle area explains the leak.",
    inspect: "Choose inspection when the first rain after dry weather reveals staining from an unclear source.",
    replace: "Choose replacement when heat-aged shingles, repeated leaks, and broad granule loss appear together.",
    compare: "Compare by sun-facing slope, roof age, granule loss, attic heat, and leak timing after dry months.",
    features: ["Attic ventilation matters during Central Valley heat.", "Granules matter when asphalt dries out.", "Pipe boots matter when rubber collars crack.", "Underlayment matters when surface materials become brittle."],
  },
  "Van Nuys": {
    observed: "Van Nuys roofs see intense Valley heat, UV exposure, and seasonal rain, so dried sealants, brittle shingles, and low-slope drainage are high-priority checks.",
    repair: "Choose repair when one dried sealant joint, vent boot, or low-slope seam explains the leak.",
    inspect: "Choose inspection when heat-aged materials look intact but rain still creates interior staining.",
    replace: "Choose replacement when Valley heat has made several slopes brittle and leaks repeat after patching.",
    compare: "Compare by roof age, sun exposure, low-slope drainage, sealant cracking, and repeated leak locations.",
    features: ["Sealants matter when high heat dries joints.", "Ventilation matters when attic heat accelerates wear.", "Low-slope drainage matters after seasonal rain.", "Shingle flexibility matters when materials turn brittle."],
  },
  Winnetka: {
    observed: "Winnetka roofs deal with Valley heat, sun exposure, and seasonal rain, so the roof surface can age significantly before a leak looks dramatic.",
    repair: "Choose repair when one vent boot, flashing joint, or small brittle-shingle area matches the damage.",
    inspect: "Choose inspection when stains appear after seasonal rain and heat-aged materials create several possible sources.",
    replace: "Choose replacement when broad UV wear, brittle shingles, and repeated leaks point beyond one repair.",
    compare: "Compare by sun-facing slope, roof age, sealant condition, attic heat, and prior patch history.",
    features: ["Ventilation matters when attic heat dries shingles.", "Sealants matter around penetrations.", "Granule loss matters on sun-facing slopes.", "Drainage matters on low-slope sections after seasonal rain."],
  },
};

const serviceProfiles = {
  "Roof Repair": {
    compare: "Compare repair options by leak location, damaged component, roof age, number of affected slopes, and whether a prior repair failed.",
    features: ["Flashing matters when the leak begins at a wall, chimney, skylight, or roof penetration.", "Shingle matching matters when the repair must blend into an existing roof plane.", "Decking condition matters when water has softened the surface below shingles.", "Sealant choice matters when a temporary caulk bead would fail faster than a proper flashing repair."],
  },
  "Emergency Roof Repair": {
    compare: "Compare emergency options by active water entry, safe roof access, tarpable area, interior risk, and whether permanent work can wait 24-72 hours.",
    features: ["Temporary covering matters when rain is still entering the home.", "Access safety matters when wind, darkness, or wet slopes make roof work unsafe.", "Interior containment matters when water reaches ceilings, insulation, or electrical areas.", "Permanent flashing repair matters after the emergency opening is controlled."],
  },
  "Roof Leak Repair": {
    compare: "Compare leak repair options by stain location, rain direction, attic moisture, penetration count, and whether the leak appears during every rain or only wind-driven rain.",
    features: ["Leak tracing matters because water can travel far from the exterior opening.", "Attic inspection matters when insulation hides the path.", "Flashing matters when leaks start near walls or penetrations.", "Water testing matters when the leak cannot be reproduced from visible damage alone."],
  },
  "Roof Replacement": {
    compare: "Compare replacement options by roof age, slope count, decking condition, ventilation, material warranty, and whether repairs are recurring.",
    features: ["Decking matters when old leaks have softened the roof base.", "Ventilation matters because a new roof can age early if attic heat stays trapped.", "Underlayment matters as the secondary water barrier.", "Material selection matters when weight, heat, wind, and warranty length change the long-term value."],
    repair: "Choose repair when an old roof still has one contained defect, solid surrounding shingles, and no history of leaks in other rooms.",
    inspect: "Choose inspection when repeated leaks could come from flashing, ventilation, decking, drainage, or a bad prior repair.",
    replace: "Choose replacement when widespread shingle loss appears together with roof age, recurring leaks, soft decking, or damage across multiple slopes.",
  },
  "Storm Damage Roof Repair": {
    compare: "Compare storm repair options by storm date, wind direction, lifted shingle area, hail marks, damaged vents, and interior water signs.",
    features: ["Lifted shingles matter because the seal can break before shingles detach.", "Vent caps matter when wind or debris cracks roof penetrations.", "Hail marks matter when impact bruises shingles without making holes.", "Photo documentation matters when storm timing and damage need to be matched."],
  },
  "Roof Inspection": {
    compare: "Compare inspection options by roof age, sale timing, storm history, attic access, number of slopes, and whether photos or written findings are needed.",
    features: ["Photo documentation matters when comparing repair bids.", "Attic access matters when stains do not line up with visible roof damage.", "Moisture readings matter when leaks are active or recent.", "Slope-by-slope notes matter when only part of the roof is failing."],
  },
  "Free Roof Inspection": {
    compare: "Compare no-cost inspection requests by urgency, storm date, leak signs, roof age, visible damage, access needs, and whether the inspection should support a repair or replacement estimate.",
    features: ["Photo documentation matters when the roof issue needs to be explained clearly.", "Attic access matters when interior stains do not line up with visible roof damage.", "Storm timing matters when wind or hail may be involved.", "Written scope matters when owners compare repair and replacement options."],
  },
  "Roof Damage Repair": {
    compare: "Compare roof damage repair options by damage source, affected slope count, leak activity, exposed underlayment, flashing condition, roof age, and whether the issue followed a storm.",
    features: ["Exposed underlayment matters when rain can reach the backup layer.", "Flashing condition matters when damage sits near walls, vents, chimneys, or skylights.", "Storm date matters when documentation may be needed.", "Surrounding material condition matters when a patch could disturb brittle shingles."],
  },
  "Shingle Roof Repair": {
    compare: "Compare shingle repair options by missing-tab count, surrounding brittleness, color match, underlayment exposure, and wind-facing slope.",
    features: ["Shingle flexibility matters when old tabs crack during repair.", "Nail placement matters when replacement shingles must seal correctly.", "Underlayment matters when missing shingles exposed the backup layer.", "Color matching matters when the repair sits on a visible front slope."],
  },
  "Flat Roof Repair": {
    compare: "Compare flat roof repair options by ponding time, seam condition, membrane age, drain flow, flashing height, and number of penetrations.",
    features: ["Ponding time matters when water remains after rain stops.", "Seams matter because low-slope roofs fail at joints before broad fields.", "Drainage matters when scuppers or drains clog.", "Flashing height matters where flat roofs meet walls or parapets."],
  },
  "Flat Roof Repair & Install": {
    compare: "Compare low-slope repair and installation options by membrane type, ponding time, seam condition, drain layout, insulation, flashing height, traffic, and whether the existing system can be restored.",
    features: ["Membrane type matters because TPO, EPDM, modified bitumen, and coatings handle seams and heat differently.", "Drainage layout matters when ponding water shortens service life.", "Insulation matters when wet material is trapped below the surface.", "Flashing height matters where low-slope roofing meets walls and parapets."],
  },
  "Metal Roofing": {
    compare: "Compare metal roofing options by panel type, exposed versus concealed fasteners, roof pitch, coating, flashing complexity, noise control, budget, and expected service life.",
    features: ["Fastener type matters because exposed screws need different maintenance than standing seam clips.", "Panel profile matters when slope, wind, and appearance affect the choice.", "Coating matters when sun, salt air, or weather exposure can fade or corrode finishes.", "Flashing details matter because metal systems move with temperature changes."],
  },
  "Commercial Roofing Services": {
    compare: "Compare commercial roofing options by roof area, membrane type, drainage, tenant disruption, access, warranty requirements, and whether the building needs repair, restoration, or replacement.",
    features: ["Drainage matters when ponding water sits near drains, scuppers, or low spots.", "Access matters when crews must work around tenants, loading areas, or business hours.", "Documentation matters when facility teams need photos, service logs, and budget planning.", "Membrane type matters because TPO, EPDM, modified bitumen, metal, and coatings fail in different ways."],
  },
  "Commercial Roof Infrared": {
    compare: "Compare infrared scan options by roof size, suspected leak areas, insulation type, recent rainfall, thermal conditions, and whether the scan will support repair or replacement planning.",
    features: ["Thermal contrast matters because scans need the right temperature conditions.", "Wet insulation matters when moisture is trapped below the membrane.", "Core cuts matter when scan findings need physical confirmation.", "Report photos matter when owners need documentation for budgeting or claims."],
  },
  "Commercial Roof Maintenance": {
    compare: "Compare maintenance plans by visit frequency, roof size, drainage points, membrane age, tenant sensitivity, and required service reporting.",
    features: ["Drain cleaning matters when debris blocks water flow.", "Seam checks matter before small openings spread.", "Service logs matter for warranty and facility records.", "Flashing review matters around HVAC curbs, walls, vents, and roof edges."],
  },
  "Commercial Roof Repair": {
    compare: "Compare commercial repair options by leak location, membrane condition, roof traffic, drainage pattern, wet insulation risk, and business disruption.",
    features: ["Membrane patches matter when punctures or seam failures are isolated.", "Drainage matters when ponding water keeps repairs saturated.", "Flashing matters around HVAC curbs and walls.", "Moisture checks matter when insulation may be wet below the surface."],
  },
  "Commercial Roof Restoration": {
    compare: "Compare restoration options by membrane age, adhesion, seam condition, saturation, coating compatibility, and whether replacement can be deferred responsibly.",
    features: ["Coating compatibility matters because not every membrane accepts every coating.", "Saturation testing matters before coating a wet roof.", "Seam reinforcement matters when joints show early wear.", "Surface preparation matters because coatings fail on dirty or unstable substrates."],
  },
  "Commercial Roof Replacement": {
    compare: "Compare commercial replacement options by membrane type, tear-off scope, insulation value, drainage redesign, business access, code requirements, and warranty length.",
    features: ["Insulation matters for energy performance and code compliance.", "Tear-off scope matters when wet materials are trapped below the membrane.", "Phasing matters when businesses must stay open during work.", "Warranty terms matter when owners compare lifecycle cost."],
  },
  "Residential Roofing Services": {
    compare: "Compare residential roofing options by leak urgency, roof age, storm history, shingle condition, attic moisture, ventilation, material fit, and whether the issue is isolated or roof-wide.",
    features: ["Attic review matters when ceiling stains do not line up directly below the opening.", "Ventilation matters when heat and trapped moisture shorten roof life.", "Flashing details matter around chimneys, walls, vents, and skylights.", "Written scope matters when homeowners compare estimates from more than one contractor."],
  },
  "Residential Roof Repair": {
    compare: "Compare residential repair options by leak source, roof age, shingle condition, flashing details, storm history, and whether the same area has failed before.",
    features: ["Shingle condition matters when nearby tabs are brittle.", "Flashing matters where walls, vents, skylights, and chimneys meet the roof.", "Attic staining matters when the water path is not directly above the ceiling mark.", "Repair history matters when repeated patches suggest a larger issue."],
  },
  "Residential Roof Replacement": {
    compare: "Compare residential replacement options by roof age, slope count, material type, ventilation, decking, tear-off layers, warranty, and cleanup process.",
    features: ["Decking matters when old leaks have softened the roof base.", "Ventilation matters because trapped attic heat shortens roof life.", "Underlayment matters as the backup water barrier.", "Material choice matters when wind, heat, weight, and appearance affect the home."],
  },
  "Custom Design Roofs": {
    compare: "Compare custom roof design options by roof shape, drainage path, material transitions, building use, slope changes, penetrations, and maintenance access.",
    features: ["Drainage layout matters when unusual rooflines create low spots.", "Material transitions matter where flat and steep sections meet.", "Access matters when future maintenance needs safe paths.", "Detailing matters around skylights, parapets, walls, and roof edges."],
  },
};

const problemProfiles = {
  "Roof Leaking After Rain": {
    compare: "Compare next steps by rain direction, leak timing, attic moisture, stain growth, and whether dripping stops quickly after rain ends.",
    features: ["Rain direction matters when wind pushes water under edges.", "Attic staining matters when the ceiling mark is not below the opening.", "Flashing matters when leaks appear near walls or chimneys.", "Drainage matters when backed-up gutters force water under roof edges."],
  },
  "Missing Shingles": {
    compare: "Compare next steps by missing shingle count, exposed underlayment, wind-facing slope, roof age, and whether nearby tabs are loose.",
    features: ["Underlayment exposure matters when the backup layer is open to UV and rain.", "Surrounding brittleness matters because repair can crack older shingles.", "Wind direction matters when tabs lifted before detaching.", "Nail pattern matters when replacement shingles need to seal correctly."],
  },
  "Storm Damaged Roof": {
    compare: "Compare next steps by storm date, wind path, lifted shingles, damaged vents, interior leaks, and whether debris struck the roof.",
    features: ["Lifted tabs matter because broken seals are easy to miss from the ground.", "Vent damage matters when plastic or metal caps crack.", "Debris impact matters when branches bruise shingles.", "Documentation matters when damage needs to be tied to a storm event."],
  },
  "Water Stains on Ceiling": {
    compare: "Compare next steps by stain color, stain growth, room location, attic moisture, rain timing, and whether the mark feels damp.",
    features: ["Stain growth matters when water is still active.", "Attic inspection matters because water may travel along rafters.", "Insulation condition matters when moisture has spread beyond the ceiling mark.", "Flashing matters when stains appear near exterior walls."],
  },
  "Roof Flashing Damage": {
    compare: "Compare next steps by flashing location, metal corrosion, sealant cracks, nearby staining, and whether the flashing is at a wall, chimney, vent, or skylight.",
    features: ["Step flashing matters where roof planes meet walls.", "Counterflashing matters around masonry.", "Sealant condition matters when old caulk hides movement.", "Fastener corrosion matters when metal details loosen."],
  },
  "Flat Roof Ponding Water": {
    compare: "Compare next steps by ponding depth, hours to dry, drain condition, membrane age, seam location, and interior staining below the low spot.",
    features: ["Drying time matters when water remains more than 48 hours.", "Drain flow matters when debris blocks scuppers.", "Membrane seams matter when standing water sits over joints.", "Slope correction matters when repair alone will not move water."],
  },
  "Old Roof: Repair or Replace": {
    compare: "Compare next steps by roof age, leak count, slope count, decking condition, repair history, and whether new damage appears after each storm.",
    features: ["Decking condition matters when old leaks softened the base.", "Ventilation matters before installing new materials.", "Repair history matters when patches are becoming routine.", "Material warranty matters when replacement is already likely."],
  },
};

const replacementCityNames = new Set([
  "Culver City",
  "Gilroy",
  "Oakdale",
  "San Jose",
  "San Pedro",
  "Torrance",
  "Turlock",
  "Van Nuys",
  "Winnetka",
  "Cape May",
  "Elizabeth",
  "Sewell",
  "Turnersville",
  "Vineland",
  "West Caldwell",
  "Williamstown",
]);

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

function page(title, description, body, schema = [], slug = "", contact = brand) {
  const schemaBlocks = schema.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
  const canonical = `${brand.domain}${slug ? `/${slug}/` : "/"}`;
  const heroImage = pageHeroImage(slug);
  const pageBody = body.replaceAll("__PAGE_HERO_IMAGE__", heroImage);
  const ogImage = heroImage.startsWith("/") ? `${brand.domain}${heroImage.split("?")[0]}` : heroImage;
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
  <meta property="og:image" content="${esc(ogImage)}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="/assets/styles.css">
  ${schemaBlocks}
</head>
<body>
  ${header(contact)}
  <main>${pageBody}</main>
  ${footer()}
  <div class="mobile-stick"><a href="${contact.phoneHref}">Call Now for Roofing Help</a></div>
  <script src="/assets/app.js" defer></script>
</body>
</html>`;
}

function header(contact = brand) {
  return `<header class="site-header">
  <a class="brand" href="/">
    <span class="brand-mark"><img src="/apple-touch-icon.png?v=1" alt="" aria-hidden="true"></span>
    <span><span class="brand-name">Roofing Champs</span><small>Fast roofing help</small></span>
  </a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav id="site-nav" class="site-nav">
    <details class="nav-menu">
      <summary>Roof Repair</summary>
      <div class="nav-panel">
        <a href="/roof-repair/">Roof Repair</a>
        <a href="/emergency-roof-repair/">Emergency Roof Repair</a>
        <a href="/roof-leak-repair/">Roof Leak Repair</a>
        <a href="/storm-damage-roof-repair/">Storm Damage Roof Repair</a>
        <a href="/shingle-roof-repair/">Shingle Roof Repair</a>
        <a href="/flat-roof-repair/">Flat Roof Repair</a>
      </div>
    </details>
    <details class="nav-menu">
      <summary>Roof Replacement</summary>
      <div class="nav-panel">
        <a href="/roof-replacement/">Roof Replacement</a>
        <a href="/residential-roof-replacement/">Residential Roof Replacement</a>
        <a href="/commercial-roof-replacement/">Commercial Roof Replacement</a>
        <a href="/roof-replacement-cost/">Roof Replacement Cost</a>
        <a href="/roof-repair-vs-replacement/">Repair vs Replacement</a>
        <a href="/roofing-materials/">Roofing Materials</a>
      </div>
    </details>
    <details class="nav-menu">
      <summary>Roofing Services</summary>
      <div class="nav-panel">
        <a href="/residential-roofing-services/">Residential Roofing Services</a>
        <a href="/commercial-roofing-services/">Commercial Roofing Services</a>
        <a href="/roof-inspection/">Roof Inspection</a>
        <a href="/free-roof-inspection/">Free Roof Inspection</a>
        <a href="/metal-roofing/">Metal Roofing</a>
        <a href="/custom-design-roofs/">Custom Design Roofs</a>
      </div>
    </details>
    <details class="nav-menu nav-menu-wide">
      <summary>Service Areas</summary>
      <div class="nav-panel nav-panel-wide">
        <div>
          <strong>California</strong>
          <a href="/roof-repair-culver-city-ca/">Roof Repair Culver City CA</a>
          <a href="/roof-repair-san-jose-ca/">Roof Repair San Jose CA</a>
          <a href="/roof-repair-torrance-ca/">Roof Repair Torrance CA</a>
          <a href="/roof-repair-van-nuys-ca/">Roof Repair Van Nuys CA</a>
          <a href="/roof-replacement-san-jose-ca/">Roof Replacement San Jose CA</a>
        </div>
        <div>
          <strong>New Jersey</strong>
          <a href="/roof-repair-cape-may-nj/">Roof Repair Cape May NJ</a>
          <a href="/roof-repair-vineland-nj/">Roof Repair Vineland NJ</a>
          <a href="/roof-repair-sewell-nj/">Roof Repair Sewell NJ</a>
          <a href="/roof-repair-west-caldwell-nj/">Roof Repair West Caldwell NJ</a>
          <a href="/roof-replacement-vineland-nj/">Roof Replacement Vineland NJ</a>
        </div>
        <div>
          <strong>All Areas</strong>
          <a href="/service-areas/">Service Areas</a>
          <a href="/roofing-permits-california/">California Roofing Permits</a>
          <a href="/roofing-permits-new-jersey/">New Jersey Roofing Permits</a>
        </div>
      </div>
    </details>
    <details class="nav-menu">
      <summary>Roofing Guides</summary>
      <div class="nav-panel">
        <a href="/faqs/">Roofing FAQs</a>
        <a href="/signs-you-need-a-new-roof/">Signs You Need a New Roof</a>
        <a href="/how-much-does-a-new-roof-cost/">New Roof Cost Guide</a>
        <a href="/how-to-file-insurance-claim-for-roof-damage/">Roof Insurance Claims</a>
        <a href="/best-roofing-material-for-california-heat/">California Roofing Materials</a>
        <a href="/best-roofing-material-for-new-jersey-weather/">New Jersey Roofing Materials</a>
      </div>
    </details>
    <a href="/how-it-works/">How It Works</a>
  </nav>
  <a class="header-call" href="${contact.phoneHref}">Call Now</a>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="footer-top">
    <div class="footer-col footer-brand-col">
      <a class="brand footer-brand" href="/"><span class="brand-mark"><img src="/apple-touch-icon.png?v=1" alt="" aria-hidden="true"></span><span><span class="brand-name">Roofing Champs</span><small>Fast roofing help</small></span></a>
      <p class="footer-blurb">Roofing Champs helps homeowners across California and New Jersey request roofing estimates for leaks, storm damage, inspections, repairs, and replacements. No fake reviews, no fake offices, no pressure calls.</p>
      <div class="footer-contact">
        <a href="${brand.phoneHref}">Call ${brand.phone}</a>
        <a class="secondary" href="/#quote-form">Get a free estimate</a>
      </div>
    </div>
    <div class="footer-col">
      <h2>Services</h2>
      <a href="/roof-repair/">Roof repair</a>
      <a href="/emergency-roof-repair/">Emergency repair</a>
      <a href="/emergency-roof-tarping/">Emergency tarping</a>
      <a href="/roof-leak-repair/">Leak tracing</a>
      <a href="/storm-damage-roof-repair/">Storm damage</a>
      <a href="/roof-inspection/">Inspections</a>
      <a href="/roof-replacement/">Roof replacement</a>
      <a href="/roof-repair-vs-replacement/">Repair vs replacement</a>
      <a href="/roofing-materials/">Roofing materials</a>
      <a href="/commercial-roofing-services/">Commercial roofing</a>
    </div>
    <div class="footer-col">
      <h2>Company</h2>
      <a href="/about/">About</a>
      <a href="/how-it-works/">How it works</a>
      <a href="/service-areas/">Service areas</a>
      <a href="/reviews/">Reviews</a>
      <a href="/faqs/">Roofing FAQs</a>
      <a href="/roof-insurance-claim-help/">Insurance claim help</a>
      <a href="/roof-replacement-cost/">Replacement cost</a>
    </div>
    <div class="footer-col">
      <h2>Where we work</h2>
      <p class="footer-markets">California (Bay Area, Central Valley, LA / South Bay, the Valley) and New Jersey (Cape May County, Gloucester, Essex, North Jersey).</p>
      <a href="/roofing-permits-california/">CA roofing permits</a>
      <a href="/roofing-permits-new-jersey/">NJ roofing permits</a>
      <a href="/best-roofing-material-for-california-heat/">CA material guide</a>
      <a href="/best-roofing-material-for-new-jersey-weather/">NJ material guide</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p class="footer-fineprint">&copy; ${year} Roofing Champs. Roofing Champs may connect homeowners with roofing professionals or service providers in their area. Consent is not a condition of purchase. Estimates are non-binding.</p>
    <div class="footer-legal">
      <a href="/partner-disclosure/">Partner Disclosure</a>
      <a href="/privacy-policy/">Privacy Policy</a>
      <a href="/terms/">Terms</a>
      <a href="/contact/">Contact</a>
    </div>
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
      <option>Commercial roof issue</option>
      <option>Maintenance or restoration</option>
      <option>Custom roof planning</option>
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

function hero({ kicker, h1, description, cta = "Get My Free Roofing Estimate", city = "", phoneHref = brand.phoneHref }) {
  return `<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">${esc(kicker)}</p>
    <h1>${esc(h1)}</h1>
    <p class="hero-text">${esc(description)}</p>
    <div class="hero-actions">
      <a class="btn primary" href="#quote-form">${esc(cta)}</a>
      <a class="btn secondary" href="${phoneHref}">Call Now for Roofing Help</a>
    </div>
    <ul class="trust-list">
      <li>Fast help for leaks and storm damage</li>
      <li>Repair and replacement estimate requests</li>
      <li>${city ? `Local roofing support for ${esc(city)} homeowners` : "Simple online request process"}</li>
      <li>Emergency leak help available</li>
    </ul>
  </div>
  <figure class="hero-visual">
    <img src="__PAGE_HERO_IMAGE__" alt="Roofing Champs roofing help for homeowners" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async">
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

function serviceCards(activeSlug = "") {
  return `<div class="card-grid services-grid">${services.map((service) => `<article class="card" itemscope itemtype="https://schema.org/Service">
    <h3 itemprop="name">${serviceNavLabel(service)}</h3>
    <p itemprop="description">${service.description}</p>
    ${service.slug === activeSlug ? "" : `<a href="/${service.slug}/">View service</a>`}
  </article>`).join("")}</div>`;
}

function serviceNavLabel(service) {
  const labels = {
    "roof-repair": "Fixes and Patches",
    "emergency-roof-repair": "Urgent Leak Help",
    "roof-leak-repair": "Leak Tracing",
    "roof-replacement": "New Roof Options",
    "storm-damage-roof-repair": "Storm Checks",
    "roof-inspection": "Inspection Reports",
    "free-roof-inspection": "No-Cost Roof Check",
    "roof-damage-repair": "Damage Repair Help",
    "commercial-roofing-services": "Building Roof Support",
    "commercial-roof-infrared": "Moisture Scan Help",
    "commercial-roof-maintenance": "Preventive Care",
    "commercial-roof-repair": "Building Leak Fixes",
    "commercial-roof-restoration": "Service-Life Extension",
    "commercial-roof-replacement": "Building Re-Roof Planning",
    "residential-roofing-services": "Home Roofing Support",
    "residential-roof-repair": "Home Leak Fixes",
    "residential-roof-replacement": "Home Re-Roof Planning",
    "shingle-roof-repair": "Shingle Work",
    "flat-roof-repair": "Low-Slope Work",
    "flat-roof-repair-install": "Low-Slope Install Planning",
    "metal-roofing": "Metal Roof Options",
    "custom-design-roofs": "Custom Roof Planning",
  };
  return labels[service.slug] || service.name;
}

function pageContext({ city = null, service = null, problem = null, title = "" } = {}) {
  const cityProfile = city ? cityProfiles[city.city] : null;
  const serviceProfile = service ? serviceProfiles[service.name] : null;
  const problemProfile = problem ? problemProfiles[problem.title] : null;
  const market = city ? marketCopy[city.market] : null;
  const topic = city ? `local roofing help in ${city.city}` : service ? serviceNavLabel(service).toLowerCase() : problem ? problem.title.toLowerCase() : title ? title.toLowerCase() : "roofing help";
  const place = city ? `${city.city}, ${city.stateAbbr}` : "the property";
  const observed = cityProfile
    ? cityProfile.observed
    : city
    ? `${market.issues[0].toLowerCase()} and ${market.issues[1].toLowerCase()} around ${city.county}`
    : service
      ? `${service.problems[0].toLowerCase()} and ${service.problems[1].toLowerCase()}`
      : problem
        ? `${problem.title.toLowerCase()} after weather, age, or roof-component failure`
        : "visible roof damage, roof age, and water movement";
  const repairSignal = cityProfile
    ? cityProfile.repair
    : serviceProfile && serviceProfile.repair
      ? serviceProfile.repair
    : city
    ? `one ${market.issues[0].toLowerCase()}-related weak spot or a contained shingle/flashing defect appears at a ${place} home`
    : service
      ? `${service.problems[0].toLowerCase()} is limited to one slope, one penetration, or one small area`
      : problem
        ? `the ${problem.title.toLowerCase()} traces to one visible opening or one roof component`
        : "one small defect explains the visible problem";
  const inspectionSignal = cityProfile
    ? cityProfile.inspect
    : serviceProfile && serviceProfile.inspect
      ? serviceProfile.inspect
    : city
    ? `the symptom follows local ${market.issues[1].toLowerCase()} but the entry point is not visible from the ground`
    : service
      ? `${service.problems[1].toLowerCase()} could be connected to flashing, ventilation, decking, or drainage`
      : problem
        ? `the cause is not obvious after checking ceilings, attic access, and exterior roof edges`
        : "the water path or storm impact is uncertain";
  const replacementSignal = cityProfile
    ? cityProfile.replace
    : serviceProfile && serviceProfile.replace
      ? serviceProfile.replace
    : city
    ? `the roof is older, leaks repeat across more than one area, or ${market.issues[2].toLowerCase()} has exposed widespread wear`
    : service
      ? `${service.problems[2].toLowerCase()} appears together with age, repeated leaks, or multiple damaged slopes`
      : problem
        ? `the same warning sign returns after repair or appears in several rooms or roof sections`
        : "age and repeated failures make another small repair a short-term answer";
  const compare = cityProfile ? cityProfile.compare : serviceProfile ? serviceProfile.compare : problemProfile ? problemProfile.compare : null;
  const features = cityProfile ? cityProfile.features : serviceProfile ? serviceProfile.features : problemProfile ? problemProfile.features : null;
  return { topic, place, observed, repairSignal, inspectionSignal, replacementSignal, market, compare, features };
}

function decisionFitSection(context = {}) {
  const details = pageContext(context);
  const repairText = details.repairSignal.startsWith("Choose") ? details.repairSignal : `Repair fits when ${details.repairSignal}.`;
  const inspectionText = details.inspectionSignal.startsWith("Choose") ? details.inspectionSignal : `Inspection fits when ${details.inspectionSignal}.`;
  const replacementText = details.replacementSignal.startsWith("Choose") ? details.replacementSignal : `Replacement fits when ${details.replacementSignal}.`;
  return `<section class="section decision-fit">
  <div class="section-head"><p class="eyebrow">Decision fit mapping</p><h2>Which Roofing Option Fits the Problem?</h2></div>
  <div class="decision-grid">
    <article><h3>Choose repair when the damage is isolated.</h3><p><strong>Repair fits</strong>: ${esc(repairText)} The trade-off is a faster, narrower scope versus the possibility that nearby aged materials fail later.</p></article>
    <article><h3>Choose inspection when the cause is unclear.</h3><p><strong>Inspection fits</strong>: ${esc(inspectionText)} The trade-off is one more diagnostic step versus approving work before the true water path is known.</p></article>
    <article><h3>Choose replacement when failures repeat.</h3><p><strong>Replacement fits</strong>: ${esc(replacementText)} The trade-off is higher upfront cost versus solving more of the roof system at one time.</p></article>
  </div>
  <p class="inline-answer">For ${esc(details.topic)}, the useful first question is not "Can this be patched?" The useful question is whether the observed pattern points to a contained defect, an uncertain water path, or a roof-wide issue. ${esc(details.observed)}</p>
</section>`;
}

function customDecisionFit({ topic, heading = "Which Option Actually Fits Your Situation?", options, tradeoffLead = "Each path has a real trade-off. The honest framing matters more than picking the cheapest line item.", framing = "The right path depends on the situation - not the cheapest line item." }) {
  return `<section class="section decision-fit">
  <div class="section-head"><p class="eyebrow">Decision fit mapping</p><h2>${esc(heading)}</h2></div>
  <div class="decision-grid">
    ${options.map(([label, fit, tradeoff]) => `<article><h3>${esc(label)}</h3><p>This path fits when ${esc(fit)} <em>Trade-off:</em> ${esc(tradeoff)}</p></article>`).join("")}
  </div>
  <p class="inline-answer">When you're weighing options for ${esc(topic)}, ${esc(framing)} ${esc(tradeoffLead)}</p>
</section>`;
}

function inlineFollowUp(items) {
  if (!items || !items.length) return "";
  return `<section class="section inline-followup"><div class="section-head"><p class="eyebrow">Follow-up answers</p><h2>Quick Answers To What You're Probably Asking Next</h2></div>${items.map(([q, a]) => `<div class="followup-block" itemscope itemtype="https://schema.org/Question"><h3 itemprop="name">${esc(q)}</h3><div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer"><p itemprop="text">${esc(a)}</p></div></div>`).join("")}</section>`;
}

function kgTripleBand(topic, triples) {
  return `<section class="section kg-band"><div class="section-head"><p class="eyebrow">Quick facts about ${esc(topic)}</p><h2>What Roofing Champs Handles</h2></div><ul class="kg-list">${triples.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>`;
}

function quantifiedSection(context = {}) {
  const details = pageContext(context);
  const marketNumber = context.city && context.city.stateAbbr === "NJ" ? "winter freeze-thaw plus spring rain" : context.city && context.city.stateAbbr === "CA" ? "UV exposure plus seasonal rain" : "weather exposure and roof age";
  return `<section class="section two-col band">
  <article><p class="eyebrow">Quantified option differentiation</p><h2>Numbers That Change the Recommendation</h2><p>A same-day request matters when water is entering living space, electrical areas, or attic insulation. A 24-72 hour inspection window usually fits stains with no active dripping. A 15+ year asphalt roof with repeated leaks deserves a repair-versus-replacement comparison instead of another patch by default.</p></article>
  <article><h2>What To Compare</h2><p>${details.compare || `Compare ${details.topic} options by leak count, roof age, damaged slope count, missing-shingle area, storm date, attic moisture, and prior repair history.`} At ${details.place}, ${marketNumber} changes how quickly a small defect can become a larger roof-system issue.</p></article>
</section>`;
}

function featureUseCaseSection(context = {}) {
  const details = pageContext(context);
  const localIssues = details.market ? details.market.issues.join(", ").toLowerCase() : details.observed;
  const features = details.features || [
    "Flashing matters when water enters around walls, chimneys, skylights, vents, or roof edges.",
    "Underlayment matters when shingles are lifted, cracked, or missing because it slows water before decking.",
    "Ventilation matters when heat and attic moisture shorten shingle life or stain decking.",
    "Drainage matters when valleys, gutters, or low-slope sections hold water against seams.",
  ];
  return `<section class="section">
  <div class="section-head"><p class="eyebrow">Technical feature to use case</p><h2>Roof Details That Matter For The Job</h2></div>
  <div class="card-grid">
    ${features.map((feature) => {
      const name = feature.split(/\s+matters?\s+/)[0];
      return `<article class="card"><h3>${esc(name)}</h3><p>${esc(feature)}</p></article>`;
    }).join("")}
  </div>
  <p class="inline-answer">The most relevant detail here is not the part name; it is the situation where the part fails. For ${details.topic}, ${localIssues} make the inspection focus different from a generic roof checklist.</p>
</section>`;
}

function exactQueryIntro(query, copy) {
  return `<p class="query-intro"><strong>${esc(query)}</strong>: ${esc(copy)}</p>`;
}

function quoteFormTrustCards({ stepsCardTitle = "What happens after you submit", whereTitle = "Where we work" } = {}) {
  return `<div class="trust-cards">
    <article class="trust-card">
      <h3>${esc(stepsCardTitle)}</h3>
      <ol class="steps compact">
        <li>We confirm your area and route the request to a local roofing pro.</li>
        <li>They reach out by your preferred method - phone, text, or email.</li>
        <li>You get a written scope and decide. No pressure, no contracts you didn't ask for.</li>
      </ol>
    </article>
    <article class="trust-card">
      <h3>Why homeowners use Roofing Champs</h3>
      <ul class="check-list">
        <li>Free to request - no card, no contract</li>
        <li>Local pros only - no out-of-state cold calls</li>
        <li>Emergency requests flagged and prioritized</li>
        <li>No fake reviews, no "#1" claims, no fake offices</li>
      </ul>
    </article>
    <article class="trust-card">
      <h3>${esc(whereTitle)}</h3>
      <p>California (Bay Area, Central Valley, LA / South Bay, the Valley) and selected New Jersey communities (Cape May County, Gloucester, North Jersey).</p>
      <div class="mini-list"><a href="/service-areas/">All service areas</a><a href="/about/">About</a><a href="/how-it-works/">How it works</a></div>
    </article>
  </div>`;
}

function cityClusterSection(city) {
  const profile = cityProfiles[city.city];
  const stateName = city.stateAbbr;
  return `<section class="section city-clusters">
  <div class="section-head"><p class="eyebrow">Page-level keyword clusters</p><h2>Local Problem Topics Covered in ${city.city}</h2></div>
  <div class="card-grid">
    <article class="card"><h2>Active Leaks</h2><p>${esc(profile.inspect)} Leak tracing should compare ceiling stains, attic moisture, roof penetrations, and the rain pattern before choosing a repair.</p></article>
    <article class="card"><h2>Urgent Weather Openings</h2><p>Emergency help matters when active water reaches living space, attic insulation, or electrical areas. Temporary tarping can buy time before permanent roof work is scheduled.</p></article>
    <article class="card"><h2>Low-Slope Drainage</h2><p>Flat and low-slope work should check ponding time, seams, drains, scuppers, and wall flashing because small drainage failures can look like broad membrane failure.</p></article>
    <article class="card"><h2>Missing or Lifted Shingles</h2><p>${esc(profile.repair)} Nearby shingle brittleness, exposed underlayment, and color match decide whether a small repair will hold cleanly.</p></article>
    <article class="card"><h2>Storm Evidence</h2><p>Storm repair should document wind-facing slopes, lifted tabs, damaged vents, debris impact, and the storm date so the visible damage matches the weather event.</p></article>
    <article class="card"><h2>Estimate Factors</h2><p>${esc(profile.compare)} Cost changes most when access, roof pitch, material type, decking condition, and urgency change the scope.</p></article>
  </div>
  <p class="inline-answer">These clusters stay on this ${city.city}, ${stateName} page to avoid cannibalizing the broader non-geo service pages. The city page owns geo-modified intent; the service pages own general service education.</p>
</section>`;
}

function faqBlock(faqs) {
  return `<section class="section faq"><div class="section-head"><p class="eyebrow">Answers for homeowners</p><h2>Frequently Asked Questions</h2></div>${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>`;
}

function home() {
  const body = `${hero({
    kicker: "Roofing estimates for leaks, storm damage, and replacements",
    h1: "Fast Roofing Help When Your Home Cannot Wait",
    description:
      "Leak after the last storm? Shingles in the yard? Roof finally looking its age? You're in the right place - we help homeowners get fast, honest roofing estimates from local pros.",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">How this works</p><h2>Start With The Problem - We'll Help You Pick The Right Fix</h2><p>Tell us what's actually happening up there. Leak? Missing shingles? Storm damage? Roof that's gone gray? Just a question? We route your request to local roofing pros so you can compare real options - repair, inspection, or replacement - without the high-pressure sales game.</p><div class="mini-list"><span>Roof leaks</span><span>Storm damage</span><span>Replacement estimates</span><span>Roof inspections</span></div>${quoteFormTrustCards()}</div></section>
  ${decisionFitSection({ title: "Roofing Champs homepage" })}
  ${quantifiedSection({ title: "roofing estimate requests" })}
  ${featureUseCaseSection({ title: "home roofing help" })}
  <section class="section"><div class="section-head"><p class="eyebrow">Roofing services</p><h2>The Stuff We Actually Help Homeowners Sort Out</h2></div>${serviceCards()}</section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Local service pages</p><h2>Roofing Help By City</h2></div><div class="link-grid">${cities.slice(0, 12).map((city) => `<a href="${city.url}">${city.city}, ${city.stateAbbr}</a>`).join("")}</div><a class="text-link" href="/service-areas/">View all service areas</a></section>
  ${faqBlock([
    ["What does Roofing Champs actually do?", "We take homeowner roofing requests - repairs, leaks, storm damage, inspections, replacements - and route them to local roofing pros who do the real work. You stay in charge of the decision."],
    ["Can I get help with an active leak right now?", "Yes - if water's coming in, start a request and flag it as urgent. Emergency tarping can buy time before permanent repair gets scheduled."],
    ["Repair or replacement - how do I tell?", "Honestly, it comes down to roof age, damage severity, leak history, and whether the problem is one spot or roof-wide. A real inspection gives you a real answer. We have a guide on this too."],
    ["Do you use fake addresses or fake reviews?", "No. City pages use service-area info, not pretend offices. And reviews show up only when verified homeowners send them in. Empty space beats invented quotes."],
  ])}`;
  writePage("", page("Roofing Champs | Fast Roofing Help for Homeowners", brand.promise, body, baseSchema(), ""), { priority: "1.00" });
}

function cityPage(city) {
  const query = `Roof Repair ${city.city} ${city.stateAbbr}`;
  const market = marketCopy[city.market];
  const faqs = [
    [`Can I request local help in ${city.city}?`, `Yes. Roofing Champs helps ${city.city} homeowners request roofing help for leaks, missing shingles, storm damage, worn flashing, and other repair needs.`],
    [`What are common roofing problems in ${city.city}?`, market.faq],
    ["Can I get help with an emergency roof leak?", "Yes. If water is actively entering your home, you should request help as soon as possible."],
    ["How do I know if my roof needs repair or replacement?", "A roof may need repair if the damage is limited to a small area. Replacement may be better for older roofs, repeated leaks, sagging areas, or widespread damage."],
    ["Do roofers inspect storm damage?", "Yes. A roof inspection can help identify wind, hail, rain, or debris damage that may not be visible from the ground."],
    ["What information should I have ready before requesting an estimate?", "Have the property address, roof issue, approximate roof age, urgency, and contact details ready."],
  ];
  const locationLine = city.streetAddress
    ? `${city.streetAddress}, ${city.city}, ${city.stateAbbr} ${city.zip}`
    : `${city.city}, ${city.stateAbbr} ${city.zip}`;
  const body = `${hero({ kicker: `Trusted roofing help for ${city.city} homeowners`, h1: city.h1, description: city.meta, city: city.city, phoneHref: city.phoneHref })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm(city.city)}<div><p class="eyebrow">${city.county}</p><h2>Local Help for ${city.city} Homeowners</h2><p class="query-intro"><strong>Real talk for ${city.city}</strong>: ${city.stateAbbr === "NJ" ? "if you've lived through more than two Jersey winters, you already know what freeze-thaw and the occasional nor'easter do to a roof - this page is for when yours is finally talking back." : "if you've owned a place around here long enough to see a wet winter rotate back through after a dry stretch, you already know which roofs handle it and which ones quietly fail - this page is for the moment yours starts showing signs."}</p><p>Leaks, storm damage, missing shingles, an aging roof - any of it can go from "I'll deal with it next month" to "the ceiling is dripping right now" faster than you'd expect. ${city.stateAbbr === "NJ" ? `In ${city.city}, the specific weather patterns and ${marketCopy[city.market].issues[0].toLowerCase()} make some roof failures more common than others.` : `In ${city.city}, the specific exposure - ${marketCopy[city.market].issues[0].toLowerCase()} and ${marketCopy[city.market].issues[1].toLowerCase()} - puts certain parts of the roof under more stress than others.`} Catching it early genuinely saves money.</p><p>Whether you noticed water stains after the last big rain, shingles missing after a wind event, or you're just looking at a roof that's been on this house since the previous owners - getting it checked beats waiting for the next surprise.</p><div class="location-card" itemscope itemtype="https://schema.org/RoofingContractor"><h3 itemprop="name">${brand.name} ${city.city}</h3><p itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">${city.streetAddress ? `<span itemprop="streetAddress">${esc(city.streetAddress)}</span>, ` : ""}<span itemprop="addressLocality">${city.city}</span>, <span itemprop="addressRegion">${city.stateAbbr}</span> <span itemprop="postalCode">${city.zip}</span></p><a itemprop="telephone" href="${city.phoneHref}">${city.phone}</a><meta itemprop="url" content="${brand.domain}${city.url}"><meta itemprop="priceRange" content="$$"><div itemprop="areaServed" itemscope itemtype="https://schema.org/City"><meta itemprop="name" content="${esc(city.city)}"><div itemprop="containedInPlace" itemscope itemtype="https://schema.org/AdministrativeArea"><meta itemprop="name" content="${esc(city.county)}, ${esc(city.state)}"></div></div></div></div></section>
  ${decisionFitSection({ city })}
  ${quantifiedSection({ city })}
  ${featureUseCaseSection({ city })}
  ${cityClusterSection(city)}
  <section class="section"><div class="section-head"><p class="eyebrow">Services in ${city.city}</p><h2>Repair, Replacement, and Inspection Requests</h2></div>${serviceCards()}</section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Local roof conditions</p><h2>Common Roofing Problems in ${city.city}</h2></div><p class="wide-copy">${market.local} Roofing Champs helps local homeowners request inspections and estimates before small roof problems become interior water damage.</p><div class="mini-list">${market.issues.map((issue) => `<span>${issue}</span>`).join("")}</div></section>
  <section class="section two-col"><article><h2>Urgent Leak Help</h2><p>Look - a leak gets worse the longer you wait. Water reaching the attic, ceiling, walls, or anywhere near electrical fixtures spreads damage that costs way more to fix than the original roof problem. Even a small drip is signaling something bigger upstream. Don't sit on it.</p><a class="btn primary" href="#quote-form">Get Help With a Leak</a><p class="mini-link"><a href="/emergency-roof-tarping/">Emergency roof tarping</a></p></article><article><h2>Storm Damage Checks</h2><p>High winds, heavy rain, hail, flying debris - all of it can damage shingles, flashing, vents, gutters, skylights, and roof valleys. Sometimes the damage is obvious from the curb. Sometimes the most expensive damage is the kind you can't see from the ground at all, which is why a real inspection beats a phone-pic assessment.</p><a class="btn secondary" href="/storm-damage-roof-repair/">Request Storm Help</a></article></section>
  <section class="section two-col"><article><p class="eyebrow">Project planning</p><h2>Permits and Inspection Timing</h2><p>Roofing permit and inspection rules vary by ${city.stateAbbr === "NJ" ? "New Jersey municipality" : "California city and county"} and by project scope. A small repair may not need a permit; a full replacement usually does. Confirm with the local building department before approving an estimate.</p><a class="btn secondary" href="${city.stateAbbr === "NJ" ? "/roofing-permits-new-jersey/" : "/roofing-permits-california/"}">${city.stateAbbr === "NJ" ? "NJ roofing permits guide" : "CA roofing permits guide"}</a></article><article><p class="eyebrow">Decision support</p><h2>Repair, Replace, or Compare Materials</h2><p>Before approving a roofing scope, it can help to compare repair-versus-replacement signals and the material options that fit ${city.city}'s climate and roof types.</p><div class="mini-list"><a href="/roof-repair-vs-replacement/">Repair vs replacement</a><a href="/roofing-materials/">Compare roofing materials</a><a href="${city.stateAbbr === "NJ" ? "/best-roofing-material-for-new-jersey-weather/" : "/best-roofing-material-for-california-heat/"}">${city.stateAbbr === "NJ" ? "Best materials for NJ weather" : "Best materials for CA heat"}</a><a href="/roof-replacement-cost/">Replacement cost factors</a><a href="/roof-insurance-claim-help/">Insurance claim help</a></div></article></section>
  <section class="section two-col band"><article><h2>Patch, Inspect, or Replace?</h2><p>Not every roofing issue requires a full replacement. Some problems can be handled with targeted repair, especially when the roof is otherwise in good condition. Widespread leaks, repeated repairs, old materials, sagging areas, or major storm damage may point toward replacement.</p></article><article><h2>How Roofing Champs Works</h2><ol class="steps"><li>Tell us what is happening with your roof.</li><li>Share your property location.</li><li>Request roofing help and review practical options.</li></ol></article></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Nearby communities</p><h2>Roofing Help Near ${city.city}</h2></div><p>Roofing Champs helps homeowners in ${city.city} and nearby communities request roofing estimates for repairs, replacements, inspections, and storm damage.</p><div class="link-grid">${city.nearby.map((name) => {
    const target = cities.find((item) => item.city === name);
    return target ? `<a href="${target.url}">${target.city}, ${target.stateAbbr}</a>` : `<span>${name}</span>`;
  }).join("")}</div></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Request Roofing Help in ${city.city}</h2><p>Tell us what is happening with your roof and start a free estimate request.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(city.slug, page(city.title, city.meta, body, citySchema(city, faqs), city.slug, city), { priority: "0.85" });
}

function serviceRelatedGuides(service) {
  const slug = service.slug;
  const isEmergencyOrStorm = slug.includes("emergency") || slug.includes("storm") || slug === "roof-damage-repair" || slug === "roof-leak-repair";
  const isRepair = slug === "roof-repair" || slug === "residential-roof-repair" || slug === "shingle-roof-repair" || slug === "roof-damage-repair";
  const isReplacement = slug.includes("replacement");
  const isMaterial = slug === "shingle-roof-repair" || slug === "metal-roofing" || slug === "flat-roof-repair" || slug === "flat-roof-repair-install" || slug === "commercial-roof-restoration" || slug === "custom-design-roofs" || slug.includes("replacement");
  const isInspection = slug === "roof-inspection" || slug === "free-roof-inspection";
  const isCommercial = slug.startsWith("commercial-");
  const seenGuides = new Set();
  const seenPaa = new Set();
  const guideLinks = [];
  const paaSlugs = [];
  const pushGuide = (href, label) => {
    if (seenGuides.has(href)) return;
    seenGuides.add(href);
    guideLinks.push([href, label]);
  };
  const pushPaa = (paaSlug) => {
    if (seenPaa.has(paaSlug)) return;
    seenPaa.add(paaSlug);
    paaSlugs.push(paaSlug);
  };

  // Content hubs (chip-style related guides)
  pushGuide("/roof-repair-vs-replacement/", "Repair vs replacement");
  pushGuide("/roofing-materials/", "Compare roofing materials");
  pushGuide("/roof-replacement-cost/", "Replacement cost factors");
  pushGuide("/roof-insurance-claim-help/", "Insurance claim help");
  if (isEmergencyOrStorm) {
    pushGuide("/emergency-roof-tarping/", "Emergency roof tarping");
  }
  if (slug === "roof-replacement" || slug.includes("residential-roof") || slug === "roof-repair") {
    pushGuide("/roofing-permits-california/", "CA roofing permits");
    pushGuide("/roofing-permits-new-jersey/", "NJ roofing permits");
  }

  // PAA pages (card-style with answer preview)
  pushPaa("how-much-does-a-new-roof-cost");
  pushPaa("how-to-choose-a-roofing-contractor");
  if (isEmergencyOrStorm) {
    pushPaa("how-to-spot-a-roof-leak");
    pushPaa("how-much-does-it-cost-to-repair-a-roof-leak");
    pushPaa("how-long-after-roof-leak-mold-grow");
    pushPaa("does-homeowners-insurance-cover-roof-replacement");
  }
  if (isRepair) {
    pushPaa("how-much-does-it-cost-to-repair-a-roof-leak");
    pushPaa("how-to-spot-a-roof-leak");
    pushPaa("roof-repair-vs-restoration");
    pushPaa("signs-you-need-a-new-roof");
  }
  if (isReplacement) {
    pushPaa("signs-you-need-a-new-roof");
    pushPaa("what-is-a-roof-warranty");
    pushPaa("how-to-read-a-roofing-estimate");
    pushPaa("do-new-roofs-add-home-value");
    pushPaa("will-my-insurance-drop-me-if-my-roof-is-old");
    pushPaa("how-long-does-roof-installation-take");
    pushPaa("can-you-roof-over-existing-shingles");
    pushPaa("best-time-to-replace-a-roof");
  }
  if (isMaterial) {
    pushPaa("architectural-vs-3-tab-shingles");
    pushPaa("is-metal-roofing-worth-it");
    pushPaa("how-long-does-a-roof-last");
  }
  if (isInspection) {
    pushPaa("what-does-a-roof-inspection-cost");
    pushPaa("signs-you-need-a-new-roof");
    pushPaa("how-to-spot-a-roof-leak");
  }
  if (isCommercial) {
    pushPaa("roof-repair-vs-restoration");
    pushPaa("can-you-patch-a-flat-roof");
    pushPaa("how-long-does-a-roof-last");
  }
  // Always cap to a reasonable card count for layout
  const paaCards = paaSlugs
    .map((s) => paaPages.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 8);

  const guidesBlock = `<section class="section band"><div class="section-head"><p class="eyebrow">Related guides</p><h2>Related Roofing Guides</h2></div><div class="link-grid">${guideLinks.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join("")}</div></section>`;

  const paaBlock = paaCards.length === 0 ? "" : `<section class="section"><div class="section-head"><p class="eyebrow">Questions homeowners ask</p><h2>More Roofing Questions Answered</h2></div><div class="card-grid">${paaCards.map((paa) => {
    const preview = paa.answer.length > 180 ? `${paa.answer.slice(0, 175).trim()}…` : paa.answer;
    return `<article class="card"><h3>${esc(paa.question)}</h3><p>${esc(preview)}</p><a href="/${paa.slug}/">Read answer</a></article>`;
  }).join("")}</div></section>`;

  return `${guidesBlock}${paaBlock}`;
}

function servicePage(service) {
  const audience = service.slug.startsWith("commercial-") ? "property owners and facility managers" : "homeowners";
  const serviceLabel = serviceNavLabel(service).toLowerCase();
  const pageDescription = sanitizedMeta(service.description, service.name);
  const faqs = [
    [`When do ${audience} actually need ${serviceLabel}?`, `Usually when ${audience} notice leaks, visible roof wear, storm damage, or some warning sign that they don't want to ignore until it gets worse. If you're on this page, your instinct is probably right - it's worth getting checked.`],
    ["Can you help with urgent stuff?", "Yes - urgent leaks, storm damage, and emergency inspections all run through the same request process. Flag the urgency and it gets prioritized."],
    ["What actually affects the price?", "Roof size, slope, materials, access, damage severity, decking condition, flashing complexity, ventilation needs, and project type. That's why a flat number on a website doesn't mean much - the real quote comes after someone looks at your roof."],
    ["What happens after I submit?", "Your request goes to a local roofing pro with the issue, urgency, property location, and contact details. They reach out to schedule the next step - usually an inspection or written estimate. No commitment until you decide."],
  ];
  const body = `${hero({ kicker: `${serviceNavLabel(service)} estimate requests`, h1: service.h1, description: pageDescription, cta: service.slug.includes("emergency") ? "Get Help With a Roof Leak" : "Request Roofing Help" })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div itemscope itemtype="https://schema.org/Service"><meta itemprop="serviceType" content="${esc(service.name)}"><meta itemprop="category" content="Roofing"><div itemprop="provider" itemscope itemtype="https://schema.org/Organization"><meta itemprop="name" content="${esc(brand.name)}"><meta itemprop="url" content="${brand.domain}"></div><div itemprop="areaServed" itemscope itemtype="https://schema.org/State"><meta itemprop="name" content="California"></div><div itemprop="areaServed" itemscope itemtype="https://schema.org/State"><meta itemprop="name" content="New Jersey"></div><p class="eyebrow">When ${audience} land on this page</p><h2 itemprop="name">What This Helps You Sort Out</h2><p class="query-intro"><strong>Honest framing</strong>: this page exists for ${audience} comparing repair, inspection, and replacement options after visible roof damage or water showing up where it shouldn't. If you're somewhere in that decision space, you're in the right spot.</p><p itemprop="description">${pageDescription}</p><div class="mini-list">${service.problems.map((problem) => `<span>${problem}</span>`).join("")}</div>${quoteFormTrustCards({ stepsCardTitle: `What happens after you request ${serviceLabel}` })}<div itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="name" content="${esc(service.name)} estimate request"><meta itemprop="price" content="0"><meta itemprop="priceCurrency" content="USD"><meta itemprop="availability" content="https://schema.org/InStock"><meta itemprop="description" content="Free roofing estimate request for ${esc(service.name.toLowerCase())} - no obligation, no contract"></div></div></section>
  ${decisionFitSection({ service })}
  ${quantifiedSection({ service })}
  ${featureUseCaseSection({ service })}
  <section class="section"><div class="section-head"><p class="eyebrow">Service areas</p><h2>Popular local pages</h2></div><div class="link-grid">${localLinksForService(service)}</div></section>
  ${serviceRelatedGuides(service)}
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Start a Request</h2><p>Start a roofing estimate request and get the next step moving.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(service.slug, page(`${service.name} | Roofing Champs`, pageDescription, body, serviceSchema(service, faqs), service.slug), { priority: "0.80" });
}

function localLinksForService(service) {
  if (service.slug === "roof-replacement") {
    return cities
      .filter((city) => replacementCityNames.has(city.city))
      .map((city) => `<a href="/roof-replacement-${city.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${city.stateAbbr.toLowerCase()}/">New roof options in ${city.city}, ${city.stateAbbr}</a>`)
      .join("");
  }
  // Interleave NJ + CA cities so both markets are represented in the
  // "Popular local pages" block on every service page.
  const njCities = cities.filter((city) => city.stateAbbr === "NJ").slice(0, 4);
  const caCities = cities.filter((city) => city.stateAbbr === "CA").slice(0, 4);
  const mixed = [];
  for (let i = 0; i < 4; i += 1) {
    if (njCities[i]) mixed.push(njCities[i]);
    if (caCities[i]) mixed.push(caCities[i]);
  }
  return mixed.map((city) => `<a href="${city.url}">${city.city}, ${city.stateAbbr}</a>`).join("");
}

function trustPage(slug, title, h1, copy) {
  const body = `${hero({ kicker: "Roofing help made simple", h1, description: copy, cta: "Start My Roofing Request" })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><h2>${h1}</h2>${exactQueryIntro(title, copy)}<p>${copy}</p><p>Roofing Champs keeps the process clear: describe the issue, share the property location, and request help for repair, inspection, storm damage, or replacement options.</p><div class="mini-list"><a href="/about/">About Roofing Champs</a><a href="/how-it-works/">How it works</a><a href="/service-areas/">Service areas</a><a href="/partner-disclosure/">Partner disclosure</a><a href="/privacy-policy/">Privacy policy</a><a href="/terms/">Terms</a></div></div></section>
  <section class="section final-cta"><h2>Start A Roofing Request</h2><p>Tell us what's happening with your roof. We'll make the next step easy.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(slug, page(`${title} | Roofing Champs`, copy, body, baseSchema(), slug), { priority: "0.55" });
}

function serviceAreas() {
  const body = `${hero({ kicker: "Roofing help by city", h1: "Roofing Champs Service Areas", description: "Roofing Champs helps homeowners in selected New Jersey and California communities request roofing estimates for repairs, replacements, inspections, and storm damage." })}
  ${trustBar()}
  ${decisionFitSection({ title: "service area roofing help" })}
  <section class="section"><div class="section-head"><p class="eyebrow">New Jersey</p><h2>New Jersey Service Areas</h2></div><div class="link-grid">${cities.filter((city) => city.stateAbbr === "NJ").map((city) => `<a href="${city.url}">${city.city}, NJ</a>`).join("")}</div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">California</p><h2>California Service Areas</h2></div><div class="link-grid">${cities.filter((city) => city.stateAbbr === "CA").map((city) => `<a href="${city.url}">${city.city}, CA</a>`).join("")}</div></section>`;
  writePage("service-areas", page("Service Areas | Roofing Champs", "View Roofing Champs service-area pages for New Jersey and California roofing estimate requests.", body, baseSchema(), "service-areas"), { priority: "0.80" });
}

function problemRelatedResources(slug) {
  const map = {
    "old-roof-repair-or-replace": [
      ["/roof-repair-vs-replacement/", "Repair vs replacement"],
      ["/roofing-materials/", "Compare roofing materials"],
      ["/how-much-does-a-new-roof-cost/", "New roof cost guide"],
    ],
    "roof-leaking-after-rain": [
      ["/emergency-roof-tarping/", "Emergency roof tarping"],
      ["/roof-leak-repair/", "Roof leak repair"],
      ["/roof-insurance-claim-help/", "Roof insurance claim help"],
    ],
    "storm-damaged-roof": [
      ["/emergency-roof-tarping/", "Emergency roof tarping"],
      ["/storm-damage-roof-repair/", "Storm damage roof repair"],
      ["/roof-insurance-claim-help/", "Roof insurance claim help"],
    ],
    "missing-shingles": [
      ["/emergency-roof-tarping/", "Emergency roof tarping"],
      ["/roof-repair-vs-replacement/", "Repair vs replacement"],
    ],
    "water-stains-on-ceiling": [
      ["/roof-leak-repair/", "Roof leak repair"],
      ["/roof-repair-vs-replacement/", "Repair vs replacement"],
    ],
    "roof-flashing-damage": [
      ["/roof-leak-repair/", "Roof leak repair"],
      ["/roofing-materials/", "Compare roofing materials"],
    ],
    "flat-roof-ponding-water": [
      ["/flat-roof-repair/", "Flat roof repair"],
      ["/roofing-materials/", "Compare roofing materials"],
    ],
  };
  const links = map[slug];
  if (!links) return "";
  return `<section class="section band"><div class="section-head"><p class="eyebrow">Related help</p><h2>Companion Guides</h2></div><div class="link-grid">${links.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join("")}</div></section>`;
}

function problemPage(problem) {
  const query = problem.title;
  const body = `${hero({ kicker: "Roofing problem guidance", h1: problem.h1, description: `${problem.title} usually means something's quietly going wrong up there - a leak, storm damage, aging materials, or a failed roof component. Better to know now than to find out when the ceiling starts dripping.`, cta: "Request Roofing Help" })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><h2>Why This One Matters</h2><p class="query-intro"><strong>Real talk</strong>: roof problems don't stay on the roof. They move into insulation, ceilings, walls, and (worst case) electrical areas. Catching this kind of warning sign early is the difference between a $400 repair and a $4,000 cleanup.</p><p>So yeah, the slightly annoying ceiling spot or that one missing shingle is worth taking seriously. Getting it checked now lets you compare repair, inspection, or replacement options without panic-decisions during the next storm.</p><h2>Can I Just Fix This Myself?</h2><p>Honestly, for most of these? No - and I say that as someone who likes DIY projects. You can spot warning signs from the ground all day long, but actually walking the roof, tracing where a leak starts versus where it shows, replacing flashing, or assessing storm damage is genuinely safer left to the pros. The ER bill from a fall costs way more than the roof estimate.</p></div></section>
  ${decisionFitSection({ problem })}
  ${quantifiedSection({ problem })}
  ${featureUseCaseSection({ problem })}
  ${problemRelatedResources(problem.slug)}
  ${faqBlock([
    [`What actually causes ${problem.title.toLowerCase()}?`, "Could be age, weather, failed flashing, damaged shingles, roof penetrations, drainage problems, or storm impact. Often it's more than one of those stacking up at the same time."],
    ["When should I request help?", "Sooner is almost always better. Definitely don't wait if water's coming in, damage is visibly spreading, or you're not sure the roof is safe to even look at."],
    ["Could this mean I need a whole new roof?", "Maybe - but not automatically. Replacement depends on roof age, how much damage there is, leak history, material condition, and what a real inspection finds. One warning sign isn't a death sentence for the roof."],
  ])}`;
  writePage(problem.slug, page(`${problem.title}: What Homeowners Should Do | Roofing Champs`, sanitizedMeta(`Learn warning signs, next steps, and when to request roofing help before damage spreads.`, problem.title), body, baseSchema(), problem.slug), { priority: "0.65" });
}

function faqHub() {
  const body = `${hero({
    kicker: "Roofing answers",
    h1: "Roofing Questions Homeowners Ask",
    description:
      "Clear answers about roof costs, materials, insurance, installation timing, leaks, storm damage, and replacement decisions.",
    cta: "Ask for Roofing Help",
  })}
  <section class="section"><div class="section-head"><p class="eyebrow">Answer library</p><h2>Roofing Cost, Material, Insurance, and Timing Answers</h2></div><div class="card-grid">${paaPages.map((item) => `<article class="card"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p><a href="/${item.slug}/">Read answer</a></article>`).join("")}</div></section>
  <section id="quote-form" class="section split band">${quoteForm()}<div><h2>Need a project-specific answer?</h2><p>General answers help with planning, but roof age, slope, material, local weather, decking, flashing, and active leaks can change the best next step.</p></div></section>`;
  writePage("faqs", page("Roofing FAQs | Roofing Champs", "Clear Roofing Champs answers about roof costs, materials, insurance, installation timing, leaks, storm damage, and replacement decisions.", body, [...baseSchema(), faqSchema(paaPages.slice(0, 8).map((item) => [item.question, item.answer]))], "faqs"), { priority: "0.70" });
}

function paaExtraResources(slug) {
  const extras = {
    "does-homeowners-insurance-cover-roof-replacement": [
      ["/roof-insurance-claim-help/", "Roof insurance claim help"],
      ["/emergency-roof-tarping/", "Emergency roof tarping"],
      ["/storm-damage-roof-repair/", "Storm damage roof repair"],
      ["/how-to-file-insurance-claim-for-roof-damage/", "Filing a roof insurance claim"],
    ],
    "how-to-file-insurance-claim-for-roof-damage": [
      ["/roof-insurance-claim-help/", "Roof insurance claim help"],
      ["/emergency-roof-tarping/", "Emergency roof tarping"],
      ["/storm-damage-roof-repair/", "Storm damage roof repair"],
      ["/does-homeowners-insurance-cover-roof-replacement/", "Insurance coverage guide"],
    ],
    "how-much-does-a-new-roof-cost": [
      ["/roof-replacement-cost/", "Replacement cost factors"],
      ["/roof-repair-vs-replacement/", "Repair vs replacement"],
      ["/roofing-materials/", "Compare roofing materials"],
    ],
    "signs-you-need-a-new-roof": [
      ["/roof-repair-vs-replacement/", "Repair vs replacement"],
      ["/roofing-materials/", "Compare roofing materials"],
    ],
    "best-roofing-material-for-california-heat": [
      ["/roofing-materials/", "Compare roofing materials"],
      ["/roofing-permits-california/", "California roofing permits"],
    ],
    "best-roofing-material-for-new-jersey-weather": [
      ["/roofing-materials/", "Compare roofing materials"],
      ["/roofing-permits-new-jersey/", "New Jersey roofing permits"],
    ],
    "can-you-roof-over-existing-shingles": [
      ["/roof-repair-vs-replacement/", "Repair vs replacement"],
      ["/roofing-materials/", "Compare roofing materials"],
    ],
  };
  const links = extras[slug];
  if (!links) return "";
  return `<section class="section"><div class="section-head"><p class="eyebrow">Related help</p><h2>Companion Guides</h2></div><div class="link-grid">${links.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join("")}</div></section>`;
}

function paaCachedAnswer(item) {
  const hasBrand = /Roofing Champs/i.test(item.answer);
  return hasBrand ? item.answer : `${item.answer} Roofing Champs helps homeowners in California and New Jersey compare practical next steps.`;
}

function paaLeadParagraph(item) {
  const firstSentence = item.answer.split(/(?<=[.!?])\s+/)[0];
  return `${firstSentence} That's the short version - and honestly, it's where most "complete guides" should stop instead of padding 2,000 words. The longer answer below covers what actually changes the number, what catches homeowners off guard, and how California vs New Jersey homes face slightly different angles on the same question.`;
}

function paaPage(item) {
  const related = item.related
    .map((question) => paaPages.find((candidate) => candidate.question === question))
    .filter(Boolean);
  const cachedAnswer = paaCachedAnswer(item);
  const lead = paaLeadParagraph(item);
  const body = `<section class="answer-hero" itemscope itemtype="https://schema.org/Question">
  <div class="quick-answer-box">
    <p class="eyebrow">Quick answer</p>
    <p class="paa-question"><strong itemprop="name">${esc(item.question)}</strong></p>
    <div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
      <p itemprop="text">${esc(cachedAnswer)}</p>
    </div>
    ${lastUpdatedLine()}
  </div>
</section>
<section class="section">
  <div class="section-head"><p class="eyebrow">Complete guide</p><h1>${esc(item.h1)}</h1></div>
  <p class="wide-copy">${esc(lead)}</p>
</section>
${item.decisionFit ? customDecisionFit({
  topic: item.question.toLowerCase().replace(/\?$/, ""),
  heading: "Three Ways To Think About This - Pick The One That Fits",
  options: item.decisionFit,
  tradeoffLead: "Roofing Champs helps California and New Jersey homeowners compare these paths with a written scope, not just a phone-quote.",
}) : ""}
<section id="quote-form" class="section split">
  ${quoteForm()}
  <div>
    <p class="eyebrow">The real answer</p>
    <h2>Here's What Actually Matters</h2>
    <p>${esc(item.intro)}</p>
    <p>${esc(item.detail)}</p>
    <h2>If You're In California Or New Jersey</h2>
    <p>${esc(item.local)}</p>
    <div class="mini-list">${item.links.map((slug) => {
      const service = services.find((entry) => entry.slug === slug);
      const problem = problemPages.find((entry) => entry.slug === slug);
      const label = service ? serviceNavLabel(service) : problem ? problem.title : "Related roofing help";
      return `<a href="/${slug}/">${esc(label)}</a>`;
    }).join("")}</div>
  </div>
</section>
<section class="section band">
  <div class="section-head"><p class="eyebrow">Related questions</p><h2>More Roofing Answers</h2></div>
  <div class="card-grid">${related.map((relatedItem) => `<article class="card"><h3>${esc(relatedItem.question)}</h3><p>${esc(relatedItem.answer)}</p><a href="/${relatedItem.slug}/">Read answer</a></article>`).join("")}</div>
</section>
${item.inlineFollowUps ? inlineFollowUp(item.inlineFollowUps) : ""}
${paaExtraResources(item.slug)}
<section class="section final-cta"><h2>Get a Roofing Estimate</h2><p>Tell us what is happening with your roof and compare practical next steps.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  const paaSchemas = [
    ...baseSchema(),
    breadcrumbSchema([
      ["Home", "/"],
      ["Roofing Answers", "/faqs/"],
      [item.question, `/${item.slug}/`],
    ]),
    articleSchema({ slug: item.slug, headline: item.h1, description: cachedAnswer }),
    faqSchema([[item.question, cachedAnswer]]),
  ];
  writePage(item.slug, page(item.title, cachedAnswer, body, paaSchemas, item.slug), { priority: "0.68" });
}

function replacementCityPage(city) {
  const profile = cityProfiles[city.city];
  const slug = `roof-replacement-${city.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${city.stateAbbr.toLowerCase()}`;
  const title = `Roof Replacement ${city.city} ${city.stateAbbr} | Roofing Champs`;
  const description = `Need a new roofing system in ${city.city}? Compare materials, tear-off scope, ventilation, cleanup, warranty details, and written estimates.`;
  const body = `${hero({
    kicker: `New roof planning for ${city.city} homeowners`,
    h1: `New Roofing Systems for ${city.city} Homes`,
    description,
    cta: "Request a Replacement Estimate",
    city: city.city,
    phoneHref: city.phoneHref,
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm(city.city)}<div><p class="eyebrow">${city.county}</p><h2>When a Full System Makes More Sense</h2><p class="query-intro"><strong>Replacement decision context</strong>: ${esc(profile.replace)} A full system can be the better fit when the problem is no longer isolated to one flashing point, one vent boot, or one small shingle area.</p><p>${esc(profile.observed)}</p><p>Roofing Champs helps homeowners compare the scope before committing: tear-off, decking, underlayment, ventilation, flashing, cleanup, and warranty terms should all be clear in writing.</p></div></section>
  <section class="section decision-fit">
    <div class="section-head"><p class="eyebrow">Decision fit mapping</p><h2>Patch, Inspect, or Install New?</h2></div>
    <div class="decision-grid">
      <article><h3>Patch</h3><p><strong>Patch fits</strong>: ${esc(profile.repair)} This keeps scope narrow when surrounding materials still have service life.</p></article>
      <article><h3>Inspect</h3><p><strong>Inspection fits</strong>: ${esc(profile.inspect)} This avoids replacing a system before the actual water path is confirmed.</p></article>
      <article><h3>Install new</h3><p><strong>New system fits</strong>: ${esc(profile.replace)} This resets more of the weather barrier instead of chasing repeated failures.</p></article>
    </div>
  </section>
  <section class="section two-col band"><article><p class="eyebrow">Project scope</p><h2>What Affects Project Cost</h2><p>${esc(profile.compare)} Replacement pricing also depends on tear-off layers, roof pitch, access, disposal, decking, underlayment, ventilation, material selection, and permit requirements.</p></article><article><h2>Installation Process</h2><p>A complete project should cover protection of the property, tear-off, deck inspection, underlayment, flashing, ventilation, material installation, magnetic cleanup, final walkthrough, and written warranty details.</p></article></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Material and weather fit</p><h2>Roofing Details That Matter in ${city.city}</h2></div><div class="card-grid">${profile.features.map((feature) => {
    const name = feature.split(/\s+matters?\s+/)[0];
    return `<article class="card"><h3>${esc(name)}</h3><p>${esc(feature)}</p></article>`;
  }).join("")}</div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Related answers</p><h2>Planning Questions</h2></div><div class="link-grid"><a href="/how-much-does-a-new-roof-cost/">Cost guide</a><a href="/roof-replacement-cost/">Replacement cost factors</a><a href="/signs-you-need-a-new-roof/">Replacement signs</a><a href="/can-you-roof-over-existing-shingles/">Overlay vs tear-off</a><a href="/how-long-does-roof-installation-take/">Timeline guide</a><a href="/roof-repair-vs-replacement/">Repair vs replacement</a><a href="/roofing-materials/">Compare roofing materials</a><a href="/roof-insurance-claim-help/">Insurance claim help</a></div></section>
  <section class="section final-cta"><h2>Request a Written Estimate in ${city.city}</h2><p>Share the roof age, leak history, material type, and project timing so the next step is clear.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(slug, page(title, description, body, replacementCitySchema(city, slug), slug, city), { priority: "0.78" });
}

function replacementCitySchema(city, slug) {
  return [
    ...baseSchema(),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `New roofing systems in ${city.city}, ${city.stateAbbr}`,
      provider: { "@type": "Organization", name: brand.name, url: brand.domain },
      url: `${brand.domain}/${slug}/`,
      areaServed: { "@type": "City", name: city.city, addressRegion: city.stateAbbr, postalCode: city.zip },
      serviceType: ["Roof replacement", "Roof installation", "Reroofing", "Asphalt shingle installation"],
    },
  ];
}

function sanitizedMeta(description, exactQuery) {
  return description.replace(new RegExp(exactQuery, "ig"), "this roofing service");
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

# Explicit AI crawler allow (best-practice GEO signal even though wildcard covers them)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: FacebookBot
Allow: /

Sitemap: ${brand.domain}/sitemap.xml
`;

  const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=300, must-revalidate
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
      "@id": `${brand.domain}/#organization`,
      name: brand.name,
      url: brand.domain,
      logo: {
        "@type": "ImageObject",
        url: `${brand.domain}/apple-touch-icon.png`,
        width: 512,
        height: 512,
      },
      description: "Roofing Champs helps California and New Jersey homeowners request roofing estimates for leaks, storm damage, inspections, repairs, and replacements.",
      areaServed: [
        { "@type": "State", name: "California" },
        { "@type": "State", name: "New Jersey" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: brand.phone,
        contactType: "customer service",
        areaServed: ["US-CA", "US-NJ"],
        availableLanguage: "English",
      },
      sameAs: brand.sameAs || [],
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: brand.name, url: brand.domain },
  ];
}

function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, url], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${brand.domain}${url}`,
    })),
  };
}

function articleSchema({ slug, headline, description, datePublished = "2026-05-01" }) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: `${brand.domain}/${slug}/`,
    datePublished,
    dateModified: today,
    author: { "@id": `${brand.domain}/#organization` },
    publisher: { "@id": `${brand.domain}/#organization` },
    image: `${brand.domain}/apple-touch-icon.png`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".quick-answer-box", ".wide-copy"],
    },
  };
}

function howToSchema({ name, description, steps }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
  };
}

function lastUpdatedLine() {
  const today = new Date().toISOString().slice(0, 10);
  return `<p class="last-updated"><time datetime="${today}">Last updated ${today}</time></p>`;
}

function contentPageSchemas({ slug, h1, description, faqs }) {
  return [
    ...baseSchema(),
    breadcrumbSchema([
      ["Home", "/"],
      [h1, `/${slug}/`],
    ]),
    articleSchema({ slug, headline: h1, description }),
    faqSchema(faqs),
  ];
}

function citySchema(city, faqs) {
  return [
    ...baseSchema(),
    breadcrumbSchema([
      ["Home", "/"],
      ["Service Areas", "/service-areas/"],
      [`Roof Repair ${city.city}, ${city.stateAbbr}`, city.url],
    ]),
    {
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "@id": `${brand.domain}${city.url}#roofingcontractor`,
      name: `${brand.name} ${city.city}`,
      url: `${brand.domain}${city.url}`,
      image: `${brand.domain}/apple-touch-icon.png`,
      telephone: city.phone,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        ...(city.streetAddress ? { streetAddress: city.streetAddress } : {}),
        addressLocality: city.city,
        addressRegion: city.stateAbbr,
        postalCode: city.zip,
        addressCountry: "US",
      },
      areaServed: [{ "@type": "City", name: city.city, addressRegion: city.stateAbbr, postalCode: city.zip }],
      serviceType: services.slice(0, 6).map((service) => service.name),
      parentOrganization: { "@id": `${brand.domain}/#organization` },
    },
    faqSchema(faqs),
  ];
}

function serviceSchema(service, faqs) {
  return [
    ...baseSchema(),
    breadcrumbSchema([
      ["Home", "/"],
      [service.name, `/${service.slug}/`],
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      provider: { "@id": `${brand.domain}/#organization` },
      areaServed: [
        { "@type": "State", name: "California" },
        { "@type": "State", name: "New Jersey" },
      ],
      serviceType: service.name,
      category: "Roofing",
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

function emergencyTarpingPage() {
  const slug = "emergency-roof-tarping";
  const title = "Emergency Roof Tarping | Storm Leak Protection | Roofing Champs";
  const description = "Storm damage, active leak, fallen branch, or exposed roof decking? Roofing Champs helps homeowners request emergency roof tarping and urgent roofing help.";
  const faqs = [
    ["How fast should a roof be tarped?", "Honestly? As fast as you can get help on site. Every hour water keeps coming in means more drywall, more insulation, and more interior damage to deal with later. If shingles are missing or there's a visible opening, treat it like the clock's running."],
    ["Does insurance cover emergency roof tarping?", "A lot of homeowner policies do cover reasonable mitigation costs after a covered event - because tarping literally prevents the claim from getting worse. That said, it depends on your policy, the cause of damage, and your documentation. Save receipts and photos."],
    ["How long can a tarp stay on a roof?", "Think days to a few weeks, not months. Tarps degrade fast under UV, wind, and rain. The longer one sits, the more likely it is to fail at the worst possible moment - so get permanent repair scheduled while the tarp is still doing its job."],
    ["Can tarping stop every roof leak?", "Nope. Tarping covers exterior openings and slows water entry. It can't reroute water that's already trapped in the assembly, and it won't fix a leak from interior plumbing or condensation. If you tarp and water keeps coming, the source isn't where you think it is."],
    ["What should I do before roofing help arrives?", "Move stuff away from the drip zone. Put buckets or containers under active leaks. Photograph the damage inside and out - more photos than you think you need. And please don't climb onto a wet or damaged roof yourself. It's genuinely dangerous."],
    ["Is tarping the same as roof repair?", "Not even close. Tarping is a band-aid that buys you time. Real repair restores the shingles, flashing, decking, or membrane so the roof actually seals again. Skip the second step and you'll be tarping the same spot next storm."],
  ];
  const body = `${hero({
    kicker: "Storm leak mitigation requests",
    h1: "Temporary Storm Cover Before Water Spreads",
    description,
    cta: "Request Urgent Roofing Help",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">When you're standing under a leak right now</p><h2>Temporary Protection Isn't Glamorous - But It Saves Your Ceiling</h2><p class="query-intro"><strong>Real talk</strong>: if you're reading this with a bucket on the kitchen floor and another nor'easter or atmospheric river coming through tomorrow, you don't need a roofing essay. You need a tarp on the roof and a real repair lined up after.</p><p>Here's how to think about it: tarping is a short-term cover that slows interior damage while permanent repair gets scheduled. It will not fix your roof. What it WILL do is keep your drywall, insulation, and electrical from getting any more wrecked than they already are while you sort the rest out.</p><div class="mini-list"><span>Active interior leaks</span><span>Missing shingles</span><span>Exposed decking</span><span>Fallen branch impact</span><span>Wind or storm damage</span></div></div></section>
  ${customDecisionFit({
    topic: "emergency roof tarping",
    heading: "Tarping, Repair, or Replacement - Which Path Fits Right Now?",
    options: [
      ["Choose emergency tarping when water is actively entering the home.", "you have visible roof damage, rain is still expected, and permanent repair cannot be scheduled the same day.", "Tarping is temporary and degrades fast - you still need permanent work scheduled within days to weeks."],
      ["Choose permanent repair when the damage is contained but not actively flowing.", "the storm is over, the roof has one clear opening, and the surrounding shingles are intact.", "You skip tarping fees but the home is unprotected until the crew arrives - acceptable only if no more rain is forecast."],
      ["Choose replacement-track planning when damage spans multiple slopes.", "you see widespread shingle loss, missing decking, or repeat-leak history on top of the new storm damage.", "Higher upfront cost than tarp-and-patch, but it resets the roof system instead of buying short-term time."],
    ],
    tradeoffLead: "Roofing Champs routes urgent storm requests to local pros who can scope tarping plus permanent repair in one visit when conditions allow.",
  })}
  ${kgTripleBand("emergency tarping", [
    "Roofing Champs helps homeowners request emergency roof tarping in California and New Jersey markets.",
    "Emergency tarping covers exterior openings to limit interior water damage.",
    "Tarping degrades under UV exposure within days to weeks.",
    "Insurance policies often treat tarping as required mitigation after a covered event.",
    "Permanent roof repair restores shingles, flashing, decking, or membrane sections.",
    "Roofing Champs routes urgent leak requests to local roofing professionals.",
    "Wind-driven rain can push water under roof edges even when shingles remain in place.",
    "Coastal homes face faster flashing corrosion than inland properties.",
    "Cape May and Villas homeowners deal with shore wind exposure that lifts shingle tabs.",
    "San Pedro and Torrance roofs face marine air corrosion on metal flashing details.",
    "Inland New Jersey homes face freeze-thaw cycles that open shingle seals.",
    "Tarping is short-term protection, not roof repair.",
    "Active interior leaks require same-day mitigation in most cases.",
    "Documentation photos taken before tarping support insurance claims.",
    "Roofing Champs operates as a homeowner-first roofing help service.",
  ])}
  <section class="section"><div class="section-head"><p class="eyebrow">When tarping actually fits</p><h2>Situations That Call For Emergency Tarping</h2></div><div class="card-grid">
    <article class="card"><h3>Active interior leak</h3><p>Water's dripping into ceilings, walls, attic insulation, or near electrical fixtures - and the rain isn't done yet. This is the textbook case.</p></article>
    <article class="card"><h3>Missing shingles or exposed decking</h3><p>A section of roof is open to weather because shingles blew off, hail punched through, or wind ripped material away. Don't wait for the next rain to find out how bad it is.</p></article>
    <article class="card"><h3>Fallen tree or branch impact</h3><p>A limb or full tree hit the roof and cracked decking or tore through layers. Even if you don't see active leaking yet, the opening is there.</p></article>
    <article class="card"><h3>Storm or wind damage</h3><p>Visible roof damage and another rain band incoming on the forecast. Tarping now beats tarping in the dark, in the rain, on a wet roof.</p></article>
  </div></section>
  <section class="section two-col band"><article><p class="eyebrow">Why fast matters</p><h2>What Tarping Actually Saves You</h2><ul><li>Stops more water from soaking into living space, attic, and insulation. (Insulation that gets wet and stays wet is insulation you replace.)</li><li>Helps prevent the next round of drywall, paint, and ceiling repair - which often runs more than the original roof fix.</li><li>Reduces mold risk in materials that would otherwise stay damp for days.</li><li>May support your insurer's mitigation requirements. Most policies expect you to limit further damage. Tarping is exactly that.</li></ul></article><article><p class="eyebrow">Insurance prep</p><h2>What To Photograph Before You Tarp</h2><p>Quick rule of thumb: more photos than feels reasonable. Time-stamped pics of interior leaks, soaked materials, exterior damage, and any debris that hit the roof. Save the receipts for any emergency stuff you bought. Note when leaks started, the storm date, and wind direction if you remember.</p><p>Trust me - the version of you filing the claim three weeks from now is going to be very grateful to the version of you who took 20 extra photos tonight.</p><div class="mini-list"><a href="/how-to-file-insurance-claim-for-roof-damage/">Insurance claim guide</a><a href="/does-homeowners-insurance-cover-roof-replacement/">Roof replacement coverage</a><a href="/roof-insurance-claim-help/">Full claim help hub</a></div></article></section>
  <section class="section"><div class="section-head"><p class="eyebrow">What happens after you submit</p><h2>From Request To Permanent Repair</h2></div><ol class="steps">
    <li>Tell us what happened. Storm? Fallen branch? Visible hole? Active leak? Just describe it like you'd describe it to a neighbor.</li>
    <li>Share where the property is and any photos you've got. Even bad phone photos help.</li>
    <li>Request urgent help so temporary protection can be arranged before the next rain.</li>
    <li>Plan permanent repair or replacement once the immediate water entry is under control.</li>
  </ol></section>
  <section class="section two-col band"><article><h2>Tarping vs Permanent Repair</h2><p>Tarping = temporary cover. Permanent repair = restoring the actual shingles, underlayment, flashing, decking, or membrane that's supposed to keep weather out. A tarp left up too long becomes part of the problem - it traps moisture, hides damage, and degrades the materials underneath. Get the real fix scheduled.</p><a class="btn secondary" href="/emergency-roof-repair/">Emergency Roof Repair</a></article><article><h2>Related Roofing Help</h2><div class="mini-list"><a href="/emergency-roof-repair/">Emergency roof repair</a><a href="/storm-damage-roof-repair/">Storm damage roof repair</a><a href="/roof-leak-repair/">Roof leak repair</a><a href="/roof-repair-vs-replacement/">Repair vs replacement</a></div></article></section>
  ${inlineFollowUp([
    ["So what does a tarp actually cost?", "Emergency tarping pricing varies by roof access, tarp size, and how urgent the response is - expect a service-call charge plus materials. Many homeowners ask whether insurance reimburses it; the short answer is usually yes when there's a covered event, which is why documentation matters so much."],
    ["Will my insurance company require tarping?", "Most policies require homeowners to take reasonable steps to limit further damage after a covered event. Tarping is the canonical example. Skipping it can give the insurer grounds to reduce the claim later, even if the rest of your documentation is clean."],
    ["What if the storm hits at night - can someone still come out?", "Depends on conditions. Tarping a wet, dark roof during active wind is genuinely dangerous, and most pros will set up indoor containment first, then return at first safe light. If a contractor promises overnight roof work in a storm, ask about their safety protocols."],
  ])}
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Request Emergency Roof Tarping</h2><p>If water's coming in right now, don't wait. Start the request and share whatever details you've got.</p><a class="btn primary" href="#quote-form">Get Urgent Roofing Help</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "Temporary Storm Cover Before Water Spreads", description, faqs }), slug), { priority: "0.78" });
}

function repairVsReplacementPage() {
  const slug = "roof-repair-vs-replacement";
  const title = "Roof Repair vs Replacement | How To Decide | Roofing Champs";
  const description = "Compare roof repair vs replacement based on roof age, leak history, storm damage, material condition, cost, and long-term risk.";
  const faqs = [
    ["When is roof repair better than replacement?", "When damage is contained to one slope, the roof's still well within its service life, the decking feels solid, and you don't have a pattern of leaks popping up in different rooms. Basically: when it's one problem, not a roof-wide problem."],
    ["When does replacement make more financial sense?", "When an asphalt roof's getting near the end of its run, when leaks keep coming back in new spots, when multiple slopes are showing wear, or when you've already paid for two or three repairs in a year. That's the roof telling you it's done."],
    ["How old is too old for a repair?", "There's no single magic number, but asphalt past 20 years gets brittle, hard to color-match, and prone to failing somewhere else right after you fix the first spot. Material, ventilation, and how much sun it's taken all matter too."],
    ["Will insurance pay for a full replacement?", "It can - if the damage came from a sudden covered event (wind, hail, fallen tree) and affects enough of the roof to justify it. Normal aging and deferred maintenance? That's on you. Document the storm date and damage carefully either way."],
    ["Can a roof inspection actually help me decide?", "Yes - and honestly, a real one is worth more than any online flowchart. A decent inspection checks every slope, flashing detail, the attic side of the decking, ventilation, and prior repair spots. Then you've got the whole picture, not just the leak you noticed."],
  ];
  const body = `${hero({
    kicker: "Repair vs replacement decision support",
    h1: "Should You Repair or Replace Your Roof?",
    description,
    cta: "Get a Repair vs Replacement Estimate",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">Honest answer</p><h2>It Depends - And Here's Why That Matters</h2><p class="query-intro"><strong>The short version</strong>: a 7-year-old roof with one wind-damaged corner is a totally different conversation from a 22-year-old roof with three active leaks. Treating them the same is how people get talked into a $15k replacement they didn't actually need - or a $400 patch that fails again in six months.</p><p>So instead of asking "should I repair or replace?", ask: how old is this roof, how many separate problems do I have, and is the decking still solid? That's the real decision matrix. Everything below is just unpacking those three questions.</p><div class="mini-list"><a href="/roof-repair/">Roof repair</a><a href="/roof-replacement/">Roof replacement</a><a href="/roof-inspection/">Roof inspection</a></div></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Signs you can repair this</p><h2>When Repair Is Probably The Right Call</h2></div><div class="card-grid">
    <article class="card"><h3>Localized damage</h3><p>The problem's limited to one slope, one penetration, or one flashing detail. The rest of the roof still looks like it has years left.</p></article>
    <article class="card"><h3>Newer roof</h3><p>You're well inside the expected service life and the surrounding shingles still bend without cracking when handled. That flexibility matters.</p></article>
    <article class="card"><h3>One isolated leak</h3><p>You can trace the ceiling stain to one specific opening, not three possible water paths converging on one room.</p></article>
    <article class="card"><h3>Missing shingles in one area</h3><p>Wind got under the tabs on a single section while the rest of the roof field is sealed and intact.</p></article>
    <article class="card"><h3>Flashing issue</h3><p>The leak's coming from a chimney, wall, vent, or skylight - somewhere new flashing and sealant can actually restore the seal.</p></article>
    <article class="card"><h3>Decking still solid</h3><p>When you push up from the attic side, the deck doesn't flex or feel soft. No sagging visible from inside.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Signs you should think about replacement</p><h2>When Another Patch Is Just Buying Time</h2></div><div class="card-grid">
    <article class="card"><h3>Leaks keep coming back</h3><p>You fix one, another shows up in a different room. That's a pattern, not a coincidence.</p></article>
    <article class="card"><h3>Old roofing materials</h3><p>An asphalt roof at or past its life expectancy. Brittle to handle, hard to nail without cracking nearby shingles.</p></article>
    <article class="card"><h3>Widespread granule loss</h3><p>Granules piling up in gutters. Shingle surface looks bald or shiny on multiple slopes. The protective layer is gone.</p></article>
    <article class="card"><h3>Sagging or soft decking</h3><p>Roof line dips, the deck feels spongy. That's long-term moisture damage and patching shingles won't fix it.</p></article>
    <article class="card"><h3>Storm damage on multiple slopes</h3><p>Wind, hail, or debris hit several planes, not just one corner. A patch repair becomes a patch quilt.</p></article>
    <article class="card"><h3>You've already paid for multiple repairs</h3><p>Two, three, four patches in a year or two. At some point the math flips and replacement is cheaper than the next round of patches.</p></article>
  </div></section>
  <section class="section two-col"><article><p class="eyebrow">Cost reality check</p><h2>What Each Path Actually Costs You</h2><p>Look, repair is the cheaper number on the invoice. No argument there. But if the surrounding materials are aged, you're buying yourself months - not years - and the second and third patches add up faster than people expect. Replacement is more upfront, but it resets the underlayment, flashing, decking, and ventilation in one shot. Sometimes that's the better deal even when it doesn't look like it on day one.</p><a class="btn secondary" href="/roof-replacement-cost/">Replacement cost factors</a></article><article><p class="eyebrow">Insurance angle</p><h2>How Coverage Shifts The Math</h2><p>Here's where it gets interesting. If a covered event caused the damage, an insurance claim can change which path makes financial sense. If the wear is gradual, the cost stays on you. Either way, document everything - storm dates, photos, contractor scope - and ask the roofer to clearly separate covered storm damage from regular wear-and-tear on the written estimate. That paperwork matters.</p><a class="btn secondary" href="/roof-insurance-claim-help/">Insurance claim help</a></article></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Material and age</p><h2>Rough Lifespan By Material</h2></div><div class="card-grid">
    <article class="card"><h3>3-tab asphalt</h3><p>Usually 15-20 years. Repair if it's isolated; start thinking replacement past 15 with multiple issues.</p></article>
    <article class="card"><h3>Architectural asphalt</h3><p>Typically 20-30 years. Repair when contained; weigh replacement past 18-20 if wear is widespread.</p></article>
    <article class="card"><h3>Metal panels</h3><p>Often 40-60 years. Most problems are fastener, flashing, or panel-specific. Full replacement rarely the first call.</p></article>
    <article class="card"><h3>Tile</h3><p>Tile bodies can last 40-50+ years - but the underlayment underneath usually needs replacement well before the tile is done.</p></article>
    <article class="card"><h3>Flat / low-slope membrane</h3><p>Typically 15-25 years. Depends heavily on drainage, seam condition, and how much foot traffic it gets.</p></article>
    <article class="card"><h3>Wood shake</h3><p>20-30 years with maintenance. Splitting, cupping, or moss usually points to replacement, not another patch.</p></article>
  </div></section>
  <section class="section two-col"><article><h2>What A Real Inspection Should Cover</h2><ul><li>Shingle, tile, or membrane condition across every slope (not just the one with the leak)</li><li>Flashing at walls, chimneys, vents, and skylights</li><li>Decking firmness from the attic side - this is where most "surprise" replacements come from</li><li>Attic ventilation and any moisture signs up there</li><li>Gutter and valley drainage</li><li>Old repair locations and how they're holding up</li></ul><p>If the inspection only checks the slope with the visible leak, you're getting a partial picture. Ask for the full walk.</p><a class="btn primary" href="/roof-inspection/">Request a roof inspection</a></article><article><h2>More Reading</h2><div class="mini-list"><a href="/roof-repair/">Roof repair service</a><a href="/roof-replacement/">Roof replacement service</a><a href="/old-roof-repair-or-replace/">Old roof: repair or replace</a><a href="/signs-you-need-a-new-roof/">Signs you need a new roof</a><a href="/roofing-materials/">Compare roofing materials</a><a href="/how-much-does-a-new-roof-cost/">New roof cost guide</a></div></article></section>
  ${customDecisionFit({
    topic: "repair vs replacement",
    heading: "Three Clean Paths Forward - Which One Matches Your Roof?",
    options: [
      ["Choose repair when the damage is contained and the rest of the roof has life left.", "one slope, one flashing detail, or one isolated leak with surrounding shingles still flexible.", "Cheaper today, but if surrounding materials are aging, you may be paying again in 12-18 months."],
      ["Choose a roof inspection when the cause is unclear.", "leaks have moved between rooms, the cause isn't obvious from the attic, or repair history is fuzzy.", "One extra step and a small inspection fee versus approving work before anyone knows the real water path."],
      ["Choose replacement when failures repeat across multiple slopes.", "age is past expected life, leaks return after patches, decking feels soft, or storm damage spans the roof.", "Highest upfront cost, but it resets the underlayment, flashing, decking, and ventilation in one project instead of paying for patches forever."],
    ],
    tradeoffLead: "Roofing Champs helps California and New Jersey homeowners compare written scopes side by side, so the decision is based on roof condition - not contractor pressure.",
  })}
  ${kgTripleBand("the repair-or-replace decision", [
    "Roofing Champs helps homeowners compare roof repair versus roof replacement decisions.",
    "Roof repair fits when damage is isolated to one slope or one flashing detail.",
    "Roof replacement fits when an asphalt roof exceeds 20 years and shows widespread wear.",
    "A roof inspection identifies decking damage, flashing failure, and ventilation issues.",
    "Asphalt shingle roofs typically last 15 to 30 years depending on grade and exposure.",
    "Metal roofing panels often last 40 to 60 years when installed correctly.",
    "Tile roofing bodies can last 40 to 50 years, though underlayment may need earlier replacement.",
    "California heat accelerates UV damage on shingle roofs.",
    "New Jersey freeze-thaw cycles open small gaps in flashing and shingle seals.",
    "Insurance may cover roof replacement when a covered storm event damages enough of the roof.",
    "Insurance typically does not cover gradual roof wear or deferred maintenance.",
    "Decking replacement is usually priced as a per-sheet allowance.",
    "Roofing Champs routes repair-or-replacement requests to local roofing professionals.",
    "Coastal homes face faster flashing corrosion than inland properties.",
    "A new architectural asphalt roof typically costs $8,000 to $25,000 for a typical home.",
  ])}
  ${inlineFollowUp([
    ["What if I just keep patching - what's the actual breaking point?", "Honestly, the math usually flips after the third or fourth patch in two years. By that point you've spent close to a third of a replacement on temporary fixes, and you still have an aging roof. Track repair invoices and a calendar - if both are stacking, replacement is probably the smarter spend."],
    ["Can I do a partial replacement - just one slope?", "Sometimes, if that slope's failure is genuinely unrelated to the rest of the roof. Most of the time, though, partial replacements end up with material mismatch, weird flashing transitions, and the un-replaced slopes failing within a year or two. Get an honest inspection before committing to partial."],
    ["What if the inspection shows mixed signals?", "It happens. Some slopes look fine, others are toast. That's where written documentation from the inspection matters - photos, decking notes, attic moisture readings. Then you can decide whether to budget for a phased plan or bite the bullet on full replacement now."],
  ])}
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Get A Real Answer For Your Roof</h2><p>Share the roof age, leak history, and what you're seeing. We'll help you figure out which path actually makes sense.</p><a class="btn primary" href="#quote-form">Request My Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "Should You Repair or Replace Your Roof?", description, faqs }), slug), { priority: "0.75" });
}

function roofingPermitsNJPage() {
  const slug = "roofing-permits-new-jersey";
  const title = "Roofing Permits in New Jersey | Roofing Champs";
  const description = "Planning roof repair or replacement in New Jersey? Learn how permits, inspections, storm damage, and contractor estimates may affect your roofing project.";
  const njCityLinks = [
    "Cape May",
    "Elizabeth",
    "Vineland",
    "Sewell",
    "Turnersville",
    "Williamstown",
    "West Caldwell",
  ]
    .map((name) => cities.find((c) => c.city === name))
    .filter(Boolean)
    .map((city) => `<a href="${city.url}">${city.city}, NJ</a>`)
    .join("");
  const faqs = [
    ["Do I need a permit for roof repair in New Jersey?", "Depends on the town and the scope. Swapping a couple of shingles? Often no. Full tear-off and re-roof? Almost always yes. Each NJ municipality runs its own rules - call the local building department before any work starts and confirm in writing."],
    ["Who actually pulls the permit?", "Should be the licensed roofing contractor, full stop. If they ask you to pull it as the homeowner, that's a yellow flag worth asking about. Either way, get it in writing and make sure permit fees are listed clearly in the estimate."],
    ["Does a roofing permit include the inspection?", "Most NJ jurisdictions schedule a building inspection as part of the permit. The contractor should coordinate the timing so the inspector can actually see the work before it gets buried under the new roof. If they're vague about this, push for specifics."],
    ["Will the new roof have to meet current code?", "Sometimes - and this is where surprise costs hide. Replacements can trigger ice-and-water shield, ventilation, or flashing upgrades to meet current code. Ask up front whether those are included or whether they'll show up as a change order halfway through."],
    ["What if a storm needs emergency work right now?", "Emergency tarping doesn't wait on permits - mitigation is treated separately so you can protect the home immediately. Permanent repair or replacement still goes through the normal permit process after the urgent stuff is handled."],
  ];
  const body = `${hero({
    kicker: "New Jersey roofing project planning",
    h1: "What New Jersey Homeowners Should Know About Roofing Permits",
    description,
    cta: "Request a NJ Roofing Estimate",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">Real talk for NJ homeowners</p><h2>Every Township Runs Its Own Show</h2><p class="query-intro"><strong>Heads up</strong>: this page is general guidance, not the actual building code. Permit rules in Cape May County look different from Bergen County, which looks different from Essex. Always confirm with your local building department before signing anything.</p><p>That said, here's what's true across most of New Jersey: full replacements involve a permit and at least one inspection. Repair-only work often doesn't. And whether you're on the shore (salt air, wind-driven rain) or inland (freeze-thaw, ice dams) changes what the estimate should actually include. Coastal Cape May and inland Williamstown are basically two different roofing climates.</p><div class="mini-list"><a href="/roof-repair/">Roof repair</a><a href="/roof-replacement/">Roof replacement</a><a href="/storm-damage-roof-repair/">Storm damage</a></div></div></section>
  <section class="section two-col"><article><p class="eyebrow">Repair vs replacement</p><h2>Scope Drives The Permit</h2><p>Small stuff - a few shingles, a flashing detail, one vent boot - usually falls under maintenance and may not need a permit. Full re-roofs, tear-offs, and structural repairs almost always do. When you're not sure where your project lands, ask the contractor to confirm with the local building department before quoting. If they balk at that, find a different contractor.</p><a class="btn secondary" href="/roof-repair-vs-replacement/">Repair vs replacement guide</a></article><article><p class="eyebrow">Township review</p><h2>When The Inspector Actually Shows Up</h2><p>A lot of NJ towns inspect after tear-off but before the new roof is closed in - so the inspector can actually see the decking and underlayment. Some inspect at completion. Either way, the contractor should coordinate the timing so the work isn't buried before sign-off. If your roofer can't tell you when the inspection is happening, that's a problem.</p></article></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">If you're on the shore</p><h2>Coastal NJ Roof Concerns</h2></div><div class="card-grid">
    <article class="card"><h3>Salt air</h3><p>Anyone who's owned a place near the shore for more than two years already knows the deal: salt eats metal. Flashing, fasteners, edge metal - it all corrodes faster than inland.</p></article>
    <article class="card"><h3>Wind-driven rain</h3><p>Those nor'easters that hit Cape May County push rain sideways under roof edges and behind flashing. Drip edge and starter courses do real work here.</p></article>
    <article class="card"><h3>Moisture that just lingers</h3><p>High humidity stays around long after the storm leaves. That stresses attic ventilation and underlayment between weather events.</p></article>
    <article class="card"><h3>Flashing corrosion</h3><p>Metal flashing at walls, chimneys, and roof penetrations needs a closer look on shore homes. What lasts 20 years inland can fail in 8 here.</p></article>
  </div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">If you're inland</p><h2>Inland NJ Roof Concerns</h2></div><div class="card-grid">
    <article class="card"><h3>Freeze-thaw cycles</h3><p>Jersey winters move from 35 to 18 to 35 again in a week. Repeated freezing and thawing opens tiny gaps around fasteners, flashing, and shingle seals over time.</p></article>
    <article class="card"><h3>Heavy spring and summer rain</h3><p>The big storms test valleys, gutters, and roof penetrations. If those aren't clean and flowing, water finds another way down.</p></article>
    <article class="card"><h3>Winter leaks</h3><p>Snow melt and refreeze near the eaves drives water back under shingles. The leak shows up in February but the cause is usually a December attic problem.</p></article>
    <article class="card"><h3>Ice dams</h3><p>When attic heat melts the snow on the upper roof and that water refreezes at the cold edge - boom, ice dam. The water pools behind it and finds a path inside.</p></article>
    <article class="card"><h3>Ventilation</h3><p>Balanced intake and exhaust ventilation is the unsung hero here. It cuts down attic heat, condensation, and ice-edge risk all at once.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Before you sign anything</p><h2>What To Ask Before Approving The Estimate</h2></div><div class="card-grid">
    <article class="card"><h3>Who pulls the permit?</h3><p>Get it in writing that the contractor pulls it, and that the fees are listed in the estimate - not a surprise charge later.</p></article>
    <article class="card"><h3>Are inspections covered?</h3><p>Make sure required municipal inspections are scheduled and the contractor's there for them. Don't agree to attend on their behalf.</p></article>
    <article class="card"><h3>Are code upgrades included?</h3><p>Ice-and-water shield, ventilation, flashing - are these part of the price or a separate line? Ask before, not after.</p></article>
    <article class="card"><h3>Is decking replacement separate?</h3><p>It usually is - they can't see hidden damage until tear-off. Ask for the per-sheet price up front so there are no surprises.</p></article>
    <article class="card"><h3>Are disposal and tear-off included?</h3><p>Tear-off, dumpster, magnetic sweep for nails, disposal - all of that should be in the scope. Confirm in writing.</p></article>
  </div></section>
  ${customDecisionFit({
    topic: "New Jersey roofing permits",
    heading: "Repair, Replacement, or Emergency - Different Permit Paths",
    options: [
      ["Choose the repair-scope path when work is limited and maintenance-grade.", "you're replacing a few shingles, sealing one flashing detail, or swapping a single vent boot.", "Often no permit required, but verify with the local building department - if they say yes, the permit becomes mandatory anyway."],
      ["Choose the full-replacement permit path when scope is roof-wide.", "you're doing a full tear-off and re-roof, ice-and-water shield upgrades, or structural decking repairs.", "More paperwork and at least one inspection, but you get code-compliant work and warranty protection that holds up if you sell."],
      ["Choose emergency mitigation when water is entering right now.", "a storm or fallen branch opened the roof and rain is still expected.", "Tarping doesn't wait on permits - mitigation is treated separately from permanent work, which still follows the normal permit process."],
    ],
    tradeoffLead: "Roofing Champs helps NJ homeowners scope projects so the permit conversation isn't a surprise mid-project.",
  })}
  ${kgTripleBand("New Jersey roofing permits", [
    "Roofing Champs helps New Jersey homeowners plan permitted roof replacement projects.",
    "Permit rules vary by New Jersey municipality and project scope.",
    "Licensed roofing contractors typically pull the local roofing permit.",
    "Cape May County roofs face salt air, wind-driven rain, and seasonal nor'easters.",
    "Coastal flashing corrosion accelerates faster than inland conditions.",
    "Inland New Jersey roofs face freeze-thaw cycles and ice dam risk.",
    "Ice-and-water shield is often required at eaves and valleys in New Jersey replacements.",
    "Township inspectors typically inspect after tear-off and at project completion.",
    "Roofing Champs serves Cape May, Elizabeth, Vineland, Sewell, and other New Jersey communities.",
    "Emergency tarping does not wait on permits in New Jersey.",
    "Architectural asphalt shingles handle most New Jersey weather exposures.",
    "Coastal salt exposure shortens flashing service life on New Jersey shore homes.",
    "Decking replacement is usually a per-sheet change order in New Jersey projects.",
    "Williamstown and Sewell roofs face inland rain plus tree debris in valleys.",
    "Roofing Champs routes New Jersey roofing requests to local licensed professionals.",
  ])}
  ${inlineFollowUp([
    ["How long does the permit process actually take in most NJ towns?", "Varies a lot. Some townships turn around permits in a few days; busier offices can take two to three weeks. Roofing contractors who work in the area regularly usually know which towns move fast and which don't - ask up front."],
    ["What if I had work done without a permit by a previous owner?", "Pretty common, honestly. It usually comes up when you sell the house and the buyer's home inspection flags it. The fix is sometimes a retroactive permit and inspection - sometimes a redo. Either way, an honest contractor estimate will flag this rather than ignore it."],
    ["Do roof repairs after a storm need permits if it's just emergency damage?", "Emergency tarping and tear-off-for-safety usually don't wait on permits - mitigation gets a pass. But the permanent replacement that follows still goes through normal permit review. Plan for both timelines."],
  ])}
  <section class="section"><div class="section-head"><p class="eyebrow">New Jersey service areas</p><h2>Roofing Help In Your NJ Town</h2></div><div class="link-grid">${njCityLinks}</div></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Plan A New Jersey Roofing Project</h2><p>Share the property location, project scope, and what shape the roof's in. We'll help you sort out the next step.</p><a class="btn primary" href="#quote-form">Request My Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "What New Jersey Homeowners Should Know About Roofing Permits", description, faqs }), slug), { priority: "0.65" });
}

function roofingPermitsCAPage() {
  const slug = "roofing-permits-california";
  const title = "Roofing Permits in California | Roofing Champs";
  const description = "Planning roof repair or replacement in California? Learn how permits, inspections, materials, energy rules, and local building requirements may affect your project.";
  const caCityLinks = [
    "San Jose",
    "Van Nuys",
    "Torrance",
    "Culver City",
    "San Pedro",
    "Gilroy",
    "Turlock",
    "Oakdale",
    "Winnetka",
  ]
    .map((name) => cities.find((c) => c.city === name))
    .filter(Boolean)
    .map((city) => `<a href="${city.url}">${city.city}, CA</a>`)
    .join("");
  const faqs = [
    ["Do I need a permit for roof work in California?", "Depends on the city, the county, and what you're doing. A small repair might slide; a full replacement basically always needs one. Different jurisdictions have different rules - call the local building department before you sign anything."],
    ["What's a cool roof requirement?", "Some California jurisdictions require cool-rated roofing materials on certain projects to hit energy goals. Mostly that means lighter colors or reflective surfaces. Your roofer should be able to explain how it affects your material choice - and if they shrug, get a second opinion."],
    ["Can I just install a new roof over the existing one?", "Some local codes allow one overlay on a sound roof. But honestly, most California projects favor tear-off because it lets the crew actually see the decking, flashing, and underlayment - and replace what's failing. Overlay hides problems that come back later."],
    ["Who pulls the permit?", "The licensed contractor, in almost every case. Get it in writing. Confirm permit fees are included in the estimate, not surprise add-ons later."],
    ["Does the permit include inspections?", "Most California cities and counties schedule one or more inspections during a re-roof - usually after tear-off and again at completion. The contractor should coordinate these so the work isn't closed in before the inspector sees it."],
  ];
  const body = `${hero({
    kicker: "California roofing project planning",
    h1: "What California Homeowners Should Know About Roofing Permits",
    description,
    cta: "Request a CA Roofing Estimate",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">Real talk for CA homeowners</p><h2>Every City And County Has Its Own Rulebook</h2><p class="query-intro"><strong>Heads up</strong>: California permit and inspection rules vary by city, county, and project scope - and cool roof / energy requirements add another layer. This page is general guidance, not a substitute for talking to your local building department.</p><p>Here's what's mostly true across the state: roof replacements involve a permit, at least one inspection, and material rules that may include cool roof standards. Repair-only projects usually follow a simpler path. And whether you're in the Valley (heat, UV, dry season), Bay Area (mixed climate, seasonal rain), or LA / South Bay (marine air, occasional atmospheric river) changes what the estimate should actually account for.</p><div class="mini-list"><a href="/roof-repair/">Roof repair</a><a href="/roof-replacement/">Roof replacement</a><a href="/best-roofing-material-for-california-heat/">CA material guide</a></div></div></section>
  <section class="section two-col"><article><p class="eyebrow">Repair vs replacement</p><h2>Scope Determines The Permit</h2><p>Small repairs - a few shingles, one flashing detail, a vent boot - usually count as maintenance. Full replacements and structural repairs almost always need a permit and inspection. When you're not sure where your project falls, ask the contractor to confirm with the local building department first. If they push back, that tells you something.</p><a class="btn secondary" href="/roof-repair-vs-replacement/">Repair vs replacement guide</a></article><article><p class="eyebrow">City and county review</p><h2>When The Inspector Shows Up</h2><p>Most California jurisdictions inspect after tear-off and again at completion. Your roofer should schedule these so they can be present, and so the work isn't buried under new material before sign-off. If they're vague about timing, push for specifics.</p></article></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Cool roof and energy</p><h2>Material and Energy Stuff That Matters</h2></div><div class="card-grid">
    <article class="card"><h3>Heat and UV</h3><p>Long sun exposure dries out sealants, makes shingles brittle, and accelerates granule loss on darker roofs. After ten Valley summers, the difference shows.</p></article>
    <article class="card"><h3>Fire exposure</h3><p>Some areas require Class A fire ratings and specific assemblies - this matters more than ever after recent wildfire seasons. Your material has to match local code.</p></article>
    <article class="card"><h3>Ventilation</h3><p>Balanced attic ventilation manages heat and moisture under the new roof. Skip it and a new roof can age fast.</p></article>
    <article class="card"><h3>Seasonal rain</h3><p>Those few rainy weeks each year test the flashing, underlayment, and low-slope drainage on a roof that spent months in dry heat. First-rain leaks are a real thing here.</p></article>
  </div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">If you've got a flat section</p><h2>Flat and Low-Slope Considerations</h2></div><p class="wide-copy">A lot of California homes have flat or low-slope additions - the patio cover, the garage roof, the rear extension. Membrane choice, slope to drain, scuppers, and seam detailing matter way more on those sections than on the steeper main roof. If water sits more than 48 hours after rain, that's not just a maintenance thing to put off until next year - it's a planning signal. The membrane and drainage need a closer look.</p><div class="mini-list"><a href="/flat-roof-repair/">Flat roof repair</a><a href="/flat-roof-repair-install/">Flat roof repair and install</a></div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Tear-off vs overlay</p><h2>Why Most CA Projects Should Just Tear Off</h2></div><p class="wide-copy">Some jurisdictions allow one overlay on a sound roof. Others require tear-off, especially when underlayment, flashing, or decking need review. Honestly? Even when overlay's legal, tear-off is usually the smarter call. It lets the crew confirm what's underneath, replace what's failing, and install new flashing properly. Overlay is rarely a good fit on a wavy, leaking, or already-layered roof - and "saving money on overlay" tends to mean "paying for it again in five years."</p></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Before you sign anything</p><h2>What To Ask Before Approving The Estimate</h2></div><div class="card-grid">
    <article class="card"><h3>Who pulls the permit?</h3><p>Contractor pulls it. Fees included in the price, not a surprise later. In writing.</p></article>
    <article class="card"><h3>Are inspections covered?</h3><p>Required inspections scheduled and attended by the contractor. Not you.</p></article>
    <article class="card"><h3>Are code upgrades included?</h3><p>Cool roof, ventilation, fire-rated assemblies - all spelled out as part of the scope or called out separately. Don't let these become "oh, we forgot to mention" line items.</p></article>
    <article class="card"><h3>Is decking replacement separate?</h3><p>Damaged decking is usually a change order because hidden damage isn't visible until tear-off. Ask for the per-sheet allowance up front so you can budget the worst case.</p></article>
    <article class="card"><h3>Are disposal and tear-off included?</h3><p>Tear-off, dumpster, cleanup, disposal. All of it. Confirm in writing.</p></article>
  </div></section>
  ${customDecisionFit({
    topic: "California roofing permits",
    heading: "Repair, Replacement, or Emergency - Different Permit Paths",
    options: [
      ["Choose the repair-scope path when work is small and maintenance-grade.", "you're replacing a few shingles, one flashing detail, a vent boot, or doing minor patching.", "Often no permit required, but the local building department has final say - confirm before you sign anything."],
      ["Choose the full-replacement permit path when scope is roof-wide.", "you're doing tear-off, re-roof, cool-roof material change, or structural repairs that touch decking.", "Permit, energy compliance review, and inspections - but the result is code-compliant work and resale-protected documentation."],
      ["Choose emergency mitigation when active water is the issue.", "a storm, fallen branch, or sudden opening is letting water in and rain is expected.", "Mitigation tarping does not wait on permits. The permanent repair that follows still goes through the normal city or county permit process."],
    ],
    tradeoffLead: "Roofing Champs helps CA homeowners scope projects so cool-roof, fire-rated, and ventilation requirements don't surprise the estimate mid-project.",
  })}
  ${kgTripleBand("California roofing permits", [
    "Roofing Champs helps California homeowners plan permitted roof replacement projects.",
    "Permit rules vary by California city, county, and project scope.",
    "Licensed roofing contractors typically pull the local roofing permit in California.",
    "Some California jurisdictions require cool-rated roofing materials on certain projects.",
    "Class A fire ratings may be required in specific California areas.",
    "California city and county inspectors typically inspect after tear-off and at completion.",
    "Roofing Champs serves San Jose, Van Nuys, Torrance, Culver City, and other California communities.",
    "Long UV exposure dries roof sealants and accelerates shingle granule loss.",
    "Coastal marine air corrodes flashing details on Southern California homes.",
    "Flat and low-slope roof sections need membrane systems instead of shingles.",
    "Ponding water lasting more than 48 hours after rain signals drainage problems.",
    "Roofing Champs routes California roofing requests to local licensed professionals.",
    "Emergency tarping does not wait on permits in California.",
    "Central Valley homes face heat-driven shingle wear on sun-facing slopes.",
    "Roofing Champs operates as a homeowner-first roofing help service across California.",
  ])}
  ${inlineFollowUp([
    ["What about HOA approval - does that come before or after the permit?", "Usually before. Many California HOAs require material and color approval before any work starts, and they don't care that your permit is already pending. Check the CC&Rs first to avoid an expensive halt mid-tear-off."],
    ["Is solar interaction a permit issue?", "It can be. If panels are present, the contractor may need to coordinate with a solar provider to remove and reinstall - and that triggers its own permits in some jurisdictions. Build the timeline accordingly."],
    ["What about wildfire-area roofing rules?", "Higher fire zones often require Class A assemblies and specific underlayment combinations. Not every contractor handles those well. Ask specifically whether they've done permitted work in your fire-hazard zone before."],
  ])}
  <section class="section band"><div class="section-head"><p class="eyebrow">California service areas</p><h2>Roofing Help In Your CA Town</h2></div><div class="link-grid">${caCityLinks}</div></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Plan A California Roofing Project</h2><p>Share the property location, project scope, and what shape the roof's in. We'll help sort out the next step.</p><a class="btn primary" href="#quote-form">Request My Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "What California Homeowners Should Know About Roofing Permits", description, faqs }), slug), { priority: "0.65" });
}

function roofReplacementCostPage() {
  const slug = "roof-replacement-cost";
  const title = "Roof Replacement Cost | What Drives the Price | Roofing Champs";
  const description = "Compare what affects roof replacement cost - roof size, slope, materials, decking, ventilation, permits, and California / New Jersey market factors.";
  const faqs = [
    ["What's the typical roof replacement cost range?", "Most home replacements land somewhere between $8,000 and $25,000 - but that's a wide range for a reason. The real number depends on roof size, pitch, material, how many layers come off, decking condition, ventilation, flashing complexity, and local labor rates. Don't anchor on the low end."],
    ["Why do roof quotes vary so much?", "Because the scope can be wildly different even when the dollar number looks close. One estimate includes tear-off, decking allowance, ventilation upgrades, and a real warranty. Another quietly skips half of that. Compare line items, not totals."],
    ["Does California or New Jersey cost more?", "Depends on the project, the city, and the labor market - there's no clean answer. CA cool-roof or fire-rated assemblies can add up. NJ ice-barrier and ventilation upgrades can too. The state matters less than the specific code requirements and what your roof actually needs."],
    ["Will insurance cover part of the replacement?", "Maybe - if a covered event (storm, hail, fallen tree) damaged enough of the roof to justify replacement. Normal aging? That's on you. Either way, document the storm date and damage carefully so the claim can distinguish covered damage from regular wear."],
    ["Should I take the lowest bid?", "Honestly? Usually no. The lowest bid often skips tear-off, decking replacement, code upgrades, or warranty - things that show up later as surprise costs. A mid-priced bid with a complete written scope almost always beats a low bid with hidden gaps."],
    ["Are decking repairs included?", "Usually they're priced separately as a per-sheet allowance, because the crew can't see hidden damage until tear-off starts. That's actually fair - what you want is a clear per-sheet price up front so there's no negotiation in the middle of the project."],
  ];
  const body = `${hero({
    kicker: "Roof replacement cost factors",
    h1: "What Actually Drives Reroof Pricing",
    description,
    cta: "Request a Written Replacement Estimate",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">The honest answer</p><h2>"How Much Does A New Roof Cost?" Isn't One Number</h2><p class="query-intro"><strong>Real range</strong>: most home replacements run $8,000 to $25,000. That's a huge range. The real number depends on roof size, pitch, material, tear-off scope, decking condition, ventilation, flashing complexity, and what your local labor market charges.</p><p>Here's the thing - pricing tracks the actual roof, not just the square footage. A simple single-story asphalt re-roof prices very differently from a steep multi-slope job with chimneys, skylights, or a low-slope addition tacked on. Two houses on the same street can quote $4,000 apart for legitimate reasons.</p><div class="mini-list"><a href="/roof-replacement/">Roof replacement service</a><a href="/roof-repair-vs-replacement/">Repair vs replacement</a><a href="/how-much-does-a-new-roof-cost/">Full cost guide</a></div></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Cost drivers</p><h2>What Actually Moves The Number</h2></div><div class="card-grid">
    <article class="card"><h3>Roof size and pitch</h3><p>Larger roofs and steeper pitches require more material, more labor, and more safety equipment.</p></article>
    <article class="card"><h3>Material choice</h3><p>Asphalt shingles, metal, tile, and low-slope membranes have very different per-square pricing and service life.</p></article>
    <article class="card"><h3>Tear-off layers</h3><p>Removing one layer is faster than removing two. Disposal costs scale with the layers being torn off.</p></article>
    <article class="card"><h3>Decking condition</h3><p>Soft or damaged decking adds per-sheet replacement cost and slows the schedule.</p></article>
    <article class="card"><h3>Flashing complexity</h3><p>Chimneys, skylights, walls, valleys, and roof penetrations all need flashing details.</p></article>
    <article class="card"><h3>Ventilation upgrades</h3><p>Ridge vents, intake vents, and code-required ventilation can be part of the scope.</p></article>
    <article class="card"><h3>Permits and inspections</h3><p>Permit fees and inspection scheduling differ by jurisdiction and project scope.</p></article>
    <article class="card"><h3>Access and disposal</h3><p>Tight lots, multi-story homes, and limited dumpster placement add to labor cost.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Material price ranges</p><h2>Typical Replacement Ranges By Material</h2></div><div class="card-grid">
    <article class="card"><h3>Architectural asphalt</h3><p>Most common residential choice. Moderate per-square pricing, 20-30 year service life.</p></article>
    <article class="card"><h3>3-tab asphalt</h3><p>Lower per-square cost. Shorter service life and weaker wind resistance.</p></article>
    <article class="card"><h3>Metal panels</h3><p>Higher upfront cost. Long service life and low maintenance when detailed correctly.</p></article>
    <article class="card"><h3>Tile</h3><p>Higher upfront cost. Long tile body life, but underlayment may need replacement at 20-30 years.</p></article>
    <article class="card"><h3>TPO / EPDM / mod-bit</h3><p>Low-slope membrane systems. Cost varies with system, drainage, and insulation.</p></article>
    <article class="card"><h3>Coatings (over sound membrane)</h3><p>Can extend service life on suitable low-slope roofs at a fraction of replacement cost.</p></article>
  </div></section>
  <section class="section two-col"><article><p class="eyebrow">California market factors</p><h2>What Moves Cost in CA</h2><p>Cool-rated assemblies, fire-rated material requirements in certain areas, tile structural support, low-slope drainage design, and heat-aware ventilation can all add line items to a California estimate. Permit and inspection rules vary by city and county.</p><div class="mini-list"><a href="/roofing-permits-california/">CA permits guide</a><a href="/best-roofing-material-for-california-heat/">CA material guide</a></div></article><article><p class="eyebrow">New Jersey market factors</p><h2>What Moves Cost in NJ</h2><p>Ice-and-water shield at eaves and valleys, ventilation balancing, flashing for coastal salt exposure, and decking allowances after years of freeze-thaw can all add line items to a New Jersey estimate. Permit and inspection rules vary by municipality.</p><div class="mini-list"><a href="/roofing-permits-new-jersey/">NJ permits guide</a><a href="/best-roofing-material-for-new-jersey-weather/">NJ material guide</a></div></article></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Hidden costs</p><h2>What Cheap Bids Often Skip</h2></div><div class="card-grid">
    <article class="card"><h3>Decking replacement</h3><p>Often priced separately. Ask for a per-sheet allowance up front.</p></article>
    <article class="card"><h3>Code upgrades</h3><p>Ventilation, ice-and-water shield, and fire-rated assemblies may be required by current code.</p></article>
    <article class="card"><h3>Flashing replacement</h3><p>Re-using old flashing saves money short-term but often shortens the new roof's life.</p></article>
    <article class="card"><h3>Disposal and cleanup</h3><p>Dumpster, debris hauling, and magnetic sweep for nails should be in the scope.</p></article>
    <article class="card"><h3>Warranty terms</h3><p>Manufacturer vs workmanship warranty lengths differ. Ask what is included.</p></article>
    <article class="card"><h3>Permit fees</h3><p>Confirm in writing whether permit fees are included or billed separately.</p></article>
  </div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Estimate review</p><h2>What To Ask Before You Sign</h2></div><ol class="steps">
    <li>Who pulls the permit and are fees included?</li>
    <li>Is tear-off, dumpster, and disposal in the price?</li>
    <li>What is the per-sheet decking replacement allowance?</li>
    <li>Are code upgrades (ventilation, ice barrier, fire-rated) included?</li>
    <li>Which flashing is being replaced versus reused?</li>
    <li>What manufacturer and workmanship warranty terms apply?</li>
    <li>How long is the project expected to take, including weather buffer?</li>
  </ol></section>
  <section class="section two-col band"><article><p class="eyebrow">Insurance and storm damage</p><h2>When A Claim Can Shift The Math</h2><p>If a covered storm or sudden event caused the damage, an insurance claim might shift part of the replacement cost off your shoulders. Catch is - you need to document everything carefully: storm date, photos, contractor scope. The claim has to clearly separate covered damage from maintenance items, or the adjuster will only pay for the storm-related stuff.</p><div class="mini-list"><a href="/roof-insurance-claim-help/">Insurance claim help</a><a href="/does-homeowners-insurance-cover-roof-replacement/">Coverage guide</a></div></article><article><p class="eyebrow">Plan the project</p><h2>More Reading</h2><div class="mini-list"><a href="/roof-repair-vs-replacement/">Repair vs replacement</a><a href="/roofing-materials/">Compare roofing materials</a><a href="/can-you-roof-over-existing-shingles/">Overlay vs tear-off</a><a href="/how-long-does-roof-installation-take/">Timeline guide</a></div></article></section>
  ${customDecisionFit({
    topic: "roof replacement cost",
    heading: "Cost-Conscious, Mid-Tier, or Long-Game - Three Honest Paths",
    options: [
      ["Choose budget asphalt when upfront cost matters more than longevity.", "you're flipping the home soon, the budget is tight, or you just need to get above code for resale.", "Lower upfront number but 15-20 year service life and weaker wind resistance than architectural shingles."],
      ["Choose architectural asphalt or mid-tier metal when you want a 20+ year roof.", "you're staying in the home for a decade or more and want a clean balance of cost and lifespan.", "Higher upfront than 3-tab, but the cost-per-year math usually beats it. Most homeowners land here."],
      ["Choose premium metal, tile, or coating systems when long-term value beats upfront price.", "you plan to stay 20+ years, the climate hits the roof hard, or aesthetics matter for the property.", "Significantly higher upfront, but 40-60 year service life and lower maintenance can flip the lifetime math."],
    ],
    tradeoffLead: "Roofing Champs helps homeowners compare scope and material side by side, so the cheapest-bid trap doesn't become the most-expensive roof.",
  })}
  ${kgTripleBand("roof replacement cost", [
    "Roofing Champs helps homeowners compare written roof replacement estimates.",
    "A new roof typically costs $8,000 to $25,000 for a typical home.",
    "Roof size, pitch, and material are the largest cost drivers.",
    "Tear-off layers affect disposal and labor cost.",
    "Decking replacement is usually priced as a per-sheet allowance.",
    "Architectural asphalt shingles last 20 to 30 years on most homes.",
    "Metal roofing panels last 40 to 60 years with proper installation.",
    "Tile roof bodies last 40 to 50 years; underlayment may need earlier replacement.",
    "Flat and low-slope membranes typically last 15 to 25 years.",
    "California cool-roof requirements can add cost to qualifying replacements.",
    "New Jersey ice-and-water shield is often required at eaves and valleys.",
    "Insurance may cover roof replacement after a covered storm event.",
    "The lowest bid often excludes tear-off, code upgrades, or warranty.",
    "Roofing Champs serves California and New Jersey communities.",
    "Permit fees vary by jurisdiction and should be itemized in the estimate.",
  ])}
  ${inlineFollowUp([
    ["How do I tell if a low bid is actually a fair price or a setup for change orders?", "Compare line items, not totals. A real bid breaks out tear-off, dumpster, underlayment, ice/water shield, flashing, decking allowance, ventilation, warranty terms, and permit fees. A suspiciously low total usually means one or more of those lines is missing or vague. Ask point-blank what isn't included."],
    ["Should financing change my decision?", "It can - but be careful. Some contractor financing offers low monthly payments while the total cost actually exceeds a 0% credit-card payoff. Ask for the cash price and the financed price side by side."],
    ["What's the average lifespan vs cost-per-year math?", "Rough rule of thumb: divide the total estimate by realistic service life. Architectural asphalt at $15,000 / 25 years = $600/yr. Metal at $30,000 / 50 years = $600/yr. Same per-year cost - very different upfront. Pick the path that fits your cash position and timeline."],
  ])}
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Get A Written Replacement Estimate</h2><p>Share roof size, material, age, and when you'd like this to happen. We'll help line up the next step.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "What Actually Drives Reroof Pricing", description, faqs }), slug), { priority: "0.72" });
}

function roofInsuranceClaimHelpPage() {
  const slug = "roof-insurance-claim-help";
  const title = "Roof Insurance Claim Help | Documentation & Next Steps | Roofing Champs";
  const description = "Understand the roof insurance claim process - documentation, photos, adjuster timing, storm-date proof, mitigation, and what to do before throwing away damaged materials.";
  const faqs = [
    ["What should I do first after roof damage?", "If it's safe, protect the home from further damage - move stuff out of the leak zone, put buckets under drips, consider tarping. Then document with photos, write down the storm date, and call your insurer. And whatever you do, don't throw away damaged materials until the claim's been reviewed."],
    ["Does my policy actually cover roof damage?", "A lot of homeowner policies cover sudden, accidental damage from a covered event - wind, hail, fallen trees, that kind of thing. Normal aging, deferred maintenance, and gradual wear usually aren't covered. So if the roof was already 22 years old and finally gave out, that's a different conversation than if a windstorm took out half the shingles last Tuesday."],
    ["How fast should I file the claim?", "As soon as practical. Many policies require prompt reporting, and they actually expect you to mitigate further damage (which is where emergency tarping comes in). Waiting weeks doesn't help anybody."],
    ["Will an adjuster come out?", "Usually yes. The adjuster inspects the roof and interior damage. Tip: a roofing pro can be there too, walk the roof with them, point out damaged areas, and provide a written scope. That extra perspective often catches stuff the adjuster might miss."],
    ["What if the adjuster denies the claim?", "Denials happen, sometimes because the damage looks gradual or the storm timing isn't clear. Don't panic. Documentation, photos, and a written contractor scope can absolutely support an appeal. People win appeals all the time."],
    ["Should I sign anything before the claim's settled?", "Be really careful with assignment-of-benefits forms or contracts that lock you into a specific contractor before the claim's settled. Read everything. Ask questions. If anyone's pressuring you to sign quickly right after a storm, that's a flag."],
  ];
  const body = `${hero({
    kicker: "Roof insurance claim guidance",
    h1: "Filing a Storm Damage Claim: A Homeowner's Guide",
    description,
    cta: "Request Roofing Help",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">General homeowner guidance</p><h2>Filing An Insurance Claim Isn't Mysterious - But It Is Particular</h2><p class="query-intro"><strong>Heads up</strong>: this page is general guidance for homeowners navigating a roof insurance claim - documentation, photos, adjuster timing, storm-date proof, and mitigation. It's not legal or policy advice. Your specific policy controls.</p><p>Here's the underlying truth that most insurance pages dance around: insurance treats sudden covered damage and gradual wear as completely different things, even on the same roof. A 15-year-old roof that lost shingles in a wind storm is a covered claim. A 15-year-old roof that's slowly degrading is maintenance you put off. The documentation you do in the first 48 hours decides which bucket your claim lands in.</p><div class="mini-list"><a href="/storm-damage-roof-repair/">Storm damage</a><a href="/emergency-roof-tarping/">Emergency tarping</a><a href="/does-homeowners-insurance-cover-roof-replacement/">Coverage guide</a></div></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">First 24-72 hours</p><h2>Right After The Damage</h2></div><div class="card-grid">
    <article class="card"><h3>Protect the home</h3><p>If water is entering, move belongings, place containers, and consider emergency tarping to limit further damage. Mitigation is often expected by insurers.</p></article>
    <article class="card"><h3>Document everything</h3><p>Take time-stamped photos and video of interior leaks, soaked materials, exterior damage, and any debris that struck the roof.</p></article>
    <article class="card"><h3>Note the storm date</h3><p>Write down the date and time of the storm or event. This helps connect the damage to a specific covered cause.</p></article>
    <article class="card"><h3>Contact your insurer</h3><p>File the claim promptly. Provide the claim handler with your documentation, location, and a short description of the damage.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Documentation checklist</p><h2>What To Capture Before Cleanup</h2></div><div class="card-grid">
    <article class="card"><h3>Wide-shot photos</h3><p>Several wide-angle exterior photos showing the roof and yard so the damage is clearly tied to the property.</p></article>
    <article class="card"><h3>Close-up photos</h3><p>Close-ups of lifted shingles, hail bruises, torn flashing, damaged vents, and debris on the roof or ground.</p></article>
    <article class="card"><h3>Interior photos</h3><p>Photos of ceiling stains, water marks, attic insulation, and any wet drywall or flooring.</p></article>
    <article class="card"><h3>Receipts</h3><p>Keep receipts for emergency materials, tarp rental, water containment, or temporary repairs.</p></article>
    <article class="card"><h3>Damaged materials</h3><p>Do not throw away damaged shingles, flashing, or debris until the adjuster has reviewed the claim.</p></article>
    <article class="card"><h3>Weather records</h3><p>Local weather reports for the event can help connect the damage to a specific storm date.</p></article>
  </div></section>
  <section class="section two-col"><article><p class="eyebrow">Adjuster process</p><h2>What To Expect From The Inspection</h2><p>The adjuster typically inspects the roof, interior damage, and surrounding property. A roofing professional can be present to walk the roof, point out damaged areas, and provide a written scope. Make sure every affected slope, vent, flashing detail, and interior symptom is reviewed - not just the most obvious area.</p></article><article><p class="eyebrow">Mitigation and tarping</p><h2>Temporary Protection Counts</h2><p>Many policies expect homeowners to take reasonable steps to limit further damage. Emergency roof tarping can be part of that mitigation. Keep documentation of the tarping work and any related costs.</p><a class="btn secondary" href="/emergency-roof-tarping/">Emergency roof tarping</a></article></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Repair vs replacement</p><h2>How Coverage Shapes The Scope</h2></div><p class="wide-copy">If a covered event damages enough of the roof, the claim may move toward replacement instead of repair. If damage is contained to one slope and surrounding materials are sound, repair may be the better path. A written contractor scope that separates storm damage from maintenance items helps the adjuster understand the picture.</p><div class="mini-list"><a href="/roof-repair-vs-replacement/">Repair vs replacement</a><a href="/storm-damage-roof-repair/">Storm damage roof repair</a><a href="/roof-inspection/">Roof inspection</a></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Common pitfalls</p><h2>What To Watch For</h2></div><div class="card-grid">
    <article class="card"><h3>Signing too early</h3><p>Be careful about signing assignment-of-benefits forms or contracts that lock in a contractor before the claim is settled.</p></article>
    <article class="card"><h3>Throwing damaged materials away</h3><p>Damaged shingles, flashing, and debris are evidence. Keep them until the claim is reviewed.</p></article>
    <article class="card"><h3>Skipping interior photos</h3><p>Interior stains, wet insulation, and damaged drywall tie the roof damage to actual home impact.</p></article>
    <article class="card"><h3>Generic estimates</h3><p>A one-line "replace roof" estimate is harder to use in a claim than a written scope showing tear-off, decking, flashing, ventilation, and warranty line items.</p></article>
    <article class="card"><h3>Storm-chaser contractors</h3><p>Door-to-door pressure right after a storm is a flag, not a feature. Take time to compare written scopes.</p></article>
    <article class="card"><h3>Maintenance vs covered damage</h3><p>If the roof was already aging, the adjuster may separate covered storm damage from uncovered wear. A clear contractor scope helps.</p></article>
  </div></section>
  <section class="section two-col band"><article><p class="eyebrow">Related guides</p><h2>More Insurance Help</h2><div class="mini-list"><a href="/does-homeowners-insurance-cover-roof-replacement/">Does insurance cover roof replacement?</a><a href="/how-to-file-insurance-claim-for-roof-damage/">How to file a roof insurance claim</a><a href="/storm-damage-roof-repair/">Storm damage roof repair</a><a href="/emergency-roof-tarping/">Emergency roof tarping</a></div></article><article><p class="eyebrow">Replacement planning</p><h2>If A New Roof Is Likely</h2><div class="mini-list"><a href="/roof-replacement/">Roof replacement</a><a href="/roof-replacement-cost/">Replacement cost guide</a><a href="/roofing-materials/">Compare roofing materials</a><a href="/how-long-does-roof-installation-take/">Installation timeline</a></div></article></section>
  ${customDecisionFit({
    topic: "roof insurance claims",
    heading: "Three Claim Paths - Pick The One That Matches Your Damage",
    options: [
      ["Choose the storm-damage claim path when a covered event caused the damage.", "wind, hail, fallen tree, or sudden storm impact created the problem and you can tie it to a specific date.", "Strong path with proper documentation - photos, storm date, contractor scope all matter. The faster you document, the smoother it goes."],
      ["Choose the partial-coverage path when damage mixes covered and gradual wear.", "the storm exposed problems but the roof was already aging or some areas show pre-existing maintenance issues.", "Adjuster will likely separate covered storm damage from uncovered wear - you're paying part, insurance pays part. Documentation matters even more here."],
      ["Choose the self-pay path when damage is gradual or maintenance-related.", "no specific storm caused the issue, the roof has been slowly deteriorating, or repairs have been deferred.", "No claim filing or denial risk, but the full cost is yours. Sometimes still the right call to avoid premium increases or claim history on the home."],
    ],
    tradeoffLead: "Roofing Champs helps homeowners document damage carefully so the adjuster sees the real picture, not a vague description.",
  })}
  ${kgTripleBand("roof insurance claims", [
    "Roofing Champs helps homeowners navigate roof insurance claim documentation.",
    "Homeowner insurance policies cover sudden, accidental damage from covered events.",
    "Wind, hail, fallen trees, and storms are typical covered events.",
    "Normal aging and deferred maintenance are not covered by most policies.",
    "Adjusters distinguish between sudden damage and gradual wear.",
    "Emergency tarping is often required by policies as mitigation.",
    "Time-stamped photos document damage before any temporary repairs.",
    "Damaged shingles and flashing should not be discarded before adjuster review.",
    "A written contractor scope separates storm damage from maintenance items.",
    "Roofing Champs serves California and New Jersey markets.",
    "Assignment-of-benefits forms transfer claim control to contractors.",
    "Storm-chaser contractors target neighborhoods immediately after weather events.",
    "Storm date documentation connects damage to a specific covered event.",
    "Insurance claim denials can sometimes be appealed with contractor documentation.",
    "Roofing Champs routes insurance-related roof requests to local professionals.",
  ])}
  ${inlineFollowUp([
    ["What if I already cleaned up before taking photos?", "Not ideal, but not the end of the claim. Photograph what's left, document what you remember, save any debris you still have, and write down the timeline. The claim gets harder without pre-cleanup photos, not impossible. Adjusters have seen this before."],
    ["My deductible is huge - is filing even worth it?", "Run the math. If your deductible is $5,000 and the damage is $6,000, you're claiming $1,000 - and possibly seeing a premium bump or non-renewal risk. Sometimes self-paying makes financial sense even when coverage applies. A roofing pro can give you a realistic damage estimate before you decide."],
    ["What if the adjuster lowballs the estimate?", "Happens regularly. Get a written contractor scope with photos and detailed line items, then submit it as supplemental documentation. Many claims get adjusted upward after the contractor's scope is shared. Don't accept a lowball without pushing back."],
  ])}
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Start A Roofing Request</h2><p>Share the storm date, damage location, and any photos so the right next step can be arranged.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "Filing a Storm Damage Claim: A Homeowner's Guide", description, faqs }), slug), { priority: "0.70" });
}

function roofingMaterialsPage() {
  const slug = "roofing-materials";
  const title = "Roofing Materials Guide | Shingle, Metal, Flat & More | Roofing Champs";
  const description = "Compare asphalt shingles, metal roofing, flat roof systems, tile, coatings, and climate-specific roofing material considerations with Roofing Champs.";
  const faqs = [
    ["What's the most common residential roofing material?", "Asphalt shingles, by a mile. Cost, availability, broad fit on sloped roofs - they tick all the boxes for typical homes. That's why you see them everywhere."],
    ["Is metal roofing worth the higher cost?", "On the right house? Yeah, it can be. The service life is long, panels are durable, maintenance is generally light. But - and this is a big but - the flashing details and panel choice make or break it. A bad metal install fails faster than a good asphalt one."],
    ["What's the best material for a flat roof?", "Depends on size, slope, traffic, and budget. The usual suspects are TPO, EPDM, and modified bitumen. They each handle seams, heat, and UV a little differently. Don't let anyone tell you it's a simple choice."],
    ["Can a coating replace a full roof replacement?", "Sometimes - if the membrane underneath is still sound and the seams/drainage get addressed first. But coating a roof that's already saturated or failing is just expensive paint. It won't fix what's broken."],
    ["Does climate change the recommendation?", "Big time. Heat and UV affect materials very differently than freeze-thaw, salt air, or wind-driven rain. A roof that lasts 25 years in mild coastal CA might struggle in inland Valley heat - or the other way around. Match the material to the local exposure, not just the price tag."],
  ];
  const body = `${hero({
    kicker: "Roofing material comparison",
    h1: "Choosing the Right Material Before You Commit",
    description,
    cta: "Get a Material-Specific Estimate",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">Material hub</p><h2>Material Choice Isn't Just A Style Decision</h2><p class="query-intro"><strong>What matters</strong>: roofing material drives upfront cost, service life, weight, repair complexity, appearance, and how the roof actually holds up against your local weather. Pick wrong and you'll be back here in 12 years instead of 30.</p><p>The right choice comes down to roof slope, budget, climate exposure, and honestly - how long you actually plan to keep the home. If you're flipping in two years, the calculus is different than if you're handing this house to your kids someday.</p><div class="mini-list"><a href="/roof-replacement/">Roof replacement</a><a href="/roof-repair-vs-replacement/">Repair vs replacement</a><a href="/roof-inspection/">Roof inspection</a></div></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Material options</p><h2>Common Roofing Materials</h2></div><div class="card-grid">
    <article class="card"><h3>Asphalt shingles</h3><p>The most common residential choice. Architectural shingles balance cost, wind resistance, and a 20-30 year service life on typical sloped roofs.</p><a href="/shingle-roof-repair/">Shingle roof repair</a></article>
    <article class="card"><h3>Metal roofing</h3><p>Standing seam and exposed-fastener panels are durable and low maintenance. Panel choice and flashing details drive long-term performance.</p><a href="/metal-roofing/">Metal roofing options</a></article>
    <article class="card"><h3>Flat and low-slope systems</h3><p>TPO, EPDM, and modified bitumen membranes handle low-slope sections. Drainage, seams, and flashing height matter more than the field of the roof.</p><a href="/flat-roof-repair/">Flat roof repair</a></article>
    <article class="card"><h3>Tile roofing</h3><p>Tile bodies last decades, but underlayment often needs replacement well before tile life ends. Weight and structural support matter on retrofit projects.</p></article>
    <article class="card"><h3>Commercial coatings and restoration</h3><p>Coatings can extend service life on sound low-slope membranes when seams and drainage are addressed first.</p><a href="/commercial-roof-restoration/">Commercial roof restoration</a></article>
    <article class="card"><h3>Low-slope install planning</h3><p>New low-slope sections need slope to drain, insulation, membrane selection, and flashing height planned together.</p><a href="/flat-roof-repair-install/">Flat roof repair and install</a></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Climate fit</p><h2>Material by Local Weather</h2></div><div class="card-grid">
    <article class="card"><h3>California heat and UV</h3><p>Cool-rated shingles, tile, metal, and properly designed low-slope membranes can manage heat, UV, and seasonal rain. Ventilation matters as much as the surface material.</p><a href="/best-roofing-material-for-california-heat/">California heat material guide</a></article>
    <article class="card"><h3>New Jersey weather</h3><p>Architectural asphalt shingles handle most NJ exposures. Coastal homes need flashing and fastener detailing for salt air; inland homes need ice-edge and ventilation planning.</p><a href="/best-roofing-material-for-new-jersey-weather/">NJ weather material guide</a></article>
  </div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">Cost, lifespan, repair complexity</p><h2>Quick Comparison</h2></div><div class="card-grid">
    <article class="card"><h3>Architectural asphalt</h3><p>Moderate cost. 20-30 year service life. Repairs are widely available; matching shingle color matters on visible slopes.</p></article>
    <article class="card"><h3>Metal panels</h3><p>Higher upfront cost. 40-60 year service life. Repairs focus on fasteners, flashing, and panel sections.</p></article>
    <article class="card"><h3>Tile</h3><p>Higher upfront cost. 40-50+ year tile life, but underlayment may need replacement at 20-30 years.</p></article>
    <article class="card"><h3>TPO / EPDM / modified bitumen</h3><p>Lower to moderate cost. 15-25 year service life depending on system and drainage.</p></article>
    <article class="card"><h3>Coatings (over sound membrane)</h3><p>Can extend service life when seams and drainage are addressed; not a replacement for a failed membrane.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">How to choose</p><h2>What Should Drive The Decision</h2></div><div class="card-grid">
    <article class="card"><h3>Roof slope</h3><p>Steep roofs open up shingle, tile, and metal options. Low-slope sections need membrane systems instead.</p></article>
    <article class="card"><h3>Budget</h3><p>Upfront price matters, but service life and repair frequency change the long-term number.</p></article>
    <article class="card"><h3>Climate</h3><p>Match material to local exposure - heat, UV, salt, wind, freeze-thaw, or seasonal rain.</p></article>
    <article class="card"><h3>Maintenance</h3><p>Some materials need more attention than others. Plan for inspection access and future repairs.</p></article>
  </div></section>
  ${customDecisionFit({
    topic: "roofing materials",
    heading: "Asphalt, Metal, or Membrane - Which Material Fits Your Roof?",
    options: [
      ["Choose architectural asphalt when you want the standard balance.", "you have a sloped roof, you're staying 15-25 years, and you want broad contractor availability for future repairs.", "Most common choice for a reason - moderate cost, reasonable lifespan, color matching is easy. Won't impress anyone, but won't fail you either."],
      ["Choose metal when long lifespan and low maintenance matter more than upfront cost.", "you're staying 30+ years, you want fewer repair conversations, or the roof faces tough weather exposure.", "Higher upfront cost and the flashing details are critical. Done right, 40-60 year service life. Done badly, fails faster than asphalt."],
      ["Choose a membrane system when the roof is flat or low-slope.", "you have flat additions, patio covers, or low-pitch sections that can't shed water like a sloped roof.", "TPO, EPDM, or modified bitumen each handle drainage and seams differently. The membrane choice should match how much sun exposure and traffic the roof gets."],
    ],
    tradeoffLead: "Roofing Champs helps homeowners match material to roof slope, climate exposure, and how long they plan to keep the home - not just upfront price.",
  })}
  ${kgTripleBand("roofing materials", [
    "Roofing Champs helps homeowners compare roofing material options.",
    "Asphalt shingles are the most common residential roofing material.",
    "Architectural asphalt shingles last 20 to 30 years on most homes.",
    "Metal roofing panels last 40 to 60 years with correct installation.",
    "Tile roofing bodies last 40 to 50 years on suitable structures.",
    "Flat roof membranes typically last 15 to 25 years depending on system.",
    "TPO and EPDM are common low-slope membrane systems.",
    "Modified bitumen handles flat-roof seams under foot traffic.",
    "Roof coatings can extend service life on sound low-slope membranes.",
    "Cool-rated shingles reduce surface heat on California roofs.",
    "Coastal salt exposure accelerates flashing corrosion on metal details.",
    "Roofing Champs serves California and New Jersey homeowners.",
    "Architectural shingles outperform 3-tab shingles in wind resistance and lifespan.",
    "Tile roofing requires structural support due to material weight.",
    "Roofing Champs routes material-specific estimate requests to local professionals.",
  ])}
  ${inlineFollowUp([
    ["How much does material choice actually move the total estimate?", "More than people realize. Asphalt to metal can roughly double the project total. Asphalt to tile can triple it on the same roof. The lifespan math sometimes still favors the pricier material - but you need cash position to support the upfront number."],
    ["What about mixed-material roofs - flat addition with sloped main?", "Super common. The right approach is two different systems handled together: shingles or tile on the slope, a membrane on the flat. Where they meet (the transition) is the critical detail. Get a contractor who's done a few of these, not one who'll cut corners on the flashing."],
    ["Does HOA affect material choice in California?", "Frequently. A lot of CA HOAs restrict color, style, and sometimes material entirely. Get the CC&Rs in hand before you fall in love with a specific metal panel profile. Faster to know up front than to repaint a roof."],
  ])}
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Request A Material-Specific Estimate</h2><p>Share the roof slope, current material, project goal, and timing so the next step is clear.</p><a class="btn primary" href="#quote-form">Get My Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  writePage(slug, page(title, description, body, contentPageSchemas({ slug, h1: "Choosing the Right Material Before You Commit", description, faqs }), slug), { priority: "0.70" });
}

function aboutPage() {
  const slug = "about";
  const title = "About Roofing Champs | Fast Roofing Help From Local Pros";
  const description = "Learn how Roofing Champs helps homeowners request roofing help for leaks, storm damage, inspections, repairs, and replacement estimates across selected New Jersey and California markets.";
  const faqs = [
    ["What does Roofing Champs actually do?", "We take your roofing request - leak, storm damage, inspection, repair, replacement, whatever it is - and route it to local roofing pros who actually do the work. You stay in the driver's seat the whole way."],
    ["Do you use fake offices or fake reviews?", "Nope. City pages describe where we help, not pretend offices that don't exist. And reviews only show up here when a real homeowner sends real feedback. We'd rather show you an empty Reviews page than make stuff up."],
    ["Where do you actually help homeowners?", "Right now, selected communities in New Jersey and California. The Service Areas page lists every city we cover with notes on what local roofs are usually fighting against."],
    ["Is there a cost to request an estimate?", "No. Starting a request is free. The quotes you get back are non-binding, so you can compare and walk away without owing anyone anything."],
    ["Is emergency roof help available?", "Yes. If water's getting in right now - storm, fallen branch, visible hole - start the request and flag it as urgent so it gets handled fast."],
  ];
  const body = `${hero({
    kicker: "About Roofing Champs",
    h1: "Roofing Help Built Around Speed, Clarity, and Local Support",
    description,
    cta: "Start My Roofing Request",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">Why we exist</p><h2>Roofing Help Without The Sales Pressure</h2><p class="query-intro"><strong>The honest pitch</strong>: most people don't think about their roof until something's wrong. A stain on the ceiling. A shingle in the yard after a wind storm. That weird drip sound in the attic during a Cape May nor'easter or a San Jose atmospheric river. We get it - and we built this around making the next step less stressful.</p><p>So here's what we actually do. You tell us what's going on with your roof. We route the request to local roofing pros who handle the work. You compare options without anyone breathing down your neck.</p><p>Single shingle? Full re-roof? Active leak at 11 PM? Just want a written inspection before you list the house? All of it fits. No upsell pressure, no "you definitely need a new roof" pitch before anyone's even looked at it.</p></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">How requests are handled</p><h2>From Your Form To Real Roofing Help</h2></div><ol class="steps">
    <li>Tell us what's happening - leak, missing shingles, storm hit you, roof's getting up there in age, or just a question rattling around in your head.</li>
    <li>Share where the property is. We need that to match you with pros who actually serve your area (no out-of-state contractors showing up unprepared).</li>
    <li>Add urgency, a couple of photos if you've got them, and what kind of help you're after - quick inspection, repair, or full replacement estimate.</li>
    <li>You compare practical options and decide what's right. No pressure, no contracts you didn't ask for.</li>
  </ol></section>
  <section class="section two-col band"><article><p class="eyebrow">What you can ask for</p><h2>Common Roofing Requests</h2><p>Honestly? The list below is the short version. If you're not sure which one fits, just start the request and we'll sort it out together.</p><div class="mini-list"><a href="/roof-repair/">Roof repair</a><a href="/emergency-roof-repair/">Emergency roof repair</a><a href="/emergency-roof-tarping/">Emergency roof tarping</a><a href="/roof-leak-repair/">Roof leak repair</a><a href="/storm-damage-roof-repair/">Storm damage</a><a href="/roof-inspection/">Roof inspection</a><a href="/roof-replacement/">Roof replacement</a><a href="/roof-repair-vs-replacement/">Repair vs replacement</a></div></article><article><p class="eyebrow">Where we work</p><h2>Markets We Currently Serve</h2><p>Right now, that's pockets of New Jersey (coastal Cape May County, inland Gloucester, parts of North Jersey) and California (Bay Area, Central Valley, LA/South Bay, the Valley). Local permit rules and weather patterns vary a lot between those, so we built guides for both.</p><div class="mini-list"><a href="/service-areas/">All service areas</a><a href="/roofing-permits-new-jersey/">NJ roofing permits</a><a href="/roofing-permits-california/">CA roofing permits</a></div></article></section>
  <section class="section"><div class="section-head"><p class="eyebrow">What we won't do</p><h2>The Stuff That Bugs Us About Other Roofing Sites</h2></div><div class="card-grid">
    <article class="card"><h3>No fake local offices</h3><p>You won't find a stock photo of a storefront and an address that turns out to be a UPS box. City pages describe where we help, not where we pretend to be.</p></article>
    <article class="card"><h3>No fake reviews</h3><p>If a roofing site claims "4.9 stars from 387 reviews" but you can't click any of them - that's invented. We'd rather show you a blank Reviews page than fake testimonials.</p></article>
    <article class="card"><h3>No "#1 roofer" anything</h3><p>You see those badges everywhere. They mean nothing. We don't claim to be the best, the cheapest, or the most certified. We just want to be useful.</p></article>
    <article class="card"><h3>No pressure calls</h3><p>You won't get a "decide tonight or this price disappears" call. Consent to be contacted is not a condition of purchase. Compare, ask questions, walk away. All fine.</p></article>
  </div></section>
  <section class="section two-col band"><article><p class="eyebrow">When it's urgent</p><h2>Active Leak? Don't Wait.</h2><p>If water is coming through your ceiling right now, stop reading and start a request. Tarping can buy you time before a permanent fix gets scheduled. Don't try to climb up there yourself in the rain - it's not worth the ER bill.</p><a class="btn primary" href="/emergency-roof-tarping/">Emergency tarping</a></article><article><p class="eyebrow">Partner disclosure</p><h2>How This Whole Thing Works</h2><p>We may connect you with roofing pros or service providers in your area. The Partner Disclosure page spells out the details. Short version: it's transparent and you're never locked into anything.</p><a class="btn secondary" href="/partner-disclosure/">Partner disclosure</a></article></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Start A Roofing Request</h2><p>Tell us what's going on up there. We'll make the next step easy.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(slug, page(title, description, body, [...baseSchema(), faqSchema(faqs)], slug), { priority: "0.60" });
}

function howItWorksPage() {
  const slug = "how-it-works";
  const title = "How Roofing Champs Works | From Request To Roofing Help";
  const description = "See how Roofing Champs handles homeowner roofing requests - what to share, what happens next, and how to compare repair, inspection, and replacement options.";
  const faqs = [
    ["How long does it take to get a response?", "Depends on how urgent it is. If water's actively coming in, flag it and you'll hear back fast. For a non-emergency \"I want to plan ahead\" request, expect a normal estimate timeline - a few business days, sometimes sooner."],
    ["What info should I have ready?", "Honestly? Just the property address, a quick description of the issue, roughly how old the roof is, and your contact info. Photos help a ton if you've got them - interior stains, missing shingles, whatever's visible."],
    ["Do I have to accept a quote?", "Nope. Quotes you get back are non-binding. You can compare, ask questions, sit on it for a week, or walk away. No one's locking you in."],
    ["Can I get an inspection without committing to repair?", "Yes - inspections only are super common. People do this before selling a house, after a storm, or just to sanity-check whether an aging roof has another season in it."],
    ["I'm not sure if I need repair or replacement. Now what?", "Start the request anyway. Seriously. That decision usually comes down to roof age, how often it's been leaking, how many slopes are messed up, and what the decking feels like. A short inspection sorts it out fast."],
    ["Is it actually free to start a request?", "Yes. Starting is free. The quotes you get are non-binding. Consent to be contacted isn't a condition of purchase. We say that everywhere because it's actually true."],
  ];
  const body = `${hero({
    kicker: "How Roofing Champs works",
    h1: "From Roofing Request To Real Help",
    description,
    cta: "Start My Roofing Request",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">The process</p><h2>Four Steps. That's It.</h2><p class="query-intro"><strong>What to expect</strong>: this isn't a maze. You describe what's going on, we route the request to a roofing pro who works in your area, you compare options. Done.</p><ol class="steps">
    <li>Tell us what's happening with your roof. Plain English is fine - "there's a stain in the kid's bedroom every time it rains" is more useful than perfect roofing vocabulary.</li>
    <li>Share where the property is. We need that to match you with someone who actually works locally.</li>
    <li>Your request gets routed for the right kind of help - inspection, repair, or replacement estimate.</li>
    <li>You compare what comes back and decide. No pressure. No "sign tonight" calls.</li>
  </ol></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">What to share</p><h2>Stuff That Makes Your Request Move Faster</h2></div><div class="card-grid">
    <article class="card"><h3>Property address</h3><p>So we can match you with pros who serve your area. That's it.</p></article>
    <article class="card"><h3>The roof issue</h3><p>A sentence is fine. "Leak after rain," "shingles in the yard after that wind storm," "I think we need a whole new roof." All work.</p></article>
    <article class="card"><h3>How urgent it is</h3><p>Water coming in right now? Waiting until next month? Just price-shopping for the spring? Tell us - the timing changes everything.</p></article>
    <article class="card"><h3>Photos (optional)</h3><p>Honestly, even a blurry phone pic of the ceiling stain helps. Don't climb on the roof for this. Ground-level is plenty.</p></article>
    <article class="card"><h3>Rough roof age</h3><p>"About 8 years," "20+," "no idea, came with the house." Any of those help frame repair vs replacement.</p></article>
    <article class="card"><h3>How to reach you</h3><p>Phone, text, or email. Whatever you actually check. Consent to contact isn't required to use the site.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">Common scenarios</p><h2>What Different Requests Usually Look Like</h2></div><div class="card-grid">
    <article class="card"><h3>Active leak after rain</h3><p>Flag it as urgent. Send a photo of the interior stain if you can. Ask about emergency tarping if water's still coming in.</p><a href="/emergency-roof-tarping/">Emergency tarping</a></article>
    <article class="card"><h3>Storm damage check</h3><p>Write down the storm date. Take ground-level photos of anything you can see. Then request a storm inspection - before you toss any debris.</p><a href="/storm-damage-roof-repair/">Storm damage</a></article>
    <article class="card"><h3>Aging roof planning</h3><p>Roof's 15+ and you're tired of patching? Smart move - get an inspection and a real repair-vs-replacement comparison before the next leak.</p><a href="/roof-repair-vs-replacement/">Repair vs replacement</a></article>
    <article class="card"><h3>Inspection only</h3><p>Pre-listing your house, post-storm peace of mind, or just curious - inspection requests are welcome without any commitment to repair.</p><a href="/roof-inspection/">Roof inspection</a></article>
  </div></section>
  <section class="section two-col"><article><p class="eyebrow">Insurance and documentation</p><h2>If A Storm Caused This, Slow Down And Document</h2><p>Quick tip from the "wish I'd done that earlier" file: photograph everything before you tarp, before you clean up, before you throw a single shingle away. Note the date of the storm. Ask your roofer to separate covered storm damage from regular wear-and-tear on the written estimate - it makes the claim a lot smoother.</p><div class="mini-list"><a href="/how-to-file-insurance-claim-for-roof-damage/">Insurance claim guide</a><a href="/does-homeowners-insurance-cover-roof-replacement/">Coverage guide</a><a href="/roof-insurance-claim-help/">Full claim help hub</a></div></article><article><p class="eyebrow">No-pressure policy</p><h2>What You Won't Get From Us</h2><p>No high-pressure "decide tonight" calls. No generic "yep, you definitely need a whole new roof" pitch from someone who hasn't been on the roof. No surprise contracts. We don't operate that way - and honestly, we don't want to work with anyone who does.</p></article></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Start A Roofing Request</h2><p>Tell us what's going on. Two minutes, no commitment.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>
  ${lastUpdatedLine()}`;
  const howItWorksSchemas = [
    ...baseSchema(),
    breadcrumbSchema([
      ["Home", "/"],
      ["How It Works", "/how-it-works/"],
    ]),
    howToSchema({
      name: "How Roofing Champs handles your roofing request",
      description: "Four-step process for requesting roofing help: describe the problem, share property details, get routed to a local roofing pro, compare practical options.",
      steps: [
        "Tell us what's happening with your roof. Plain English is fine - 'there's a stain in the kid's bedroom every time it rains' is more useful than perfect roofing vocabulary.",
        "Share where the property is. We need that to match you with someone who actually works locally.",
        "Your request gets routed for the right kind of help - inspection, repair, or replacement estimate.",
        "You compare what comes back and decide. No pressure. No 'sign tonight' calls.",
      ],
    }),
    articleSchema({ slug, headline: "From Roofing Request To Real Help", description }),
    faqSchema(faqs),
  ];
  writePage(slug, page(title, description, body, howItWorksSchemas, slug), { priority: "0.60" });
}

function reviewsPage() {
  const slug = "reviews";
  const title = "Roofing Champs Reviews | Real Homeowner Feedback Only";
  const description = "Roofing Champs publishes verified homeowner feedback only. This page is ready for real reviews after roofing requests, inspections, repairs, and replacements.";
  const faqs = [
    ["Do you publish fake reviews?", "No. We'd rather show you a mostly empty page than make up testimonials. Real feedback from real homeowners only - and yeah, that means this page might look sparse compared to sites with 400 fabricated 5-star quotes."],
    ["Can I leave a review after my roof work?", "Please do. Once your request has been handled and the work's complete, share what your experience was actually like. Future homeowners read this stuff."],
    ["Where else can I leave a review?", "Third-party review sites are honestly more useful for future homeowners - they're verified differently. Reach out after the work's done and we'll point you to the right place."],
    ["What if my experience was bad?", "Tell us. Seriously. Honest negative feedback is more valuable than no feedback - it tells us where the routing process broke and gives future homeowners a real picture, not a marketing one."],
    ["Are reviews edited?", "Just basic formatting (typos, line breaks). The content stays as the homeowner wrote it. We don't edit reviews to sound more positive than they are."],
  ];
  const body = `${hero({
    kicker: "Roofing Champs reviews",
    h1: "Verified Homeowner Feedback Only",
    description,
    cta: "Start My Roofing Request",
  })}
  ${trustBar()}
  <section id="quote-form" class="section split">${quoteForm()}<div><p class="eyebrow">Why this page might look different</p><h2>Real Feedback, Not Invented Quotes</h2><p class="query-intro"><strong>The honest version</strong>: most roofing sites greet you with "4.9 stars from 437 reviews" and a wall of testimonials. Click any of them. Try to trace them back. Usually you can't. We chose not to play that game.</p><p>So this page might look light compared to those. That's the point. When a real homeowner sends real feedback after we've helped with their roof, it goes here - exactly as they wrote it. Empty space beats invented quotes, every time.</p></div></section>
  <section class="section"><div class="section-head"><p class="eyebrow">How we handle this</p><h2>Our Review Policy In Plain English</h2></div><div class="card-grid">
    <article class="card"><h3>Verified people only</h3><p>Reviews only show up here when an actual homeowner who used Roofing Champs sends them in. No purchased reviews, no AI-generated ones, no "borrowed" testimonials from a sister site.</p></article>
    <article class="card"><h3>No magic star badges</h3><p>You won't see a "4.9 stars from 437 reviews" graphic that can't be verified. If we ever post review data, it'll trace to specific feedback.</p></article>
    <article class="card"><h3>Negative reviews stay</h3><p>If a homeowner had a bad experience and shares it, that stays up too. Hiding negative feedback is the same as making up positive feedback - both lie about reality.</p></article>
    <article class="card"><h3>Published as written</h3><p>Aside from minor formatting cleanup, comments appear exactly the way you sent them. We're not in the business of polishing your review to sound more enthusiastic.</p></article>
  </div></section>
  <section class="section band"><div class="section-head"><p class="eyebrow">After the work's done</p><h2>How To Leave A Review</h2></div><ol class="steps">
    <li>Wait until the work's actually complete and you've had a couple weeks to see how it holds up.</li>
    <li>Tell us how it went - the request process, the roofing pro, the work itself, the outcome. The good and the bad.</li>
    <li>If you want it published here, let us know and we'll add it with your permission.</li>
    <li>If you'd rather post on a third-party review platform, ask for the right link and we'll send it.</li>
  </ol></section>
  <section class="section two-col"><article><p class="eyebrow">Haven't started yet?</p><h2>Where To Begin</h2><p>If you're reading this before requesting any roofing help, no worries - the process is the same whether you've got a single missing shingle or a roof that's clearly on its last summer.</p><div class="mini-list"><a href="/roof-repair/">Roof repair</a><a href="/emergency-roof-repair/">Emergency roof repair</a><a href="/roof-inspection/">Roof inspection</a><a href="/roof-replacement/">Roof replacement</a></div></article><article><p class="eyebrow">More about us</p><h2>How Roofing Champs Operates</h2><div class="mini-list"><a href="/about/">About Roofing Champs</a><a href="/how-it-works/">How it works</a><a href="/partner-disclosure/">Partner disclosure</a><a href="/privacy-policy/">Privacy policy</a></div></article></section>
  ${faqBlock(faqs)}
  <section class="section final-cta"><h2>Start A Roofing Request</h2><p>Tell us what's going on with your roof. We'll make the next step easy.</p><a class="btn primary" href="#quote-form">Get My Free Roofing Estimate</a></section>`;
  writePage(slug, page(title, description, body, [...baseSchema(), faqSchema(faqs)], slug), { priority: "0.55" });
}

home();
services.forEach(servicePage);
cities.forEach(cityPage);
cities.filter((city) => replacementCityNames.has(city.city)).forEach(replacementCityPage);
serviceAreas();
problemPages.forEach(problemPage);
faqHub();
paaPages.forEach(paaPage);
emergencyTarpingPage();
repairVsReplacementPage();
roofingPermitsNJPage();
roofingPermitsCAPage();
roofingMaterialsPage();
roofReplacementCostPage();
roofInsuranceClaimHelpPage();
aboutPage();
howItWorksPage();
trustPage("contact", "Contact", "Contact Roofing Champs", "Start a roofing request online or call for roofing help. Roofing Champs makes the next step clear for homeowners.");
reviewsPage();
trustPage("partner-disclosure", "Partner Disclosure", "Partner Disclosure", "Roofing Champs may connect homeowners with roofing professionals or service providers. Consent is not a condition of purchase.");
trustPage("privacy-policy", "Privacy Policy", "Privacy Policy", "This page explains how Roofing Champs may collect and use information submitted through roofing request forms.");
trustPage("terms", "Terms", "Terms of Use", "These terms describe use of the Roofing Champs website and roofing request process.");
notFoundPage();
utilityFiles();

console.log(`Built ${builtPages.length} indexed pages in ${out}`);
