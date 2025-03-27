"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaShoppingBag, FaLock, FaSignOutAlt, FaSpinner, FaGamepad } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  createdAt: string;
  emailVerified?: boolean;
}

interface Purchase {
  id: string;
  productName: string;
  orderNumber: string;
  purchaseDate: string;
  amount: number;
}

interface License {
  id: string;
  licenseKey: string;
  productName: string;
  fivemUsername: string;
  createdAt: string;
  expiresAt: string | null;
  status: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const handleVerifyEmail = () => {
    if (user) {
      setUser({ ...user, emailVerified: true }); // Simuleer dat de e-mail is geverifieerd
      alert('Uw e-mailadres is succesvol geverifieerd!');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        const userResponse = await fetch('/api/auth/user');
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            // Redirect to login if unauthorized
            router.push('/login');
            return;
          }
          throw new Error('Failed to authenticate');
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's purchases
        const purchasesResponse = await fetch('/api/purchases');
        if (purchasesResponse.ok) {
          const purchasesData = await purchasesResponse.json();
          setPurchases(purchasesData.purchases || []);
        }

      } catch (err) {
        console.error('Authentication error:', err);
        setError('Er is een fout opgetreden bij het laden van uw gegevens.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-white">Dashboard laden...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8"></div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Mijn Dashboard
            </h1>
            <p className="mt-3 text-xl text-gray-300">
              Beheer uw account en bekijk uw aankopen
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Navigation */}
              <div className="md:w-64 bg-gray-50 p-6 border-r border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FaUser size={20} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === 'profile' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-3 h-4 w-4" />
                    Profiel
                  </button>
                  <button
                    onClick={() => setActiveTab('purchases')}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === 'purchases' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaShoppingBag className="mr-3 h-4 w-4" />
                    Mijn aankopen
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === 'security' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaLock className="mr-3 h-4 w-4" />
                    Beveiliging
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4" />
                    Uitloggen
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mijn profiel</h2>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Naam</h3>
                          <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">E-mail</h3>
                          <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">E-mail geverifieerd</h3>
                          <p className="mt-1 text-lg text-gray-900">
                            {user?.emailVerified ? 'Ja' : 'Nee'}
                          </p>
                          {!user?.emailVerified && (
                            <button
                              onClick={handleVerifyEmail}
                              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
                            >
                              Verifieer e-mail
                            </button>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Lid sinds</h3>
                          <p className="mt-1 text-lg text-gray-900">
                            {user?.createdAt ? formatDate(user.createdAt) : 'Onbekend'}
                          </p>
                        </div>
                        {user?.admin && (
                          <div className="bg-blue-50 p-4 rounded-md">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">
                                  U heeft beheerdersrechten
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'purchases' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mijn aankopen</h2>
                    {purchases.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bestelnummer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Datum
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bedrag
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {purchases.map((purchase) => (
                              <tr key={purchase.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {purchase.orderNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {purchase.productName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(purchase.purchaseDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  €{purchase.amount.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                        <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Geen aankopen</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          U heeft nog geen producten gekocht.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => router.push('/producten')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <FaShoppingBag className="-ml-1 mr-2 h-5 w-5" />
                            Producten bekijken
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Beveiliging</h2>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <form className="space-y-6">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                            Huidig wachtwoord
                          </label>
                          <div className="mt-1">
                            <input
                              id="current-password"
                              name="current-password"
                              type="password"
                              required
                              className="appearance-none block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            Nieuw wachtwoord
                          </label>
                          <div className="mt-1">
                            <input
                              id="new-password"
                              name="new-password"
                              type="password"
                              required
                              className="appearance-none block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Bevestig nieuw wachtwoord
                          </label>
                          <div className="mt-1">
                            <input
                              id="confirm-password"
                              name="confirm-password"
                              type="password"
                              required
                              className="appearance-none block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Wachtwoord wijzigen
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
}
