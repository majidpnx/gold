import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'شناسه محصول الزامی است'),
    qty: z.number().positive('تعداد باید مثبت باشد'),
  })).min(1, 'حداقل یک محصول باید انتخاب شود'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { items } = createOrderSchema.parse(body);
    
    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, you'd get this from the authenticated session
    const userId = '507f1f77bcf86cd799439011'; // Demo user ID
    
    // Get products and calculate prices
    const orderItems = [];
    let totalPrice = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({
          success: false,
          message: `محصول با شناسه ${item.productId} یافت نشد`,
        }, { status: 400 });
      }
      
      const itemTotal = product.pricePerGram * product.weightGrams * item.qty;
      totalPrice += itemTotal;
      
      orderItems.push({
        productId: product._id,
        qty: item.qty,
        priceAtOrder: product.pricePerGram,
      });
    }
    
    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice,
      status: 'pending',
    });
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'سفارش با موفقیت ایجاد شد',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create order error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در ایجاد سفارش',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // For demo purposes, we'll get all orders
    // In a real app, you'd filter by the authenticated user
    const orders = await Order.find()
      .populate('userId', 'name phone')
      .populate('items.productId', 'title images')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: orders,
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت سفارشات',
    }, { status: 500 });
  }
}
