import React, { useState } from 'react';
import './App.css';
import MapView from './MapView';
import SummaryCards from './SummaryCard';
import EducationCharts from './EducationCharts';
import HealthCharts from './HealthCharts';
import PopulationCharts from './PopulationCharts';
import WardExplorer from './WardExplorer';
import AboutPage from './AboutPage';

const OverviewIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 12L16 8" />
    <path d="M12 12L8 16" />
    <path d="M12 3A9 9 0 0 1 21 12" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map',        label: ' Overview' },
    { id: 'education',  label: '🎓 Education' },
    { id: 'health',     label: '🏥 Health' },
    { id: 'population', label: '👨‍👩‍👧‍👦 Population' },
    { id: 'wards',      label: '🏘️ Ward Explorer' },
    { id: 'about',      label: 'ℹ️ About' }

  ];

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Zomba District Intelligence Dashboard</h1>
          <p>Integrated data platform for evidence-based district planning · Zomba, Malawi</p>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
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
        </aside>

        <main className="content-area">
          {activeTab === 'map' && <SummaryCards />}

          <div className="content">
            {activeTab === 'map' && <MapView />}
            {activeTab === 'education'  && <EducationCharts />}
            {activeTab === 'health'     && <HealthCharts />}
            {activeTab === 'population' && <PopulationCharts />}
            {activeTab === 'wards'      && <WardExplorer />}
            {activeTab === 'about'      && <AboutPage />}
          </div>
        </main>
      </div>

      <footer className="footer">
        <p>Zomba District Council · Data: WorldPop, District Departments · Built with React & Flask</p>
      </footer>
    </div>
  );
}

export default App;