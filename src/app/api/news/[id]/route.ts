import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a specific news item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const newsId = parseInt(id, 10);

    if (isNaN(newsId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const newsItem = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!newsItem) {
      return NextResponse.json({ message: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json(newsItem, { status: 200 });
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json({ message: 'Error fetching news item' }, { status: 500 });
  }
}

// UPDATE a news item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const newsId = parseInt(id, 10);

    if (isNaN(newsId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Check if user is authenticated and admin
    const cookies = request.cookies;
    const userId = cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { admin: true },
    });

    if (!user?.admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const data = await request.json();
    const { title, description, date, imageUrl, link, tag } = data;

    // Format date properly for database
    let formattedDate;
    if (date) {
      try {
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          formattedDate = new Date(date);
          formattedDate.setUTCHours(12, 0, 0, 0); // Set to noon UTC
        } else {
          formattedDate = new Date(date);
        }

        if (isNaN(formattedDate.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch (err) {
        console.error('Date parsing error:', err, date);
        return NextResponse.json(
          { error: `Invalid date format: ${date}. Please use YYYY-MM-DD format.` },
          { status: 400 }
        );
      }
    }

    // Update the news item
    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: {
        title,
        description,
        date: formattedDate,
        imageUrl,
        link,
        tag,
      },
    });

    return NextResponse.json(updatedNews, { status: 200 });
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json({ message: 'Error updating news item' }, { status: 500 });
  }
}

// DELETE a news item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const newsId = parseInt(id, 10);

    if (isNaN(newsId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Check if user is authenticated and admin
    const cookies = request.cookies;
    const userId = cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { admin: true },
    });

    if (!user?.admin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    // Delete the news item
    await prisma.news.delete({
      where: { id: newsId },
    });

    return NextResponse.json({ message: 'News item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json({ message: 'Error deleting news item' }, { status: 500 });
  }
}
