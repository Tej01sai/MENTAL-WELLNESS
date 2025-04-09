import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VoiceApp from '../components/VoiceApp';
import { FaArrowRight, FaComments, FaMicrophone } from 'react-icons/fa';

const Home = () => {
  const [showVoiceAnalysis, setShowVoiceAnalysis] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Mental Health Analysis",
      description: "Get AI-powered insights about your mental wellness based on your responses.",
      icon: "📊"
    },
    {
      title: "Voice Recognition",
      description: "Analyze stress levels through voice patterns using advanced AI algorithms.",
      icon: "🔊"
    },
    {
      title: "Personalized Recommendations",
      description: "Receive customized advice based on your unique mental health profile.",
      icon: "🧠"
    },
    {
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties.",
      icon: "🔒"
    }
  ];

  return (
    <div className={`home-container ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your Mental Wellness Journey Starts Here</h1>
          <p>Advanced AI technology to help understand, monitor, and improve your mental health</p>
          
          <div className="hero-buttons">
            <Link to="/analyze" className="btn btn-primary">
              Start Analysis <FaArrowRight className="btn-icon" />
            </Link>
            <Link to="/chat" className="btn btn-secondary">
              Talk to AI <FaComments className="btn-icon" />
            </Link>
          </div>
        </div>
        
        <div className="hero-image">
          {/* Animated CodeX Logo instead of placeholder image */}
          <div className="codex-logo">
            <span className="logo-text">C</span>
            <span className="logo-text">o</span>
            <span className="logo-text">d</span>
            <span className="logo-text">e</span>
            <span className="logo-text logo-x">X</span>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Voice Analysis Section */}
      <div className="voice-analysis-section">
        <div className="voice-content">
          <h2>Voice Analysis Technology</h2>
          <p>
            Our advanced AI can detect stress patterns in your voice to provide 
            real-time feedback about your emotional state.
          </p>
          <button 
            onClick={() => setShowVoiceAnalysis(prev => !prev)} 
            className="btn btn-voice"
          >
            {showVoiceAnalysis ? 'Hide Voice Analysis' : 'Try Voice Analysis'} <FaMicrophone className="btn-icon" />
          </button>
        </div>
        
        {/* Conditionally Render VoiceApp */}
        <div className={`voice-app-container ${showVoiceAnalysis ? 'show' : ''}`}>
          {showVoiceAnalysis && <VoiceApp />}
        </div>
      </div>

      <style jsx>{`
        .home-container {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          padding: 0;
          margin: 0;
          overflow-x: hidden;
        }
        
        .home-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hero Section */
        .hero-section {
          display: flex;
          padding: 60px 5%;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf0 100%);
          min-height: 500px;
          align-items: center;
          justify-content: space-between;
        }
        
        .hero-content {
          flex: 1;
          max-width: 600px;
          animation: fadeInLeft 1s ease forwards;
        }
        
        .hero-content h1 {
          font-size: 2.8rem;
          color: #333;
          margin-bottom: 20px;
          line-height: 1.2;
          background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-content p {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        
        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeInRight 1s ease forwards;
        }
        
        /* CodeX Logo Animation */
        .codex-logo {
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(45deg, #4776e6, #8e54e9);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          padding: 40px;
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 400px;
          height: 300px;
        }
        
        .codex-logo:after {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
        }
        
        .logo-text {
          font-size: 5rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          margin: 0 -2px;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          animation: popIn 0.5s ease forwards;
        }
        
        .logo-text:nth-child(1) { animation-delay: 0.1s; }
        .logo-text:nth-child(2) { animation-delay: 0.2s; }
        .logo-text:nth-child(3) { animation-delay: 0.3s; }
        .logo-text:nth-child(4) { animation-delay: 0.4s; }
        .logo-text:nth-child(5) { 
          animation-delay: 0.6s;
          color: #FFD700;
          font-size: 5.5rem;
          transform-origin: center;
          animation: popInX 0.8s ease forwards;
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          70% {
            opacity: 1;
            transform: translateY(-5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes popInX {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8) rotate(0deg);
          }
          60% {
            opacity: 1;
            transform: translateY(-10px) scale(1.2) rotate(10deg);
          }
          80% {
            transform: translateY(-5px) scale(1.1) rotate(-5deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1.1) rotate(0deg);
          }
        }

        /* Buttons */
        .hero-buttons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 25px;
          border-radius: 50px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .btn-icon {
          margin-left: 8px;
          transition: transform 0.3s ease;
        }
        
        .btn:hover .btn-icon {
          transform: translateX(5px);
        }
        
        .btn-primary {
          background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 14px rgba(71, 118, 230, 0.3);
        }
        
        .btn-secondary {
          background: white;
          color: #4776e6;
          border: 2px solid #4776e6;
        }
        
        .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1);
        }
        
        .btn-voice {
          background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%);
          color: white;
          margin-top: 20px;
        }
        
        .btn-voice:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 14px rgba(255, 126, 95, 0.3);
        }

        /* Features Section */
        .features-section {
          padding: 60px 5%;
          background-color: white;
          text-align: center;
        }
        
        .features-section h2 {
          font-size: 2.2rem;
          margin-bottom: 40px;
          color: #333;
          position: relative;
          display: inline-block;
        }
        
        .features-section h2:after {
          content: "";
          position: absolute;
          width: 50%;
          height: 3px;
          background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
          bottom: -10px;
          left: 25%;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.5s ease forwards;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        
        .feature-card h3 {
          margin-bottom: 15px;
          color: #4776e6;
        }
        
        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        /* Voice Analysis Section */
        .voice-analysis-section {
          padding: 60px 5%;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .voice-content {
          max-width: 700px;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .voice-content h2 {
          font-size: 2.2rem;
          margin-bottom: 20px;
          color: #333;
        }
        
        .voice-content p {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .voice-app-container {
          width: 100%;
          max-width: 800px;
          opacity: 0;
          height: 0;
          overflow: hidden;
          transition: opacity 0.5s ease, height 0.5s ease;
        }
        
        .voice-app-container.show {
          opacity: 1;
          height: auto;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) rotate(45deg);
          }
          100% {
            transform: translateX(150%) rotate(45deg);
          }
        }

        /* Responsive design */
        @media screen and (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            padding: 40px 5%;
          }
          
          .hero-content {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .hero-content h1 {
            font-size: 2.2rem;
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .logo-text {
            font-size: 4rem;
          }
          
          .logo-text:nth-child(5) {
            font-size: 4.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;