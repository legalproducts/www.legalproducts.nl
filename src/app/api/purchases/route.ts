import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the userId from the cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      );
    }

    // Get orders from database
    const purchases = await prisma.order.findMany({
      where: { userId },
      orderBy: { purchaseDate: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        productName: true,
        amount: true,
        purchaseDate: true,
      },
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van aankopen' },
      { status: 500 }
    );
  }
}
