"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/hooks/useCart";
import { ProductGallery } from "@/components/ProductGallery/ProductGallery";
import styles from "./ProductDetail.module.css";

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const { addItem } = useCart();

  return (
    <section className={styles.product}>
      <ProductGallery product={product} />

      <motion.aside
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className={styles.category}>{product.category}</p>
          <h1>{product.title}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
        </div>

        <div className={styles.sizes} aria-label="Select size">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={selectedSize === size ? styles.activeSize : ""}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <p className={styles.description}>{product.description}</p>

        <button className={styles.addButton} type="button" onClick={() => addItem(product, selectedSize)}>
          Add to Cart
        </button>
      </motion.aside>
    </section>
  );
}
