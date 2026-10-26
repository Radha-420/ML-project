import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, Maximize } from 'lucide-react';

const Navbar = ({ isDark, toggleTheme }) => {
  const location = useLocation();
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/predict': return 'Predict Attrition';
      case '/history': return 'Prediction History';
      case '/model': return 'Model Performance';
      case '/about': return 'About';
      default: return '';
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="navbar">
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{getPageTitle()}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          ML Model <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-low)' }}></div>
        </div>
        <button onClick={handleFullscreen} className="nav-btn" title="Toggle Fullscreen">
          <Maximize size={20} />
        </button>
        <button onClick={toggleTheme} className="nav-btn" title="Toggle Theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="nav-btn" title="Notifications">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
