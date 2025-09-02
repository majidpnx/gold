'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Euro, Coins } from 'lucide-react';
import { useState } from 'react';

interface BrsApiData {
  gold_18k: {
    price: number;
    change_percent: number;
    name: string;
  } | null;
  gold_24k: {
    price: number;
    change_percent: number;
    name: string;
  } | null;
  coin_emami: {
    price: number;
    change_percent: number;
    name: string;
  } | null;
  coin_bahar: {
    price: number;
    change_percent: number;
    name: string;
  } | null;
  usd: {
    price: number;
    change_percent: number;
    name: string;
  } | null;
  eur: {
    price: number;
    change_percent: number;
    name: string;
  } | null;
  iranianGoldPrice: number;
  lastUpdated: string;
  source: string;
}

async function fetchPrices(): Promise<BrsApiData> {
  const response = await fetch('/api/prices/brsapi');
  const data = await response.json();
  return data.data;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} ثانیه پیش`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
  return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
}

function getChangeIcon(change: number) {
  return change >= 0 ? (
    <TrendingUp className="h-4 w-4 text-green-600" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-600" />
  );
}

function getChangeColor(change: number) {
  return change >= 0 ? 'text-green-600' : 'text-red-600';
}

export default function PriceDashboard() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['brsapiPrices'],
    queryFn: fetchPrices,
    refetchInterval: 30000, // 30 seconds
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-600 mb-4">خطا در دریافت قیمت‌ها</div>
          <Button onClick={handleRefresh} variant="outline">
            تلاش مجدد
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const priceItems = [
    {
      title: 'طلای ۱۸ عیار',
      data: data.gold_18k,
      icon: <TrendingUp className="h-5 w-5 text-yellow-600" />,
      unit: 'تومان/گرم',
    },
    {
      title: 'طلای ۲۴ عیار',
      data: data.gold_24k,
      icon: <TrendingUp className="h-5 w-5 text-yellow-700" />,
      unit: 'تومان/گرم',
    },
    {
      title: 'سکه امامی',
      data: data.coin_emami,
      icon: <Coins className="h-5 w-5 text-yellow-600" />,
      unit: 'تومان',
    },
    {
      title: 'سکه بهار آزادی',
      data: data.coin_bahar,
      icon: <Coins className="h-5 w-5 text-yellow-600" />,
      unit: 'تومان',
    },
    {
      title: 'دلار آمریکا',
      data: data.usd,
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      unit: 'ریال',
    },
    {
      title: 'یورو',
      data: data.eur,
      icon: <Euro className="h-5 w-5 text-blue-600" />,
      unit: 'ریال',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">قیمت‌های زنده بازار</h2>
          <p className="text-gray-600 mt-1">
            آخرین بروزرسانی: {data ? formatTimeAgo(data.lastUpdated) : 'نامشخص'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            منبع: {data.source}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {priceItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {item.icon}
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.data ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(item.data.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.unit}
                  </div>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(item.data.change_percent)}
                    <span className={`text-sm font-medium ${getChangeColor(item.data.change_percent)}`}>
                      {item.data.change_percent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-400 text-sm">داده در دسترس نیست</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      {data.iranianGoldPrice > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="py-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                قیمت محاسبه شده طلای ایرانی
              </h3>
              <div className="text-3xl font-bold text-yellow-700">
                {formatPrice(data.iranianGoldPrice)} تومان
              </div>
              <p className="text-sm text-gray-600 mt-2">
                بر اساس قیمت جهانی طلا و نرخ دلار
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
