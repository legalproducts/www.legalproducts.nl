import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const { stripePriceId, productName, tebexProductId } = body; // Voeg tebexProductId toe
    if (!stripePriceId || !productName || !tebexProductId) { // Controleer ook op tebexProductId
      console.error('Invalid request body:', body);
      return NextResponse.json(
        { error: 'Stripe Price ID, Product Name, and Tebex Product ID are required.' },
        { status: 400 }
      );
    }

    console.log('Creating Stripe checkout session with:', { stripePriceId, productName, tebexProductId });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, // Voeg session_id toe
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/producten`,
      metadata: { productName, tebexProductId }, // Voeg tebexProductId toe aan de metadata
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session with Stripe:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het maken van de checkout sessie.' },
      { status: 500 }
    );
  }
}
