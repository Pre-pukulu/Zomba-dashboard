import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const COLORS = ['#1a365d','#276749','#744210','#822727','#553c9a','#2c7a7b','#702459'];

export default function PopulationCharts() {
  const [population, setPopulation] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/population`).then(r => setPopulation(r.data));
  }, []);

  // Population per ward
  const popData = [...population]
    .sort((a, b) => b.population - a.population)
    .map(w => ({ name: w.ward, population: w.population }));

  // Age group breakdown (totals across all wards)
  const totalUnder5     = population.reduce((s, w) => s + w.under5, 0);
  const totalSchoolAge  = population.reduce((s, w) => s + w.school_age, 0);
  const totalAdults     = population.reduce((s, w) => s + w.adults, 0);
  const ageData = [
    { name: 'Under 5',    value: totalUnder5 },
    { name: 'School age', value: totalSchoolAge },
    { name: 'Adults',     value: totalAdults },
  ];

  // Population density
  const densityData = [...population]
    .map(w => ({ name: w.ward, density: Math.round(w.population / w.area_km2) }))
    .sort((a, b) => b.density - a.density);

  // Stacked age breakdown per ward
  const stackedData = population.map(w => ({
    name: w.ward,
    'Under 5':    w.under5,
    'School age': w.school_age,
    'Adults':     w.adults,
  }));

  return (
    <div className="charts-page">
      <h2 className="section-title">Population Overview — Zomba District</h2>

      <div className="charts-grid">

        {/* Population per ward */}
        <div className="chart-card wide">
          <h3>Population by ward</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={popData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v.toLocaleString()} />
              <Tooltip formatter={v => [v.toLocaleString(), 'Population']} />
              <Bar dataKey="population" name="Population" radius={[4,4,0,0]}>
                {popData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age groups pie */}
        <div className="chart-card">
          <h3>Age group distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ageData} cx="50%" cy="50%" outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {ageData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Population density */}
        <div className="chart-card">
          <h3>Population density (people/km²)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={densityData} layout="vertical"
              margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [`${v} /km²`, 'Density']} />
              <Bar dataKey="density" name="Density" fill="#553c9a" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked age per ward */}
        <div className="chart-card wide">
          <h3>Age group breakdown by ward</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stackedData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v.toLocaleString()} />
              <Tooltip formatter={v => v.toLocaleString()} />
              <Legend />
              <Bar dataKey="Under 5"    stackId="a" fill="#c53030" />
              <Bar dataKey="School age" stackId="a" fill="#2b6cb0" />
              <Bar dataKey="Adults"     stackId="a" fill="#276749" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}