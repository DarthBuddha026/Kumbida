// Template library (design §9.1): the 31 designs in design/manifest.json, in 11 categories.
// Tile and theme colors are taken from each cover in design/templates/; full covers are generated into
// public/covers/<id>.html (npm run covers).
export type EventType = "wedding" | "birthday" | "debut" | "baptism" | "anniversary" | "reunion" | "other";

export const EVENT_TYPES: { id: EventType; label: string }[] = [
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
  { id: "debut", label: "Debut" },
  { id: "baptism", label: "Baptism" },
  { id: "anniversary", label: "Anniversary" },
  { id: "reunion", label: "Reunion" },
  { id: "other", label: "Other" },
];

export const DISPLAY_TEXT: Record<EventType, string> = {
  birthday: "Birthday Star",
  wedding: "The Happy Couple",
  baptism: "Our Little Blessing",
  debut: "The Celebrant",
  anniversary: "The Happy Couple",
  reunion: "Together Again",
  other: "Our Guest of Honor",
};

export const isEventType = (v: unknown): v is EventType => EVENT_TYPES.some((t) => t.id === v);

// Categories: the folders in design/templates, with girl/boy folders joined (owner request: Baby, Kid and Teen
// Birthday, Debut). Used as filters on the landing gallery, the booking design picker and (later) admin Templates.
export const CATEGORIES = [
  { id: "baby", label: "Baby Birthday", type: "birthday" },
  { id: "kid", label: "Kid Birthday", type: "birthday" },
  { id: "teen", label: "Teen Birthday", type: "birthday" },
  { id: "debut", label: "Debut", type: "debut" },
  { id: "wedding", label: "Weddings", type: "wedding" },
  { id: "anniversary", label: "Anniversary", type: "anniversary" },
  { id: "reunion", label: "Reunion", type: "reunion" },
] as const satisfies readonly { id: string; label: string; type: EventType }[];
export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Tile = {
  bg: string;
  small: string; // the cover's small label
  sample: string; // display text as set on the cover
  ink: string; // display text color
  sub: string; // label color on the tile
  text: string; // body text color (guest page)
  font: string; // display font (CSS var from src/app/fonts.ts)
  italic?: boolean;
  weight: number;
  scale?: number; // title size multiplier for wide or narrow fonts
  btn: string; // button color (guest page)
  btnInk: string;
  dot: string; // accent / motif swatch (the cover's color setting)
};

export type Design = {
  id: string; // = file name in design/templates and public/covers
  name: string;
  category: CategoryId;
  types: EventType[]; // derived from the category
  tags: string;
  blurb: string;
  status: "live" | "cover";
  tile: Tile;
};

const f = (name: string) => `var(--font-${name})`;
const BIRTHDAY = "Birthday Star";
const COUPLE = "The Happy Couple";

const D = (id: string, name: string, category: CategoryId, blurb: string, tile: Tile, status: Design["status"] = "cover"): Design => {
  const c = CATEGORIES.find((x) => x.id === category)!;
  return { id, name, category, types: [c.type], tags: c.label, blurb, status, tile };
};

