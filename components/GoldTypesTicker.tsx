"use client";

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Coins, BarChart3, Gem, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface GoldTypeData {
  name: string;
  unitPrice: number;
  premium: number;
  unit: string;
  basePrice: number;
  source: string;
  updatedAt: string;
}

interface GoldTypesData {
  basePrice: number;
  types: Record<string, GoldTypeData>;
  tgjuData: any;
  updatedAt: string;
}

async function fetchGoldTypes(): Promise<GoldTypesData> {
  const response = await fetch('/api/prices/gold/types');
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

const categories = {
  pure_gold: ['gram_18k', 'gram_24k'],
  coins: ['coin_emami', 'coin_bahare_azadi', 'coin_nim', 'coin_rob'],
  bars: ['bar_100g', 'bar_50g', 'bar_10g'],
  jewelry: ['jewelry_18k', 'jewelry_21k']
};

function getCategoryIcon(category: string) {
  switch (category) {
    case 'pure_gold': return <TrendingUp className="h-4 w-4" />;
    case 'coins': return <Coins className="h-4 w-4" />;
    case 'bars': return <BarChart3 className="h-4 w-4" />;
    case 'jewelry': return <Gem className="h-4 w-4" />;
    default: return <TrendingUp className="h-4 w-4" />;
  }
}

function getCategoryName(category: string) {
  switch (category) {
    case 'pure_gold': return 'طلای خام';
    case 'coins': return 'سکه‌ها';
    case 'bars': return 'شمش‌ها';
    case 'jewelry': return 'جواهرات';
    default: return category;
  }
}

export default function GoldTypesTicker() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['goldTypes'],
    queryFn: fetchGoldTypes,
    refetchInterval: 5000, // 5 seconds
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            انواع طلا و قیمت‌ها
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
            <div className="text-red-600 mb-2">خطا در دریافت قیمت‌ها</div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              تلاش مجدد
            </Button>
          </div>
        ) : data ? (
          <>
            {/* Main Price - 18k Gold */}
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700 mb-1">
                {formatPrice(data.types?.gram_18k?.unitPrice || 89407000)}
              </div>
              <div className="text-sm text-gray-600">قیمت اصلی طلای ۱۸ عیار (تومان/گرم)</div>
            </div>

            {/* Categories */}
            {Object.entries(categories).map(([categoryKey, typeKeys]) => (
              <div key={categoryKey} className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  {getCategoryIcon(categoryKey)}
                  {getCategoryName(categoryKey)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {typeKeys.map((typeKey) => {
                    const typeData = data.types[typeKey];
                    if (!typeData) return null;

                    const sourceBadge = getSourceBadge(typeData.source);

                    return (
                      <div key={typeKey} className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-800">{typeData.name}</div>
                          <Badge variant={sourceBadge.variant} className="text-xs">
                            {sourceBadge.text}
                          </Badge>
                        </div>
                        
                        <div className="text-xl font-bold text-yellow-700 mb-1">
                          {formatPrice(typeData.unitPrice)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>برای هر {typeData.unit}</span>
                          {typeData.premium !== 0 && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              typeData.premium > 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {typeData.premium > 0 ? '+' : ''}{typeData.premium.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Footer Info */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>آخرین بروزرسانی: {formatTimeAgo(data.updatedAt)}</span>
                </div>
                
                                  <div className="flex items-center gap-2">
                    <span>منبع:</span>
                    <Badge variant="outline" className="text-xs">
                      priceto.day
                    </Badge>
                  </div>
              </div>
              
                              <div className="text-xs text-gray-500 mt-2">
                  بروزرسانی خودکار هر ۵ ثانیه • قیمت‌ها بر اساس داده‌های priceto.day
                </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
