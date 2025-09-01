'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XCircle, Home, ShoppingBag, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Failed Header */}
          <Card className="text-center mb-8">
            <CardContent className="py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                پرداخت ناموفق بود!
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                متأسفانه پرداخت شما با موفقیت انجام نشد. لطفاً دوباره تلاش کنید.
              </p>
              
              <Badge variant="outline" className="text-red-600 border-red-600">
                ناموفق
              </Badge>
            </CardContent>
          </Card>

          {/* Error Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>مشکلات احتمالی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">مشکل در شبکه</h3>
                    <p className="text-gray-600">اتصال اینترنت خود را بررسی کنید</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">عدم تایید بانک</h3>
                    <p className="text-gray-600">اطلاعات کارت بانکی خود را بررسی کنید</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">محدودیت تراکنش</h3>
                    <p className="text-gray-600">ممکن است کارت شما محدودیت تراکنش داشته باشد</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">خطای سیستمی</h3>
                    <p className="text-gray-600">ممکن است مشکل موقتی در سیستم پرداخت باشد</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>پشتیبانی</CardTitle>
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
            <Link href="/checkout" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <RefreshCw className="w-4 h-4 ml-2" />
                تلاش مجدد
              </Button>
            </Link>
            
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 ml-2" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              در صورت بروز مشکل، با پشتیبانی ما تماس بگیرید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
