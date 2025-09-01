"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { formatToman, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Package, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Link from 'next/link';

const productSchema = z.object({
  title: z.string().min(1, 'عنوان محصول الزامی است'),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  pricePerGram: z.number().positive('قیمت هر گرم باید مثبت باشد'),
  weightGrams: z.number().positive('وزن باید مثبت باشد'),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
  type: z.enum(['jewelry', 'bar'], { message: 'نوع محصول باید jewelry یا bar باشد' }),
});

type ProductForm = {
  title: string;
  description?: string;
  images?: string[];
  pricePerGram: number;
  weightGrams: number;
  tags?: string[];
  inStock: boolean;
  type: 'jewelry' | 'bar';
};

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const queryClient = useQueryClient();
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetcher('/api/products'),
  });
  
  const createMutation = useMutation({
    mutationFn: (data: ProductForm) => fetcher('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('محصول با موفقیت ایجاد شد');
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در ایجاد محصول');
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: ProductForm }) => fetcher(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('محصول با موفقیت بروزرسانی شد');
      setEditingProduct(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در بروزرسانی محصول');
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetcher(`/api/products/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('محصول با موفقیت حذف شد');
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در حذف محصول');
    },
  });
  
  const products = productsData?.products || [];
  
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || product.type === selectedType;
    return matchesSearch && matchesType;
  });
  
  const handleCreate = (data: ProductForm) => {
    createMutation.mutate(data);
  };
  
  const handleUpdate = (data: ProductForm) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data });
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">مدیریت محصولات</h1>
        <p className="text-gray-600">ایجاد، ویرایش و حذف محصولات</p>
      </div>
      
      {/* Actions and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="ml-2 h-4 w-4" />
              افزودن محصول جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>افزودن محصول جدید</DialogTitle>
              <DialogDescription>
                اطلاعات محصول جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
              initialData={null}
            />
          </DialogContent>
        </Dialog>
        
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="نوع محصول" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="jewelry">جواهر</SelectItem>
              <SelectItem value="bar">شمش</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard
              key={product._id || `product-${index}`}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => handleDelete(product._id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">محصولی یافت نشد</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedType ? 'محصولی با فیلترهای انتخاب شده یافت نشد' : 'هنوز محصولی ایجاد نشده است'}
            </p>
            {!searchTerm && !selectedType && (
              <Button onClick={() => setIsCreateOpen(true)} className="bg-green-500 hover:bg-green-600">
                افزودن اولین محصول
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ویرایش محصول</DialogTitle>
              <DialogDescription>
                اطلاعات محصول را ویرایش کنید
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
              initialData={editingProduct}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}

function ProductCard({ product, onEdit, onDelete }: { product: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">نوع:</span> {product.type === 'jewelry' ? 'جواهر' : 'شمش'}</p>
              <p><span className="font-medium">وزن:</span> {product.weightGrams} گرم</p>
              <p><span className="font-medium">قیمت هر گرم:</span> {formatToman(product.pricePerGram)}</p>
              <p><span className="font-medium">قیمت کل:</span> {formatToman(product.pricePerGram * product.weightGrams)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 border-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'موجود' : 'ناموجود'}
          </span>
          <span className="text-xs text-gray-500 mr-2">
            {formatDate(product.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductForm({ onSubmit, isLoading, initialData }: { 
  onSubmit: (data: ProductForm) => void, 
  isLoading: boolean, 
  initialData: any 
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      images: [],
      pricePerGram: 0,
      weightGrams: 0,
      tags: [],
      inStock: true,
      type: 'jewelry',
    },
  });
  
  const watchedType = watch('type');
  
  const handleFormSubmit = (data: ProductForm) => {
    onSubmit(data);
    if (!initialData) {
      reset();
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">عنوان محصول *</Label>
          <Input
            id="title"
            {...register('title')}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">نوع محصول *</Label>
          <Select value={watchedType} onValueChange={(value) => setValue('type', value as 'jewelry' | 'bar')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jewelry">جواهر</SelectItem>
              <SelectItem value="bar">شمش</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerGram">قیمت هر گرم (تومان) *</Label>
          <Input
            id="pricePerGram"
            type="number"
            step="1000"
            {...register('pricePerGram', { valueAsNumber: true })}
            className={errors.pricePerGram ? 'border-red-500' : ''}
          />
          {errors.pricePerGram && (
            <p className="text-sm text-red-500">{errors.pricePerGram.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weightGrams">وزن (گرم) *</Label>
          <Input
            id="weightGrams"
            type="number"
            step="0.01"
            {...register('weightGrams', { valueAsNumber: true })}
            className={errors.weightGrams ? 'border-red-500' : ''}
          />
          {errors.weightGrams && (
            <p className="text-sm text-red-500">{errors.weightGrams.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inStock">وضعیت موجودی</Label>
          <Select 
            value={watch('inStock') ? 'true' : 'false'} 
            onValueChange={(value) => setValue('inStock', value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">موجود</SelectItem>
              <SelectItem value="false">ناموجود</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'در حال ذخیره...' : (initialData ? 'بروزرسانی' : 'ایجاد')}
        </Button>
        <Button type="button" variant="outline" onClick={() => reset()}>
          بازنشانی
        </Button>
      </div>
    </form>
  );
}
