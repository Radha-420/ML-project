import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Brain, PieChart, History, ChartNoAxesCombined, Database, Info } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/employees', name: 'Employees', icon: <Users size={18} /> },
    { path: '/predict', name: 'Predict Attrition', icon: <Brain size={18} /> },
    { path: '/analytics', name: 'Analytics', icon: <PieChart size={18} /> },
    { path: '/model', name: 'Model Performance', icon: <ChartNoAxesCombined size={18} /> },
    { path: '/history', name: 'Prediction History', icon: <History size={18} /> },
    { path: '/dataset', name: 'Dataset Management', icon: <Database size={18} /> },
    { path: '/about', name: 'About', icon: <Info size={18} /> }
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', margin: 0, fontSize: '18px', letterSpacing: '0.5px' }}>
          <span style={{ color: 'var(--accent-primary)' }}>◈</span> ATTRISENSE
        </h2>
        <small style={{ color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 500, fontSize: '10px' }}>Workforce Intelligence</small>
      </div>

      <nav style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>ML SYSTEM</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--risk-low)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-low)' }}></div>
          Online
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
