"use client";
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Eye, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher('/api/orders'),
  });
  
  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">سفارشات من</h1>
        <p className="text-gray-600">تاریخچه و وضعیت سفارشات شما</p>
      </div>
      
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">هنوز سفارشی ثبت نکرده‌اید</h2>
            <p className="text-gray-600 mb-6">برای مشاهده محصولات و ثبت سفارش به گالری مراجعه کنید</p>
            <Link href="/gallery">
              <Button className="bg-yellow-500 hover:bg-yellow-600">
                مشاهده گالری
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function OrderCard({ order }: { order: any }) {
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
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-lg">
                سفارش #{order._id.slice(-6)}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{order.items?.length || 0} محصول</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium text-yellow-700">
                  {formatToman(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/orders/${order._id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                مشاهده جزئیات
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
