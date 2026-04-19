import React, { useState } from 'react';
import './App.css';
import MapView from './MapView';
import SummaryCards from './SummaryCard';
import EducationCharts from './EducationCharts';
import HealthCharts from './HealthCharts';
import PopulationCharts from './PopulationCharts';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map',        label: '🗺  Map View' },
    { id: 'education',  label: '🏫 Education' },
    { id: 'health',     label: '🏥 Health' },
    { id: 'population', label: '👥 Population' },
  ];

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Zomba District Intelligence Dashboard</h1>
          <p>Integrated data platform for evidence-based district planning · Zomba, Malawi</p>
        </div>
      </header>

      <SummaryCards />

      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'education'  && <div className="panel"><h2>Education charts — coming in Phase 4</h2></div>}
        {activeTab === 'health'     && <div className="panel"><h2>Health charts — coming in Phase 4</h2></div>}
        {activeTab === 'population' && <div className="panel"><h2>Population data — coming in Phase 4</h2></div>}
      </main>

      <footer className="footer">
        <p>Zomba District Council · Data: WorldPop, District Departments · Built with React & Flask</p>
      </footer>
    </div>
  );
}

export default App;