'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Wallet,
  Plus,
  Minus,
  History,
  CreditCard,
  Banknote
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'refund';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export default function WalletPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchTransactions();
    } else {
      router.push('/auth/signin');
    }
  }, [router]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would fetch from API
      // For demo, we'll use localStorage
      const savedTransactions = localStorage.getItem('userTransactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    try {
      setIsProcessing(true);
      
      // Simulate deposit process
      const newTransaction: Transaction = {
        _id: Date.now().toString(),
        userId: user._id,
        type: 'deposit',
        amount: parseFloat(depositAmount),
        description: 'واریز به کیف پول',
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      
      // Update user balance
      const updatedUser = {
        ...user,
        walletBalance: user.walletBalance + parseFloat(depositAmount)
      };
      
      // Update transactions
      const updatedTransactions = [newTransaction, ...transactions];
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userTransactions', JSON.stringify(updatedTransactions));
      
      setUser(updatedUser);
      setTransactions(updatedTransactions);
      setDepositAmount('');
      setShowDepositForm(false);
      
      alert('واریز با موفقیت انجام شد');
      
    } catch (error) {
      console.error('Deposit error:', error);
      alert('خطا در واریز');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    if (parseFloat(withdrawAmount) > user.walletBalance) {
      alert('موجودی کافی نیست');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Simulate withdraw process
      const newTransaction: Transaction = {
        _id: Date.now().toString(),
        userId: user._id,
        type: 'withdraw',
        amount: parseFloat(withdrawAmount),
        description: 'برداشت از کیف پول',
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      
      // Update user balance
      const updatedUser = {
        ...user,
        walletBalance: user.walletBalance - parseFloat(withdrawAmount)
      };
      
      // Update transactions
      const updatedTransactions = [newTransaction, ...transactions];
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userTransactions', JSON.stringify(updatedTransactions));
      
      setUser(updatedUser);
      setTransactions(updatedTransactions);
      setWithdrawAmount('');
      setShowWithdrawForm(false);
      
      alert('برداشت با موفقیت انجام شد');
      
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('خطا در برداشت');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'withdraw':
        return <Minus className="h-4 w-4 text-red-600" />;
      case 'purchase':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <Banknote className="h-4 w-4 text-yellow-600" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getTransactionBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">تکمیل شده</Badge>;
      case 'pending':
        return <Badge variant="secondary">در انتظار</Badge>;
      case 'failed':
        return <Badge variant="destructive">ناموفق</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 ml-2" />
              بازگشت
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">کیف پول</h1>
            <p className="text-gray-600 mt-2">
              مدیریت موجودی و تراکنش‌ها
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              موجودی فعلی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-4">
                {user.walletBalance.toLocaleString('fa-IR')} تومان
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowDepositForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  واریز
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowWithdrawForm(true)}
                  className="flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                  برداشت
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Form */}
        {showDepositForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>واریز به کیف پول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="depositAmount">مبلغ واریز (تومان)</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    placeholder="مبلغ را وارد کنید"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDeposit}
                    disabled={isProcessing || !depositAmount}
                  >
                    {isProcessing ? 'در حال پردازش...' : 'واریز'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowDepositForm(false);
                      setDepositAmount('');
                    }}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Form */}
        {showWithdrawForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>برداشت از کیف پول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdrawAmount">مبلغ برداشت (تومان)</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="مبلغ را وارد کنید"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={user.walletBalance}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    حداکثر: {user.walletBalance.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleWithdraw}
                    disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) > user.walletBalance}
                  >
                    {isProcessing ? 'در حال پردازش...' : 'برداشت'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowWithdrawForm(false);
                      setWithdrawAmount('');
                    }}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              تاریخچه تراکنش‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>هنوز تراکنشی ثبت نشده است</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${
                        transaction.type === 'deposit' || transaction.type === 'refund' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                        {transaction.amount.toLocaleString('fa-IR')} تومان
                      </p>
                      {getTransactionBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}