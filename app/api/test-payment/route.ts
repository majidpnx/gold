import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Test payment request body:', body);
    
    // Validate input
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({
        success: false,
        message: 'مبلغ نامعتبر است',
      }, { status: 400 });
    }

    if (!body.userInfo || !body.userInfo.phone) {
      return NextResponse.json({
        success: false,
        message: 'اطلاعات کاربر الزامی است',
      }, { status: 400 });
    }

    if (!body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'سبد خرید خالی است',
      }, { status: 400 });
    }
    
    // Simulate a successful payment response
    return NextResponse.json({
      success: true,
      paymentUrl: 'https://sandbox.zarinpal.com/pg/StartPay/test-authority',
      authority: 'test-authority',
      transactionId: 'test-transaction-id',
    });

  } catch (error) {
    console.error('Test payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'خطای نامشخص';
    return NextResponse.json({
      success: false,
      message: 'خطا در تست پرداخت: ' + errorMessage,
    }, { status: 500 });
  }
}
