import { Catalog } from "@/modules/catalog/Catalog";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return <Catalog products={products} />;
}
