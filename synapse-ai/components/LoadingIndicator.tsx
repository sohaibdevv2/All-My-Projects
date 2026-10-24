import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-start space-x-2 p-4">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 flex-shrink-0">
            {/* You can replace this with a proper bot icon if you have one */}
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;