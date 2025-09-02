import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sendOTPSchema = z.object({
  phone: z.string()
    .min(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .max(11, 'شماره تلفن باید ۱۱ رقم باشد')
    .regex(/^09\d{9}$/, 'شماره تلفن باید با ۰۹ شروع شود'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = sendOTPSchema.parse(body);
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, you would send this OTP via SMS
    // For demo purposes, we'll store it in memory and log it
    console.log(`OTP for ${phone}: ${otp}`);
    
    // Store OTP in memory (in production, use Redis or database)
    if (!global.otpStore) {
      global.otpStore = new Map();
    }
    
    global.otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      message: 'کد تایید ارسال شد',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در ارسال کد تایید',
    }, { status: 500 });
  }
}

// Extend global type for TypeScript
declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}
