import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia', // Updated API version
});

// Utility function to strip HTML tags and preserve spacing
function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function GET() {
  try {
    // Haal alleen actieve producten op van Stripe
    const products = await stripe.products.list({
      active: true, // Filter alleen actieve producten
    });

    // Optioneel: Voeg prijzen toe aan de producten
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({ product: product.id });
        const defaultPrice = prices.data[0]?.unit_amount || null; // Haal de eerste prijs op of gebruik null
        return {
          id: product.id,
          title: product.name,
          description: stripHtmlTags(product.description || ''),
          price: defaultPrice ? defaultPrice / 100 : null, // Converteer centen naar euro's of gebruik null
          imageUrl: product.images[0] || '',
          category: product.metadata?.category || 'Onbekend',
          stripeProductId: product.id,
          stripePriceId: prices.data[0]?.id || '',
          archived: !product.active,
        };
      })
    );

    return NextResponse.json({ products: productsWithPrices });
  } catch (error) {
    console.error('Error fetching products from Stripe:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van producten.' },
      { status: 500 }
    );
  }
}
