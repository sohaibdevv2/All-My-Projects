import React from 'react';
import { Link } from 'react-router-dom';

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

interface HeaderProps {
    userName: string;
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

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <SparkleIcon />
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Spark Community</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/new-story" className="text-gray-500 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                </svg>
                <span>Write</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full">
                  <img src={`https://randomuser.me/api/portraits/men/${getAvatarId(userName)}.jpg`} alt="User Avatar" className="w-full h-full rounded-full object-cover"/>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;