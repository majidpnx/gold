import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  qty: number;
  pricePerGram: number;
  weightGrams: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const exists = state.items.find(i => i.productId === item.productId);
        if (exists) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId),
      })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.qty * i.pricePerGram * i.weightGrams, 0),
    }),
    { name: 'cart-storage' }
  )
);
