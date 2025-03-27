'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  link: string;
  tag: string;
}

const AdminNewsTable = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/news?all=true');
      if (response.ok) {
        const result = await response.json();
        const newsData = Array.isArray(result) ? result : result.data;

        if (Array.isArray(newsData)) {
          // Filter alleen geldige nieuwsitems
          const validNewsItems = newsData.filter(
            (item) =>
              item.id &&
              item.title &&
              item.date &&
              item.tag &&
              typeof item.id === 'number' &&
              typeof item.title === 'string' &&
              typeof item.date === 'string' &&
              typeof item.tag === 'string'
          );
          setNewsItems(validNewsItems);
        } else {
          console.error('API response is not in the expected format:', result);
          setNewsItems([]);
        }
      } else {
        console.error('Failed to fetch news. Status:', response.status);
        setNewsItems([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
  };

  const handleEdit = async (news: NewsItem) => {
    router.push(`/admin/news/edit/${news.id}`);
    // Wacht een korte tijd en haal de lijst opnieuw op
    setTimeout(() => fetchNews(), 1000);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Weet je zeker dat je dit nieuwsbericht wilt verwijderen?')) {
      try {
        await fetch(`/api/news/${id}`, { method: 'DELETE' });
        setNewsItems(newsItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Nieuwsberichten beheren</h2>
        <button
          onClick={() => router.push('/admin/news/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Nieuw bericht
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Titel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Tag
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {newsItems.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{news.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{formatDate(news.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      {news.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(news)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <FaEdit className="inline" /> Bewerken
                    </button>
                    <button
                      onClick={() => handleDelete(news.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash className="inline" /> Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsTable;
