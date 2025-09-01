'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, MapPin, Phone, User, Mail, ShoppingCart } from 'lucide-react';
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

interface UserInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = totalPrice > 10000000 ? 0 : 500000; // Free shipping for orders over 10M Toman
  const finalTotal = totalPrice + shippingCost;

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.phone || !userInfo.address) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    if (cartItems.length === 0) {
      alert('سبد خرید خالی است');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data
      const orderData = {
        items: cartItems,
        userInfo,
        totalPrice: finalTotal,
        shippingCost,
        status: 'pending'
      };

      // Send to ZarinPal payment API
      const response = await fetch('/api/payment/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalTotal,
          description: `سفارش طلا - ${userInfo.firstName} ${userInfo.lastName}`,
          callbackUrl: `${window.location.origin}/payment/verify`,
          userInfo,
          cartItems
        }),
      });

      const result = await response.json();
      console.log('Payment API response:', result);

      if (result.success && result.paymentUrl) {
        console.log('Redirecting to ZarinPal:', result.paymentUrl);
        window.location.href = result.paymentUrl;
      } else {
        console.error('Payment failed:', result);
        throw new Error(result.message || 'خطا در ایجاد درگاه پرداخت');
      }
      
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('خطا در ایجاد درگاه پرداخت. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">سبد خرید خالی است</h2>
              <p className="text-gray-600 mb-6">برای تکمیل سفارش ابتدا محصولی به سبد خرید اضافه کنید</p>
              <Link href="/gallery">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  مشاهده محصولات
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            بازگشت به سبد خرید
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">تکمیل سفارش</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  اطلاعات شخصی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">نام *</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="نام خود را وارد کنید"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="نام خانوادگی خود را وارد کنید"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">شماره تلفن *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  آدرس ارسال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">آدرس کامل *</Label>
                  <Textarea
                    id="address"
                    value={userInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="آدرس کامل خود را وارد کنید"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">شهر *</Label>
                    <Input
                      id="city"
                      value={userInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="نام شهر"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">کد پستی</Label>
                    <Input
                      id="postalCode"
                      value={userInfo.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  روش پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">پرداخت آنلاین (زرین‌پال)</div>
                      <div className="text-sm text-blue-700">پرداخت امن و سریع با درگاه زرین‌پال</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1610375461369-d613b56394da?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.quantity} عدد • {item.weightGrams} گرم
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-yellow-600">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>تعداد محصولات:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>مجموع قیمت:</span>
                    <span>{formatPrice(totalPrice)} تومان</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>هزینه ارسال:</span>
                    <span>{shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost) + ' تومان'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-yellow-600 pt-2 border-t">
                    <span>مجموع نهایی:</span>
                    <span>{formatPrice(finalTotal)} تومان</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      در حال انتقال به درگاه پرداخت...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 ml-2" />
                      پرداخت آنلاین
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  با تکمیل سفارش، شما شرایط و قوانین ما را می‌پذیرید
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
