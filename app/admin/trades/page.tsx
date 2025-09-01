"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Search, User, Calendar, DollarSign, Scale } from 'lucide-react';

export default function AdminTradesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { data: trades, isLoading } = useQuery({
    queryKey: ['adminTrades'],
    queryFn: () => fetcher('/api/admin/trades'),
  });
  
  const filteredTrades = trades?.filter((trade: any) => {
    const matchesSearch = 
      trade.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.userId?.phone?.includes(searchTerm) ||
      trade._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || trade.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];
  
  const getTypeText = (type: string) => {
    switch (type) {
      case 'buy':
        return 'خرید';
      case 'sell':
        return 'فروش';
      default:
        return type;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
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
      case 'completed':
        return 'تکمیل شده';
      case 'cancelled':
        return 'لغو شده';
      default:
        return status;
    }
  };
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">مدیریت معاملات</h1>
        <p className="text-gray-600">مشاهده و مدیریت تمام معاملات آبشده</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="جستجو در معاملات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="نوع معامله" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            <SelectItem value="buy">خرید</SelectItem>
            <SelectItem value="sell">فروش</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Trades List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : filteredTrades.length > 0 ? (
        <div className="space-y-4">
          {filteredTrades.map((trade: any) => (
            <TradeCard
              key={trade._id}
              trade={trade}
              getTypeText={getTypeText}
              getTypeColor={getTypeColor}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">معامله‌ای یافت نشد</h2>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== 'all' ? 'معامله‌ای با فیلترهای انتخاب شده یافت نشد' : 'هنوز معامله‌ای انجام نشده است'}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Summary */}
      {filteredTrades.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700">{filteredTrades.length}</p>
                <p className="text-sm text-gray-600">کل معاملات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {filteredTrades.filter((t: any) => t.type === 'buy').length}
                </p>
                <p className="text-sm text-gray-600">خرید</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">
                  {filteredTrades.filter((t: any) => t.type === 'sell').length}
                </p>
                <p className="text-sm text-gray-600">فروش</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {filteredTrades.reduce((sum: number, t: any) => sum + t.grams, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">مجموع گرم</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">
                  {formatToman(filteredTrades.reduce((sum: number, t: any) => sum + t.total, 0))}
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

function TradeCard({ 
  trade, 
  getTypeText, 
  getTypeColor, 
  getStatusColor, 
  getStatusText 
}: { 
  trade: any, 
  getTypeText: (type: string) => string,
  getTypeColor: (type: string) => string,
  getStatusColor: (status: string) => string,
  getStatusText: (status: string) => string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">
                معامله #{trade._id.slice(-6)}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(trade.type)}`}>
                {getTypeText(trade.type)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trade.status)}`}>
                {getStatusText(trade.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{trade.userId?.name || trade.userId?.phone || 'کاربر'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <span>{trade.grams} گرم</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium text-yellow-700">
                  {formatToman(trade.unitPrice)}/گرم
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-bold text-yellow-700">
                  {formatToman(trade.total)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(trade.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
