import { products as fallbackProducts } from "@/data/products";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Product } from "@/types/product";

type ProductImageRow = {
  alt: string;
  sort_order: number;
  url: string;
};

type ProductRow = {
  category: string;
  description: string;
  id: string;
  price: number;
  product_images: ProductImageRow[];
  sizes: string[];
  slug: string;
  stock: number;
  title: string;
};

const productSelect = `
  id,
  slug,
  title,
  price,
  description,
  category,
  sizes,
  stock,
  product_images (
    url,
    alt,
    sort_order
  )
`;

function mapProduct(row: ProductRow): Product {
  const images = [...(row.product_images ?? [])]
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((image) => image.url);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: row.price,
    description: row.description,
    images,
    sizes: row.sizes.length > 0 ? row.sizes : ["One size"],
    category: row.category,
    stock: row.stock
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return fallbackProducts;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products from Supabase", error);
    return fallbackProducts;
  }

  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) {
    return fallbackProducts.find((product) => product.slug === slug);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Failed to load product '${slug}' from Supabase`, error);
    return fallbackProducts.find((product) => product.slug === slug);
  }

  return data ? mapProduct(data as ProductRow) : undefined;
}
