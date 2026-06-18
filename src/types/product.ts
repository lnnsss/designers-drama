export type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  category: string;
  stock: number;
};

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};
