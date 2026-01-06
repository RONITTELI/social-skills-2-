import React from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">
          SocialAI ⚡
        </div>
        <nav>
          <div className="nav-item active">📊 Dashboard</div>
          <div className="nav-item">🎙️ Practice Mode</div>
          <div className="nav-item">📈 History</div>
          <div className="nav-item">⚙️ Settings</div>
        </nav>
        <div style={{ marginTop: 'auto', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          v2.0.1 Pro
        </div>
      </aside>

      {/* Main Content Area */}
      <Dashboard />
    </div>
  );
}

export default App;