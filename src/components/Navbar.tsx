'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaDiscord, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import UserDropdown from './UserDropdown';
import InfoBar from '@/components/InfoBar'; // Import InfoBar

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user'); // Replace with your actual API endpoint
        if (response.ok) {
          const user = await response.json();
          setIsLoggedIn(true);
          setUserName(user.name || 'Gebruiker');
          setIsAdmin(user.admin || false); // Check if the user is an admin
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear user session on the backend
    fetch('/api/auth/logout', { method: 'POST' }) // Replace with your actual logout API endpoint
      .then(() => {
        setIsLoggedIn(false);
        window.location.href = '/';
      })
      .catch((error) => console.error('Failed to log out:', error));
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="h-8 w-8 mr-2">
                <div className="bg-blue-500 h-full w-full rounded-full flex items-center justify-center">
                <img src="/Legalround.png" alt="FS Logo" />
                </div>
              </div>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Homepagina
                </Link>
                <Link href="/producten" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Producten
                </Link>
                <Link href="/nieuws" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  Nieuws
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <a
                href="https://discord.gg/your-discord"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <FaDiscord className="h-6 w-6" />
              </a>
              
              {isLoggedIn ? (
                <UserDropdown userName={userName} onLogout={handleLogout} isAdmin={isAdmin} />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700"
                >
                  <FaUser className="h-4 w-4 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Hoofdmenu openen</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <InfoBar/>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Homepagina
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Producten
            </Link>
            <a
              href="#contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <a
              href="https://discord.gg/your-discord"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FaDiscord className="h-5 w-5 mr-2" />
                Discord
              </div>
            </a>
            
            {/* Use mobile-friendly version of user dropdown */}
            {isLoggedIn ? (
              <div className="space-y-1 pt-2 border-t border-gray-700">
                <div className="block px-3 py-2 text-base font-medium text-gray-300">
                  <FaUser className="h-5 w-5 inline mr-2" />
                  {userName}
                </div>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 pl-9"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mijn profiel
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 pl-9"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="h-5 w-5 mr-2" />
                    Uitloggen
                  </div>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FaUser className="h-5 w-5 mr-2" />
                  Login
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;