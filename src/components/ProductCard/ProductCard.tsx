"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasHoverImage = product.images.length > 1;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${product.slug}`} className={styles.link} aria-label={`View ${product.title}`}>
        <motion.div className={styles.media} layoutId={`product-image-${product.id}`}>
          <Image className={styles.imagePrimary} src={product.images[0]} alt={product.title} fill sizes="(max-width: 760px) 50vw, (max-width: 1120px) 33vw, 25vw" priority={priority} />
          {hasHoverImage && (
            <Image className={styles.imageSecondary} src={product.images[1]} alt="" fill sizes="(max-width: 760px) 50vw, (max-width: 1120px) 33vw, 25vw" aria-hidden="true" />
          )}
        </motion.div>
        <div className={styles.meta}>
          <h2>{product.title}</h2>
          <p>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.article>
  );
}
