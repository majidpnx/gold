// ZarinPal Payment Gateway Integration - Complete Implementation

export interface ZarinPalPaymentRequest {
  amount: number; // Amount in Rial (not Toman)
  description: string;
  callback_url: string;
  mobile?: string;
  email?: string;
}

export interface ZarinPalPaymentResponse {
  Status: number;
  Authority: string;
  message?: string;
}

export interface ZarinPalVerificationRequest {
  amount: number; // Amount in Rial (same as payment request)
  authority: string;
}

export interface ZarinPalVerificationResponse {
  Status: number;
  RefID: string;
  message?: string;
}

class ZarinPalService {
  private merchantId: string;
  private sandbox: boolean;
  private baseUrl: string;

  constructor() {
    // Read merchant ID from environment variable
    this.merchantId ='8f720bb2-4dfd-4c78-8d5c-b8cd35a9ad59';
    this.sandbox = process.env.NODE_ENV === 'development';
    this.baseUrl = this.sandbox 
      ? 'https://sandbox.zarinpal.com/pg/v4/payment'
      : 'https://payment.zarinpal.com/pg/v4/payment';
    
    console.log('ZarinPal initialized:', {
      merchantId: this.merchantId ? 'Set' : 'Not Set',
      sandbox: this.sandbox,
      baseUrl: this.baseUrl
    });
  }

  async createPaymentRequest(data: ZarinPalPaymentRequest): Promise<ZarinPalPaymentResponse> {
    try {
      const requestData = {
        merchant_id: this.merchantId,
        amount: data.amount, // Amount in Rial
        description: data.description,
        callback_url: data.callback_url,
        metadata: {
          mobile: data.mobile || '',
          email: data.email || '',
        }
      };

      console.log('ZarinPal Payment Request:', requestData);
      
      const response = await fetch(`${this.baseUrl}/request.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('ZarinPal Response:', result);

      // API v4 response format: {data: {code, authority}, errors: []}
      if (result.data && result.data.code === 100) {
        return {
          Status: result.data.code,
          Authority: result.data.authority,
        };
      } else {
        const errorCode = result.data?.code || (result.errors?.length > 0 ? -1 : -1);
        const errorMessage = result.errors?.length > 0 ? result.errors[0].message : this.getErrorMessage(errorCode);
        return {
          Status: errorCode,
          Authority: '',
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error('ZarinPal request error:', error);
      return {
        Status: -1,
        Authority: '',
        message: 'خطا در اتصال به درگاه پرداخت',
      };
    }
  }

  async verifyPayment(data: ZarinPalVerificationRequest): Promise<ZarinPalVerificationResponse> {
    try {
      const requestData = {
        merchant_id: this.merchantId,
        amount: data.amount, // Same amount as payment request (in Rial)
        authority: data.authority,
      };

      console.log('ZarinPal Verification Request:', requestData);

      const response = await fetch(`${this.baseUrl}/verify.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('ZarinPal Verification Response:', result);

      // API v4 response format: {data: {code, ref_id}, errors: []}
      if (result.data && (result.data.code === 100 || result.data.code === 101)) {
        return {
          Status: result.data.code,
          RefID: result.data.ref_id,
        };
      } else {
        const errorCode = result.data?.code || (result.errors?.length > 0 ? -1 : -1);
        const errorMessage = result.errors?.length > 0 ? result.errors[0].message : this.getErrorMessage(errorCode);
        return {
          Status: errorCode,
          RefID: '',
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error('ZarinPal verification error:', error);
      return {
        Status: -1,
        RefID: '',
        message: 'خطا در تایید پرداخت',
      };
    }
  }

  getPaymentUrl(authority: string): string {
    const gateway = this.sandbox 
      ? 'https://sandbox.zarinpal.com/pg/StartPay/'
      : 'https://payment.zarinpal.com/pg/StartPay/';
    return `${gateway}${authority}`;
  }

  private getErrorMessage(status: number): string {
    const errorMessages: { [key: number]: string } = {
      '-1': 'اطلاعات ارسال شده ناقص است',
      '-2': 'IP و یا مرچنت کد پذیرنده صحیح نیست',
      '-3': 'با توجه به محدودیت های شاپینگ امکان پرداخت با رقم درخواست شده میسر نمی باشد',
      '-4': 'سطح تایید پذیرنده پایین تر از سطح نقره ای است',
      '-11': 'درخواست مورد نظر یافت نشد',
      '-12': 'امکان ویرایش درخواست میسر نمی باشد',
      '-21': 'هیچ نوع عملیات مالی برای این تراکنش یافت نشد',
      '-22': 'تراکنش ناموفق می باشد',
      '-33': 'رقم تراکنش با رقم پرداخت شده مطابقت ندارد',
      '-34': 'سقف تقسیم تراکنش از لحاظ تعداد یا رقم عبور نموده است',
      '-40': 'اجازه دسترسی به متد مربوطه وجود ندارد',
      '-41': 'اطلاعات ارسال شده مربوط به AdditionalData غیر معتبر می باشد',
      '-42': 'مدت زمان معتبر طول عمر شناسه پرداخت باید بین 30 دقیقه تا 45 روز می باشد',
      '-54': 'درخواست مورد نظر آرشیو شده است',
      '100': 'عملیات با موفقیت انجام گردیده است',
      '101': 'عملیات پرداخت قبلا با موفقیت انجام شده است',
    };

    return errorMessages[status] || `خطای نامشخص (کد: ${status})`;
  }
}

export const zarinpalService = new ZarinPalService();