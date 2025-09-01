import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connected successfully');
    
    return NextResponse.json({
      success: true,
      message: 'اتصال به دیتابیس موفق بود',
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در اتصال به دیتابیس: ' + error.message,
    }, { status: 500 });
  }
}
