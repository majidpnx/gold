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
import { Loader2, Phone, User, Mail } from 'lucide-react';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  phone: z.string()
    .min(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .max(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تلفن باید با ۰۹ شروع شود'),
  email: z.string().email('ایمیل نامعتبر است').optional().or(z.literal('')),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState<SignupForm | null>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });
  
  const sendOTP = async (data: SignupForm) => {
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
        setFormData(data);
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
  
  const verifyOTPAndSignup = async () => {
    if (!formData) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          otp 
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store user data in localStorage for demo
        localStorage.setItem('user', JSON.stringify(result.data.user));
        router.push('/dashboard');
      } else {
        setError(result.message || 'خطا در ثبت نام');
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
            {step === 'form' ? 'ایجاد حساب کاربری' : 'تایید شماره تلفن'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 'form' 
              ? 'اطلاعات خود را وارد کنید' 
              : `کد تایید ارسال شده به ${formData?.phone} را وارد کنید`
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {step === 'form' ? (
            <form onSubmit={handleSubmit(sendOTP)} className="space-y-4">
              <div>
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    className="pr-10"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              
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
              
              <div>
                <Label htmlFor="email">ایمیل (اختیاری)</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="pr-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
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
                onClick={verifyOTPAndSignup} 
                className="w-full" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ثبت نام...
                  </>
                ) : (
                  'تایید و ثبت نام'
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('form')}
              >
                بازگشت به فرم
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <Link href="/auth/signin" className="text-yellow-600 hover:text-yellow-700 font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
