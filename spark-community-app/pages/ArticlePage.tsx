import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Article } from '../types';
import NotFoundPage from './NotFoundPage';

interface ArticlePageProps {
  articles: Article[];
  deleteArticle: (id: string) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ articles, deleteArticle }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | undefined>(undefined);

  useEffect(() => {
    const foundArticle = articles.find(a => a.id === id);
    setArticle(foundArticle);
    window.scrollTo(0, 0);
  }, [id, articles]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      if (id) {
        deleteArticle(id);
        navigate('/');
      }
    }
  };

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>
      
      <div className="flex items-center justify-between my-8">
        <div className="flex items-center space-x-4">
          <img src={article.authorAvatar} alt={article.authorName} className="w-14 h-14 rounded-full" />
          <div>
            <p className="text-lg font-semibold text-gray-800">{article.authorName}</p>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{article.publicationDate}</span>
              <span className="text-gray-300">&middot;</span>
              <span>{article.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          aria-label="Delete story"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div 
        className="prose prose-lg lg:prose-xl max-w-none font-serif text-gray-800"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
};

export default ArticlePage;