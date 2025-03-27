"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loadStripe } from '@stripe/stripe-js';

// Define the product type to avoid implicit any
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stripeProductId: string;
  stripePriceId: string;
  archived?: boolean; // Add archived property
}

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['Alle categorieën']);
  const [error, setError] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);

  // Check if the user's email is verified
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user status');
        }
        const data = await response.json();
        setIsEmailVerified(data.emailVerified);
      } catch (error) {
        console.error('Error fetching user status:', error);
        setIsEmailVerified(false); // Default to false if the status cannot be fetched
      }
    };

    fetchUserStatus();
  }, []);

  // Load products from Stripe API
  useEffect(() => {
    const loadStripeProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van producten');
        }

        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);

          // Extract unique categories from the active products
          const productCategories = data.products.map((product: Product) => product.category) as string[];
          const uniqueCategories = ['Alle categorieën', ...new Set(productCategories)];
          setCategories(uniqueCategories);
        } else {
          throw new Error('Ongeldig productformaat ontvangen');
        }
      } catch (error) {
        console.error('Failed to load products from Stripe:', error);
        setError('Er is een fout opgetreden bij het laden van de producten. Probeer het later opnieuw.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStripeProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];
      
      if (searchTerm) {
        result = result.filter(product => 
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedCategory && selectedCategory !== 'Alle categorieën') {
        result = result.filter(product => 
          product.category === selectedCategory
        );
      }
      
      setFilteredProducts(result);
    }
  }, [searchTerm, selectedCategory, products]);

  // Handle Stripe checkout
  const handleCheckout = async (product: Product) => {
    if (!isEmailVerified) {
      alert('U moet uw e-mailadres verifiëren voordat u een aankoop kunt doen.');
      return;
    }

    setCheckoutLoading(product.id);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripePriceId: product.stripePriceId,
          productName: product.title,
          tebexProductId: product.stripeProductId, // Voeg tebexProductId toe
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error handling checkout:', error);
      alert('Er is een fout opgetreden bij het afrekenen. Probeer het opnieuw.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (isEmailVerified === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Onze Producten
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Ontdek ons assortiment van juridische producten en diensten voor particulieren en bedrijven.
          </p>
        </div>
      </div>
      {/* Fixed improperly closed tags above */}
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and filter section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Zoek producten..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white text-black placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <select
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white text-black focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Fixed JSX syntax errors in the product grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md text-center py-12 px-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Fout bij laden producten</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Probeer opnieuw
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
                >
                  <div className="h-48 w-full relative bg-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h3>
                    <p className="text-base text-gray-600 mb-4 h-16 overflow-hidden">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price !== undefined
                          ? `€${product.price.toFixed(2)}`
                          : 'Prijs niet beschikbaar'} {/* Controleer of de prijs bestaat */}
                      </span>
                      <button
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-75"
                        onClick={() => handleCheckout(product)}
                        disabled={checkoutLoading === product.id || !isEmailVerified}
                      >
                        {checkoutLoading === product.id ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Bezig...
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="mr-2" />
                            Kopen
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md text-center py-12 px-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Geen producten gevonden</h3>
              <p className="text-gray-600 mb-4">Probeer andere zoektermen of filters.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Alle producten weergeven
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
