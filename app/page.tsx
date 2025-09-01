import PriceTicker from '@/components/PriceTicker';
import GoldTypesTicker from '@/components/GoldTypesTicker';
import HeroSlider from '@/components/HeroSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Coins, BarChart3, Gem, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Hero Section with Slider */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <HeroSlider />
          </div>

          {/* Main Gold Price Display */}
          <div className="max-w-4xl mx-auto mb-16">
            <PriceTicker />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">بروزرسانی زنده</h3>
              <p className="text-gray-600">قیمت‌ها هر 5 ثانیه به‌روزرسانی می‌شوند</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">منبع معتبر</h3>
              <p className="text-gray-600">داده‌های دقیق از منابع معتبر جهانی</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">قیمت‌های کامل</h3>
              <p className="text-gray-600">همه انواع طلا، سکه و جواهرات</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gold Types Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              قیمت انواع طلا
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              قیمت‌های دقیق برای همه انواع طلا، سکه‌ها، شمش‌ها و جواهرات
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <GoldTypesTicker />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدمات ما
            </h2>
            <p className="text-lg text-gray-600">
              امکانات کامل برای معاملات طلا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/gallery">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">گالری طلا</h3>
                  <p className="text-gray-600 text-sm mb-4">مشاهده محصولات طلا</p>
                  <ArrowRight className="h-4 w-4 text-yellow-600 mx-auto group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/trading">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">معاملات طلا</h3>
                  <p className="text-gray-600 text-sm mb-4">خرید و فروش طلا</p>
                  <ArrowRight className="h-4 w-4 text-green-600 mx-auto group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/wallet">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Coins className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">کیف پول</h3>
                  <p className="text-gray-600 text-sm mb-4">مدیریت موجودی</p>
                  <ArrowRight className="h-4 w-4 text-blue-600 mx-auto group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Gem className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">داشبورد</h3>
                  <p className="text-gray-600 text-sm mb-4">مدیریت حساب</p>
                  <ArrowRight className="h-4 w-4 text-purple-600 mx-auto group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            شروع کنید
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            همین حالا ثبت‌نام کنید و از خدمات کامل معاملات طلا استفاده کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                ورود
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-yellow-600">
                مشاهده گالری
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
