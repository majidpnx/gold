"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatToman } from '@/lib/format';
import { ShoppingCart, User2, LogIn, Menu, X, Package, TrendingUp, Home, User, LogOut } from 'lucide-react';
import CartBadge from './CartBadge';
import { useState, useEffect } from 'react';
import PriceTicker from './PriceTicker';

const navLinks = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/gallery', label: 'گالری', icon: Package },
  { href: '/trading', label: 'معامله آبشده', icon: TrendingUp },
];

export default function Navbar() {
  const { items } = useCart();
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-lg sticky top-0 z-50 border-b border-yellow-100">
      <nav className="container flex items-center justify-between py-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-yellow-700 group-hover:text-yellow-800 transition-colors">
              طلای آنلاین
            </span>
          </Link>
          
          {/* Desktop Price Ticker */}
          <div className="hidden md:block">
            <PriceTicker compact={true} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  pathname === link.href 
                    ? 'text-yellow-700 bg-yellow-50 font-bold' 
                    : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cart" className="relative group">
            <div className="p-2 rounded-lg group-hover:bg-yellow-50 transition-colors">
              <CartBadge />
            </div>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-yellow-50 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.phone || 'کاربر'}
                </span>
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('cart');
                  window.location.href = '/';
                }}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="خروج"
              >
                <LogOut className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors">
              <LogIn className="w-4 h-4" />
              ورود
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container py-4 space-y-4">
            {/* Mobile Price Ticker */}
            <div className="pb-4 border-b border-gray-200">
              <PriceTicker compact={true} />
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'text-yellow-700 bg-yellow-50 font-bold'
                        : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <CartBadge />
                  <span className="text-gray-700">سبد خرید</span>
                </div>
              </Link>

              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {user.name || user.phone || 'کاربر'}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      localStorage.removeItem('cart');
                      setIsMobileMenuOpen(false);
                      window.location.href = '/';
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors w-full text-right"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">خروج</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-3 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  ورود به سیستم
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
