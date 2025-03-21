import { prisma } from '@/lib/prisma';
import { getTagColor } from '@/utils/tagColors';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default async function NewsOverview() {
  const news = await prisma.news.findMany({
    orderBy: {
      date: 'desc'
    }
  });

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nieuws Overzicht</h1>
          <p className="text-lg text-gray-600">Alle updates en artikelen op een rij</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const formattedDate = new Date(item.date).toLocaleDateString('nl-NL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div 
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
              >
                <div className="h-48 w-full relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <span className={`inline-block ${getTagColor(item.tag)} text-white text-xs font-bold px-2 py-1 rounded-md uppercase mb-2`}>
                    {item.tag}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaCalendarAlt className="mr-2" />
                    <time>{formattedDate}</time>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>
                  <p className="text-base text-gray-600 mb-4">
                    {item.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <Link 
                    href={item.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Lees meer <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
