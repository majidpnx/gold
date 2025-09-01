import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'], {
    message: 'وضعیت نامعتبر است',
  }),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'سفارش یافت نشد',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'وضعیت سفارش با موفقیت بروزرسانی شد',
    });
    
  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در بروزرسانی وضعیت سفارش',
    }, { status: 500 });
  }
}
