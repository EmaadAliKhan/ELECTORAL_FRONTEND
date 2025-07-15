import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import VoterList from './pages/VoterList';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import './assets/css/App.css';

//  hlavní App component with layout and routing
const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/voters" element={<VoterList />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;