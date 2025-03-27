'use client';

import Link from 'next/link';
import { FaHome, FaNewspaper, FaSignOutAlt, FaUsers, FaCog } from 'react-icons/fa';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  return (
    <aside className="bg-gray-800 text-white w-64 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <p className="text-sm text-gray-400">Legal Products</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === 'news' ? 'bg-blue-600' : 'hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <FaNewspaper className="mr-3" />
              Nieuwsberichten
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <FaUsers className="mr-3" />
              Gebruikers
            </button>
          </li>
          
          <li>
            <button
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FaCog className="mr-3" />
              Instellingen
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <FaHome className="mr-3" />
          Terug naar site
        </Link>
        
        <button
          className="flex items-center w-full p-3 mt-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
