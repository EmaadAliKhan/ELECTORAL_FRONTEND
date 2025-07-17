import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/Sidebar.css';
// ... other imports like icons

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
              ElectoBase 
            </div>
            <ul className="nav-links">
              <li><NavLink to="/" end>📊 Dashboard</NavLink></li>
              <li><NavLink to="/voters">👥 Population Search</NavLink></li>
              <li><NavLink to="/analytics">📈 Analytics</NavLink></li>
              <li><NavLink to="/business-analysis">Business Analysis</NavLink></li>
            </ul>

    </aside>
  );
};

export default Sidebar;
