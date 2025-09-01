'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Home, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function OrderSuccessPage() {
  
  useEffect(() => {
    // Clear cart when payment is successful
    localStorage.removeItem('cart');
    sessionStorage.removeItem('cart');
    
    // Dispatch cart updated event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="text-center mb-8">
            <CardContent className="py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                سفارش شما با موفقیت ثبت شد!
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                شماره سفارش: <span className="font-mono font-bold text-yellow-600">#ORD-{Date.now().toString().slice(-8)}</span>
              </p>
              
              <Badge variant="outline" className="text-green-600 border-green-600">
                در حال پردازش
              </Badge>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                جزئیات سفارش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">وضعیت سفارش</h3>
                  <p className="text-gray-600">در حال پردازش و آماده‌سازی</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">تخمین زمان تحویل</h3>
                  <p className="text-gray-600">۲ تا ۳ روز کاری</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">روش پرداخت</h3>
                  <p className="text-gray-600">پرداخت آنلاین (زرین‌پال)</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">روش ارسال</h3>
                  <p className="text-gray-600">ارسال با پیک موتوری</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>مراحل بعدی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-600 font-bold text-sm">۱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">تایید پرداخت</h3>
                    <p className="text-gray-600">پرداخت شما در حال بررسی و تایید است</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-600 font-bold text-sm">۲</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">آماده‌سازی سفارش</h3>
                    <p className="text-gray-600">محصولات شما در حال بسته‌بندی و آماده‌سازی است</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-600 font-bold text-sm">۳</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ارسال سفارش</h3>
                    <p className="text-gray-600">سفارش شما ارسال شده و شماره پیگیری برایتان ارسال می‌شود</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-600 font-bold text-sm">۴</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">تحویل سفارش</h3>
                    <p className="text-gray-600">سفارش شما در محل آدرس ثبت شده تحویل داده می‌شود</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">ایمیل: support@goldtrading.ir</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">ساعات کاری: شنبه تا چهارشنبه ۹ صبح تا ۶ عصر</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Home className="w-4 h-4 ml-2" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
            
            <Link href="/gallery" className="flex-1">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="w-4 h-4 ml-2" />
                مشاهده محصولات بیشتر
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              در صورت بروز هرگونه مشکل یا سوال، با پشتیبانی ما تماس بگیرید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
