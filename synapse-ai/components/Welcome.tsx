import React from 'react';

interface WelcomeProps {
  onSendMessage: (message: string) => void;
}

const suggestions = [
  {
    title: 'Explain a concept',
    prompt: 'Explain quantum computing in simple terms.',
  },
  {
    title: 'Write some code',
    prompt: 'Write a python function that returns the nth fibonacci number.',
  },
  {
    title: 'Brainstorm ideas',
    prompt: 'Brainstorm creative names for a new coffee shop.',
  },
  {
    title: 'Plan a trip',
    prompt: 'What are some must-see places for a 3-day trip to Paris?',
  },
];

const Welcome: React.FC<WelcomeProps> = ({ onSendMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          How can I help you today?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(suggestion.prompt)}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
            >
              <p className="font-semibold text-gray-700">{suggestion.title}</p>
              <p className="text-sm text-gray-500 mt-1">{suggestion.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
