// src/components/ContactForm.tsx
'use client';

import { useState } from 'react';
import { FaEnvelope, FaDiscord, FaUser } from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Neem contact met ons op</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Neem contact op
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
          Heeft u vragen over onze producten of heeft u maatwerkontwikkeling nodig? Wij horen graag van u!
          </p>
        </div>

        <div className="mt-10 sm:flex sm:flex-wrap">
          <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="h-full bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white mr-4">
                  <FaDiscord className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Discord</h3>
              </div>
              <p className="text-gray-600 mb-4">Sluit je aan bij onze Discord-server voor de snelste ondersteuning en communitydiscussies.</p>
              <a
                href="https://discord.gg/your-discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                discord.gg/your-discord
              </a>
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="h-full bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-500 text-white mr-4">
                  <FaEnvelope className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Email</h3>
              </div>
              <p className="text-gray-600 mb-4">Voor zakelijke vragen of gedetailleerde vragen kunt u contact met ons opnemen via e-mail.</p>
              <a href="mailto:contact@yourfivemstore.com" className="text-blue-600 hover:text-blue-800">
                contact@yourfivemstore.com
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/3 px-4 mb-8">
            <form onSubmit={handleSubmit} className="h-full bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Stuur een bericht</h3>
              
              {status.message && (
                <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {status.message}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Naam</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Bericht</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Verzenden...' : 'Bericht verzenden'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;