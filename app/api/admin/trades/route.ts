import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Trade from '@/models/Trade';

export async function GET() {
  try {
    await connectDB();
    
    const trades = await Trade.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: trades,
    });
    
  } catch (error) {
    console.error('Get admin trades error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت معاملات',
    }, { status: 500 });
  }
}
