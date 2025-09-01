'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Scale, 
  Gem, 
  Shield, 
  Truck, 
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Sample product data
const sampleProducts = [
  {
    _id: 'sample-1',
    name: 'دستبند طلای ۱۸ عیار',
    description: 'دستبند زیبای طلای ۱۸ عیار با طراحی مدرن و ظریف. این دستبند با کیفیت عالی و وزن دقیق ۸.۵ گرم ساخته شده است.',
    price: 25000000,
    weightGrams: 8.5,
    karat: 18,
    category: 'jewelry',
    tags: ['دستبند', 'طلای زینتی', '۱۸ عیار'],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative',
    features: [
      'عیار دقیق ۱۸',
      'وزن ۸.۵ گرم',
      'طراحی مدرن',
      'کیفیت عالی',
      'گواهی اصالت'
    ],
    specifications: {
      'نوع محصول': 'دستبند',
      'عیار': '۱۸',
      'وزن': '۸.۵ گرم',
      'جنس': 'طلای خالص',
      'رنگ': 'طلایی',
      'سازنده': 'ایران'
    }
  },
  {
    _id: 'sample-2',
    name: 'گردنبند طلای ۲۱ عیار',
    description: 'گردنبند شیک طلای ۲۱ عیار با نگین فیروزه. این گردنبند با طراحی زیبا و نگین طبیعی فیروزه عرضه می‌شود.',
    price: 35000000,
    weightGrams: 12.3,
    karat: 21,
    category: 'jewelry',
    tags: ['گردنبند', 'طلای زینتی', '۲۱ عیار', 'فیروزه'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative',
    features: [
      'عیار دقیق ۲۱',
      'وزن ۱۲.۳ گرم',
      'نگین فیروزه طبیعی',
      'طراحی شیک',
      'کیفیت عالی'
    ],
    specifications: {
      'نوع محصول': 'گردنبند',
      'عیار': '۲۱',
      'وزن': '۱۲.۳ گرم',
      'نگین': 'فیروزه طبیعی',
      'جنس': 'طلای خالص',
      'رنگ': 'طلایی'
    }
  }
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

function formatWeight(weight: number): string {
  return `${weight} گرم`;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    // Find product by ID
    const foundProduct = sampleProducts.find(p => p._id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // If not found, use first sample product
      setProduct(sampleProducts[0]);
    }
  }, [productId]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1610375461369-d613b56394da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleAddToCart = async () => {
    if (!product?.inStock) {
      toast.error('این محصول موجود نیست');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        weightGrams: product.weightGrams,
        karat: product.karat,
        image: product.images[0] || '',
        quantity: quantity
      };

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: any) => item.productId === cartItem.productId);
      
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success(`${product.name} به سبد خرید اضافه شد`);
    } catch (error) {
      toast.error('خطا در افزودن به سبد خرید');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/gallery" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          بازگشت به گالری
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  
                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <Star className="w-16 h-16 mx-auto mb-4" />
                    <p>تصویر موجود نیست</p>
                  </div>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <Badge 
                  variant={product.inStock ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {product.inStock ? 'موجود' : 'ناموجود'}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex ? 'border-yellow-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {formatPrice(product.price)} تومان
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Scale className="w-4 h-4" />
                  {formatWeight(product.weightGrams)}
                </div>
                <div className="flex items-center gap-1">
                  <Gem className="w-4 h-4" />
                  {product.karat} عیار
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">تعداد:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                disabled={!product.inStock || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                ) : (
                  <ShoppingCart className="w-5 h-5 ml-2" />
                )}
                {product.inStock ? (isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید') : 'ناموجود'}
              </Button>
              
              <Link href="/cart">
                <Button variant="outline" size="lg" className="w-full">
                  مشاهده سبد خرید
                </Button>
              </Link>
            </div>

            {/* Features */}
            {product.features && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    ویژگی‌های محصول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    مشخصات فنی
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">{key}:</span>
                        <span className="text-sm font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">برچسب‌ها:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
