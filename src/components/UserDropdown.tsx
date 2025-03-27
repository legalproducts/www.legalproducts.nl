'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaUserCircle, FaTachometerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDropdownProps {
  userName: string;
  onLogout: () => void;
  isAdmin: boolean; // Added isAdmin prop
}

const UserDropdown = ({ userName, onLogout, isAdmin }: UserDropdownProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-white shadow-md transition-all duration-200 ease-in-out hover:shadow-lg"
      >
        <FaUser className="h-5 w-5 text-white" />
        <span>{userName}</span>
      </button>
      
      <AnimatePresence>
        {showUserMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-52 rounded-xl shadow-xl py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
          >
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
                onClick={() => setShowUserMenu(false)}
              >
                <FaUserCircle className="h-4 w-4 mr-3 text-green-500" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="flex items-center">
                <FaTachometerAlt className="h-5 w-5 mr-2" />
                Dashboard
              </div>
            </Link>
            <button
              onClick={() => {
                onLogout();
                setShowUserMenu(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <div className="flex items-center">
                <FaSignOutAlt className="h-4 w-4 mr-3" />
                Uitloggen
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
