import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"; // 🔥 Use environment variable

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [wavePosition, setWavePosition] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [showResultsPrompt, setShowResultsPrompt] = useState(false);

  // Animation for the wave background
  useEffect(() => {
    const waveAnimation = setInterval(() => {
      setWavePosition(prev => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(waveAnimation);
  }, []);

  // Fetch conversation count when component loads
  useEffect(() => {
    const fetchConversationCount = async () => {
      if (!user?.username) return;
      try {
        const response = await axios.get(`${API_URL}/analytics/${user.username}`);
        const data = response.data;
        setConversationCount(data.conversationCount || 0);
        setShowResultsPrompt(data.hasEnoughData);
      } catch (error) {
        console.log('Analytics not available yet');
      }
    };
    fetchConversationCount();
  }, [user]);

  const handleSend = async () => {
    if (message.trim()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/send-message`, { message, username: user?.username });

        const { result, stressAnalysis } = response.data;

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, isUser: true },
          { text: result, isUser: false },
        ]);

        setStressLevel(stressAnalysis?.stressLevel || 0);
        setSuggestion(stressAnalysis?.suggestion || "");

        // Update conversation count
        setConversationCount(prev => prev + 1);
        
        // Check if user now has enough conversations for results
        if (conversationCount + 1 >= 3) {
          setShowResultsPrompt(true);
        }

        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, isUser: true },
          { text: "Failed to send message.", isUser: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStressColor = (level) => {
    const colors = [
      { min: 90, color: "#8B0000" }, // Dark Red
      { min: 80, color: "#FF0000" }, // Red
      { min: 70, color: "#FF4500" }, // Orange-Red
      { min: 60, color: "#FF8C00" }, // Orange
      { min: 50, color: "#FFD700" }, // Gold
      { min: 40, color: "#FFFF00" }, // Yellow
      { min: 30, color: "#ADFF2F" }, // Green-Yellow
      { min: 20, color: "#32CD32" }, // Lime Green
      { min: 10, color: "#008000" }, // Green
      { min: 0, color: "#006400" }   // Dark Green
    ];
    return colors.find(c => level >= c.min).color;
  };

  return (
    <div className="chat-container">
      {/* Improved Wave Background */}
      <div className="wave-background">
        <div className="wave wave1" style={{ backgroundPositionX: `${wavePosition * 2}px` }}></div>
        <div className="wave wave2" style={{ backgroundPositionX: `${-wavePosition * 1.5}px` }}></div>
        <div className="wave wave3" style={{ backgroundPositionX: `${wavePosition}px` }}></div>
      </div>

      <div className="content-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}>
              <div className="message-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && <div className="message ai-message">
            <div className="message-bubble loading">
              <div className="dot-typing"></div>
            </div>
          </div>}
        </div>

        {/* Conversation Counter */}
        <div className="conversation-counter">
          <div className="counter-content">
            <span className="counter-text">Conversations: {conversationCount}</span>
            <div className="progress-dots">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`progress-dot ${i < conversationCount ? 'active' : ''}`}
                />
              ))}
            </div>
            {conversationCount < 3 && (
              <span className="progress-text">
                {3 - conversationCount} more for insights
              </span>
            )}
          </div>
        </div>

        {/* Results Available Prompt */}
        {showResultsPrompt && (
          <div className="results-prompt">
            <div className="results-content">
              <span className="results-icon">🎉</span>
              <span className="results-text">Your wellness insights are ready!</span>
              <button 
                className="results-button"
                onClick={() => window.location.href = '/results'}
              >
                View Results
              </button>
            </div>
          </div>
        )}

        <div className="stress-container">
          <div className="stress-label">Stress Level: {stressLevel} / 100</div>
          <div className="stress-bar-container">
            <div 
              className="stress-bar-fill" 
              style={{ 
                width: `${stressLevel}%`, 
                backgroundColor: getStressColor(stressLevel) 
              }}
            >
              <div className="stress-bar-pulse" style={{ backgroundColor: getStressColor(stressLevel) }}></div>
            </div>
          </div>
        </div>

        {suggestion && <div className="suggestion-container">{suggestion}</div>}

        <div className="input-container">
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSend()} 
            placeholder="Type a message..." 
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          font-family: Arial, sans-serif;
          background-color: #fff;
        }

        /* Improved Wave Animation Styles */
        .wave-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #fff 0%, #f8f9fa 100%);
          overflow: hidden;
          z-index: 0;
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          background-repeat: repeat-x;
          background-position: 0 bottom;
          z-index: 1;
        }

        .wave1 {
          height: 120px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath fill='rgba(65, 105, 225, 0.15)' d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          opacity: 0.7;
          z-index: 3;
          animation: wave-move 18s linear infinite;
        }

        .wave2 {
          height: 180px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath fill='rgba(30, 64, 175, 0.2)' d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          opacity: 0.6;
          z-index: 2;
          animation: wave-move 15s linear infinite reverse;
        }

        .wave3 {
          height: 250px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath fill='rgba(30, 58, 138, 0.25)' d='M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z' class='shape-fill'%3E%3C/path%3E%3C/svg%3E");
          opacity: 0.5;
          z-index: 1;
          animation: wave-move 20s linear infinite;
        }

        @keyframes wave-move {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Content Styles */
        .content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          margin: 20px;
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          padding: 20px;
        }

        .messages-container {
          height: 400px;
          overflow-y: auto;
          padding: 15px;
          border-radius: 15px;
          background-color: rgba(249, 249, 249, 0.8);
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
          margin-bottom: 15px;
        }

        .message {
          margin-bottom: 15px;
          display: flex;
          animation: fadeIn 0.3s ease-in-out;
        }

        .user-message {
          justify-content: flex-end;
        }

        .ai-message {
          justify-content: flex-start;
        }

        .message-bubble {
          padding: 10px 15px;
          border-radius: 18px;
          max-width: 70%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .user-message .message-bubble {
          background-color: #007bff;
          color: #fff;
          border-bottom-right-radius: 5px;
        }

        .ai-message .message-bubble {
          background-color: #ffffff;
          color: #333;
          border-bottom-left-radius: 5px;
        }

        .message-bubble p {
          margin: 0;
        }

        /* Loading animation */
        .loading {
          padding: 15px;
        }

        .dot-typing {
          position: relative;
          left: -9999px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #007bff;
          color: #007bff;
          box-shadow: 9984px 0 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px 0 0 0 #007bff;
          animation: dotTyping 1.5s infinite linear;
        }

        @keyframes dotTyping {
          0% {
            box-shadow: 9984px 0 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px 0 0 0 #007bff;
          }
          16.667% {
            box-shadow: 9984px -10px 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px 0 0 0 #007bff;
          }
          33.333% {
            box-shadow: 9984px 0 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px 0 0 0 #007bff;
          }
          50% {
            box-shadow: 9984px 0 0 0 #007bff, 9999px -10px 0 0 #007bff, 10014px 0 0 0 #007bff;
          }
          66.667% {
            box-shadow: 9984px 0 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px 0 0 0 #007bff;
          }
          83.333% {
            box-shadow: 9984px 0 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px -10px 0 0 #007bff;
          }
          100% {
            box-shadow: 9984px 0 0 0 #007bff, 9999px 0 0 0 #007bff, 10014px 0 0 0 #007bff;
          }
        }

        /* Enhanced Stress Level Bar */
        .stress-container {
          margin-bottom: 15px;
        }

        .stress-label {
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 5px;
          color: #333;
        }

        .stress-bar-container {
          width: 100%;
          height: 15px;
          background-color: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .stress-bar-fill {
          height: 100%;
          border-radius: 10px;
          position: relative;
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          background-image: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.2) 20%, 
            rgba(255, 255, 255, 0.1) 40%, 
            rgba(255, 255, 255, 0.2) 60%, 
            rgba(255, 255, 255, 0.1) 80%, 
            rgba(255, 255, 255, 0.2) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }

        .stress-bar-pulse {
          position: absolute;
          top: 0;
          right: 0;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          filter: blur(5px);
          animation: pulse 2s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }

        .suggestion-container {
          padding: 15px;
          border-radius: 12px;
          background-color: rgba(240, 240, 240, 0.8);
          font-style: italic;
          font-size: 14px;
          margin-bottom: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.5s ease-in-out;
        }

        .input-container {
          display: flex;
          gap: 10px;
        }

        .input-container input {
          flex: 1;
          padding: 12px 15px;
          border-radius: 25px;
          border: 1px solid #e0e0e0;
          font-size: 16px;
          outline: none;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .input-container input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .input-container button {
          padding: 12px 24px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .input-container button:hover {
          background-color: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Make the scrollbar more aesthetic */
        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #007bff;
        }

        /* Conversation Counter Styles */
        .conversation-counter {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 12px 20px;
          margin-bottom: 15px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
        }

        .counter-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .counter-text {
          font-weight: 600;
          font-size: 14px;
        }

        .progress-dots {
          display: flex;
          gap: 6px;
          margin: 0 15px;
        }

        .progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background-color: #fff;
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.4);
        }

        .progress-text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Results Prompt Styles */
        .results-prompt {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          border-radius: 15px;
          padding: 15px 20px;
          margin-bottom: 15px;
          box-shadow: 0 4px 15px rgba(17, 153, 142, 0.25);
          animation: pulse-success 2s infinite;
        }

        .results-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .results-icon {
          font-size: 20px;
          margin-right: 10px;
        }

        .results-text {
          flex: 1;
          font-weight: 600;
          font-size: 14px;
        }

        .results-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .results-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
        }

        @keyframes pulse-success {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .content-container {
            margin: 10px;
            padding: 15px;
          }

          .messages-container {
            height: 350px;
          }

          .input-container button {
            padding: 12px 20px;
          }

          .counter-content, .results-content {
            flex-direction: column;
            gap: 8px;
          }

          .progress-dots {
            margin: 8px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
