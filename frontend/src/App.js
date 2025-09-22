// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthContext } from './AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Analyze from './pages/Analysis';
import Results from './pages/Results';
import Chat from './components/Chat';
import Profile from './pages/Profile';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />

        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<Results />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
