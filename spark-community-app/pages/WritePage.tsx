import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../types';

interface WritePageProps {
  addArticle: (article: Article) => void;
  authorName: string;
}

const getAvatarId = (name: string): number => {
    let hash = 0;
    if (name.length === 0) return 0;
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100; // Return a number between 0-99
};

const WritePage: React.FC<WritePageProps> = ({ addArticle, authorName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content cannot be empty.');
      return;
    }

    const newArticle: Article = {
      id: Date.now().toString(),
      title: title.trim(),
      authorName: authorName,
      authorAvatar: `https://randomuser.me/api/portraits/men/${getAvatarId(authorName)}.jpg`,
      publicationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTimeMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
      snippet: content.trim().substring(0, 150) + '...',
      content: `<p>${content.trim().replace(/\n+/g, '</p><p>')}</p>`,
      imageUrl: `https://picsum.photos/600/400?random=${Date.now()}`,
      claps: 0,
      comments: 0,
    };

    addArticle(newArticle);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Write a new story</h1>
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="sr-only">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-4xl font-bold border-none focus:ring-0 p-0 placeholder-gray-400"
            aria-label="Article Title"
          />
        </div>
        <div>
          <label htmlFor="content" className="sr-only">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            rows={15}
            className="w-full text-lg font-serif border-none focus:ring-0 p-0 placeholder-gray-400 resize-none"
            aria-label="Article Content"
          />
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handlePublish}
            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritePage;