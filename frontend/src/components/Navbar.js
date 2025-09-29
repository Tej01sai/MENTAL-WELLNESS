import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine, FaList, FaComments, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const profileLabel = user?.username ? user.username : 'Profile';

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/analyze', label: 'Analyze', icon: <FaChartLine /> },
    { path: '/results', label: 'Results', icon: <FaList /> },
    { path: '/chat', label: 'Chat', icon: <FaComments /> },
    { path: '/profile', label: profileLabel, icon: <FaUser /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Mental Wellness AI
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; }
        .navbar { background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%); height: 70px; display: flex; justify-content: center; align-items: center; position: sticky; top: 0; z-index: 999; box-shadow: 0 2px 10px rgba(0,0,0,0.15); margin: 0; padding: 0; }
        .navbar-container { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 1200px; padding: 0 24px; height: 100%; }
        .navbar-logo { color: #fff; text-decoration: none; font-size: 1.5rem; font-weight: bold; letter-spacing: 1px; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .navbar-logo:hover { color: #ffdd57; text-shadow: 0 0 10px rgba(255,221,87,0.5); transform: scale(1.05); }
        .nav-menu { display: flex; align-items: center; list-style: none; margin: 0; padding: 0; }
        .nav-item { height: 70px; position: relative; display: flex; align-items: center; }
        .nav-link { display: flex; align-items: center; text-decoration: none; color: #fff; height: 100%; padding: 0 20px; transition: all 0.3s ease; }
        .nav-link:hover { color: #ffdd57; background-color: rgba(255,255,255,0.1); transform: translateY(-3px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .nav-link.active { color: #ffdd57; font-weight: bold; position: relative; }
        .nav-link.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background-color: #ffdd57; animation: slideIn 0.3s ease-in-out; }
        @keyframes slideIn { from { width: 0; opacity: 0; } to { width: 100%; opacity: 1; } }
        .nav-icon { margin-right: 8px; font-size: 1.2rem; transition: transform 0.3s ease; }
        .nav-link:hover .nav-icon { transform: rotate(10deg) scale(1.2); }
        .menu-icon { display: none; color: #fff; font-size: 1.8rem; cursor: pointer; transition: all 0.3s ease; }
        .menu-icon:hover { color: #ffdd57; transform: rotate(180deg); }
        @media screen and (max-width: 768px) {
          .menu-icon { display: block; }
          .nav-menu { display: flex; flex-direction: column; width: 100%; height: calc(100vh - 70px); position: absolute; top: 70px; left: -100%; opacity: 0; transition: all 0.5s ease; background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%); }
          .nav-menu.active { left: 0; opacity: 1; transition: all 0.5s ease; z-index: 1; }
          .nav-item { height: 60px; width: 100%; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.2); animation: fadeIn 0.5s ease forwards; opacity: 0; }
          .nav-menu.active .nav-item:nth-child(1) { animation-delay: 0.1s; }
          .nav-menu.active .nav-item:nth-child(2) { animation-delay: 0.2s; }
          .nav-menu.active .nav-item:nth-child(3) { animation-delay: 0.3s; }
          .nav-menu.active .nav-item:nth-child(4) { animation-delay: 0.4s; }
          .nav-menu.active .nav-item:nth-child(5) { animation-delay: 0.5s; }
          .nav-link { width: 100%; display: flex; justify-content: center; padding: 20px; }
          .nav-link.active::after { display: none; }
          .nav-link.active { background-color: rgba(255,255,255,0.1); border-left: 4px solid #ffdd57; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
