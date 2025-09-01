import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: users,
    });
    
  } catch (error) {
    console.error('Get admin users error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت کاربران',
    }, { status: 500 });
  }
}
