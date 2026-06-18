"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import styles from "./ProductGallery.module.css";

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const activeImage = product.images[activeIndex];

  return (
    <div className={styles.gallery}>
      <button
        className={styles.viewer}
        type="button"
        onClick={() => setIsZoomOpen(true)}
        aria-label={`Zoom ${product.title} image ${activeIndex + 1}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            layoutId={activeIndex === 0 ? `product-image-${product.id}` : undefined}
            className={styles.activeImage}
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={activeImage}
              alt={`${product.title} view ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 920px) 100vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>
      </button>

      <div className={styles.thumbnails} aria-label={`${product.title} gallery`}>
        {product.images.map((image, index) => (
          <button
            type="button"
            key={image}
            className={activeIndex === index ? styles.active : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show image ${index + 1}`}
          >
            <Image src={image} alt="" fill sizes="82px" aria-hidden="true" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <button
              className={styles.lightboxBackdrop}
              type="button"
              aria-label="Close image zoom"
              onClick={() => setIsZoomOpen(false)}
            />
            <motion.div
              className={styles.lightboxImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={activeImage}
                alt={`${product.title} enlarged view ${activeIndex + 1}`}
                fill
                sizes="100vw"
                priority
              />
            </motion.div>
            <button className={styles.lightboxClose} type="button" onClick={() => setIsZoomOpen(false)}>
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
