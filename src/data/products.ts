import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "dd-condoms",
    slug: "condoms",
    title: "Condoms",
    price: 1200,
    description:
      "Not everything needs a serious explanation. A bold accessory created for those who love chaos, creativity and a little drama. A set of 3 pieces.",
    images: ["https://radika1.link/2026/06/18/1d8456eedb8a11e47.webp"],
    sizes: ["One size"],
    category: "Accessories",
    stock: 50
  },
  {
    id: "dd-keychain",
    slug: "keychain",
    title: "Keychain",
    price: 900,
    description:
      "A signature star keychain designed to add character to your everyday essentials. Lightweight, bold, and impossible to ignore.",
    images: ["https://radika1.link/2026/06/18/210fa7781b75f1b97.webp"],
    sizes: ["One size"],
    category: "Accessories",
    stock: 50
  },
  {
    id: "dd-door-hanger",
    slug: "door-hanger",
    title: "Door Hanger",
    price: 1200,
    description:
      "For creators, dreamers, and anyone protecting their energy. A statement piece that says more than words ever could.",
    images: ["https://radika1.link/2026/06/18/36d24017b6330d1d0.webp"],
    sizes: ["One size"],
    category: "Objects",
    stock: 50
  },
  {
    id: "dd-usb-drive",
    slug: "usb-drive",
    title: "USB Drive",
    price: 2400,
    description:
      "Store your ideas, memories, and inspirations in a design that stands out. Function meets individuality. 128GB.",
    images: ["https://s1.radikal.cloud/2026/06/18/4dc8735ff494040d2.webp"],
    sizes: ["One size"],
    category: "Tech",
    stock: 50
  },
  {
    id: "dd-carabiner",
    slug: "carabiner",
    title: "Carabiner",
    price: 900,
    description:
      "Clip it to your bag, keys, or belt loop. A practical accessory reimagined through the brand's signature star identity.",
    images: ["https://radika1.link/2026/06/18/5e2de6694af4463f0.webp"],
    sizes: ["One size"],
    category: "Accessories",
    stock: 50
  },
  {
    id: "dd-red-lighter",
    slug: "red-lighter",
    title: "Red Lighter",
    price: 600,
    description:
      "An everyday object transformed into a collectible statement. Clean, minimal, and unmistakably Designers Drama.",
    images: [
      "https://radika1.link/2026/06/18/6b69ababa479542f0.webp",
      "https://s1.radikal.cloud/2026/06/18/67-photo030b9b098db3b083.webp"
    ],
    sizes: ["One size"],
    category: "Objects",
    stock: 50
  },
  {
    id: "dd-black-lighter",
    slug: "black-lighter",
    title: "Black Lighter",
    price: 600,
    description:
      "An everyday object transformed into a collectible statement. Clean, minimal, and unmistakably Designers Drama.",
    images: [
      "https://s1.radikal.cloud/2026/06/18/770b9ce05a71b2e0a.webp",
      "https://s1.radikal.cloud/2026/06/18/67-photo030b9b098db3b083.webp"
    ],
    sizes: ["One size"],
    category: "Objects",
    stock: 50
  },
  {
    id: "dd-stamp",
    slug: "stamp",
    title: "Stamp",
    price: 1200,
    description:
      "Leave your mark wherever you go. Featuring the iconic star symbol, this stamp turns ordinary surfaces into personal statements.",
    images: ["https://radika1.link/2026/06/18/8b098cbd728b0c77a.webp"],
    sizes: ["One size"],
    category: "Objects",
    stock: 50
  }
];

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);
