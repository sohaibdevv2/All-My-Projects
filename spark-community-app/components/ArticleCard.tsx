import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ClapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-500"><path d="M15.42 8.526a.939.939 0 0 1 .632.854v8.52c0 .52-.422.94-.94.94H4.552a.939.939 0 0 1-.94-.94V10.3a.939.939 0 0 1 .42-.799l4.282-2.744a.939.939 0 0 1 1.258.113l.938 1.213.938 1.213.939 1.213z" stroke="currentColor" strokeWidth="1.5"></path><path d="M19.01 10.323a.94.94 0 0 1-.4 1.22l-3.21 1.95m3.61-3.17v-1.6c0-.52-.421-.94-.94-.94H16.1a.94.94 0 0 0-.94.94v2.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg>;
const CommentIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-500"><path d="M18 17.6h-5.25l-2.1 1.9-2.1-1.9H4.5a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h13.9a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.4.5z" stroke="currentColor" strokeWidth="1.5"></path></svg>;

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="py-8 border-b border-gray-200">
      <div className="flex justify-between">
        <div className="flex-1 pr-8">
            <div className="flex items-center space-x-2 mb-2">
                <img src={article.authorAvatar} alt={article.authorName} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-medium text-gray-800">{article.authorName}</span>
            </div>
            <Link to={`/article/${article.id}`} className="block group">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">{article.title}</h2>
                <p className="mt-2 text-gray-500 font-serif leading-relaxed line-clamp-2">{article.snippet}</p>
            </Link>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{article.publicationDate}</span>
                    <span className="text-gray-300">&middot;</span>
                    <span>{article.readTimeMinutes} min read</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <ClapIcon />
                        <span className="text-sm text-gray-600">{article.claps > 1000 ? `${(article.claps/1000).toFixed(1)}K` : article.claps}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <CommentIcon />
                        <span className="text-sm text-gray-600">{article.comments}</span>
                    </div>
                </div>
            </div>
        </div>
        <Link to={`/article/${article.id}`} className="flex-shrink-0">
          <img src={article.imageUrl} alt={article.title} className="w-40 h-28 object-cover rounded-md" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;