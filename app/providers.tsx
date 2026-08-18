"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/src/types/catalog";

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  itemCount: number;
  add: (product: Product, quantity?: number) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "abf-pedido-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setLines(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((product: Product, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.id === product.id
            ? { ...line, quantity: Number((line.quantity + quantity).toFixed(2)) }
            : line,
        );
      }
      return [...current, { ...product, quantity }];
    });
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    setLines((current) =>
      current.map((line) =>
        line.id === productId ? { ...line, quantity: Number(quantity.toFixed(2)) } : line,
      ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.id !== productId));
  }, []);

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      itemCount: lines.length,
      add,
      update,
      remove,
      clear: () => setLines([]),
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [lines, isOpen, add, update, remove],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart debe usarse dentro de CartProvider");
  return value;
}
