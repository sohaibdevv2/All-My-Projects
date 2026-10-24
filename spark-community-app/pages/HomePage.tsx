
import React from 'react';
import ArticleCard from '../components/ArticleCard';
import { Article } from '../types';

interface HomePageProps {
  articles: Article[];
}

const HomePage: React.FC<HomePageProps> = ({ articles }) => {
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default HomePage;
