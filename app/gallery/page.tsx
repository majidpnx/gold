"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Filter, Grid3X3, List, Star, Sparkles } from 'lucide-react';

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedTag, selectedType, currentPage],
    queryFn: () => fetcher(`/api/products?search=${searchTerm}&tag=${selectedTag}&type=${selectedType}&page=${currentPage}&limit=${itemsPerPage}`),
  });
  
  const products = productsData?.products || [];
  const pagination = productsData?.pagination || { page: 1, total: 0, pages: 1 };
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag === 'all' ? '' : tag);
    setCurrentPage(1);
  };
  
  const handleTypeChange = (type: string) => {
    setSelectedType(type === 'all' ? '' : type);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('all');
    setSelectedType('all');
    setCurrentPage(1);
  };
  
  // Enhanced tags and types for better Persian experience
  const availableTags = ['طلا', 'جواهر', 'شمش', 'دستبند', 'گردنبند', 'انگشتر', 'آویز', 'ساعت', 'سکه', 'مشخص'];
  const availableTypes = [
    { value: 'jewelry', label: 'جواهرات', icon: Sparkles },
    { value: 'bar', label: 'شمش طلا', icon: Package }
  ];
  
  const hasActiveFilters = searchTerm || (selectedTag !== 'all') || (selectedType !== 'all');
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Package className="h-6 w-6 text-yellow-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-700">گالری جواهرات و طلا</h1>
            <p className="text-gray-600">مجموعه‌ای از زیباترین و با کیفیت‌ترین محصولات طلا و جواهر</p>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-700">{products.length}</div>
                <div className="text-sm text-yellow-600">محصول موجود</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{pagination.total}</div>
                <div className="text-sm text-green-600">کل محصولات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{pagination.pages}</div>
                <div className="text-sm text-blue-600">صفحات</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Filters */}
      <Card className="mb-8 border-2 border-yellow-100">
        <CardHeader className="bg-gradient-to-l from-yellow-50 to-white">
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Filter className="h-5 w-5" />
            فیلترها و جستجو
          </CardTitle>
          <CardDescription>جستجو و فیلتر محصولات بر اساس نیاز شما</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="جستجو در محصولات..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedTag} onValueChange={handleTagChange}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب برچسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه برچسب‌ها</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="نوع محصول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Filter className="h-4 w-4" />
                فیلترهای فعال:
                {searchTerm && <span className="bg-blue-100 px-2 py-1 rounded text-xs">"{searchTerm}"</span>}
                {selectedTag && <span className="bg-blue-100 px-2 py-1 rounded text-xs">{selectedTag}</span>}
                {selectedType && <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                  {availableTypes.find(t => t.value === selectedType)?.label}
                </span>}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters} className="text-blue-600 border-blue-300">
                پاک کردن فیلترها
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Products Display */}
      {isLoading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`bg-gray-200 rounded animate-pulse ${
              viewMode === 'grid' ? 'h-80' : 'h-32'
            }`}></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
          
          {/* Enhanced Pagination */}
          {pagination.pages > 1 && (
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    نمایش {((pagination.page - 1) * itemsPerPage) + 1} تا {Math.min(pagination.page * itemsPerPage, pagination.total)} از {pagination.total} محصول
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      قبلی
                    </Button>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={pagination.page === pageNum ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                    >
                      بعدی
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">محصولی یافت نشد</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'با فیلترهای انتخاب شده محصولی یافت نشد. لطفاً فیلترها را تغییر دهید.'
                : 'در حال حاضر محصولی در گالری موجود نیست.'
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                پاک کردن فیلترها
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
