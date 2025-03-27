// src/app/page.tsx
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import ContactForm from '@/components/ContactForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InfoBar from '@/components/InfoBar'; // Import InfoBar
import Link from 'next/link';
import NewsSection from '@/components/NewsSection';
import { Metadata } from 'next';

export default function Home() {
  const isEmailVerified = true; // Simuleer de verificatiestatus van de gebruiker

  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBadges />
      
      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Uitgelichte producten</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Populaire scripts
            </p>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Bekijk alle producten
            </Link>
          </div>
        </div>
      </section>
      
      <NewsSection />
      <ContactForm />
      <Footer />
    </main>
  );
}