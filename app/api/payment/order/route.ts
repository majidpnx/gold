import { NextResponse } from 'next/server';
import { zarinpalService } from '@/lib/zarinpal';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  try {
    console.log('Starting payment order process...');
    
    await connectDB();
    console.log('Database connected');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { amount, description, callbackUrl, userInfo, cartItems } = body;

    // Validate input
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return NextResponse.json({
        success: false,
        message: 'مبلغ نامعتبر است',
      }, { status: 400 });
    }

    if (!userInfo || !userInfo.phone) {
      console.log('Invalid user info:', userInfo);
      return NextResponse.json({
        success: false,
        message: 'اطلاعات کاربر الزامی است',
      }, { status: 400 });
    }

    if (!cartItems || cartItems.length === 0) {
      console.log('Empty cart items');
      return NextResponse.json({
        success: false,
        message: 'سبد خرید خالی است',
      }, { status: 400 });
    }

    console.log('Creating ZarinPal payment request...');
    
    // Create payment request
    const paymentRequest = await zarinpalService.createPaymentRequest({
      amount: amount,
      description: description || `سفارش طلا - ${userInfo.firstName} ${userInfo.lastName}`,
      callback_url: callbackUrl || 'http://localhost:3000/payment/verify',
      mobile: userInfo.phone,
      email: userInfo.email || '',
    });

    console.log('ZarinPal response:', paymentRequest);

    if (paymentRequest.Status !== 100) {
      console.log('ZarinPal error:', paymentRequest.message);
      console.log('ZarinPal status:', paymentRequest.Status);
      return NextResponse.json({
        success: false,
        message: paymentRequest.message || 'خطا در ایجاد درخواست پرداخت',
        status: paymentRequest.Status,
      }, { status: 400 });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: null,
      type: 'order',
      amount: amount,
      status: 'pending',
      authority: paymentRequest.Authority,
      description: description || 'سفارش طلا',
      ref: paymentRequest.Authority,
      metadata: {
        userInfo,
        cartItems,
        orderType: 'guest'
      }
    });

    await transaction.save();
    console.log('Transaction saved with authority:', paymentRequest.Authority);

    // Get payment URL
    const paymentUrl = zarinpalService.getPaymentUrl(paymentRequest.Authority);

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl,
      authority: paymentRequest.Authority,
      transactionId: transaction._id,
    });

  } catch (error) {
    console.error('Create order payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در ایجاد درخواست پرداخت',
    }, { status: 500 });
  }
}