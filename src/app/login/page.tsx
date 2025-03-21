'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaDiscord, FaGoogle, FaCheck } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Inloggen mislukt. Probeer het opnieuw.');
      }
      
      // Handle successful login
      setSuccess('U bent succesvol ingelogd!');
      
      // Store user data (you might want to use a state management solution or cookies)
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Redirect to dashboard or home page
      setTimeout(() => {
        router.push('/');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
              <img src="/Legalround.png" alt="Legal Products Logo" className="h-14 w-14" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Log in op uw account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Of{' '}
            <Link href="/registreren" className="font-medium text-blue-400 hover:text-blue-300">
              registreer als nieuwe gebruiker
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-800 text-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded bg-green-800 text-green-100">
                {success}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  E-mailadres
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="uw@email.nl"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Wachtwoord
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember_me"
                        name="remember_me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="sr-only"
                      />
                      <div 
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`${rememberMe ? 'bg-blue-600' : 'bg-gray-700'} w-5 h-5 rounded border border-gray-600 flex items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}
                        tabIndex={0}
                        role="checkbox"
                        aria-checked={rememberMe}
                        aria-labelledby="remember-label"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setRememberMe(!rememberMe);
                            e.preventDefault();
                          }
                        }}
                      >
                        {rememberMe && (
                          <FaCheck className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="ml-2 text-sm">
                      <label id="remember-label" htmlFor="remember_me" className="font-medium text-gray-300 cursor-pointer">
                        Onthoud mij
                      </label>
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                    Wachtwoord vergeten?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Inloggen...' : 'Inloggen'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Of ga verder met</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600"
                >
                  <FaDiscord className="h-5 w-5 text-blue-400 mr-2" />
                  Inloggen met Discord
                </a>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600"
                >
                  <FaGoogle className="h-5 w-5 text-red-400 mr-2" />
                  Inloggen met Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
