'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';

interface PriceTickerProps {
  compact?: boolean;
}

interface GoldPriceData {
  unitPrice: number;
  source: string;
  updatedAt: string;
  marketInfo: {
    iranianPremium?: number;
    fluctuation?: number;
    note?: string;
  };
}

async function fetchGoldPrice(): Promise<GoldPriceData> {
  const response = await fetch('/api/prices/gold');
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

function getSourceBadge(source: string) {
  switch (source) {
    case 'priceto_day_calculation':
      return { text: 'priceto.day', variant: 'default' as const };
    case 'fallback_calculation':
      return { text: 'محاسبه پیش‌فرض', variant: 'secondary' as const };
    case 'emergency_fallback':
      return { text: 'پیش‌فرض اضطراری', variant: 'destructive' as const };
    default:
      return { text: 'نامشخص', variant: 'outline' as const };
  }
}

export default function PriceTicker({ compact = false }: PriceTickerProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['goldPrice'],
    queryFn: fetchGoldPrice,
    refetchInterval: 5000, // 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />
            <span className="text-gray-600">در حال بارگذاری...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2">
            <span className="text-red-600">خطا در دریافت قیمت</span>
          </div>
        ) : data ? (
          <>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold text-yellow-700">
                {formatPrice(data.unitPrice)}
              </span>
              <span className="text-gray-600 text-xs">تومان</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(data.updatedAt)}</span>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  const sourceBadge = data ? getSourceBadge(data.source) : { text: 'نامشخص', variant: 'outline' as const };

  return (
    <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            قیمت زنده طلای ۱۸ عیار
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-yellow-600" />
              <span className="text-gray-600">در حال دریافت قیمت‌های آنلاین...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">خطا در دریافت قیمت</div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              تلاش مجدد
            </Button>
          </div>
        ) : data ? (
          <>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-700 mb-2">
                {formatPrice(data.unitPrice)}
              </div>
              <div className="text-lg text-gray-600 mb-4">تومان برای هر گرم (۱۸ عیار)</div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>منبع داده:</span>
                <Badge variant={sourceBadge.variant} className="text-xs">
                  {sourceBadge.text}
                </Badge>
              </div>
              
              {data.marketInfo?.iranianPremium && (
                <div className="text-xs text-gray-500 mb-1">
                  پریمیوم بازار ایران: {((data.marketInfo.iranianPremium - 1) * 100).toFixed(1)}%
                </div>
              )}
              
              {data.marketInfo?.fluctuation && (
                <div className="text-xs text-gray-500 mb-1">
                  نوسان: {data.marketInfo.fluctuation.toFixed(2)}%
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>آخرین بروزرسانی: {formatTimeAgo(data.updatedAt)}</span>
              </div>
              
              {data.marketInfo?.note && (
                <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
                  {data.marketInfo.note}
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-2 text-center">
                بروزرسانی خودکار هر ۵ ثانیه
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
