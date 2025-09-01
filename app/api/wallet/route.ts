import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // For demo purposes, we'll get the first user
    // In a real app, you'd get this from the authenticated session
    const user = await User.findOne();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'کاربر یافت نشد',
      }, { status: 404 });
    }
    
    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({
      success: true,
      data: {
        balance: user.walletBalance,
        transactions,
      },
    });
    
  } catch (error) {
    console.error('Get wallet error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت اطلاعات کیف پول',
    }, { status: 500 });
  }
}
