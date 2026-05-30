import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

export type Listing = {
  id: string;
  title: string;
  price: number;
  image: string;
  wear: string;
  fabric: string;
  region: string;
  seller: string;
  badge?: "Verified Plus" | "Premium Listing" | "Verified";
  customizable?: boolean;
  age: string;
  bodyType: string;
};

export const listings: Listing[] = [
  {
    id: "lp-maison-corset",
    title: "La Perla Maison Corset",
    price: 480,
    image: listing1,
    wear: "2 Hours",
    fabric: "Silk Satin",
    region: "Milan, IT",
    seller: "Sienna V.",
    badge: "Verified Plus",
    customizable: true,
    age: "25-30",
    bodyType: "Petite",
  },
  {
    id: "ap-vintage-set",
    title: "Agent Provocateur Vintage Set",
    price: 620,
    image: listing2,
    wear: "0 Hours (New)",
    fabric: "Chantilly Lace",
    region: "London, UK",
    seller: "Elena Moore",
    badge: "Premium Listing",
    age: "30-35",
    bodyType: "Hourglass",
  },
  {
    id: "falke-holdups",
    title: "Falke Luxury Hold-ups",
    price: 110,
    image: listing3,
    wear: "1 Hour",
    fabric: "Sheer Silk",
    region: "Paris, FR",
    seller: "Sophie L.",
    badge: "Verified",
    age: "20-25",
    bodyType: "Slim",
  },
  {
    id: "burgundy-couture",
    title: "Burgundy Couture Detail",
    price: 340,
    image: listing4,
    wear: "4 Hours",
    fabric: "Silk Jacquard",
    region: "Vienna, AT",
    seller: "Mira K.",
    badge: "Verified Plus",
    customizable: true,
    age: "30-35",
    bodyType: "Curvy",
  },
  {
    id: "ivory-lace-detail",
    title: "Ivory Heritage Lace",
    price: 215,
    image: listing5,
    wear: "0 Hours (New)",
    fabric: "Leavers Lace",
    region: "Lyon, FR",
    seller: "Camille R.",
    badge: "Verified",
    age: "25-30",
    bodyType: "Petite",
  },
  {
    id: "noir-rouge-robe",
    title: "Noir & Rouge Silk Robe",
    price: 295,
    image: listing6,
    wear: "6 Hours",
    fabric: "Mulberry Silk",
    region: "Tokyo, JP",
    seller: "Yuki A.",
    badge: "Premium Listing",
    customizable: true,
    age: "30-35",
    bodyType: "Slim",
  },
];