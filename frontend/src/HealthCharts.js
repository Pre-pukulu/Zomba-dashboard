import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const COLORS = ['#822727','#c53030','#fc8181','#feb2b2','#276749','#48bb78'];

export default function HealthCharts() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/health-facilities`).then(r => setFacilities(r.data));
  }, []);

  // Monthly visits per facility
  const visitsData = [...facilities]
    .sort((a, b) => b.monthly_visits - a.monthly_visits)
    .map(f => ({ name: f.name.replace(' Health Centre','').replace(' Community','').replace(' Dispensary','').replace(' Health Post',''), visits: f.monthly_visits }));

  // Facility type breakdown
  const typeCount = facilities.reduce((acc, f) => {
    acc[f.type] = (acc[f.type] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

  // Beds per facility
  const bedsData = facilities
    .filter(f => f.beds > 0)
    .sort((a, b) => b.beds - a.beds)
    .map(f => ({ name: f.name.replace(' Community','').replace(' Health Centre',''), beds: f.beds }));

  return (
    <div className="charts-page">
      <h2 className="section-title">Health Facilities Overview — Zomba District</h2>

      <div className="charts-grid">

        {/* Monthly visits */}
        <div className="chart-card wide">
          <h3>Monthly patient visits by facility</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={visitsData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [v.toLocaleString(), 'Monthly visits']} />
              <Bar dataKey="visits" name="Visits" fill="#c53030" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Facility types pie */}
        <div className="chart-card">
          <h3>Facility types</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" outerRadius={80}
                dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {typeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Beds per facility */}
        <div className="chart-card">
          <h3>Beds per facility</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bedsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="beds" name="Beds" fill="#822727" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}