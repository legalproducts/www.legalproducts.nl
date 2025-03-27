import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }

    const productName = session.metadata?.productName || 'Unknown Product';
    const amount = session.amount_total ? session.amount_total / 100 : 0;

    const orderNumber = `ORDER-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-6)}`;

    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId || undefined },
    });

    let order;
    if (!existingOrder) {
      order = await prisma.order.create({
        data: {
          orderNumber,
          productName,
          amount,
          userId,
          stripeSessionId: sessionId,
          purchaseDate: new Date(),
        },
      });
    } else {
      order = existingOrder;
    }

    const tebexProductId = session.metadata?.tebexProductId;

    if (tebexProductId) {
      try {
        const couponCode = `COUPON-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

        const tebexResponse = await fetch('https://plugin.tebex.io/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tebex-Secret': process.env.TEBEX_SECRET_KEY || 'rGL3Jcxbd0htBidpJ4hvhkkND2mETvWg',
          },
          body: JSON.stringify({
            code: couponCode,
            effective_on: 'cart',
            discount_type: 'percentage',
            discount_amount: 100,
            redeem_unlimited: false,
            expire_never: false,
            expire_limit: 1,
            expire_date: '2030-01-01',
            discount_application_method: 2,
            basket_type: 'single',
            start_date: new Date().toISOString(),
            note: `Coupon for product ${tebexProductId}`,
            packages: [parseInt(tebexProductId, 10)],
          }),
        });

        if (!tebexResponse.ok) {
          const errorData = await tebexResponse.json();
          console.error('Tebex API error:', errorData);
          throw new Error('Failed to create Tebex coupon');
        }

        await prisma.order.update({
          where: { stripeSessionId: sessionId },
          data: { tebexClaimCode: couponCode },
        });
      } catch (error) {
        console.error('Error creating Tebex coupon:', error);
        return NextResponse.json(
          { error: 'Failed to create Tebex coupon' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      sessionId,
      orderNumber: order.orderNumber,
      productName,
      amount,
      customerEmail: session.customer_details?.email || 'Unknown',
      paymentDate: new Date(session.created * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
