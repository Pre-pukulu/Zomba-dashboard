import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function WardExplorer() {
  const [wards, setWards]       = useState([]);
  const [selected, setSelected] = useState('');
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/wards`).then(r => setWards(r.data));
  }, []);

  function loadWard(ward) {
    setSelected(ward);
    setLoading(true);
    axios.get(`${API}/api/ward/${encodeURIComponent(ward)}`)
      .then(r => { setData(r.data); setLoading(false); });
  }

  return (
    <div className="ward-explorer">
      <h2 className="section-title">Ward Explorer</h2>
      <p className="ward-intro">Select a ward to see a detailed breakdown of its services and population.</p>

      <div className="ward-buttons">
        {wards.map(ward => (
          <button
            key={ward}
            onClick={() => loadWard(ward)}
            className={`ward-btn ${selected === ward ? 'active' : ''}`}
          >
            {ward}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading"><div className="spinner" /><p>Loading ward data...</p></div>
      )}

      {data && !loading && (
        <div className="ward-detail">
          <h3>📍 {data.ward} Ward</h3>

          {/* Population */}
          {data.population && (
            <div className="ward-section">
              <h4>👥 Population</h4>
              <div className="ward-stats">
                <div className="ward-stat">
                  <span className="stat-value">{data.population.population?.toLocaleString()}</span>
                  <span className="stat-label">Total population</span>
                </div>
                <div className="ward-stat">
                  <span className="stat-value">{data.population.households?.toLocaleString()}</span>
                  <span className="stat-label">Households</span>
                </div>
                <div className="ward-stat">
                  <span className="stat-value">{data.population.school_age?.toLocaleString()}</span>
                  <span className="stat-label">School-age children</span>
                </div>
                <div className="ward-stat">
                  <span className="stat-value">{Math.round(data.population.population / data.population.area_km2)}</span>
                  <span className="stat-label">People per km²</span>
                </div>
              </div>
            </div>
          )}

          {/* Schools */}
          {data.schools?.length > 0 && (
            <div className="ward-section">
              <h4>🏫 Schools ({data.schools.length})</h4>
              <table className="ward-table">
                <thead>
                  <tr>
                    <th>School</th><th>Type</th><th>Enrollment</th><th>Teachers</th><th>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {data.schools.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td><span className={`badge-type ${s.type.toLowerCase()}`}>{s.type}</span></td>
                      <td>{s.enrollment.toLocaleString()}</td>
                      <td>{s.teachers}</td>
                      <td>
                        <span className={Math.round(s.enrollment/s.teachers) > 45 ? 'ratio-bad' : 'ratio-ok'}>
                          {Math.round(s.enrollment/s.teachers)}:1
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.schools?.length === 0 && (
            <div className="ward-section">
              <h4>🏫 Schools</h4>
              <p className="no-data">⚠️ No schools recorded for this ward — may require attention.</p>
            </div>
          )}

          {/* Health */}
          <div className="ward-section">
            <h4>🏥 Health Facility</h4>
            {data.health_facility?.name ? (
              <div className="ward-stats">
                <div className="ward-stat">
                  <span className="stat-value">{data.health_facility.name}</span>
                  <span className="stat-label">{data.health_facility.type}</span>
                </div>
                <div className="ward-stat">
                  <span className="stat-value">{data.health_facility.beds}</span>
                  <span className="stat-label">Beds</span>
                </div>
                <div className="ward-stat">
                  <span className="stat-value">{data.health_facility.monthly_visits?.toLocaleString()}</span>
                  <span className="stat-label">Monthly visits</span>
                </div>
              </div>
            ) : (
              <p className="no-data">⚠️ No health facility recorded for this ward — may require attention.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}