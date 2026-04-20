import React from 'react';

export default function AboutPage() {
  const team = [
    { role: 'Developer', name: 'PRECIOUS PUKULU' },
  ];

  const features = [
    { icon: '🗺️', title: 'Interactive Map', desc: 'Visualize schools, health facilities, and population density across Zomba wards using real geographic coordinates.' },
    { icon: '�', title: 'Education Analytics', desc: 'Track school enrollment, teacher ratios, and school distribution to identify areas needing educational resources.' },
    { icon: '⚕️', title: 'Health Facility Coverage', desc: 'Analyse health facility distribution, patient visits, and bed capacity across the district.' },
    { icon: '👨‍👩‍👧‍👦', title: 'Population Intelligence', desc: 'Explore population distribution, age groups, and density powered by WorldPop spatial data.' },
    { icon: '📊', title: 'Evidence-Based Planning', desc: 'All indicators are designed to support district planners in making data-driven resource allocation decisions.' },
    { icon: '🚀', title: 'Modern Architecture', desc: 'Built with React, Flask, SQLite and Docker — portable, reproducible, and easy to deploy anywhere.' },
  ];

  const stack = [
    { name: 'React',      role: 'Frontend dashboard',     color: '#61dafb' },
    { name: 'Flask',      role: 'REST API backend',        color: '#000000' },
    { name: 'SQLite',     role: 'Central data repository', color: '#003b57' },
    { name: 'Leaflet.js', role: 'Interactive maps',        color: '#199900' },
    { name: 'Recharts',   role: 'Data visualizations',     color: '#8884d8' },
    { name: 'Docker',     role: 'Containerization',        color: '#2496ed' },
    { name: 'WorldPop',   role: 'Population data source',  color: '#e53e3e' },
  ];

  return (
    <div className="about-page">

      {/* Hero */}
      <div className="about-hero">
        <h2>District Intelligence Dashboard</h2>
        <p>An integrated data platform for evidence-based planning in Zomba District, Malawi</p>
        <div className="about-badges">
          <span className="badge">Digital Governance</span>
          <span className="badge">Final Year Project</span>
          <span className="badge">University of Malawi</span>
          <span className="badge">Department of Computing</span>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="about-section">
        <h3>The Problem</h3>
        <p>
          Local governments in Malawi struggle with fragmented data spread across multiple
          departments — education, health, social welfare — stored in disconnected spreadsheets
          and systems. This makes it difficult for district planners to answer key questions:
          Which wards need more schools? Where are health facilities understaffed?
          Which communities are most vulnerable?
        </p>
      </div>

      <div className="about-section">
        <h3>Our Solution</h3>
        <p>
          The Zomba District Intelligence Dashboard aggregates data from multiple departmental
          sources into a single integrated platform. Combined with WorldPop population data,
          it gives district planners a unified view of the district — enabling faster,
          fairer, and more evidence-based decisions.
        </p>
      </div>

      {/* Features */}
      <div className="about-section">
        <h3>Key Features</h3>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="about-section">
        <h3>Technology Stack</h3>
        <div className="stack-grid">
          {stack.map(s => (
            <div key={s.name} className="stack-item">
              <span className="stack-dot" style={{ background: s.color }} />
              <div>
                <strong>{s.name}</strong>
                <span>{s.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div className="about-section">
        <h3>Data Sources</h3>
        <ul className="data-sources">
          <li>🌍 <strong>WorldPop</strong> — High-resolution spatial population estimates for Malawi</li>
          <li>🏫 <strong>District Education Office</strong> — School locations, enrollment, teacher data</li>
          <li>🏥 <strong>District Health Office</strong> — Health facility locations and service statistics</li>
          <li>🗺️ <strong>OpenStreetMap</strong> — Base map tiles for geographic context</li>
        </ul>
      </div>

      {/* Team */}
      <div className="about-section">
        <h3>Project Team</h3>
        <div className="team-grid">
          {team.map(m => (
            <div key={m.name} className="team-card">
              <div className="team-avatar">{m.name.charAt(0)}</div>
              <div>
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="supervisor-note">
          Final Year ICT Project · Department of Computing · University of Malawi
        </p>
      </div>

    </div>
  );
}