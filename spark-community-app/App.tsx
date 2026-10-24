import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import WritePage from './pages/WritePage';
import NotFoundPage from './pages/NotFoundPage';
import NamePromptPage from './pages/NamePromptPage';
import { MOCK_ARTICLES } from './constants';
import { Article } from './types';

function App() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [userName, setUserName] = useState<string | null>(null);

  const addArticle = (newArticle: Article) => {
    setArticles(prevArticles => [newArticle, ...prevArticles]);
  };

  const deleteArticle = (articleId: string) => {
    const updatedArticles = articles.filter(a => a.id !== articleId);
    setArticles(updatedArticles);
  };
  
  const handleNameSubmit = (name: string) => {
    if (name.trim()) {
      setUserName(name.trim());
    }
  };

  if (!userName) {
    return <NamePromptPage onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <Header userName={userName} />
      <main className="flex-grow w-full max-w-4xl px-4 py-8 mx-auto">
        <Routes>
          <Route path="/" element={<HomePage articles={articles} />} />
          <Route path="/article/:id" element={<ArticlePage articles={articles} deleteArticle={deleteArticle} />} />
          <Route path="/new-story" element={<WritePage addArticle={addArticle} authorName={userName} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;