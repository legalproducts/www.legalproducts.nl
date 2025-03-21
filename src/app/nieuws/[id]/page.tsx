import { prisma } from '@/lib/prisma';
import { FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import { getTagColor } from '@/utils/tagColors';

type Props = {
  params: Promise<{ id: string }>, // Keep Promise wrapper for params
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> // Make searchParams a Promise
}

export async function generateStaticParams() {
  const news = await prisma.news.findMany();
  return news.map((item) => ({
    id: item.link.split('/').pop() || '', // Get the last part of the link
  }));
}

export default async function NewsDetail({ params, searchParams }: Props) {
  const resolvedParams = await params; // Await params to resolve the Promise
  const resolvedSearchParams = searchParams ? await searchParams : undefined; // Await searchParams if provided

  const news = await prisma.news.findFirst({
    where: { 
      link: `/nieuws/${resolvedParams.id}` // Use resolvedParams.id
    }
  });

  if (!news) {
    return <div>Nieuws niet gevonden</div>;
  }

  const formattedDate = new Date(news.date).toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Hero section with image */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px]">
        <Image
          src={news.imageUrl}
          alt={news.title}
          fill
          priority
          style={{ objectFit: 'cover' }}
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-4xl mx-auto">
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getTagColor(news.tag)} mb-4`}>
            {news.tag}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{news.title}</h1>
          <div className="flex items-center text-gray-200">
            <FaCalendarAlt className="mr-2" />
            <time>{formattedDate}</time>
          </div>
        </div>
      </div>

      {/* Content section */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 text-lg leading-relaxed [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
            dangerouslySetInnerHTML={{ __html: news.description }}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span>Leestijd: ~{Math.max(1, Math.ceil(news.description.replace(/<[^>]*>/g, '').split(' ').length / 200))} minuten</span>
          </div>
        </div>
      </article>
    </>
  );
}
