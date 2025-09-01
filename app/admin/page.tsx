"use client";
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, TrendingUp, DollarSign, ShoppingCart, Activity, BarChart3, Calendar, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => fetcher('/api/admin/stats'),
  });
  
  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  const {
    users = 0,
    products = 0,
    orders = 0,
    trades = 0,
    salesTotal = 0,
    tradesTotal = 0,
    recentOrders = [],
    recentTrades = [],
  } = stats || {};
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">داشبورد مدیریت</h1>
        <p className="text-gray-600">نمای کلی از وضعیت سیستم و آمار کلی</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-r-4 border-r-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">کاربران کل</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{users.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-gray-500 mt-1">کل کاربران ثبت شده</p>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 ml-1" />
              +۱۲٪ از ماه گذشته
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-r-4 border-r-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">محصولات موجود</CardTitle>
            <Package className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{products.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-gray-500 mt-1">محصولات فعال در سیستم</p>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 ml-1" />
              +۸٪ از ماه گذشته
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-r-4 border-r-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">سفارشات کل</CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{orders.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-gray-500 mt-1">کل سفارشات ثبت شده</p>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 ml-1" />
              +۱۵٪ از ماه گذشته
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-r-4 border-r-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">معاملات آبشده</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{trades.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-gray-500 mt-1">معاملات طلای آبشده</p>
            <div className="flex items-center text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3 ml-1" />
              +۲۳٪ از ماه گذشته
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <DollarSign className="h-5 w-5" />
              خلاصه مالی
            </CardTitle>
            <CardDescription>وضعیت کلی درآمد و معاملات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">کل فروش محصولات:</span>
              <span className="text-lg font-bold text-green-700">{formatToman(salesTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-700">کل معاملات آبشده:</span>
              <span className="text-lg font-bold text-orange-700">{formatToman(tradesTotal)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">مجموع کل:</span>
              <span className="text-xl font-bold text-blue-700">{formatToman(salesTotal + tradesTotal)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Activity className="h-5 w-5" />
              آمار سریع
            </CardTitle>
            <CardDescription>نرخ تبدیل و میانگین‌ها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {orders > 0 ? Math.round((orders / users) * 100) : 0}%
                </div>
                <div className="text-xs text-blue-600">نرخ تبدیل کاربران</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {orders > 0 ? Math.round(salesTotal / orders) : 0}
                </div>
                <div className="text-xs text-purple-600">میانگین سفارش (تومان)</div>
              </div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-700">
                {trades > 0 ? Math.round(tradesTotal / trades) : 0}
              </div>
              <div className="text-xs text-yellow-600">میانگین معامله آبشده (تومان)</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              آخرین سفارشات
            </CardTitle>
            <CardDescription>سفارشات اخیر ثبت شده</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {order.userId?.name || order.userId?.phone || 'کاربر ناشناس'}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatToman(order.totalPrice)}</div>
                      <div className="text-xs text-gray-500 capitalize">{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>هنوز سفارشی ثبت نشده است</p>
              </div>
            )}
            <div className="mt-4">
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full">
                  مشاهده همه سفارشات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              آخرین معاملات
            </CardTitle>
            <CardDescription>معاملات اخیر آبشده</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTrades.length > 0 ? (
              <div className="space-y-3">
                {recentTrades.map((trade: any) => (
                  <div key={trade._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {trade.type === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {trade.userId?.name || trade.userId?.phone || 'کاربر ناشناس'}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(trade.createdAt)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{formatToman(trade.total)}</div>
                      <div className="text-xs text-gray-500">
                        {trade.type === 'buy' ? 'خرید' : 'فروش'} {trade.grams} گرم
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>هنوز معامله‌ای انجام نشده است</p>
              </div>
            )}
            <div className="mt-4">
              <Link href="/admin/trades">
                <Button variant="outline" className="w-full">
                  مشاهده همه معاملات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">عملیات سریع</CardTitle>
            <CardDescription>دسترسی سریع به بخش‌های مختلف مدیریت</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Package className="h-6 w-6" />
                  <span className="text-sm">مدیریت محصولات</span>
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm">مدیریت سفارشات</span>
                </Button>
              </Link>
              <Link href="/admin/trades">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">مدیریت معاملات</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">مدیریت کاربران</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
