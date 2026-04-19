import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const COLORS = ['#1a365d','#2b6cb0','#63b3ed','#bee3f8','#744210','#d69e2e','#276749','#48bb78'];

export default function EducationCharts() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/schools`).then(r => setSchools(r.data));
  }, []);

  // Enrollment per school
  const enrollmentData = [...schools]
    .sort((a, b) => b.enrollment - a.enrollment)
    .map(s => ({ name: s.name.replace(' School','').replace(' Primary','').replace(' Secondary',''), enrollment: s.enrollment, teachers: s.teachers }));

  // Teacher ratio per school
  const ratioData = schools.map(s => ({
    name: s.name.replace(' School','').replace(' Primary','').replace(' Secondary',''),
    ratio: Math.round(s.enrollment / s.teachers),
  })).sort((a, b) => b.ratio - a.ratio);

  // Primary vs Secondary
  const primary   = schools.filter(s => s.type === 'Primary').length;
  const secondary = schools.filter(s => s.type === 'Secondary').length;
  const typeData  = [
    { name: 'Primary',   value: primary },
    { name: 'Secondary', value: secondary },
  ];

  // Total enrollment primary vs secondary
  const enrollPrimary   = schools.filter(s => s.type === 'Primary').reduce((sum, s) => sum + s.enrollment, 0);
  const enrollSecondary = schools.filter(s => s.type === 'Secondary').reduce((sum, s) => sum + s.enrollment, 0);
  const enrollTypeData  = [
    { name: 'Primary',   students: enrollPrimary },
    { name: 'Secondary', students: enrollSecondary },
  ];

  return (
    <div className="charts-page">
      <h2 className="section-title">Education Overview — Zomba District</h2>

      <div className="charts-grid">

        {/* Enrollment per school */}
        <div className="chart-card wide">
          <h3>Student enrollment by school</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={enrollmentData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="enrollment" name="Students" fill="#2b6cb0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* School type breakdown */}
        <div className="chart-card">
          <h3>School types</h3>
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

        {/* Enrollment by type */}
        <div className="chart-card">
          <h3>Enrollment by school type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={enrollTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="students" name="Students" radius={[4,4,0,0]}>
                {enrollTypeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Teacher ratio */}
        <div className="chart-card wide">
          <h3>Student-to-teacher ratio by school <span className="note">(lower is better)</span></h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ratioData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}:1`, 'Student/Teacher ratio']} />
              <Bar dataKey="ratio" name="Ratio" radius={[4,4,0,0]}>
                {ratioData.map((entry, i) => (
                  <Cell key={i} fill={entry.ratio > 45 ? '#e53e3e' : entry.ratio > 35 ? '#d69e2e' : '#276749'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="chart-note">🔴 Above 45:1 &nbsp;🟡 35–45:1 &nbsp;🟢 Below 35:1</p>
        </div>

      </div>
    </div>
  );
}