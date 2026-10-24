import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2">The story you're looking for doesn't exist or has been moved.</p>
        <Link 
            to="/" 
            className="mt-8 bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition-colors duration-200"
        >
            Back to Home
        </Link>
    </div>
  );
};

export default NotFoundPage;