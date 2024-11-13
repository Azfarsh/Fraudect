import React, { useState, useRef, useEffect } from 'react';
import { Shield, Send, Bot, User, AlertCircle, Lock, XCircle } from 'lucide-react';

const FraudDetectionBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Fraud Detection Assistant. I can help analyze suspicious activities and provide security recommendations. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleExit = () => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    const generatedSummary = {
      type_of_fraud: determineTypeOfFraud(userMessages),
      description: userMessages.map(msg => msg.content).join(' ').slice(0, 200) + '...',
      fraudulent: determineFraudulent(assistantMessages)
    };

    setSummary(generatedSummary);
    setShowSummary(true);
  };

  const determineTypeOfFraud = (messages) => {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    if (content.includes('credit card')) return 'Credit Card Fraud';
    if (content.includes('identity')) return 'Identity Theft';
    if (content.includes('phishing')) return 'Phishing';
    if (content.includes('scam')) return 'Scam';
    if (content.includes('hack')) return 'Cyber Attack';
    return 'Other';
  };

  const determineFraudulent = (messages) => {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    const fraudIndicators = [
      'suspicious', 'fraud', 'scam', 'unauthorized', 'fake', 
      'malicious', 'illegal', 'breach', 'compromise'
    ];
    return fraudIndicators.some(indicator => content.includes(indicator)) ? 'Yes' : 'No';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp
      }]);
    } catch (err) {
      console.error('Chat Error:', err);
      setError(err.message || 'Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const spinnerStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTop: '4px solid #3b82f6',
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chatbot Section */}
        <div className="w-full h-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-blue-900">Fraud Detection Assistant</h1>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Secure Channel</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-3 items-start`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[70%] ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800'
                  } p-3 rounded-xl shadow-sm`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-blue-100' 
                      : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div style={spinnerStyle} />
                <span className="text-sm">Processing your request...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {showSummary && summary && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 mt-4">
                <h3 className="font-semibold text-blue-900 mb-2">Case Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Type of Fraud:</span>
                    <span>{summary.type_of_fraud}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Description:</span>
                    <span>{summary.description}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Fraudulent:</span>
                    <span className={summary.fraudulent === 'Yes' ? 'text-red-600' : 'text-green-600'}>
                      {summary.fraudulent}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-white/50 backdrop-blur-sm border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe any suspicious activity..."
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
              <button
                type="button"
                onClick={handleExit}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Exit
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block">
          <img 
            src="/chat.jpeg" 
            alt="Chat illustration"
            className="w-full h-[800px] object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionBot;