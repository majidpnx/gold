import { NextResponse } from 'next/server';
import { zarinpalService } from '@/lib/zarinpal';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  try {
    console.log('=== Starting Payment Process ===');
    
    // Check environment variables
    const merchantId = '8f720bb2-4dfd-4c78-8d5c-b8cd35a9ad59';
    if (!merchantId) {
      console.error('ZARINPAL_MERCHANT_ID not found in environment variables');
      return NextResponse.json({
        success: false,
        message: 'تنظیمات درگاه پرداخت ناقص است',
        error: 'MERCHANT_ID_MISSING'
      }, { status: 500 });
    }

    await connectDB();
    console.log('Database connected');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { amount, description, userInfo, cartItems } = body;

    // Validation
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return NextResponse.json({
        success: false,
        message: 'مبلغ نامعتبر است',
        error: 'INVALID_AMOUNT'
      }, { status: 400 });
    }

    if (!userInfo || !userInfo.phone) {
      console.log('Invalid user info:', userInfo);
      return NextResponse.json({
        success: false,
        message: 'اطلاعات کاربر الزامی است',
        error: 'INVALID_USER_INFO'
      }, { status: 400 });
    }

    if (!cartItems || cartItems.length === 0) {
      console.log('Empty cart items');
      return NextResponse.json({
        success: false,
        message: 'سبد خرید خالی است',
        error: 'EMPTY_CART'
      }, { status: 400 });
    }

    // Convert amount from Toman to Rial (multiply by 10)
    const amountInRial = amount * 10;
    console.log(`Amount: ${amount} Toman = ${amountInRial} Rial`);

    // Validate callback URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/payment/callback`;
    
    console.log('Callback URL:', callbackUrl);

    console.log('Creating ZarinPal payment request...');
    
    // Create payment request with ZarinPal
    const paymentRequest = await zarinpalService.createPaymentRequest({
      amount: amountInRial, // Amount in Rial
      description: description || `سفارش طلا - ${userInfo.firstName} ${userInfo.lastName}`,
      callback_url: callbackUrl,
      mobile: userInfo.phone,
      email: userInfo.email || '',
    });

    console.log('ZarinPal payment request result:', paymentRequest);

    if (paymentRequest.Status !== 100) {
      console.log('ZarinPal error:', paymentRequest.message);
      console.log('ZarinPal status:', paymentRequest.Status);
      
      return NextResponse.json({
        success: false,
        message: paymentRequest.message || 'خطا در ایجاد درخواست پرداخت',
        status: paymentRequest.Status,
        error: 'ZARINPAL_ERROR'
      }, { status: 400 });
    }

    if (!paymentRequest.Authority) {
      console.log('No Authority received from ZarinPal');
      return NextResponse.json({
        success: false,
        message: 'شناسه پرداخت دریافت نشد',
        error: 'NO_AUTHORITY'
      }, { status: 400 });
    }

    // Save transaction to database with Authority from ZarinPal
    const transaction = new Transaction({
      userId: null,
      type: 'order',
      amount: amount, // Store amount in Toman for display
      status: 'pending',
      authority: paymentRequest.Authority, // Real Authority from ZarinPal
      description: description || 'سفارش طلا',
      ref: paymentRequest.Authority,
      metadata: {
        userInfo,
        cartItems,
        orderType: 'guest',
        amountInToman: amount, // Original amount in Toman
        amountInRial: amountInRial, // Converted amount in Rial
        merchantId: merchantId.substring(0, 8) + '...', // Log partial merchant ID for debugging
      }
    });

    await transaction.save();
    console.log('Transaction saved with Authority:', paymentRequest.Authority);
    console.log('Transaction ID:', transaction._id);

    // Generate payment URL
    const paymentUrl = zarinpalService.getPaymentUrl(paymentRequest.Authority);
    
    console.log('Payment URL generated:', paymentUrl);
    console.log('=== Payment Process Started Successfully ===');

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl,
      authority: paymentRequest.Authority,
      transactionId: transaction._id,
      amount: amount, // Amount in Toman for display
      amountInRial: amountInRial, // Amount in Rial for ZarinPal
      message: 'درخواست پرداخت با موفقیت ایجاد شد',
    });

  } catch (error) {
    console.error('Start payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در ایجاد درخواست پرداخت',
      error: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}