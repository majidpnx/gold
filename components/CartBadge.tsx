'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export default function CartBadge() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const cart = JSON.parse(cartData);
          const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(totalItems);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error reading cart:', error);
        setCartCount(0);
      }
    };

    // Update count on mount
    updateCartCount();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  if (cartCount === 0) {
    return (
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative">
      <ShoppingCart className="w-5 h-5" />
      <Badge 
        className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center bg-red-500 text-white"
      >
        {cartCount > 99 ? '99+' : cartCount}
      </Badge>
    </div>
  );
}
