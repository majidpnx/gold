import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // For now, we'll use a simple approach - in a real app you'd verify JWT/session
    // For demo purposes, we'll get the first user or return null
    const user = await User.findOne().select('-password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'کاربر یافت نشد',
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        userType: user.userType,
        walletBalance: user.walletBalance,
        createdAt: user.createdAt,
      },
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت اطلاعات کاربر',
    }, { status: 500 });
  }
}
