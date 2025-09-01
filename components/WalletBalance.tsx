'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Plus, 
  Minus, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletData {
  balance: number;
  transactions: Array<{
    id: string;
    type: 'deposit' | 'withdraw' | 'purchase';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    description: string;
    createdAt: string;
  }>;
}

async function fetchWalletData(): Promise<WalletData> {
  const response = await fetch('/api/wallet');
  const data = await response.json();
  return data.data;
}

async function createPayment(amount: number) {
  const response = await fetch('/api/payment/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount,
      userId: 'current-user-id', // This should come from auth context
      description: 'شارژ کیف پول',
      type: 'deposit',
    }),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message);
  }
  
  return data.data;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fa-IR');
}

export default function WalletBalance() {
  const [amount, setAmount] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const queryClient = useQueryClient();

  const { data: walletData, isLoading, error } = useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWalletData,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const paymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      // Redirect to ZarinPal payment page
      window.location.href = data.paymentUrl;
    },
    onError: (error) => {
      toast.error(error.message || 'خطا در ایجاد درخواست پرداخت');
      setIsCharging(false);
    },
  });

  const handleCharge = async () => {
    const numAmount = parseInt(amount);
    
    if (!numAmount || numAmount < 10000) {
      toast.error('حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است');
      return;
    }

    if (numAmount > 100000000) {
      toast.error('حداکثر مبلغ شارژ ۱۰۰,۰۰۰,۰۰۰ تومان است');
      return;
    }

    setIsCharging(true);
    paymentMutation.mutate(numAmount);
  };

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
          <span className="mr-2">در حال بارگذاری...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          خطا در بارگذاری اطلاعات کیف پول
        </CardContent>
      </Card>
    );
  }

  const balance = walletData?.balance || 0;
  const needsCharge = balance < 100000; // Less than 100K Tomans

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="w-full border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-yellow-600" />
            موجودی کیف پول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-700 mb-2">
              {formatPrice(balance)} تومان
            </div>
            
            {needsCharge ? (
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-4">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">موجودی کم است</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">موجودی کافی</span>
              </div>
            )}
          </div>

          {/* Quick Charge Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-xs"
              >
                {formatPrice(quickAmount)}
              </Button>
            ))}
          </div>

          {/* Manual Charge */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="مبلغ شارژ (تومان)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCharge}
              disabled={isCharging || !amount}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {isCharging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="mr-1">شارژ</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            حداقل: ۱۰,۰۰۰ تومان • حداکثر: ۱۰۰,۰۰۰,۰۰۰ تومان
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>آخرین تراکنش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          {walletData?.transactions && walletData.transactions.length > 0 ? (
            <div className="space-y-3">
              {walletData.transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <Plus className="h-4 w-4 text-green-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className={`font-semibold ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {formatPrice(transaction.amount)}
                    </div>
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {transaction.status === 'completed' ? 'موفق' :
                       transaction.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              تراکنشی یافت نشد
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
