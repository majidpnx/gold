import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    return NextResponse.json({
      merchantId: merchantId ? 'Set (' + '8f720bb2-4dfd-4c78-8d5c-b8cd35a9ad59'.substring(0, 8) + '...)' : 'Not Set',
      baseUrl: baseUrl || 'Not Set',
      nodeEnv: process.env.NODE_ENV,
      message: merchantId ? 'Environment variables are configured' : 'ZARINPAL_MERCHANT_ID is missing'
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Error reading environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}