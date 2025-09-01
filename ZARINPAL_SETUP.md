# راه‌اندازی درگاه پرداخت زرین‌پال

## مراحل راه‌اندازی:

### 1. ثبت‌نام در زرین‌پال
- به سایت [زرین‌پال](https://www.zarinpal.com) بروید
- ثبت‌نام کنید و حساب کاربری ایجاد کنید
- اطلاعات هویتی خود را تکمیل کنید

### 2. دریافت مرچنت کد
- در پنل کاربری زرین‌پال، بخش "درگاه پرداخت" را انتخاب کنید
- مرچنت کد خود را کپی کنید

### 3. تنظیم متغیرهای محیطی
فایل `.env.local` را در ریشه پروژه ایجاد کنید:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gold-trading

# ZarinPal Payment Gateway
ZARINPAL_MERCHANT_ID=YOUR_MERCHANT_ID_HERE

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3002
NODE_ENV=development
```

### 4. فعال‌سازی زرین‌پال واقعی
بعد از تنظیم مرچنت کد، در فایل `app/api/payment/order/route.ts`:

1. کامنت‌های تست را حذف کنید
2. کد زرین‌پال واقعی را فعال کنید

```typescript
// حذف این بخش:
/*
const paymentRequest = await zarinpalService.createPaymentRequest({
  // ...
});
*/

// و فعال کردن کد واقعی:
const paymentRequest = await zarinpalService.createPaymentRequest({
  amount: amount,
  description: description || `سفارش طلا - ${userInfo.firstName} ${userInfo.lastName}`,
  callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/verify`,
  mobile: userInfo.phone,
  email: userInfo.email || '',
});
```

### 5. تست در محیط توسعه
- در محیط توسعه، زرین‌پال از sandbox استفاده می‌کند
- می‌توانید با کارت‌های تستی پرداخت کنید
- در محیط production، زرین‌پال واقعی فعال می‌شود

### 6. کارت‌های تستی زرین‌پال
برای تست در محیط sandbox:
- شماره کارت: 5022-2910-0000-0008
- رمز: هر رمزی
- CVV2: هر عددی
- تاریخ انقضا: هر تاریخی در آینده

## نکات مهم:
- حتماً `NEXT_PUBLIC_BASE_URL` را درست تنظیم کنید
- در محیط production، `NODE_ENV=production` قرار دهید
- مرچنت کد را در فایل‌های عمومی قرار ندهید
- از HTTPS در محیط production استفاده کنید
