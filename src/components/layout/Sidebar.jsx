import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        ElectoBase 
      </div>
      <ul className="nav-links">
        <li><NavLink to="/" end>📊 Dashboard</NavLink></li>
        <li><NavLink to="/voters">👥 Voter Search</NavLink></li>
        <li><NavLink to="/analytics">📈 Analytics</NavLink></li>
      </ul>
    </nav>
  );
};

export default Sidebar;