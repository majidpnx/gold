'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, Coins, Gem, Star } from 'lucide-react';
import Link from 'next/link';


const slides = [
  {
    id: 1,
    title: 'قیمت زنده طلا',
    subtitle: 'به‌روزترین قیمت‌های طلا در ایران',
    description: 'قیمت‌های آنلاین و دقیق با بروزرسانی خودکار ',
    image: 'https://images.unsplash.com/photo-1610375461369-d613b56394da?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: TrendingUp,
    color: 'from-yellow-400 to-orange-500',
    link: '/gallery',
    buttonText: 'مشاهده قیمت‌ها'
  },
  {
    id: 2,
    title: 'گالری طلای زینتی',
    subtitle: 'مجموعه‌ای از زیباترین طلاها',
    description: 'انواع طلای زینتی، سکه و جواهرات با کیفیت عالی',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Gem,
    color: 'from-purple-400 to-pink-500',
    link: '/gallery',
    buttonText: 'مشاهده گالری'
  },
  {
    id: 3,
    title: 'معاملات آنلاین',
    subtitle: 'خرید و فروش امن طلا',
    description: 'معاملات سریع و امن با پشتیبانی زرین‌پال',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Coins,
    color: 'from-green-400 to-blue-500',
    link: '/trading',
    buttonText: 'شروع معامله'
  },
  {
    id: 4,
    title: 'کیفیت تضمینی',
    subtitle: 'طلا با عیار و وزن دقیق',
    description: 'تمام محصولات با گواهی کیفیت و اصالت ارائه می‌شود',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Star,
    color: 'from-red-400 to-yellow-500',
    link: '/gallery',
    buttonText: 'مشاهده محصولات'
  },
  {
    id: 5,
    title: 'سکه‌های طلا',
    subtitle: 'سکه‌های معتبر و با ارزش',
    description: 'سکه‌های بهار آزادی و سایر سکه‌های طلای معتبر',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Star,
    color: 'from-amber-400 to-yellow-500',
    link: '/gallery',
    buttonText: 'مشاهده سکه‌ها'
  },
  {
    id: 6,
    title: 'ساعت‌های لوکس',
    subtitle: 'ساعت‌های طلای با کیفیت',
    description: 'ساعت‌های لوکس طلای 18 و 21 عیار با کیفیت سوئیسی',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Star,
    color: 'from-blue-400 to-purple-500',
    link: '/gallery',
    buttonText: 'مشاهده ساعت‌ها'
  },
  {
    id: 7,
    title: 'جواهرات طلا',
    subtitle: 'انگشتر، گردنبند و دستبند',
    description: 'مجموعه‌ای از زیباترین جواهرات طلای 18 و 21 عیار',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Gem,
    color: 'from-pink-400 to-rose-500',
    link: '/gallery',
    buttonText: 'مشاهده جواهرات'
  },
  {
    id: 8,
    title: 'طلای خام',
    subtitle: 'طلا و نقره خام',
    description: 'طلا و نقره خام با عیار و وزن دقیق برای سرمایه‌گذاری',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&auto=format&q=80',
    icon: Coins,
    color: 'from-yellow-500 to-amber-600',
    link: '/gallery',
    buttonText: 'مشاهده طلای خام'
  }
];

// Simple background image component
function SlideImage({ src, alt, className, fallbackColor }: { src: string; alt: string; className: string; fallbackColor: string }) {
  return (
    <div 
      className={`${className} bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Fallback gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackColor} opacity-20`} />
    </div>
  );
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <SlideImage 
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0"
            fallbackColor={slide.color}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Fallback background color */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-20`} />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${slide.color} flex items-center justify-center`}>
                    <slide.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-yellow-400 text-lg font-semibold">{slide.subtitle}</h3>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  {slide.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={slide.link}>
                    <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                      {slide.buttonText}
                    </Button>
                  </Link>
                  <Link href="/trading">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                      معاملات آنلاین
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-yellow-400 w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'}`} />
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
