import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import { UserIcon, BotIcon } from './Icons';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isModel = message.role === MessageRole.MODEL;
  const isError = message.role === MessageRole.ERROR;

  const containerClasses = `flex items-start gap-3 my-4 px-4`;
  const messageBoxClasses = `max-w-3xl w-fit p-4 rounded-2xl`;

  if (isUser) {
    return (
      <div className={`${containerClasses} justify-end`}>
        <div className={`${messageBoxClasses} bg-blue-600`}>
          <p className="text-white whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
        </div>
      </div>
    );
  }

  if (isModel) {
    return (
      <div className={`${containerClasses} justify-start`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <BotIcon />
        </div>
        <div className={`${messageBoxClasses} bg-white shadow-sm`}>
          <MarkdownRenderer content={message.content} />
        </div>
      </div>
    );
  }

   if (isError) {
    return (
        <div className={`${containerClasses} justify-start`}>
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                <BotIcon />
            </div>
            <div className={`${messageBoxClasses} bg-red-50 border border-red-200 text-red-700`}>
                <p>{message.content}</p>
            </div>
        </div>
    );
  }

  return null;
};

export default Message;