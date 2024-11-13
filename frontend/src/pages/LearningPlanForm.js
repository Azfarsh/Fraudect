import React, { useState, useRef, useEffect } from 'react';
import { Shield, Send, Bot, User, RefreshCcw, AlertCircle, Lock, AlertTriangle } from 'lucide-react';

const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your Gemini API key
const PROXY_URL = 'http://localhost:3001/fraud-detect'; // Your backend endpoint

const FraudDetectionChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Fraud Detection Assistant. I can help analyze suspicious activities, detect potential fraud patterns, and provide security recommendations. Please describe any suspicious activity you'd like me to analyze."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an advanced fraud detection AI assistant.
                       Analyze user queries for potential fraud patterns,
                       provide detailed security recommendations, and help
                       users understand various types of financial fraud.
                       Be precise, thorough, and always prioritize security.
                       If a serious fraud risk is detected, provide clear
                       steps for immediate action.`
            },
            ...messages,
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const analysisContent = data.analysis || data.message || data.choices?.[0]?.message?.content;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: analysisContent
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setError('Unable to process fraud analysis. Please try again later.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties analyzing your request. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <Shield className="header-icon primary" />
          <h1>AI Fraud Detection Assistant</h1>
        </div>
        <div className="header-security">
          <AlertTriangle className="header-icon warning" />
          <Lock className="header-icon secondary" />
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.role === 'assistant' ? 'assistant' : 'user'}`}
          >
            <div className="avatar">
              {message.role === 'assistant' ? (
                <Bot className="avatar-icon assistant" />
              ) : (
                <User className="avatar-icon user" />
              )}
            </div>
            <div className="message">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="loading">
            <RefreshCcw className="loading-icon" />
            <span>Analyzing suspicious patterns...</span>
          </div>
        )}
        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="security-alert">
        <AlertCircle className="alert-icon" />
        <p>Secure Channel: All communications are encrypted. Never share sensitive financial data or credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Describe any suspicious activity..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          <Send className="send-icon" />
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          width: 100%;
          max-width: 700px;
          height: 600px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(160deg, #f8fafc 0%, #eff6ff 100%);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px 16px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-security {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon {
          width: 24px;
          height: 24px;
        }

        .header-icon.primary {
          color: #2563eb;
        }

        .header-icon.secondary {
          color: #16a34a;
        }

        .header-icon.warning {
          color: #eab308;
        }

        h1 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e40af;
          font-weight: 600;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          max-width: 85%;
        }

        .message-wrapper.user {
          flex-direction: row-reverse;
          margin-left: auto;
        }

        .avatar {
          padding: 8px;
          border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .avatar-icon {
          width: 20px;
          height: 20px;
        }

        .avatar-icon.assistant {
          color: #2563eb;
        }

        .avatar-icon.user {
          color: #16a34a;
        }

        .message {
          padding: 12px 16px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          line-height: 1.5;
          font-size: 0.95rem;
          white-space: pre-wrap;
        }

        .user .message {
          background: #2563eb;
          color: white;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #2563eb;
          font-size: 0.9rem;
        }

        .loading-icon {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          padding: 12px;
          background: #fee2e2;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .error-icon {
          width: 18px;
          height: 18px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .security-alert {
          margin: 0 16px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-icon {
          width: 16px;
          height: 16px;
          color: #16a34a;
        }

        .chat-input {
          display: flex;
          padding: 12px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .chat-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #2563eb;
          ring: 2px solid #2563eb;
        }

        .chat-input button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          margin-left: 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .chat-input button:hover {
          background: #1d4ed8;
        }

        .chat-input button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .send-icon {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  );
};

export default FraudDetectionChatbot;