import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const order = await Order.findById(id)
      .populate('userId', 'name phone')
      .populate('items.productId', 'title images weightGrams');
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'سفارش یافت نشد',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: order,
    });
    
  } catch (error) {
    console.error('Get order error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت سفارش',
    }, { status: 500 });
  }
}
