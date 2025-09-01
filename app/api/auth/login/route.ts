import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const loginSchema = z.object({
  phone: z.string().min(10, 'شماره تلفن باید حداقل ۱۰ رقم باشد'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { phone } = loginSchema.parse(body);
    
    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create new user with phone
      user = await User.create({
        phone,
        userType: 'user',
        walletBalance: 0,
      });
    }
    
    // In a real app, you'd set a JWT token or session here
    // For now, we'll just return the user data
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          phone: user.phone,
          name: user.name,
          userType: user.userType,
          walletBalance: user.walletBalance,
          createdAt: user.createdAt,
        },
      },
      message: 'ورود موفقیت‌آمیز بود',
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.errors,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در ورود به سیستم',
    }, { status: 500 });
  }
}
