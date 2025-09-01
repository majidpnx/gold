import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { z } from 'zod';

const withdrawSchema = z.object({
  amount: z.number().positive('مبلغ باید مثبت باشد'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount } = withdrawSchema.parse(body);
    
    // For demo purposes, we'll get the first user
    // In a real app, you'd get this from the authenticated session
    const user = await User.findOne();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'کاربر یافت نشد',
      }, { status: 404 });
    }
    
    if (user.walletBalance < amount) {
      return NextResponse.json({
        success: false,
        message: 'موجودی کیف پول کافی نیست',
      }, { status: 400 });
    }
    
    // Create transaction
    await Transaction.create({
      userId: user._id,
      type: 'withdraw',
      amount,
      status: 'completed',
      ref: `WTH-${Date.now()}`,
    });
    
    // Update wallet balance
    await User.findByIdAndUpdate(user._id, {
      $inc: { walletBalance: -amount },
    });
    
    return NextResponse.json({
      success: true,
      message: 'مبلغ با موفقیت از کیف پول برداشت شد',
      data: { newBalance: user.walletBalance - amount },
    });
    
  } catch (error) {
    console.error('Withdraw error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در برداشت مبلغ',
    }, { status: 500 });
  }
}
