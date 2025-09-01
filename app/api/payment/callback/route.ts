import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Payment Callback Received ===');
    
    const { searchParams } = new URL(request.url);
    const Status = searchParams.get('Status');
    const Authority = searchParams.get('Authority');
    
    console.log('Callback params:', { Status, Authority });

    // Check if payment was successful (Status must be "OK")
    if (Status !== 'OK') {
      console.log('Payment failed with status:', Status);
      
      // Redirect to failure page with status
      const failureUrl = new URL('/payment/failed', request.url);
      failureUrl.searchParams.set('status', Status || 'unknown');
      failureUrl.searchParams.set('error', 'payment_cancelled');
      
      return NextResponse.redirect(failureUrl);
    }

    // Check if Authority is provided
    if (!Authority) {
      console.log('No Authority received in callback');
      
      const failureUrl = new URL('/payment/failed', request.url);
      failureUrl.searchParams.set('error', 'no_authority');
      
      return NextResponse.redirect(failureUrl);
    }

    console.log('Payment successful, redirecting to verify with Authority:', Authority);
    
    // Redirect to verification with Authority
    const verifyUrl = new URL('/api/payment/verify', request.url);
    verifyUrl.searchParams.set('Authority', Authority);
    
    return NextResponse.redirect(verifyUrl);

  } catch (error) {
    console.error('Callback error:', error);
    
    const failureUrl = new URL('/payment/failed', request.url);
    failureUrl.searchParams.set('error', 'callback_error');
    
    return NextResponse.redirect(failureUrl);
  }
}