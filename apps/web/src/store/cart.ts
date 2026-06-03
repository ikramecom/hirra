import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartLine } from '@hirra/shared';
import { buildCartLineKey, cartItemCount, cartSubtotal } from '@hirra/shared';

interface CartState {
  lines: CartLine[];
  isOpen: boolean;

  // Actions
  addLine: (line: Omit<CartLine, 'key'>) => void;
  removeLine: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;

  // Drawer controls
  openDrawer: () => void;
  closeDrawer: () => void;

  // Derived (computed at read-time)
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      addLine(line) {
        const key = buildCartLineKey(line);
        const existing = get().lines.find((l) => l.key === key);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.key === key ? { ...l, quantity: l.quantity + line.quantity } : l,
            ),
          });
        } else {
          set({ lines: [...get().lines, { ...line, key }] });
        }
      },

      removeLine(key) {
        set({ lines: get().lines.filter((l) => l.key !== key) });
      },

      updateQuantity(key, quantity) {
        if (quantity <= 0) {
          set({ lines: get().lines.filter((l) => l.key !== key) });
        } else {
          set({
            lines: get().lines.map((l) =>
              l.key === key ? { ...l, quantity: Math.min(quantity, 20) } : l,
            ),
          });
        }
      },

      clear() {
        set({ lines: [] });
      },

      openDrawer() {
        set({ isOpen: true });
      },

      closeDrawer() {
        set({ isOpen: false });
      },

      itemCount() {
        return cartItemCount(get().lines);
      },

      subtotal() {
        return cartSubtotal(get().lines);
      },
    }),
    {
      name: 'riyanaluxe:cart',
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
