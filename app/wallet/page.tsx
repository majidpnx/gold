"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Wallet, Plus, Minus, History } from 'lucide-react';

const depositSchema = z.object({
  amount: z.number().positive('مبلغ باید مثبت باشد'),
});

const withdrawSchema = z.object({
  amount: z.number().positive('مبلغ باید مثبت باشد'),
});

type DepositForm = z.infer<typeof depositSchema>;
type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function WalletPage() {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: walletData, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetcher('/api/wallet'),
  });
  
  const depositMutation = useMutation({
    mutationFn: (data: DepositForm) => fetcher('/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('مبلغ با موفقیت به کیف پول اضافه شد');
      setIsDepositOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در واریز مبلغ');
    },
  });
  
  const withdrawMutation = useMutation({
    mutationFn: (data: WithdrawForm) => fetcher('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('مبلغ با موفقیت از کیف پول برداشت شد');
      setIsWithdrawOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در برداشت مبلغ');
    },
  });
  
  const balance = walletData?.balance || 0;
  const transactions = walletData?.transactions || [];
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">کیف پول</h1>
        <p className="text-gray-600">مدیریت موجودی و تراکنش‌های مالی</p>
      </div>
      
      {/* Balance Card */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-yellow-700">موجودی فعلی</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-5xl font-bold text-yellow-700 mb-4">
            {formatToman(balance)}
          </div>
          <div className="flex gap-4 justify-center">
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="ml-2 h-4 w-4" />
                  واریز
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>واریز به کیف پول</DialogTitle>
                  <DialogDescription>
                    مبلغ مورد نظر برای واریز را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                <DepositForm onSubmit={depositMutation.mutate} isLoading={depositMutation.isPending} />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600">
                  <Minus className="ml-2 h-4 w-4" />
                  برداشت
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>برداشت از کیف پول</DialogTitle>
                  <DialogDescription>
                    مبلغ مورد نظر برای برداشت را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                <WithdrawForm onSubmit={withdrawMutation.mutate} isLoading={withdrawMutation.isPending} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            تاریخچه تراکنش‌ها
          </CardTitle>
          <CardDescription>آخرین تراکنش‌های مالی شما</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((transaction: any) => (
                <div key={transaction._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-500' :
                      transaction.type === 'withdraw' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'deposit' ? 'واریز' :
                         transaction.type === 'withdraw' ? 'برداشت' :
                         'تنظیم'}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatToman(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.ref}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">هنوز تراکنشی انجام نداده‌اید</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function DepositForm({ onSubmit, isLoading }: { onSubmit: (data: DepositForm) => void, isLoading: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
  });
  
  const handleFormSubmit = (data: DepositForm) => {
    onSubmit(data);
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deposit-amount">مبلغ (تومان)</Label>
        <Input
          id="deposit-amount"
          type="number"
          placeholder="1000000"
          {...register('amount', { valueAsNumber: true })}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'در حال واریز...' : 'واریز'}
      </Button>
    </form>
  );
}

function WithdrawForm({ onSubmit, isLoading }: { onSubmit: (data: WithdrawForm) => void, isLoading: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
  });
  
  const handleFormSubmit = (data: WithdrawForm) => {
    onSubmit(data);
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="withdraw-amount">مبلغ (تومان)</Label>
        <Input
          id="withdraw-amount"
          type="number"
          placeholder="1000000"
          {...register('amount', { valueAsNumber: true })}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'در حال برداشت...' : 'برداشت'}
      </Button>
    </form>
  );
}
