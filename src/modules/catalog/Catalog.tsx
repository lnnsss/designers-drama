import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import styles from "./Catalog.module.css";

export function Catalog({ products }: { products: Product[] }) {
  return (
    <section className={styles.catalog} id="shop">
      <div className={styles.grid}>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>

      <section className={styles.info} id="about">
        <h2>About</h2>
        <p>
            Made for those who choose to stand out. True style begins where individuality takes shape. Wear your difference with confidence.
        </p>
      </section>
    </section>
  );
}
