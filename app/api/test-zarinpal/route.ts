import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test with a simple request to ZarinPal
    const testData = {
      merchant_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      amount: 1000,
      description: 'تست اتصال',
      callback_url: 'http://localhost:3000/test',
    };

    console.log('Testing ZarinPal connection with:', testData);

    const response = await fetch('https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('ZarinPal test response status:', response.status);
    
    const result = await response.json();
    console.log('ZarinPal test result:', result);

    return NextResponse.json({
      success: true,
      status: response.status,
      result: result,
      message: 'تست اتصال به زرین‌پال انجام شد'
    });

  } catch (error) {
    console.error('ZarinPal test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'خطای نامشخص',
      message: 'خطا در تست اتصال به زرین‌پال'
    }, { status: 500 });
  }
}
