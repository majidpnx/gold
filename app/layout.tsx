import './globals.css';
import { Vazirmatn } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const vazirmatn = Vazirmatn({ 
  subsets: ['arabic'], 
  weight: ['400','700'], 
  variable: '--font-vazirmatn',
  display: 'swap'
});

export const metadata = {
  title: 'طلای آنلاین - پلتفرم خرید و فروش طلا و جواهر',
  description: 'پلتفرم امن و سریع برای معامله طلا، جواهر و آبشده با قیمت لحظه‌ای',
  keywords: 'طلا، جواهر، آبشده، خرید طلا، فروش طلا',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={`${vazirmatn.className} font-vazirmatn antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
          </div>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
