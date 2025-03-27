"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaSpinner, FaGamepad } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define the type for session details to fix TypeScript errors
interface SessionDetails {
  success: boolean;
  sessionId: string;
  orderNumber: string;
  productName: string;
  amount: number;
  customerEmail?: string;
  paymentDate: string;
  requiresFivemUsername?: boolean; // Add this field
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Add states for FiveM username
  const [fivemUsername, setFivemUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Geen geldige betaling gevonden.');
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Check if user is authenticated
        const authResponse = await fetch('/api/auth/user');
        if (authResponse.status === 401) {
          // If not authenticated, redirect to login
          router.push('/login?redirect=checkout/success&session_id=' + sessionId);
          return;
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error('Fout bij het verifiëren van betaling');
        }

        const data = await response.json();

        // Set requiresFivemUsername based on product category or metadata
        // For this example, we'll assume all products need a FiveM username
        data.requiresFivemUsername = true;

        setSessionDetails(data);
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Er is een fout opgetreden bij het verifiëren van uw betaling.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  const handleSubmitFivemUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fivemUsername.trim()) {
      setUsernameError('Voer een geldige FiveM gebruikersnaam in');
      return;
    }

    if (!sessionDetails) return;

    setIsSubmitting(true);
    setUsernameError('');

    try {
      const response = await fetch('/api/licenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fivemUsername,
          orderNumber: sessionDetails.orderNumber,
          productName: sessionDetails.productName,
          sessionId: sessionDetails.sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Er is een fout opgetreden');
      }

      setUsernameSubmitted(true);
    } catch (error) {
      console.error('Error submitting FiveM username:', error);
      setUsernameError(
        error instanceof Error
          ? error.message
          : 'Er is een fout opgetreden bij het toevoegen van uw licentie'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 sm:p-10">
              {loading ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin h-12 w-12 mx-auto text-blue-600" />
                  <p className="mt-4 text-xl font-medium text-gray-700">
                    Betaling verifiëren...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-xl font-medium text-gray-700">{error}</p>
                  <p className="mt-2 text-gray-500">
                    Als u denkt dat dit een fout is, neem dan contact op met onze klantenservice.
                  </p>
                  <div className="mt-6">
                    <Link href="/producten" className="text-blue-600 hover:text-blue-800 font-medium">
                      Terug naar producten
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <FaCheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Betaling succesvol!
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Bedankt voor uw aankoop. Een bevestigingsmail is naar uw e-mailadres verzonden.
                  </p>
                  
                  {sessionDetails && (
                    <div className="mt-8 border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-medium text-gray-900">Bestelgegevens</h3>
                      <dl className="mt-4 space-y-4">
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500 sm:text-right">Bestelnummer</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {sessionDetails.orderNumber || 'Niet beschikbaar'}
                          </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500 sm:text-right">Product</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {sessionDetails.productName || 'Niet beschikbaar'}
                          </dd>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500 sm:text-right">Totaalbedrag</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {sessionDetails.amount ? `€${sessionDetails.amount.toFixed(2)}` : 'Niet beschikbaar'} {/* Zorg ervoor dat het bedrag correct wordt weergegeven */}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                  
                  
                  
                  {/* Success message after submitting username */}
                  {usernameSubmitted && (
                    <div className="mt-8 border-t border-gray-200 pt-8">
                      <div className="rounded-md bg-green-50 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaCheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">FiveM gebruikersnaam toegevoegd</h3>
                            <div className="mt-2 text-sm text-green-700">
                              <p>
                                Uw FiveM gebruikersnaam is succesvol gekoppeld. U heeft nu toegang tot de gekochte scripts via Keymaster.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 space-y-4">
                    <p className="text-gray-600">
                      U heeft nu toegang tot het gekochte product. U kunt het product bekijken in uw dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                      <Link
                        href="/dashboard"
                        className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Naar dashboard
                      </Link>
                      <Link
                        href="/producten"
                        className="px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Bekijk meer producten
                      </Link>
                    </div>
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-8"><FaSpinner className="animate-spin h-12 w-12 mx-auto text-blue-600" /><p className="mt-4 text-xl font-medium text-gray-700">Laden...</p></div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
