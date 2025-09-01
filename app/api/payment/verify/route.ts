import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { zarinpalService } from '@/lib/zarinpal';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Payment Verification Process ===');
    
    // Check environment variables
    const merchantId = '8f720bb2-4dfd-4c78-8d5c-b8cd35a9ad59';
    if (!merchantId) {
      console.error('ZARINPAL_MERCHANT_ID not found in environment variables');
      const failureUrl = new URL('/payment/failed', request.url);
      failureUrl.searchParams.set('error', 'merchant_id_missing');
      return NextResponse.redirect(failureUrl);
    }
    
    await connectDB();
    console.log('Database connected');
    
    const { searchParams } = new URL(request.url);
    const Authority = searchParams.get('Authority');
    
    console.log('Authority from callback:', Authority);

    if (!Authority) {
      console.log('No Authority provided for verification');
      const failureUrl = new URL('/payment/failed', request.url);
      failureUrl.searchParams.set('error', 'no_authority');
      return NextResponse.redirect(failureUrl);
    }

    // Find transaction by Authority
    const transaction = await Transaction.findOne({ authority: Authority });
    
    if (!transaction) {
      console.log('Transaction not found for Authority:', Authority);
      const failureUrl = new URL('/payment/failed', request.url);
      failureUrl.searchParams.set('error', 'transaction_not_found');
      return NextResponse.redirect(failureUrl);
    }

    console.log('Transaction found:', {
      id: transaction._id,
      amount: transaction.amount,
      status: transaction.status,
      authority: transaction.authority
    });

    // Check if already verified
    if (transaction.status === 'completed') {
      console.log('Transaction already completed');
      const successUrl = new URL('/orders/success', request.url);
      successUrl.searchParams.set('ref', transaction.ref || '');
      successUrl.searchParams.set('amount', transaction.amount.toString());
      return NextResponse.redirect(successUrl);
    }

    // Get amount in Rial from metadata (or convert from Toman)
    const amountInRial = transaction.metadata?.amountInRial || (transaction.amount * 10);
    
    console.log(`Verifying with amount: ${amountInRial} Rial (${transaction.amount} Toman)`);

    // Verify payment with ZarinPal
    console.log('Verifying payment with ZarinPal...');
    const verificationResult = await zarinpalService.verifyPayment({
      amount: amountInRial, // Use amount in Rial
      authority: Authority,
    });

    console.log('ZarinPal verification result:', verificationResult);

    if (verificationResult.Status === 100 || verificationResult.Status === 101) {
      // Payment successful
      console.log('Payment verification successful');
      
      // Update transaction status
      transaction.status = 'completed';
      transaction.ref = verificationResult.RefID;
      transaction.metadata = {
        ...transaction.metadata,
        verificationDate: new Date(),
        refId: verificationResult.RefID,
        verificationStatus: verificationResult.Status,
      };
      
      await transaction.save();
      
      console.log('Transaction updated with RefID:', verificationResult.RefID);
      console.log('=== Payment Verification Completed Successfully ===');
      
      // Redirect to success page
      const successUrl = new URL('/orders/success', request.url);
      successUrl.searchParams.set('ref', verificationResult.RefID);
      successUrl.searchParams.set('amount', transaction.amount.toString());
      successUrl.searchParams.set('authority', Authority);
      
      return NextResponse.redirect(successUrl);
      
    } else {
      // Payment failed
      console.log('Payment verification failed:', verificationResult.message);
      
      // Update transaction status
      transaction.status = 'failed';
      transaction.metadata = {
        ...transaction.metadata,
        verificationDate: new Date(),
        verificationStatus: verificationResult.Status,
        failureReason: verificationResult.message,
      };
      
      await transaction.save();
      
      const failureUrl = new URL('/payment/failed', request.url);
      failureUrl.searchParams.set('error', 'verification_failed');
      failureUrl.searchParams.set('status', verificationResult.Status.toString());
      failureUrl.searchParams.set('message', encodeURIComponent(verificationResult.message || 'تایید پرداخت ناموفق'));
      
      return NextResponse.redirect(failureUrl);
    }

  } catch (error) {
    console.error('Verification error:', error);
    
    const failureUrl = new URL('/payment/failed', request.url);
    failureUrl.searchParams.set('error', 'verification_error');
    
    return NextResponse.redirect(failureUrl);
  }
}