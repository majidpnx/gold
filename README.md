# پلتفرم معاملات طلا

پلتفرم کامل خرید و فروش آنلاین طلا با قیمت‌های زنده و درگاه پرداخت زرین‌پال

## ویژگی‌ها

### 🏆 ویژگی‌های اصلی
- **قیمت‌های زنده طلا**: بروزرسانی خودکار هر 5 ثانیه از priceto.day
- **اسلایدر جذاب**: نمایش محصولات و خدمات در هیرو سکشن
- **گالری طلای زینتی**: انواع دستبند، گردنبند، انگشتر و جواهرات
- **درگاه پرداخت زرین‌پال**: پرداخت امن و سریع
- **کیف پول هوشمند**: چک کردن موجودی و شارژ خودکار
- **معاملات آنلاین**: خرید و فروش طلا با قیمت‌های واقعی

### 💰 سیستم پرداخت
- **زرین‌پال**: درگاه پرداخت معتبر ایرانی
- **شارژ کیف پول**: مبالغ از 10,000 تا 100,000,000 تومان
- **تایید خودکار**: پردازش خودکار تراکنش‌ها
- **تاریخچه تراکنش**: نمایش کامل تراکنش‌ها

### 🎨 طراحی و UX
- **طراحی مدرن**: Tailwind CSS و shadcn/ui
- **رابط کاربری فارسی**: RTL و فونت Vazirmatn
- **انیمیشن‌های جذاب**: Hover effects و transitions
- **Responsive**: سازگار با همه دستگاه‌ها

## تکنولوژی‌ها

### Frontend
- **Next.js 15**: App Router و Server Components
- **TypeScript**: Type safety کامل
- **Tailwind CSS**: Styling مدرن
- **shadcn/ui**: کامپوننت‌های آماده
- **React Query**: مدیریت state و caching
- **Lucide React**: آیکون‌های زیبا

### Backend
- **MongoDB**: دیتابیس NoSQL
- **Mongoose**: ODM برای MongoDB
- **ZarinPal API**: درگاه پرداخت
- **priceto.day API**: قیمت‌های زنده طلا

## نصب و راه‌اندازی

### 1. کلون کردن پروژه
```bash
git clone <repository-url>
cd gold-trading
```

### 2. نصب وابستگی‌ها
```bash
npm install
```

### 3. تنظیم متغیرهای محیطی
فایل `.env.local` را ایجاد کنید:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gold-trading

# ZarinPal Payment Gateway
ZARINPAL_MERCHANT_ID=your-zarinpal-merchant-id

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. راه‌اندازی دیتابیس
```bash
# نصب MongoDB (اگر نصب نیست)
# Windows: https://docs.mongodb.com/manual/installation/
# macOS: brew install mongodb-community
# Linux: sudo apt install mongodb

# راه‌اندازی MongoDB
mongod
```

### 5. راه‌اندازی سرور توسعه
```bash
npm run dev
```

## تنظیمات زرین‌پال

