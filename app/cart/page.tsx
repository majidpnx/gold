'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  weightGrams: number;
  karat: number;
  image: string;
  quantity: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری سبد خرید...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            بازگشت به گالری
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">سبد خرید</h1>
        </div>

        {cartItems.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">سبد خرید خالی است</h2>
              <p className="text-gray-600 mb-6">هنوز هیچ محصولی به سبد خرید اضافه نکرده‌اید</p>
              <Link href="/gallery">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  مشاهده محصولات
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.productId} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Product Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1610375461369-d613b56394da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <span>{item.weightGrams} گرم • {item.karat} عیار</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-yellow-600">
                            {formatPrice(item.price)} تومان
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right mt-2">
                          <span className="text-sm text-gray-600">مجموع: </span>
                          <span className="font-semibold text-yellow-600">
                            {formatPrice(item.price * item.quantity)} تومان
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تعداد محصولات:</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مجموع قیمت:</span>
                    <span className="text-xl font-bold text-yellow-600">
                      {formatPrice(totalPrice)} تومان
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href="/checkout">
                      <Button 
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        size="lg"
                      >
                        تکمیل سفارش
                      </Button>
                    </Link>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearCart}
                  >
                    پاک کردن سبد خرید
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
