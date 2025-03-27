"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaHeading } from 'react-icons/fa';

interface FormData {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  tag: string;
  link?: string; // Optional, will be generated if not provided
}

export default function CreateNews() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    tag: 'Update'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    let insertion = '';
    
    switch (format) {
      case 'bold':
        insertion = `**${text.slice(start, end)}**`;
        break;
      case 'italic':
        insertion = `*${text.slice(start, end)}*`;
        break;
      case 'ul':
        insertion = `\n- ${text.slice(start, end)}`;
        break;
      case 'ol':
        insertion = `\n1. ${text.slice(start, end)}`;
        break;
      case 'h2':
        insertion = `\n## ${text.slice(start, end)}`;
        break;
      case 'link':
        insertion = `[${text.slice(start, end)}](url)`;
        break;
    }

    const newText = text.slice(0, start) + insertion + text.slice(end);
    setFormData(prev => ({ ...prev, description: newText }));
  };

  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n- (.*)/g, '<ul><li>$1</li></ul>')
      .replace(/\n\d\. (.*)/g, '<ol><li>$1</li></ol>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const formatMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-gray-900">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="italic text-gray-900">$1</span>')
      .replace(/\n- (.*)/g, '<div class="pl-4 text-gray-900 my-2">• $1</div>')
      .replace(/\n\d\. (.*)/g, '<div class="pl-4 text-gray-900 my-2">1. $1</div>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-900 my-4">$1</h2>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedDescription = convertMarkdownToHtml(formData.description);
      
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = formData.date;
      
      // Log what we're sending to help with debugging
      console.log('Sending data:', { 
        ...formData, 
        description: formattedDescription,
        date: formattedDate
      });
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description: formattedDescription,
          date: formattedDate, // Ensure we send the properly formatted date
          // Generate a link from the title if not provided
          link: formData.link || `/nieuws/${formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')}`
        }),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        router.push('/admin'); // Redirect to admin dashboard after successful creation
      } else {
        throw new Error(responseData.error || 'Failed to create news');
      }
    } catch (error) {
      console.error('Error:', error);
      setError((error as Error).message || 'Er ging iets mis bij het aanmaken van het nieuws');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nieuw nieuwsbericht maken</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Description with formatting buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beschrijving</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => insertFormatting('bold')}
                className="p-2 rounded hover:bg-gray-100"
                title="Vet (selecteer tekst en klik)"
              >
                <FaBold className="text-black"/>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('italic')}
                className="p-2 rounded hover:bg-gray-100"
                title="Schuingedrukt (selecteer tekst en klik)"
              >
                <FaItalic className="text-black"/>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('h2')}
                className="p-2 rounded hover:bg-gray-100"
                title="Koptekst"
              >
                <FaHeading className="text-black"/>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('ul')}
                className="p-2 rounded hover:bg-gray-100"
                title="Lijst met bullets"
              >
                <FaListUl className="text-black"/>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('ol')}
                className="p-2 rounded hover:bg-gray-100"
                title="Genummerde lijst"
              >
                <FaListOl className="text-black"/>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('link')}
                className="p-2 rounded hover:bg-gray-100"
                title="Link"
              >
                <FaLink className="text-black"/>
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                value={formData.description}
                onChange={handleDescriptionChange}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono"
                placeholder="Schrijf hier je bericht..."
                required
              />
              
              {/* Live Preview with improved styling */}
              <div className="border rounded-md p-6 bg-white shadow-inner">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Voorvertoning</h3>
                <div className="prose prose-sm max-w-none bg-white">
                  <div 
                    className="text-gray-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(formData.description) || '<span class="text-gray-400 italic">Typ om een voorvertoning te zien...</span>'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date and Tag selection */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Datum</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
              <p className="text-sm text-gray-500 mt-2">Voorbeeld: {formatDate(formData.date)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                required
              >
                <option value="Update">Update</option>
                <option value="Release">Release</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Artikel">Artikel</option>
              </select>
            </div>
          </div>

          {/* Image URL input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Afbeelding URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Optional link field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link (optioneel - wordt automatisch gegenereerd als leeg)
            </label>
            <input
              type="text"
              value={formData.link || ''}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="/nieuws/mijn-nieuws-titel"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Bezig met opslaan...' : 'Nieuws aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}