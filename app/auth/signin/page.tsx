'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Phone, UserPlus } from 'lucide-react';
import Link from 'next/link';

const signinSchema = z.object({
  phone: z.string()
    .min(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .max(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تلفن باید با ۰۹ شروع شود'),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });
  
  const sendOTP = async (data: SigninForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPhone(data.phone);
        setStep('otp');
      } else {
        setError(result.message || 'خطا در ارسال کد تایید');
      }
      
    } catch (error) {
      setError('خطا در اتصال به سرور');
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOTP = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store user data in localStorage for demo
        localStorage.setItem('user', JSON.stringify(result.data.user));
        router.push('/dashboard');
      } else {
        setError(result.message || 'کد تایید نامعتبر است');
      }
      
    } catch (error) {
      setError('خطا در اتصال به سرور');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 'phone' ? 'ورود به حساب کاربری' : 'تایید شماره تلفن'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 'phone' 
              ? 'شماره تلفن خود را وارد کنید' 
              : `کد تایید ارسال شده به ${phone} را وارد کنید`
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {step === 'phone' ? (
            <form onSubmit={handleSubmit(sendOTP)} className="space-y-4">
              <div>
                <Label htmlFor="phone">شماره تلفن</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09123456789"
                    className="pr-10"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  'ارسال کد تایید'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">کد تایید</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              
              <Button 
                onClick={verifyOTP} 
                className="w-full" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال تایید...
                  </>
                ) : (
                  'تایید و ورود'
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('phone')}
              >
                تغییر شماره تلفن
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              حساب کاربری ندارید؟{' '}
              <Link href="/auth/signup" className="text-yellow-600 hover:text-yellow-700 font-medium">
                ثبت نام کنید
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
