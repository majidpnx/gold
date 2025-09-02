import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const verifyOTPSchema = z.object({
  phone: z.string()
    .min(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .max(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تلفن باید با ۰۹ شروع شود'),
  otp: z.string().length(6, 'کد تایید باید ۶ رقم باشد'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = verifyOTPSchema.parse(body);
    
    // Check OTP from memory store
    if (!global.otpStore) {
      return NextResponse.json({
        success: false,
        message: 'کد تایید منقضی شده است',
      }, { status: 400 });
    }
    
    const storedOTP = global.otpStore.get(phone);
    
    if (!storedOTP) {
      return NextResponse.json({
        success: false,
        message: 'کد تایید یافت نشد',
      }, { status: 400 });
    }
    
    if (Date.now() > storedOTP.expiresAt) {
      global.otpStore.delete(phone);
      return NextResponse.json({
        success: false,
        message: 'کد تایید منقضی شده است',
      }, { status: 400 });
    }
    
    if (storedOTP.otp !== otp) {
      return NextResponse.json({
        success: false,
        message: 'کد تایید نامعتبر است',
      }, { status: 400 });
    }
    
    // OTP is valid, now find or create user
    await connectDB();
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create new user
      user = await User.create({
        phone,
        userType: 'user',
        walletBalance: 0,
      });
    }
    
    // Remove used OTP
    global.otpStore.delete(phone);
    
    return NextResponse.json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      data: {
        user: {
          _id: user._id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          userType: user.userType,
          walletBalance: user.walletBalance,
          createdAt: user.createdAt,
        },
      },
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در تایید کد',
    }, { status: 500 });
  }
}
