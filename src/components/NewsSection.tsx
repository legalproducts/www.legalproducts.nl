"use client"

import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTagColor } from '@/utils/tagColors';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  link: string;
  tag: string;
}

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?all=true'); // Voeg 'all=true' toe
        const data = await response.json();
        const newsArray = Array.isArray(data) ? data : data.news || [];
        
        // Ensure proper date formatting
        const formattedData = newsArray.map((item: NewsItem) => ({
          ...item,
          date: formatDate(item.date), // Format the date here
        }));
        
        setNewsItems(formattedData);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('nl-NL', options);
  };

  // Limit to a maximum of 3 news items
  const displayedItems = newsItems.slice(0, 3);

  const truncateDescription = (description: string) => {
    // Remove HTML tags
    const plainText = description.replace(/<[^>]*>/g, '');
    // Truncate to 150 characters
    return plainText.length > 150 
      ? plainText.substring(0, 150) + '...'
      : plainText;
  };

  if (loading) {
    return <div className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-white">Loading...</p>
      </div>
    </div>;
  }

  // Add check for empty news array
  if (!loading && displayedItems.length === 0) {
    return <div className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Laatste nieuws</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Blijf op de hoogte van onze ontwikkelingen
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-white text-xl">Er zijn momenteel geen nieuwsberichten beschikbaar.</p>
          <p className="text-gray-400 mt-2">Kom later terug voor updates.</p>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Laatste nieuws</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Blijf op de hoogte van onze ontwikkelingen
          </p>
        </div>

        {/* Pas layout aan gebaseerd op aantal items */}
        <div className={`
          ${displayedItems.length === 1 
            ? 'flex justify-center' 
            : 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'}
          ${displayedItems.length === 2 ? 'lg:grid-cols-2 lg:gap-12' : ''}
        `}>
          {displayedItems.map((item) => (
            <div 
              key={item.id} 
              className={`
                bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105
                ${displayedItems.length === 1 ? 'max-w-md w-full' : ''}
              `}
            >
              <div className="h-48 w-full relative">
                <Image 
                  src={item.imageUrl} 
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAIAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigD/2Q=="
                />
              </div>
              <div className="p-6">
                {/* Tag boven de titel met dynamische kleur en hover effect */}
                {item.tag && (
                  <span className={`inline-block ${getTagColor(item.tag)} text-white text-xs font-bold px-2 py-1 rounded-md uppercase mb-2 transition-colors duration-200 cursor-default`}>
                    {item.tag}
                  </span>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-base text-gray-600 mb-4">
                  {truncateDescription(item.description)}
                </p>
                <Link 
                  href={item.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Lees meer <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
