import {
  Abril_Fatface, Alegreya, Allura, Baloo_2, Bebas_Neue, Big_Shoulders, Bungee, Chakra_Petch, Cinzel, Cormorant,
  Dancing_Script, Dela_Gothic_One, Fraunces, Graduate, Great_Vibes, Italiana, Lilita_One, Nunito, Orbitron, Pacifico,
  Parisienne, Permanent_Marker, Pinyon_Script, Playfair_Display, Poiret_One, Racing_Sans_One, Righteous, Sniglet,
} from "next/font/google";

// Site fonts (design/tokens.css)
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

// Display fonts for the design tiles (each cover's title font, see src/lib/designs.ts). Not preloaded: browsers fetch
// one only when a tile uses it. Full covers load their own fonts inside public/covers/*.html.
// next/font needs literal options, so each is written out.
const greatVibes = Great_Vibes({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-great-vibes" });
const sniglet = Sniglet({ subsets: ["latin"], preload: false, weight: "800", variable: "--font-sniglet" });
const baloo = Baloo_2({ subsets: ["latin"], preload: false, weight: "800", variable: "--font-baloo" });
const racing = Racing_Sans_One({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-racing" });
const lilita = Lilita_One({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-lilita" });
const pacifico = Pacifico({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-pacifico" });
const dancing = Dancing_Script({ subsets: ["latin"], preload: false, weight: "700", variable: "--font-dancing" });
const abril = Abril_Fatface({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-abril" });
const orbitron = Orbitron({ subsets: ["latin"], preload: false, weight: "800", variable: "--font-orbitron" });
const bungee = Bungee({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-bungee" });
const playfair = Playfair_Display({ subsets: ["latin"], preload: false, weight: ["500", "800"], variable: "--font-playfair" });
const righteous = Righteous({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-righteous" });
const marker = Permanent_Marker({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-marker" });
const dela = Dela_Gothic_One({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-dela" });
const chakra = Chakra_Petch({ subsets: ["latin"], preload: false, weight: "700", variable: "--font-chakra" });
const bebas = Bebas_Neue({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-bebas" });
const pinyon = Pinyon_Script({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-pinyon" });
const italiana = Italiana({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-italiana" });
const poiret = Poiret_One({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-poiret" });
const bigShoulders = Big_Shoulders({ subsets: ["latin"], preload: false, weight: "800", variable: "--font-big-shoulders" });
const parisienne = Parisienne({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-parisienne" });
const cormorant = Cormorant({ subsets: ["latin"], preload: false, weight: "500", variable: "--font-cormorant" });
const cinzel = Cinzel({ subsets: ["latin"], preload: false, weight: "500", variable: "--font-cinzel" });
const allura = Allura({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-allura" });
const alegreya = Alegreya({ subsets: ["latin"], preload: false, weight: "800", variable: "--font-alegreya" });
const graduate = Graduate({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-graduate" });

export const fontVars = [
  fraunces, nunito, greatVibes, sniglet, baloo, racing, lilita, pacifico, dancing, abril, orbitron, bungee, playfair,
  righteous, marker, dela, chakra, bebas, pinyon, italiana, poiret, bigShoulders, parisienne, cormorant, cinzel, allura,
  alegreya, graduate,
]
  .map((f) => f.variable)
  .join(" ");
