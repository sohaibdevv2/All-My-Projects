import React from 'react';

export const UserIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const BotIcon: React.FC = () => (
    <svg 
        className="h-6 w-6"
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 2.5C12.83 2.5 13.5 3.17 13.5 4V5.5H15.5C16.33 5.5 17 6.17 17 7V8.5H18.5C19.33 8.5 20 9.17 20 10V14C20 14.83 19.33 15.5 18.5 15.5H17V17C17 17.83 16.33 18.5 15.5 18.5H13.5V20C13.5 20.83 12.83 21.5 12 21.5C11.17 21.5 10.5 20.83 10.5 20V18.5H8.5C7.67 18.5 7 17.83 7 17V15.5H5.5C4.67 15.5 4 14.83 4 14V10C4 9.17 4.67 8.5 5.5 8.5H7V7C7 6.17 7.67 5.5 8.5 5.5H10.5V4C10.5 3.17 11.17 2.5 12 2.5ZM12 8.25C10.21 8.25 8.75 9.71 8.75 11.5C8.75 13.29 10.21 14.75 12 14.75C13.79 14.75 15.25 13.29 15.25 11.5C15.25 9.71 13.79 8.25 12 8.25Z" fill="url(#grad1)"/>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgb(96, 165, 250)', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor: 'rgb(192, 132, 252)', stopOpacity:1}} />
            </linearGradient>
        </defs>
    </svg>
);


export const SendIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

export const NewChatIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);