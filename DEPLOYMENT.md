# راهنمای Deployment در Vercel

## مشکل "Hello World" در Vercel

اگر در Vercel فقط "Hello World" نمایش داده می‌شود، احتمالاً یکی از مشکلات زیر است:

## 1. Environment Variables

در Vercel Dashboard، به بخش Environment Variables بروید و این متغیرها را اضافه کنید:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-trading
ZARINPAL_MERCHANT_ID=your-merchant-id-here
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## 2. Build Settings

در Vercel، Build Settings را بررسی کنید:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 3. MongoDB Atlas

برای production، از MongoDB Atlas استفاده کنید:

1. به [MongoDB Atlas](https://cloud.mongodb.com) بروید
2. یک cluster ایجاد کنید
3. Database User ایجاد کنید
4. Network Access تنظیم کنید (0.0.0.0/0)
5. Connection String را کپی کنید

## 4. بررسی Build Logs

در Vercel Dashboard:
1. به بخش "Functions" بروید
2. Build logs را بررسی کنید
3. خطاهای احتمالی را پیدا کنید

## 5. تست محلی

قبل از deploy، محلی تست کنید:

```bash
npm run build
npm run start
```

## 6. فایل‌های مهم

اطمینان حاصل کنید که این فایل‌ها وجود دارند:
- `next.config.js` ✅
- `vercel.json` ✅
- `package.json` ✅
- `app/layout.tsx` ✅
- `app/page.tsx` ✅

## 7. عیب‌یابی

اگر هنوز مشکل دارید:

1. **Console Logs**: در Vercel Functions، console logs را بررسی کنید
2. **Network Tab**: در browser، network requests را چک کنید
3. **Environment**: متغیرهای محیطی را دوباره بررسی کنید

## 8. Redeploy

پس از تغییرات:
1. در Vercel Dashboard، روی "Redeploy" کلیک کنید
2. یا یک commit جدید push کنید

## نکات مهم

- **Turbopack**: در production استفاده نکنید
- **MongoDB**: حتماً از Atlas استفاده کنید
- **Environment Variables**: همه متغیرها را در Vercel تنظیم کنید
- **Build Time**: اولین build ممکن است 5-10 دقیقه طول بکشد
