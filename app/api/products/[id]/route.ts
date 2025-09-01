import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { z } from 'zod';

const updateProductSchema = z.object({
  title: z.string().min(1, 'عنوان محصول الزامی است').optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  pricePerGram: z.number().positive('قیمت هر گرم باید مثبت باشد').optional(),
  weightGrams: z.number().positive('وزن باید مثبت باشد').optional(),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  type: z.enum(['jewelry', 'bar'], { message: 'نوع محصول باید jewelry یا bar باشد' }).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'محصول یافت نشد',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: product,
    });
    
  } catch (error) {
    console.error('Get product error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت محصول',
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    const updateData = updateProductSchema.parse(body);
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'محصول یافت نشد',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'محصول با موفقیت بروزرسانی شد',
    });
    
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در بروزرسانی محصول',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'محصول یافت نشد',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت حذف شد',
    });
    
  } catch (error) {
    console.error('Delete product error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در حذف محصول',
    }, { status: 500 });
  }
}
