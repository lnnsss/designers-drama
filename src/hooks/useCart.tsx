"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { CartItem, Product } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "designers-drama-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      setItems(JSON.parse(stored) as CartItem[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, size: string) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((current) =>
      current.filter((item) => !(item.product.id === productId && item.size === size))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      total,
      count
    }),
    [addItem, count, isCartOpen, items, removeItem, total, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
