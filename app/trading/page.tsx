"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, History, Calculator, DollarSign, Scale, Clock, AlertCircle } from 'lucide-react';

const tradeSchema = z.object({
  grams: z.number().positive('مقدار گرم باید مثبت باشد').max(1000, 'حداکثر ۱۰۰۰ گرم'),
});

type TradeForm = z.infer<typeof tradeSchema>;

export default function TradingPage() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const queryClient = useQueryClient();
  
  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['goldPrice'],
    queryFn: () => fetcher('/api/prices/gold'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => fetcher('/api/trades'),
  });
  
  const tradeMutation = useMutation({
    mutationFn: (data: { type: 'buy' | 'sell', grams: number }) => fetcher('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success(`معامله ${tradeType === 'buy' ? 'خرید' : 'فروش'} با موفقیت انجام شد`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در انجام معامله');
    },
  });
  
  const unitPrice = priceData?.unitPrice || 0;
  const trades = tradesData || [];
  
  const calculateTotal = (grams: number) => {
    return unitPrice * grams;
  };
  
  const handleTrade = (grams: number) => {
    tradeMutation.mutate({ type: tradeType, grams });
  };
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">معامله طلای آبشده</h1>
        <p className="text-gray-600">خرید و فروش طلای آبشده با قیمت لحظه‌ای و شفاف</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Form */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-yellow-100">
            <CardHeader className="bg-gradient-to-l from-yellow-50 to-white">
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Calculator className="h-6 w-6" />
                {tradeType === 'buy' ? 'خرید طلای آبشده' : 'فروش طلای آبشده'}
              </CardTitle>
              <CardDescription className="text-yellow-600">
                قیمت فعلی: {priceLoading ? 'در حال دریافت...' : formatToman(unitPrice)}/گرم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Trade Type Selection */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  variant={tradeType === 'buy' ? 'default' : 'ghost'}
                  className={`flex-1 ${tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
                  onClick={() => setTradeType('buy')}
                >
                  <TrendingUp className="ml-2 h-5 w-5" />
                  خرید طلا
                </Button>
                <Button
                  variant={tradeType === 'sell' ? 'default' : 'ghost'}
                  className={`flex-1 ${tradeType === 'sell' ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
                  onClick={() => setTradeType('sell')}
                >
                  <TrendingDown className="ml-2 h-5 w-5" />
                  فروش طلا
                </Button>
              </div>
              
              {/* Quick Amount Buttons */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">انتخاب سریع مقدار:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 5, 10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="hover:bg-yellow-50 hover:border-yellow-300"
                      onClick={() => handleTrade(amount)}
                      disabled={tradeMutation.isPending}
                    >
                      {amount} گرم
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Custom Amount Input */}
              <div>
                <Label htmlFor="customGrams" className="text-sm font-medium text-gray-700 mb-2 block">
                  مقدار سفارشی (گرم):
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="customGrams"
                    type="number"
                    placeholder="مثال: ۱۵"
                    min="0.1"
                    max="1000"
                    step="0.1"
                    className="text-center text-lg"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 0) {
                        // Update form or show preview
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById('customGrams') as HTMLInputElement;
                      const grams = parseFloat(input.value);
                      if (grams > 0 && grams <= 1000) {
                        handleTrade(grams);
                      } else {
                        toast.error('لطفاً مقدار معتبری وارد کنید');
                      }
                    }}
                    disabled={tradeMutation.isPending}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
                  >
                    {tradeMutation.isPending ? 'در حال انجام...' : 'انجام معامله'}
                  </Button>
                </div>
              </div>
              
              {/* Price Preview */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">نمای کلی معامله</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-500">قیمت هر گرم</div>
                      <div className="text-lg font-bold text-yellow-700">{formatToman(unitPrice)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">مثال برای ۱۰ گرم</div>
                      <div className="text-lg font-bold text-green-700">{formatToman(unitPrice * 10)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">نکات مهم:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• قیمت‌ها هر ۳۰ ثانیه بروزرسانی می‌شوند</li>
                      <li>• حداقل مقدار معامله: ۱ گرم</li>
                      <li>• حداکثر مقدار معامله: ۱۰۰۰ گرم</li>
                      <li>• معاملات فوری و بدون کارمزد</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Price Info & History */}
        <div className="space-y-6">
          {/* Current Price Card */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-yellow-700 flex items-center justify-center gap-2">
                <DollarSign className="h-5 w-5" />
                قیمت لحظه‌ای طلا
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {priceLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-yellow-200 rounded mb-2"></div>
                  <div className="h-4 bg-yellow-200 rounded w-3/4 mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-yellow-700 mb-2">
                    {formatToman(unitPrice)}
                  </div>
                  <div className="text-sm text-yellow-600 mb-3">به ازای هر گرم</div>
                  <div className="flex items-center justify-center gap-2 text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    +۲.۵٪ از دیروز
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Market Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5" />
                آمار بازار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">بالاترین قیمت امروز:</span>
                <span className="font-medium text-green-600">{formatToman(unitPrice * 1.02)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">پایین‌ترین قیمت امروز:</span>
                <span className="font-medium text-red-600">{formatToman(unitPrice * 0.98)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">تغییرات ۲۴ ساعته:</span>
                <span className="font-medium text-green-600">+۲.۵٪</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Trades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                آخرین معاملات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tradesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : trades.length > 0 ? (
                <div className="space-y-3">
                  {trades.slice(0, 5).map((trade: any) => (
                    <div key={trade._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className="text-sm">
                          <div className="font-medium">
                            {trade.type === 'buy' ? 'خرید' : 'فروش'}
                          </div>
                          <div className="text-xs text-gray-500">{trade.grams} گرم</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatToman(trade.total)}</div>
                        <div className="text-xs text-gray-500">{formatDate(trade.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <History className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm">هنوز معامله‌ای انجام نشده</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
