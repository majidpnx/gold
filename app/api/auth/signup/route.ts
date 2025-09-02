import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  phone: z.string()
    .min(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .max(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تلفن باید با ۰۹ شروع شود'),
  email: z.string().email('ایمیل نامعتبر است').optional().or(z.literal('')),
  otp: z.string().length(6, 'کد تایید باید ۶ رقم باشد'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, otp } = signupSchema.parse(body);
    
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
    
    // Check if user already exists
    await connectDB();
    const existingUser = await User.findOne({ phone });
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'کاربری با این شماره تلفن قبلاً ثبت نام کرده است',
      }, { status: 400 });
    }
    
    // Create new user
    const user = await User.create({
      name,
      phone,
      email: email || undefined,
      userType: 'user',
      walletBalance: 0,
    });
    
    // Remove used OTP
    global.otpStore.delete(phone);
    
    return NextResponse.json({
      success: true,
      message: 'ثبت نام موفقیت‌آمیز بود',
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
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    // Handle MongoDB duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        success: false,
        message: 'کاربری با این شماره تلفن قبلاً ثبت نام کرده است',
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در ثبت نام',
    }, { status: 500 });
  }
}
