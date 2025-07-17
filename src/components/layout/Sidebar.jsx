import React from 'react';
import { NavLink } from 'react-router-dom';
// ... other imports like icons

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        {/* ... your other links ... */}
        <NavLink to="/voters">Voter List</NavLink>
        <NavLink to="/analytics">General Analytics</NavLink>
        {/* Add the new link */}
        <NavLink to="/business-analysis">Business Analysis</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
