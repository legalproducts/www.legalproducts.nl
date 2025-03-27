"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaHeading } from "react-icons/fa";

const convertHtmlToMarkdown = (html: string): string => {
  return html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**') // Convert bold
    .replace(/<em>(.*?)<\/em>/g, '*$1*') // Convert italic
    .replace(/<ul>\s*<li>(.*?)<\/li>\s*<\/ul>/g, '- $1') // Convert unordered list
    .replace(/<ol>\s*<li>(.*?)<\/li>\s*<\/ol>/g, '1. $1') // Convert ordered list
    .replace(/<h2>(.*?)<\/h2>/g, '## $1') // Convert headings
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)') // Convert links
    .replace(/<br\s*\/?>/g, '\n'); // Convert line breaks
};

const convertMarkdownToHtml = (markdown: string): string => {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert italic
    .replace(/\n- (.*)/g, '<ul><li>$1</li></ul>') // Convert unordered list
    .replace(/\n\d\. (.*)/g, '<ol><li>$1</li></ol>') // Convert ordered list
    .replace(/## (.*)/g, '<h2>$1</h2>') // Convert headings
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Convert links
    .replace(/\n/g, '<br>'); // Convert line breaks
};

export default function EditNews() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    imageUrl: "",
    tag: "",
    link: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title,
            description: convertHtmlToMarkdown(data.description), // Convert HTML to markdown
            date: data.date.split("T")[0],
            imageUrl: data.imageUrl,
            tag: data.tag,
            link: data.link || "",
          });
        } else {
          throw new Error("Failed to fetch news item");
        }
      } catch (error) {
        console.error(error);
        setError("Er ging iets mis bij het ophalen van het nieuwsbericht.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    let insertion = "";

    switch (format) {
      case "bold":
        insertion = `**${text.slice(start, end)}**`;
        break;
      case "italic":
        insertion = `*${text.slice(start, end)}*`;
        break;
      case "ul":
        insertion = `\n- ${text.slice(start, end)}`;
        break;
      case "ol":
        insertion = `\n1. ${text.slice(start, end)}`;
        break;
      case "h2":
        insertion = `\n## ${text.slice(start, end)}`;
        break;
      case "link":
        insertion = `[${text.slice(start, end)}](url)`;
        break;
    }

    const newText = text.slice(0, start) + insertion + text.slice(end);
    setFormData((prev) => ({ ...prev, description: newText }));
  };

  const formatMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-gray-900">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="italic text-gray-900">$1</span>')
      .replace(/\n- (.*)/g, '<div class="pl-4 text-gray-900 my-2">• $1</div>')
      .replace(/\n\d\. (.*)/g, '<div class="pl-4 text-gray-900 my-2">1. $1</div>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-900 my-4">$1</h2>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n/g, "<br>");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedDescription = convertMarkdownToHtml(formData.description); // Convert markdown to HTML

      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: formattedDescription, // Use HTML description
        }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        throw new Error("Failed to update news item");
      }
    } catch (error) {
      console.error(error);
      setError("Er ging iets mis bij het bijwerken van het nieuwsbericht.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Bezig met laden...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nieuwsbericht bewerken</h1>

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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Description with formatting buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beschrijving</label>
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => insertFormatting("bold")} className="p-2 rounded hover:bg-gray-100">
                <FaBold className="text-black" />
              </button>
              <button type="button" onClick={() => insertFormatting("italic")} className="p-2 rounded hover:bg-gray-100">
                <FaItalic className="text-black" />
              </button>
              <button type="button" onClick={() => insertFormatting("h2")} className="p-2 rounded hover:bg-gray-100">
                <FaHeading className="text-black" />
              </button>
              <button type="button" onClick={() => insertFormatting("ul")} className="p-2 rounded hover:bg-gray-100">
                <FaListUl className="text-black" />
              </button>
              <button type="button" onClick={() => insertFormatting("ol")} className="p-2 rounded hover:bg-gray-100">
                <FaListOl className="text-black" />
              </button>
              <button type="button" onClick={() => insertFormatting("link")} className="p-2 rounded hover:bg-gray-100">
                <FaLink className="text-black" />
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono"
              placeholder="Schrijf hier je bericht..."
              required
            />
            <div className="border rounded-md p-6 bg-white shadow-inner mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Voorvertoning</h3>
              <div
                className="text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(formData.description) || '<span class="text-gray-400 italic">Typ om een voorvertoning te zien...</span>',
                }}
              />
            </div>
          </div>

          {/* Date and Tag selection */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Datum</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          {/* Optional link field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link (optioneel)</label>
            <input
              type="text"
              value={formData.link || ""}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
              {loading ? "Bezig met opslaan..." : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