### 1. ثبت‌نام در زرین‌پال
- به [سایت زرین‌پال](https://www.zarinpal.com) بروید
- حساب کاربری ایجاد کنید
- درخواست درگاه پرداخت دهید

### 2. دریافت Merchant ID
- پس از تایید درخواست، Merchant ID دریافت می‌کنید
- آن را در فایل `.env.local` قرار دهید

### 3. تنظیم Callback URL
- در پنل زرین‌پال، Callback URL را تنظیم کنید:
  - Development: `http://localhost:3000/payment/verify`
  - Production: `https://yourdomain.com/payment/verify`

## ساختار پروژه

```
gold-trading/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # احراز هویت
│   │   ├── payment/       # پرداخت زرین‌پال
│   │   ├── prices/        # قیمت‌های طلا
│   │   └── products/      # محصولات
│   ├── gallery/           # گالری محصولات
│   ├── trading/           # معاملات
│   ├── wallet/            # کیف پول
│   └── payment/           # تایید پرداخت
├── components/            # کامپوننت‌های React
│   ├── ui/               # کامپوننت‌های پایه
│   ├── HeroSlider.tsx    # اسلایدر هیرو
│   ├── PriceTicker.tsx   # نمایش قیمت
│   └── WalletBalance.tsx # کیف پول
├── lib/                  # کتابخانه‌ها
│   ├── mongodb.ts        # اتصال دیتابیس
│   └── zarinpal.ts       # زرین‌پال
├── models/               # مدل‌های MongoDB
└── public/               # فایل‌های استاتیک
```

## API Endpoints

### قیمت‌های طلا
- `GET /api/prices/gold` - قیمت اصلی طلا
- `GET /api/prices/gold/types` - انواع طلا
- `GET /api/prices/gold/iranian` - قیمت‌های ایرانی

### پرداخت
- `POST /api/payment/create` - ایجاد درخواست پرداخت
- `POST /api/payment/verify` - تایید پرداخت

### محصولات
- `GET /api/products` - لیست محصولات
- `POST /api/products` - ایجاد محصول

### کیف پول
- `GET /api/wallet` - اطلاعات کیف پول
- `POST /api/wallet/deposit` - شارژ کیف پول

## محصولات طلای زینتی

### دسته‌بندی محصولات
- **دستبند**: طلای 18 و 21 عیار
- **گردنبند**: با نگین‌های مختلف
- **انگشتر**: طراحی‌های مدرن
- **گوشواره**: ظریف و شیک
- **ساعت**: لوکس و با کیفیت
- **ست طلا**: کامل و هماهنگ

### ویژگی‌های محصولات
- **عیار دقیق**: 18 و 21 عیار
- **وزن دقیق**: محاسبه شده
- **نگین‌های اصل**: فیروزه، یاقوت، الماس
- **گواهی کیفیت**: تضمین اصالت

## سیستم کیف پول

### ویژگی‌ها
- **موجودی زنده**: نمایش لحظه‌ای
- **شارژ آسان**: دکمه‌های سریع
- **تاریخچه کامل**: همه تراکنش‌ها
- **هشدار موجودی**: اطلاع‌رسانی کمبود

### محدودیت‌ها
- **حداقل شارژ**: 10,000 تومان
- **حداکثر شارژ**: 100,000,000 تومان
- **بروزرسانی**: هر 10 ثانیه

## قیمت‌های زنده

### منابع داده
- **priceto.day**: منبع اصلی
- **gold-api.com**: پشتیبان
- **metals.live**: پشتیبان اضافی

### محاسبات
- **انس جهانی**: قیمت لحظه‌ای
- **نرخ دلار**: از صرافی‌های معتبر
- **پریمیوم ایران**: 8% بالاتر از جهانی
- **نوسانات**: ±0.3% شبیه‌سازی بازار

## توسعه

### اضافه کردن محصول جدید
```typescript
// در app/api/products/route.ts
const newProduct = {
  name: 'نام محصول',
  description: 'توضیحات',
  price: 25000000,
  weightGrams: 8.5,
  karat: 18,
  category: 'jewelry',
  tags: ['دستبند', 'طلای زینتی'],
  images: ['/images/product.jpg'],
  inStock: true,
  type: 'decorative'
};
```

### تغییر تنظیمات زرین‌پال
```typescript
// در lib/zarinpal.ts
class ZarinPalService {
  private merchantId: string = 'your-new-merchant-id';
  private sandbox: boolean = false; // برای production
}
```

## استقرار (Deployment)

### Vercel
```bash
npm run build
vercel --prod
```

### تنظیمات Production
```env
NODE_ENV=production
ZARINPAL_MERCHANT_ID=your-production-merchant-id
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## پشتیبانی

### مشکلات رایج
1. **خطای اتصال دیتابیس**: MongoDB را چک کنید
2. **خطای زرین‌پال**: Merchant ID را بررسی کنید
3. **قیمت‌های نامعتبر**: اتصال اینترنت را چک کنید

### تماس
- **ایمیل**: support@gold-trading.com
- **تلفن**: 021-12345678
- **واتساپ**: 09123456789

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

**نکته**: برای استفاده در محیط production، حتماً تنظیمات امنیتی و SSL را فعال کنید.
