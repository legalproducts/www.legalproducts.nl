import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const countParam = url.searchParams.get('count');

    if (countParam === 'true') {
      // Return only the count of news items
      const totalNews = await prisma.news.count();
      return NextResponse.json({ count: totalNews });
    }

    const currentDate = new Date();
    const getAllParam = url.searchParams.get('all');
    const getAll = getAllParam === 'true';
    
    const newsQuery = {
      where: {
        ...(getAll
          ? {} // Geen filter toepassen als 'all=true'
          : {
              date: {
                lte: currentDate, // Alleen nieuwsitems met een datum <= vandaag
              },
            }),
      },
      orderBy: {
        date: Prisma.SortOrder.desc,
      },
      ...(getAll ? {} : { take: 3 }), // Alleen beperken tot 3 items als 'all' niet is ingesteld
    };

    const news = await prisma.news.findMany(newsQuery);

    // Improved date formatting
    const formattedNews = news.map(item => ({
      ...item,
      date: item.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Update required fields (remove 'link' since we generate it)
    const requiredFields = ['title', 'description', 'date', 'imageUrl', 'tag'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure proper date handling for new items
    const newsDate = body.date ? new Date(body.date) : new Date();
    
    if (isNaN(newsDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const slug = generateSlug(body.title);
    
    // Create news item
    const news = await prisma.news.create({
      data: {
        title: body.title,
        description: body.description,
        date: newsDate,
        imageUrl: body.imageUrl,
        tag: body.tag,
        link: `/nieuws/${slug}`,
      }
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create news item' },
      { status: 500 }
    );
  }
}