export const DESIGNS: Design[] = [
  // Baby Birthday (girl, then boy)
  D("royal-princess", "Royal Princess", "baby", "Lilac and gold with a flowing script title for a royal first birthday.",
    { bg: "#F3ECF9", small: "YOU ARE ROYALLY INVITED", sample: BIRTHDAY, ink: "#6A3D96", sub: "#4B2C6B", text: "#4B2C6B", font: f("great-vibes"), weight: 400, scale: 1.25, btn: "#6A3D96", btnInk: "#FFFFFF", dot: "#B8892E" }),
  D("bunny-garden", "Bunny Garden", "baby", "Peach and spring green with bunting and a little bunny in the garden.",
    { bg: "#FFF1E8", small: "OUR LITTLE BUNNY IS TURNING ONE", sample: BIRTHDAY, ink: "#D9776C", sub: "#7A4B3A", text: "#7A4B3A", font: f("sniglet"), weight: 800, btn: "#D9776C", btnInk: "#FFFFFF", dot: "#F4A7A0" }),
  D("little-star", "Little Star", "baby", "Soft pink with twinkling stars. Made for first birthdays.",
    { bg: "#FCE8EB", small: "YOU’RE INVITED", sample: BIRTHDAY, ink: "#8E3446", sub: "#8E3446", text: "#5A2633", font: f("fraunces"), italic: true, weight: 500, btn: "#B5475C", btnInk: "#FFFFFF", dot: "#D9CFF0" }, "live"),
    D("little-sailor", "Little Sailor", "baby", "Sky blue and navy with a nautical theme for a little captain.",
    { bg: "#EAF3FA", small: "AHOY! ALL ABOARD FOR", sample: BIRTHDAY, ink: "#1F3B5C", sub: "#1F3B5C", text: "#1F3B5C", font: f("baloo"), weight: 800, btn: "#1F3B5C", btnInk: "#FFFFFF", dot: "#E2574C" }),
  D("race-day", "Race Day", "baby", "Checkered flags, a race car and a pit-stop ticket.",
    { bg: "#1E2430", small: "START YOUR ENGINES", sample: "RACE DAY", ink: "#FFFFFF", sub: "#FFC22E", text: "#FFFFFF", font: f("racing"), italic: true, weight: 400, btn: "#FFC22E", btnInk: "#1E2430", dot: "#FFC22E" }),
  D("dino-roar", "Dino Roar", "baby", "A purple sky, an egg-shaped photo frame and friendly dinos.",
    { bg: "#7B4DF2", small: "ROAR PARTY!", sample: "BIRTHDAY STAR", ink: "#FFD24A", sub: "#FFFFFF", text: "#FFFFFF", font: f("lilita"), weight: 400, btn: "#0E8070", btnInk: "#FFFFFF", dot: "#17A88E" }),
  // Kid Birthday (girl, then boy)
  D("unicorn-dreams", "Unicorn Dreams", "kid", "Pastel pink with rainbows, sparkles and a little magic.",
    { bg: "#FDF0F6", small: "A MAGICAL PARTY FOR", sample: BIRTHDAY, ink: "#C2549A", sub: "#6B3A6E", text: "#6B3A6E", font: f("pacifico"), weight: 400, scale: 0.9, btn: "#C2549A", btnInk: "#FFFFFF", dot: "#F7A6C9" }),
  D("mermaid-lagoon", "Mermaid Lagoon", "kid", "Sea green and coral for an under-the-sea birthday.",
    { bg: "#E6F6F4", small: "MAKE A SPLASH WITH", sample: BIRTHDAY, ink: "#1E7A74", sub: "#1E5A5A", text: "#1E5A5A", font: f("dancing"), weight: 700, scale: 1.1, btn: "#1E7A74", btnInk: "#FFFFFF", dot: "#F28C7A" }),
  D("pink-glam", "Pink Glam", "kid", "Hot pink, sparkles and a tilted photo card.",
    { bg: "#FFE3EF", small: "IT’S A GLAM PARTY", sample: BIRTHDAY, ink: "#D6247A", sub: "#5A1037", text: "#5A1037", font: f("abril"), weight: 400, btn: "#D6247A", btnInk: "#FFFFFF", dot: "#D6247A" }),
    D("space-explorer", "Space Explorer", "kid", "Deep navy space with a countdown for an out-of-this-world birthday mission.",
    { bg: "#14213D", small: "3 · 2 · 1 · BLAST OFF", sample: "BIRTHDAY STAR", ink: "#FFFFFF", sub: "#FFB23F", text: "#FFFFFF", font: f("orbitron"), weight: 800, scale: 0.7, btn: "#FFB23F", btnInk: "#14213D", dot: "#FFB23F" }),
  D("construction-zone", "Construction Zone", "kid", "Hard-hat yellow and bold block letters for a big birthday build.",
    { bg: "#FFF5D6", small: "UNDER CONSTRUCTION", sample: "BIRTHDAY STAR", ink: "#2B2B2B", sub: "#2B2B2B", text: "#2B2B2B", font: f("bungee"), weight: 400, scale: 0.8, btn: "#2B2B2B", btnInk: "#FFFFFF", dot: "#F5B800" }),
  D("little-boss", "Little Boss", "kid", "Navy and gold office memo with a meeting-agenda card.",
    { bg: "#172340", small: "THE BOSS IS TURNING", sample: "SEVEN", ink: "#C9A04A", sub: "#FFFFFF", text: "#172340", font: f("playfair"), weight: 800, scale: 1.3, btn: "#172340", btnInk: "#FFFFFF", dot: "#C9A04A" }),
  // Teen Birthday (girl, then boy)
  D("disco-glow", "Disco Glow", "teen", "Midnight purple with neon pink glow and disco lights.",
    { bg: "#1B1035", small: "LET’S DANCE ALL NIGHT", sample: BIRTHDAY, ink: "#FFFFFF", sub: "#FF5FD2", text: "#FFFFFF", font: f("righteous"), weight: 400, btn: "#FF5FD2", btnInk: "#1B1035", dot: "#FF5FD2" }),
  D("pastel-polaroid", "Pastel Polaroid", "teen", "Cream and lavender with marker handwriting and polaroid snaps.",
    { bg: "#FBF6EF", small: "SAVE THE DATE, BESTIE", sample: BIRTHDAY, ink: "#3A3355", sub: "#3A3355", text: "#3A3355", font: f("marker"), weight: 400, btn: "#3A3355", btnInk: "#FFFFFF", dot: "#B9A3F0" }),
  D("anime-adventure-pink", "Anime Adventure (Pink)", "teen", "Speed lines, petals and manga panels in an original style, in pink.",
    { bg: "#FFFFFF", small: "EPISODE 14 · A NEW LEVEL", sample: "BIRTHDAY STAR", ink: "#FF7AA2", sub: "#1B1B2F", text: "#1B1B2F", font: f("dela"), weight: 400, scale: 0.66, btn: "#FF7AA2", btnInk: "#1B1B2F", dot: "#FF7AA2" }),
    D("game-on", "Game On", "teen", "Dark arcade screen with neon green for a level-up birthday.",
    { bg: "#0F1420", small: "PLAYER 1 · READY", sample: "BIRTHDAY STAR", ink: "#E8F0FF", sub: "#3DF5A6", text: "#E8F0FF", font: f("chakra"), weight: 700, scale: 0.85, btn: "#3DF5A6", btnInk: "#0F1420", dot: "#3DF5A6" }),
  D("street-court", "Street Court", "teen", "Charcoal and basketball orange with tall jersey lettering.",
    { bg: "#1E1E24", small: "GAME DAY", sample: "BIRTHDAY STAR", ink: "#FFFFFF", sub: "#F26B1D", text: "#FFFFFF", font: f("bebas"), weight: 400, scale: 1.2, btn: "#F26B1D", btnInk: "#1E1E24", dot: "#F26B1D" }),
  D("anime-adventure-sky-blue", "Anime Adventure (Sky Blue)", "teen", "Speed lines and manga panels in an original style, in sky blue.",
    { bg: "#FFFFFF", small: "EPISODE 15 · A NEW LEVEL", sample: "BIRTHDAY STAR", ink: "#5BC0EB", sub: "#1B1B2F", text: "#1B1B2F", font: f("dela"), weight: 400, scale: 0.66, btn: "#5BC0EB", btnInk: "#1B1B2F", dot: "#5BC0EB" }),
  // Debut (girl, then boy)
  D("enchanted-rose", "Enchanted Rose", "debut", "Blush and deep rose with an elegant script for eighteen roses.",
    { bg: "#FBF1EF", small: "EIGHTEEN ROSES FOR", sample: "The Celebrant", ink: "#9E2A3F", sub: "#5C1E2E", text: "#5C1E2E", font: f("pinyon"), weight: 400, scale: 1.1, btn: "#9E2A3F", btnInk: "#FFFFFF", dot: "#9E2A3F" }),
  D("starlit-gala", "Starlit Gala", "debut", "Midnight blue and silver for a night under the stars.",
    { bg: "#101A33", small: "A NIGHT UNDER THE STARS", sample: "The Celebrant", ink: "#F2EFE8", sub: "#C9D3E6", text: "#F2EFE8", font: f("italiana"), weight: 400, btn: "#C9D3E6", btnInk: "#101A33", dot: "#C9D3E6" }),
    D("black-tie", "Black Tie", "debut", "Black and champagne gold with art deco lettering.",
    { bg: "#121212", small: "BLACK TIE CELEBRATION", sample: "The Celebrant", ink: "#F3EBDD", sub: "#C9A45C", text: "#F3EBDD", font: f("poiret"), weight: 400, btn: "#C9A45C", btnInk: "#121212", dot: "#C9A45C" }),
  D("city-lights", "City Lights", "debut", "Night-city navy and amber with tall skyline lettering.",
    { bg: "#0E1B2C", small: "ONE NIGHT IN THE CITY", sample: "THE CELEBRANT", ink: "#EAF2FF", sub: "#F2B544", text: "#EAF2FF", font: f("big-shoulders"), weight: 800, scale: 1.1, btn: "#F2B544", btnInk: "#0E1B2C", dot: "#F2B544" }),
  // Weddings
  D("sampaguita", "Sampaguita", "wedding", "Ivory and soft green with sampaguita blooms and a flowing script.",
    { bg: "#FBF8F1", small: "WITH JOYFUL HEARTS", sample: COUPLE, ink: "#4F6B4A", sub: "#3E4A3B", text: "#3E4A3B", font: f("parisienne"), weight: 400, btn: "#4F6B4A", btnInk: "#FFFFFF", dot: "#E9C46A" }),
  D("garden-vows", "Garden Vows", "wedding", "Leafy greens and a classic serif for garden and church weddings.",
    { bg: "#E8F0EA", small: "SAVE THE DATE", sample: COUPLE, ink: "#2F5A47", sub: "#23402F", text: "#23402F", font: f("fraunces"), weight: 600, btn: "#2F5A47", btnInk: "#FFFFFF", dot: "#9CBFA7" }),
  D("elegant-minimalist", "Elegant & Minimalist", "wedding", "Ivory, a thin gold border and refined serif type.",
    { bg: "#FAF8F3", small: "THE WEDDING OF", sample: COUPLE, ink: "#1C1C1C", sub: "#1C1C1C", text: "#1C1C1C", font: f("cormorant"), weight: 500, btn: "#1C1C1C", btnInk: "#FFFFFF", dot: "#A8956B" }),
  D("bloom", "Bloom", "wedding", "Hand-drawn blooms in blush and peach.",
    { bg: "#FBF6F1", small: "TOGETHER WITH THEIR FAMILIES", sample: COUPLE, ink: "#8A5A48", sub: "#4A3B36", text: "#4A3B36", font: f("playfair"), weight: 500, btn: "#8A5A48", btnInk: "#FFFFFF", dot: "#F2C4C0" }),
  D("golden-hour", "Golden Hour", "wedding", "Navy and gold for a sunset ceremony.",
    { bg: "#22304A", small: "AS THE SUN SETS", sample: COUPLE, ink: "#F2D38B", sub: "#E8E2D2", text: "#F4EEE2", font: f("fraunces"), italic: true, weight: 500, btn: "#F2D38B", btnInk: "#22304A", dot: "#F2D38B" }),
  // Anniversary
  D("golden-years", "Golden Years", "anniversary", "Deep green and gold with classic capitals for a milestone anniversary.",
    { bg: "#1F3A33", small: "CELEBRATING [NUMBER] YEARS", sample: COUPLE, ink: "#F3ECDD", sub: "#D4AF62", text: "#F3ECDD", font: f("cinzel"), weight: 500, scale: 0.85, btn: "#D4AF62", btnInk: "#1F3A33", dot: "#D4AF62" }),
  D("love-letters", "Love Letters", "anniversary", "Cream paper and red ink, like a stack of love letters.",
    { bg: "#F7EFE6", small: "[NUMBER] YEARS OF LOVE LETTERS", sample: COUPLE, ink: "#B23A48", sub: "#2E3A57", text: "#2E3A57", font: f("allura"), weight: 400, scale: 1.15, btn: "#2E3A57", btnInk: "#FFFFFF", dot: "#B23A48" }),
  // Reunion
  D("family-tree", "Family Tree", "reunion", "Warm cream and leafy green for a family homecoming.",
    { bg: "#FAF5EA", small: "THE [FAMILY NAME] FAMILY", sample: "Together Again", ink: "#4F6B3A", sub: "#3D3A26", text: "#3D3A26", font: f("alegreya"), weight: 800, btn: "#4F6B3A", btnInk: "#FFFFFF", dot: "#E3A44B" }),
  D("class-reunion", "Class Reunion", "reunion", "Yearbook navy and red with varsity lettering.",
    { bg: "#F4EFE4", small: "CLASS OF [YEAR]", sample: "Together Again", ink: "#B23A48", sub: "#1F2D4A", text: "#1F2D4A", font: f("graduate"), weight: 400, scale: 0.85, btn: "#1F2D4A", btnInk: "#FFFFFF", dot: "#B23A48" }),
];

export const designById = (id: string) => DESIGNS.find((d) => d.id === id);
