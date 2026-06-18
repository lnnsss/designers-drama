"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/formatPrice";
import { CloseIcon } from "@/components/Icons/Icons";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, total, updateQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            className={styles.backdrop}
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          />

          <motion.aside
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Shopping cart"
          >
            <div className={styles.header}>
              <h2>Cart</h2>
              <IconButton label="Close cart" onClick={closeCart}>
                <CloseIcon />
              </IconButton>
            </div>

            {items.length === 0 ? (
              <p className={styles.empty}>Your cart is empty.</p>
            ) : (
              <div className={styles.items}>
                {items.map((item) => (
                  <article key={`${item.product.id}-${item.size}`} className={styles.item}>
                    <div className={styles.itemImage}>
                      <Image src={item.product.images[0]} alt={item.product.title} fill sizes="92px" />
                    </div>
                    <div className={styles.itemInfo}>
                      <div>
                        <h3>{item.product.title}</h3>
                        <p>
                          {item.size} / {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className={styles.controls}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          aria-label={`Decrease ${item.product.title} quantity`}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          aria-label={`Increase ${item.product.title} quantity`}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => removeItem(item.product.id, item.size)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className={styles.summary}>
              <div>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button type="button">Checkout</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
