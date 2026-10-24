import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ExternalLink, Loader2, BookOpen, User, Calendar, Github } from "lucide-react";

/* 
  =============================================================================
  DEPLOYMENT NOTE:
  If you are copying this to a local Vite project:
  1. This file represents your 'src/App.tsx'.
  2. You will need to install lucide-react: `npm install lucide-react`
  3. The `createRoot` call at the bottom typically lives in 'src/main.tsx', 
     so usually you only copy the component code into 'App.tsx' and export it as default.
  =============================================================================
*/

interface MediumItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
}

interface FeedInfo {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

interface FeedData {
  status: string;
  feed: FeedInfo;
  items: MediumItem[];
}

const App = () => {
  const [items, setItems] = useState<MediumItem[]>([]);
  const [feedInfo, setFeedInfo] = useState<FeedInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const RSS_URL = "https://medium.com/feed/@sohaibmalikdev";
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data: FeedData = await response.json();

      if (data.status === "ok") {
        setItems(data.items);
        setFeedInfo(data.feed);
      } else {
        setError("Failed to fetch Medium articles. Please check the URL.");
      }
    } catch (err) {
      setError("An error occurred while fetching articles.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to extract text content from HTML string
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Helper function to extract the first image from content if thumbnail is missing
  const extractFirstImage = (item: MediumItem): string => {
    // 1. Check if the RSS feed provided a thumbnail directly
    if (item.thumbnail && item.thumbnail.startsWith("http")) {
      return item.thumbnail;
    }

    // 2. Parse the content to find the first <img> tag
    const parser = new DOMParser();
    const doc = parser.parseFromString(item.content, 'text/html');
    const img = doc.querySelector('img');
    if (img && img.src) {
      return img.src;
    }

    // 3. Fallback: Parse the description to find an <img> tag
    const docDesc = parser.parseFromString(item.description, 'text/html');
    const imgDesc = docDesc.querySelector('img');
    if (imgDesc && imgDesc.src) {
      return imgDesc.src;
    }

    // 4. Fallback placeholder
    return "https://images.unsplash.com/photo-1499750310159-5b5f38e31638?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-black" />
        <p className="text-lg font-medium">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-500">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <p className="text-xl font-bold mb-2">Oops!</p>
          <p>{error}</p>
          <button 
            onClick={fetchArticles}
            className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 py-12 mb-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {feedInfo?.image && (
            <div className="mb-6 flex justify-center">
              <img 
                src={feedInfo.image} 
                alt={feedInfo.author}
                className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-sm object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Sohaib Malik
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Exploring technology, development, and insights.
          </p>
          <div className="flex justify-center gap-6 mt-8">
             <a 
              href={feedInfo?.link || "https://medium.com/@sohaibmalikdev"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
            >
              <BookOpen size={18} />
              <span>Medium Profile</span>
            </a>
          </div>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-6xl mx-auto px-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const imageUrl = extractFirstImage(item);
            const plainTextSummary = stripHtml(item.description).slice(0, 140) + "...";
            
            return (
              <article 
                key={item.guid || index} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group"
              >
                {/* Image Container */}
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  <img 
                    src={imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1499750310159-5b5f38e31638?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                      Medium
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(item.pubDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{item.author}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-gray-700 transition-colors">
                    {item.title}
                  </h2>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {plainTextSummary}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors group/btn"
                    >
                      <span>Read Article</span>
                      <ExternalLink size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      
      {/* Footer Section */}
      <footer className="max-w-5xl mx-auto px-6 py-12 mt-12 text-center text-gray-400 text-sm border-t border-gray-100 w-full">
        <div className="flex justify-center items-center gap-6 mb-6">
          <a
            href="https://github.com/sohaibdevv"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-gray-600 hover:text-black hover:scale-110 transition-all duration-300 border border-gray-100 group"
            aria-label="GitHub Profile"
          >
            <Github size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          </a>
          <a
             href="https://medium.com/@sohaibmalikdev" 
             target="_blank" 
             rel="noopener noreferrer"
             className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-gray-600 hover:text-black hover:scale-110 transition-all duration-300 border border-gray-100 group"
             aria-label="Medium Profile"
           >
             <BookOpen size={24} className="group-hover:-rotate-12 transition-transform duration-300" />
           </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Sohaib Malik. All rights reserved.</p>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}