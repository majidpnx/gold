"use client";
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Calendar, DollarSign, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetcher(`/api/orders/${orderId}`),
  });
  
  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }
  
  if (!order) {
    return (
      <main className="container py-8">
        <div className="text-center py-16">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">سفارش یافت نشد</h1>
          <p className="text-gray-600 mb-6">سفارش مورد نظر وجود ندارد یا حذف شده است</p>
          <Link href="/orders">
            <Button variant="outline">بازگشت به سفارشات</Button>
          </Link>
        </div>
      </main>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار';
      case 'paid':
        return 'پرداخت شده';
      case 'shipped':
        return 'ارسال شده';
      case 'delivered':
        return 'تحویل شده';
      case 'cancelled':
        return 'لغو شده';
      default:
        return status;
    }
  };
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-800 mb-4">
          <ArrowLeft className="h-4 w-4" />
          بازگشت به سفارشات
        </Link>
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">
          سفارش #{order._id.slice(-6)}
        </h1>
        <p className="text-gray-600">جزئیات کامل سفارش</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                اطلاعات سفارش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">تاریخ ثبت</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">مبلغ کل</p>
                    <p className="font-bold text-yellow-700 text-lg">{formatToman(order.totalPrice)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">وضعیت</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">کاربر</p>
                    <p className="font-medium">{order.userId?.name || order.userId?.phone || 'نامشخص'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>محصولات سفارش</CardTitle>
              <CardDescription>{order.items?.length || 0} محصول</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded overflow-hidden">
                      {/* Placeholder for product image */}
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.productId?.title || 'محصول طلا'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.productId?.weightGrams || 'نامشخص'} گرم × {item.qty} عدد
                      </p>
                      <p className="text-sm text-gray-500">
                        قیمت هر گرم: {formatToman(item.priceAtOrder)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-yellow-700">
                        {formatToman((item.productId?.weightGrams || 0) * item.priceAtOrder * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>تعداد محصولات:</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>مجموع وزن:</span>
                  <span className="font-medium">
                    {order.items?.reduce((sum: number, item: any) => 
                      sum + (item.productId?.weightGrams || 0) * item.qty, 0
                    ).toFixed(2)} گرم
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-lg font-bold text-yellow-700">
                    <span>مجموع:</span>
                    <span>{formatToman(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Link href="/gallery" className="w-full">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
                    خرید بیشتر
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
