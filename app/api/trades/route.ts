import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Trade from '@/models/Trade';
import User from '@/models/User';
import { z } from 'zod';

const createTradeSchema = z.object({
  type: z.enum(['buy', 'sell'], { message: 'نوع معامله باید buy یا sell باشد' }),
  grams: z.number().positive('مقدار گرم باید مثبت باشد'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { type, grams } = createTradeSchema.parse(body);
    
    // For demo purposes, we'll get the first user
    // In a real app, you'd get this from the authenticated session
    const user = await User.findOne();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'کاربر یافت نشد',
      }, { status: 404 });
    }
    
    // Get current gold price
    const priceResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/prices/gold`);
    const priceData = await priceResponse.json();
    const unitPrice = priceData.data.unitPrice;
    
    const total = unitPrice * grams;
    
    if (type === 'buy') {
      // Check if user has enough balance
      if (user.walletBalance < total) {
        return NextResponse.json({
          success: false,
          message: 'موجودی کیف پول کافی نیست',
        }, { status: 400 });
      }
      
      // Deduct from wallet
      await User.findByIdAndUpdate(user._id, {
        $inc: { walletBalance: -total },
      });
    } else {
      // Add to wallet for sell
      await User.findByIdAndUpdate(user._id, {
        $inc: { walletBalance: total },
      });
    }
    
    // Create trade
    const trade = await Trade.create({
      userId: user._id,
      type,
      grams,
      unitPrice,
      total,
      status: 'completed',
    });
    
    return NextResponse.json({
      success: true,
      data: trade,
      message: `معامله ${type === 'buy' ? 'خرید' : 'فروش'} با موفقیت انجام شد`,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create trade error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: error.issues,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در ایجاد معامله',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // For demo purposes, we'll get all trades
    // In a real app, you'd filter by the authenticated user
    const trades = await Trade.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({
      success: true,
      data: trades,
    });
    
  } catch (error) {
    console.error('Get trades error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت معاملات',
    }, { status: 500 });
  }
}
