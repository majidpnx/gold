'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface VerificationResult {
  success: boolean;
  message: string;
  data?: {
    transactionId: string;
    refId: string;
    amount: number;
    status: string;
  };
}

export default function PaymentVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const authority = searchParams.get('Authority');
      const status = searchParams.get('Status');

      if (!authority) {
        setVerificationResult({
          success: false,
          message: 'شناسه پرداخت نامعتبر است',
        });
        setIsVerifying(false);
        return;
      }

      if (status === 'NOK') {
        setVerificationResult({
          success: false,
          message: 'پرداخت توسط کاربر لغو شده است',
        });
        setIsVerifying(false);
        return;
      }

      try {
        // For testing, simulate verification
        if (authority.startsWith('test-authority-')) {
          // Simulate successful verification
          setVerificationResult({
            success: true,
            message: 'پرداخت با موفقیت انجام شد (تست)',
            data: {
              transactionId: 'test-transaction',
              refId: 'test-ref-id',
              amount: 1000000,
              status: 'completed'
            },
          });
        } else {
          const response = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              authority: authority,
            }),
          });

          const result = await response.json();

          if (result.success) {
            setVerificationResult({
              success: true,
              message: 'پرداخت با موفقیت انجام شد',
              data: result.data,
            });
          } else {
            setVerificationResult({
              success: false,
              message: result.message || 'خطا در تایید پرداخت',
            });
          }
        }
      } catch (error) {
        setVerificationResult({
          success: false,
          message: 'خطا در اتصال به سرور',
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              در حال تایید پرداخت
            </h2>
            <p className="text-gray-600 text-center">
              لطفاً صبر کنید تا پرداخت شما تایید شود...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect based on verification result
  useEffect(() => {
    if (verificationResult) {
      if (verificationResult.success) {
        // Clear cart and redirect to success page
        localStorage.removeItem('cart');
        window.location.href = '/orders/success';
      } else {
        // Redirect to failed page
        window.location.href = '/payment/failed';
      }
    }
  }, [verificationResult]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            در حال انتقال...
          </h2>
          <p className="text-gray-600 text-center">
            لطفاً صبر کنید...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
