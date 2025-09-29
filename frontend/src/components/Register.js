import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://mental-wellness-production.up.railway.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email.split('@')[0], // Use email prefix as username
          email: email,
          password: password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Auto-login after successful registration
        login({ 
          email: data.user.email, 
          username: data.user.username, 
          phone: data.user.phone 
        });
        navigate("/home");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate Google OAuth response (in real app, this would come from Google)
      const mockGoogleUser = {
        email: "newuser@gmail.com",
        username: "NewGoogleUser"
      };
      
      const response = await fetch('https://mental-wellness-production.up.railway.app/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockGoogleUser),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login({ 
          email: data.email, 
          username: data.username, 
          phone: data.phone,
          provider: data.provider 
        });
        navigate("/home");
      } else {
        throw new Error(data.message || "Google signup failed");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError(err.message || "Google signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="floating-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="floating-circle circle-4"></div>
          <div className="floating-circle circle-5"></div>
        </div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-icon">🌟</div>
            <h1 className="logo-text">Join Mental Wellness AI</h1>
          </div>
          <p className="welcome-text">Start your journey to better mental health and wellness today.</p>
        </div>

        <div className="register-form-container">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="google-signup-btn"
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? "Creating account..." : "Sign up with Google"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-input"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="register-btn"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="signin-link">Sign in here</Link></p>
            <p className="terms-text">By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .register-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .floating-elements {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 8s ease-in-out infinite;
        }

        .circle-1 {
          width: 100px;
          height: 100px;
          top: 15%;
          left: 15%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 80px;
          height: 80px;
          top: 70%;
          right: 15%;
          animation-delay: 1.5s;
        }

        .circle-3 {
          width: 60px;
          height: 60px;
          top: 85%;
          left: 25%;
          animation-delay: 3s;
        }

        .circle-4 {
          width: 120px;
          height: 120px;
          top: 5%;
          right: 25%;
          animation-delay: 0.8s;
        }

        .circle-5 {
          width: 70px;
          height: 70px;
          top: 40%;
          left: 5%;
          animation-delay: 2.2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-25px) rotate(90deg); }
          50% { transform: translateY(15px) rotate(180deg); }
          75% { transform: translateY(-10px) rotate(270deg); }
        }

        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 100%;
          max-width: 480px;
          margin: 2rem;
          animation: slideUp 0.6s ease-out;
          position: relative;
          z-index: 10;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .logo-icon {
          font-size: 3rem;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .logo-text {
          font-size: 1.7rem;
          font-weight: bold;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .welcome-text {
          color: #666;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }

        .error-message {
          background: #ffe6e6;
          color: #d63031;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #fdb2b2;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .google-signup-btn {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          color: #333;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .google-signup-btn:hover {
          border-color: #4285F4;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(66, 133, 244, 0.2);
        }

        .google-signup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .google-icon {
          flex-shrink: 0;
        }

        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e0e0e0;
        }

        .divider span {
          background: white;
          padding: 0 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #f093fb;
          box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
        }

        .form-input:disabled {
          background: #f5f5f5;
          opacity: 0.7;
        }

        .register-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
        }

        .register-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
        }

        .register-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .register-footer {
          text-align: center;
          margin-top: 2rem;
        }

        .register-footer p {
          margin: 0.5rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .signin-link {
          color: #f093fb;
          text-decoration: none;
          font-weight: 600;
        }

        .signin-link:hover {
          text-decoration: underline;
        }

        .terms-text {
          color: #999;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .register-card {
            margin: 1rem;
            padding: 2rem;
          }
          
          .logo-text {
            font-size: 1.4rem;
          }
          
          .welcome-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;