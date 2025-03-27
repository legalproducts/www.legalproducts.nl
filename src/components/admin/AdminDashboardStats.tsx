'use client';

import { useState, useEffect } from 'react';
import { FaUserFriends, FaNewspaper, FaRegClock } from 'react-icons/fa';

interface StatsProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

interface RegisteredUser {
  id: string;
  name: string;
  createdAt: string; // ISO date string
}

const StatCard = ({ icon, title, value, change, changeType }: StatsProps) => {
  const changeColor = 
    changeType === 'positive' ? 'text-green-500' :
    changeType === 'negative' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/20">
          {icon}
        </div>
      </div>
      <div className={`mt-3 flex items-center ${changeColor}`}>
        <span className="text-sm font-medium">{change}</span>
      </div>
    </div>
  );
};

const AdminDashboardStats = () => {
  const [stats, setStats] = useState({
    users: { total: '0', change: '' },
    news: { total: '0', change: '' },
    views: { total: '0', change: '' },
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userResponse, newsCountResponse, registeredUsersResponse] = await Promise.all([
          fetch('/api/auth/user?all=true'),
          fetch('/api/news?count=true'), // Correct API call for news count
          fetch('/api/auth/register'), // Fetch registered users
        ]);

        const usersData = await userResponse.json();
        const newsCountData = await newsCountResponse.json();
        const registeredUsersData = await registeredUsersResponse.json();

        // Update to correctly handle the users count from the array length
        setStats({
          users: { 
            total: Array.isArray(usersData) ? usersData.length.toString() : '0', 
            change: '' 
          },
          news: { 
            total: newsCountData.count ? newsCountData.count.toString() : '0',
            change: '' 
          },
          views: { total: '4,320', change: '+15% vanaf vorige maand' },
        });

        setRegisteredUsers(registeredUsersData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaUserFriends size={20} />}
          title="Totaal Gebruikers"
          value={stats.users.total}
          change={stats.users.change}
          changeType="positive"
        />
        <StatCard
          icon={<FaNewspaper size={20} />}
          title="Nieuwsberichten"
          value={stats.news.total}
          change={stats.news.change}
          changeType="positive"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recente Activiteit</h3>
        <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {registeredUsers.map((user) => (
              <li key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FaRegClock className="text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      Geregistreerd op {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
