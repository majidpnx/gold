'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    weightGrams: number;
    karat: number;
    category: string;
    tags: string[];
    images: string[];
    inStock: boolean;
    type: string;
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price);
}

function formatWeight(weight: number): string {
  return `${weight} گرم`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to a placeholder image if the main image fails to load
    e.currentTarget.src = 'https://images.unsplash.com/photo-1610375461369-d613b56394da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock) {
      alert('این محصول موجود نیست');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Create cart item
      const cartItem = {
        productId: product._id || 'sample',
        name: product.name,
        price: product.price,
        weightGrams: product.weightGrams,
        karat: product.karat,
        image: product.images[0] || '',
        quantity: 1
      };

      console.log('Adding item to cart:', cartItem);

      // Get existing cart
      let existingCart = [];
      const cartData = localStorage.getItem('cart');
      console.log('Existing cart data:', cartData);
      
      if (cartData) {
        try {
          existingCart = JSON.parse(cartData);
          console.log('Parsed existing cart:', existingCart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          existingCart = [];
        }
      }
      
      // Check if product already exists
      const existingItemIndex = existingCart.findIndex((item: any) => item.productId === cartItem.productId);
      
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += 1;
        console.log('Updated existing item quantity');
      } else {
        existingCart.push(cartItem);
        console.log('Added new item to cart');
      }

      console.log('Final cart:', existingCart);

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      console.log('Cart saved to localStorage');
      
      // Verify it was saved
      const savedData = localStorage.getItem('cart');
      console.log('Verified saved data:', savedData);
      
      // Dispatch custom event to update cart badge
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      alert(`${product.name} به سبد خرید اضافه شد! (${existingCart.length} محصول)`);
      
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص';
      alert('خطا در افزودن به سبد خرید: ' + errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
            
            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  ›
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="text-center text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-2" />
              <p>تصویر موجود نیست</p>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Stock Badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={product.inStock ? 'default' : 'destructive'}
            className="text-xs"
          >
            {product.inStock ? 'موجود' : 'ناموجود'}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="text-xs">
            {product.category === 'jewelry' ? 'جواهرات' :
             product.category === 'watches' ? 'ساعت' :
             product.category === 'coins' ? 'سکه' :
             product.category === 'bars' ? 'شمش' :
             product.category === 'sets' ? 'ست' : product.category}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Weight */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-lg font-bold text-yellow-600">
              {formatPrice(product.price)} تومان
            </div>
            <div className="text-xs text-gray-500">
              {formatWeight(product.weightGrams)} • {product.karat} عیار
            </div>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/product/${product._id || 'sample'}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 ml-1" />
              مشاهده
            </Button>
          </Link>
          
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            disabled={!product.inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1" />
            ) : (
              <ShoppingCart className="w-4 h-4 ml-1" />
            )}
            {product.inStock ? (isAddingToCart ? 'در حال افزودن...' : 'افزودن') : 'ناموجود'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
