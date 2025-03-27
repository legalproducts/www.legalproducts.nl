'use client';

import { FaBars, FaSearch, FaBell } from 'react-icons/fa';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button className="p-2 rounded-md md:hidden hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaBars className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white capitalize">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Zoeken..."
              className="w-64 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400" />
          </div>
          
          <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">
            <FaBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
