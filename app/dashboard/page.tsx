"use client";
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/lib/auth';
import { Wallet, Package, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetcher('/api/wallet'),
  });
  
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher('/api/orders'),
  });
  
  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => fetcher('/api/trades'),
  });
  
  if (userLoading) {
    return (
      <main className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  const balance = walletData?.balance || 0;
  const orders = ordersData || [];
  const trades = tradesData || [];
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">داشبورد</h1>
        <p className="text-gray-600">خوش آمدید {user?.name || user?.phone}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موجودی کیف پول</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {formatToman(balance)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تعداد سفارشات</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تعداد معاملات</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {trades.length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/wallet">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
            <Wallet className="ml-2 h-4 w-4" />
            کیف پول
          </Button>
        </Link>
        <Link href="/trading">
          <Button className="w-full bg-green-500 hover:bg-green-600">
            <TrendingUp className="ml-2 h-4 w-4" />
            معامله آبشده
          </Button>
        </Link>
        <Link href="/orders">
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            <Package className="ml-2 h-4 w-4" />
            سفارشات
          </Button>
        </Link>
        <Link href="/gallery">
          <Button className="w-full bg-purple-500 hover:bg-purple-600">
            <User className="ml-2 h-4 w-4" />
            گالری
          </Button>
        </Link>
      </div>
      
      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>آخرین سفارشات</CardTitle>
          <CardDescription>سفارشات اخیر شما</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order: any) => (
                <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">سفارش #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-700">{formatToman(order.totalPrice)}</p>
                    <p className={`text-sm px-2 py-1 rounded ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'pending' ? 'در انتظار' :
                       order.status === 'paid' ? 'پرداخت شده' :
                       order.status === 'shipped' ? 'ارسال شده' :
                       order.status === 'delivered' ? 'تحویل شده' :
                       'لغو شده'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">هنوز سفارشی ثبت نکرده‌اید</p>
          )}
          {orders.length > 5 && (
            <div className="text-center mt-4">
              <Link href="/orders">
                <Button variant="outline">مشاهده همه سفارشات</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>آخرین معاملات</CardTitle>
          <CardDescription>معاملات اخیر آبشده</CardDescription>
        </CardHeader>
        <CardContent>
          {tradesLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : trades.length > 0 ? (
            <div className="space-y-2">
              {trades.slice(0, 5).map((trade: any) => (
                <div key={trade._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className={`font-medium ${trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.type === 'buy' ? 'خرید' : 'فروش'} {trade.grams} گرم
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(trade.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-700">{formatToman(trade.total)}</p>
                    <p className="text-sm text-gray-500">{formatToman(trade.unitPrice)}/گرم</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">هنوز معامله‌ای انجام نداده‌اید</p>
          )}
          {trades.length > 5 && (
            <div className="text-center mt-4">
              <Link href="/trading">
                <Button variant="outline">مشاهده همه معاملات</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
