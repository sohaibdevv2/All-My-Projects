// frontend/src/App.jsx (Using Plain CSS Class Names)
import React, { useState } from 'react';
import axios from 'axios';
// This component assumes you have imported the CSS file in main.jsx/index.js

function AIChatApp() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('Hello! Ask me an AI-powered question.');
  const [loading, setLoading] = useState(false);
  const DJANGO_API_URL = 'http://127.0.0.1:8000/api/ask/'; 

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('AI is thinking...'); 
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const result = await axios.post(DJANGO_API_URL, { prompt: currentPrompt });
      setResponse(result.data.response); 
    } catch (error) {
      console.error("API Call Failed:", error);
      setResponse('Error: Could not connect to the AI service. Check the Django server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Applied the main container class
    <div className="chat-container"> 
      <h1 style={{ textAlign: 'center', marginBottom: '15px', color: '#343a40' }}>
        💬 AI Chat Application
      </h1>

      {/* --- AI Response Display Area --- */}
      <div className="chat-response">
        <strong>AI Response:</strong> 
        <p>{response}</p>
      </div>

      {/* --- User Input Area --- */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message here..."
        rows="4"
        className="chat-input"
      />
      
      <button 
        onClick={handleSend} 
        disabled={loading || !prompt.trim()}
        className="chat-button"
        style={{ backgroundColor: (loading || !prompt.trim()) ? '#808080' : '#28a745' }}
      >
        {loading ? 'Sending...' : 'Ask AI'}
      </button>
      
      {loading && <p style={{ textAlign: 'center', marginTop: '10px', color: '#007bff' }}>Processing request...</p>}
    </div>
  );
}

export default AIChatApp;