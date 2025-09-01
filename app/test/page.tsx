export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          تست Deployment
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          اگر این صفحه را می‌بینید، Next.js درست کار می‌کند
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">اطلاعات Environment:</h2>
          <div className="text-left space-y-2">
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            <p><strong>MongoDB:</strong> {process.env.MONGODB_URI ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</p>
            <p><strong>ZarinPal:</strong> {process.env.ZARINPAL_MERCHANT_ID ? '✅ تنظیم شده' : '❌ تنظیم نشده'}</p>
            <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || '❌ تنظیم نشده'}</p>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
}