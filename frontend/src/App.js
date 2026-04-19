import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🗺 Zomba District Intelligence Dashboard</h1>
          <p>Integrated data platform for evidence-based district planning</p>
        </div>
      </header>

      <nav className="tabs">
        {['map', 'education', 'health', 'population'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="content">
        <div className="panel">
          {activeTab === 'map'        && <h2>🗺 Map View — coming in Phase 3</h2>}
          {activeTab === 'education'  && <h2>🏫 Education — coming in Phase 4</h2>}
          {activeTab === 'health'     && <h2>🏥 Health — coming in Phase 4</h2>}
          {activeTab === 'population' && <h2>👥 Population — coming in Phase 4</h2>}
        </div>
      </main>
    </div>
  );
}

export default App;