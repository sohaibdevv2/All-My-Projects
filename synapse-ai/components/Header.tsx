import React from 'react';
import { NewChatIcon } from './Icons';

interface HeaderProps {
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
      <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Synapse
      </h1>
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors focus:outline-none"
        aria-label="New chat"
      >
        <NewChatIcon />
        <span className="hidden sm:inline">New Chat</span>
      </button>
    </header>
  );
};

export default Header;