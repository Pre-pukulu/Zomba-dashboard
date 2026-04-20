import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function SummaryCards() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/summary`)
      .then(r => setSummary(r.data))
      .catch(console.error);
  }, []);

  if (!summary) return null;

  const cards = [
    { label: 'Total Population',   value: summary.total_population.toLocaleString(),        icon: '👨‍👩‍👧‍👦', color: '#1a365d' },
    { label: 'Total Wards',        value: summary.total_wards,                               icon: '🏘️',  color: '#276749' },
    { label: 'Schools',            value: summary.total_schools,                             icon: '🎓', color: '#744210' },
    { label: 'Health Facilities',  value: summary.total_health_facilities,                   icon: '🏥', color: '#822727' },
    { label: 'Total Student Enrollment',   value: summary.total_enrollment.toLocaleString(),         icon: '📖', color: '#553c9a' },
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.label} className="card" style={{ borderTop: `4px solid ${card.color}` }}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-value" style={{ color: card.color }}>{card.value}</div>
          <div className="card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}