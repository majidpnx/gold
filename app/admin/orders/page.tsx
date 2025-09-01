"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ShoppingCart, Search, Eye, Calendar, DollarSign, User, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher('/api/orders'),
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: string }) => fetcher(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('وضعیت سفارش با موفقیت بروزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در بروزرسانی وضعیت');
    },
  });
  
  const orders = ordersData || [];
  
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };
  
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
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">مدیریت سفارشات</h1>
        <p className="text-gray-600">مشاهده و مدیریت تمام سفارشات سیستم</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="جستجو در سفارشات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="وضعیت سفارش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="pending">در انتظار</SelectItem>
            <SelectItem value="paid">پرداخت شده</SelectItem>
            <SelectItem value="shipped">ارسال شده</SelectItem>
            <SelectItem value="delivered">تحویل شده</SelectItem>
            <SelectItem value="cancelled">لغو شده</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">سفارشی یافت نشد</h2>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'سفارشی با فیلترهای انتخاب شده یافت نشد' : 'هنوز سفارشی ثبت نشده است'}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Summary */}
      {filteredOrders.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-700">{filteredOrders.length}</p>
                <p className="text-sm text-gray-600">کل سفارشات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {filteredOrders.filter((o: any) => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-gray-600">تحویل شده</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {filteredOrders.filter((o: any) => o.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">در انتظار</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {formatToman(filteredOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0))}
                </p>
                <p className="text-sm text-gray-600">مجموع ارزش</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function OrderCard({ 
  order, 
  onStatusUpdate, 
  getStatusColor, 
  getStatusText 
}: { 
  order: any, 
  onStatusUpdate: (orderId: string, status: string) => void,
  getStatusColor: (status: string) => string,
  getStatusText: (status: string) => string
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = (newStatus: string) => {
    setIsUpdating(true);
    onStatusUpdate(order._id, newStatus);
    setTimeout(() => setIsUpdating(false), 1000);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-lg">
                سفارش #{order._id.slice(-6)}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{order.userId?.name || order.userId?.phone || 'کاربر'}</span>
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
          
          <div className="flex flex-col gap-2">
            <Link href={`/orders/${order._id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="ml-2 h-4 w-4" />
                مشاهده جزئیات
              </Button>
            </Link>
            
            <Select 
              value={order.status} 
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="paid">پرداخت شده</SelectItem>
                <SelectItem value="shipped">ارسال شده</SelectItem>
                <SelectItem value="delivered">تحویل شده</SelectItem>
                <SelectItem value="cancelled">لغو شده</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
