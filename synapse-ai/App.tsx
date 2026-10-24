import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, MessageRole } from './types';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import Welcome from './components/Welcome';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (isLoading || !message.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      content: message,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    const history = messages
      .filter(msg => msg.role !== MessageRole.ERROR)
      .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
      }));

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = '';
      const modelMessageId = `model-${Date.now()}`;
      
      setMessages(prev => [
        ...prev,
        { id: modelMessageId, role: MessageRole.MODEL, content: '' },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        modelResponse += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, content: modelResponse + '▌' } : msg
          )
        );
      }
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, content: modelResponse } : msg
        )
      );

    } catch (err: any) {
      console.error(err);
      const errorMessageContent = err.message || 'An error occurred while fetching the response. Please try again.';
      setError(errorMessageContent);
      setMessages(prev => [
        ...prev,
        { id: `error-${Date.now()}`, role: MessageRole.ERROR, content: errorMessageContent },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <Header onNewChat={handleNewChat} />
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <Welcome onSendMessage={handleSendMessage} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="text-xs text-center text-gray-500 mt-2">
            Synapse can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default App;
