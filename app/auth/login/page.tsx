"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcher';

const loginSchema = z.object({
  phone: z.string().min(10, 'شماره تلفن باید حداقل ۱۰ رقم باشد'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      
      const response = await fetcher('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      toast.success('ورود موفقیت‌آمیز بود');
      router.push('/dashboard');
      
    } catch (error: any) {
      toast.error(error.message || 'خطا در ورود به سیستم');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="container py-8 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-yellow-700">ورود به سیستم</CardTitle>
          <CardDescription>
            برای ورود شماره تلفن خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">شماره تلفن</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              disabled={isLoading}
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
