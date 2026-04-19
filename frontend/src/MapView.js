import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored icons
const schoolIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const healthIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

// Color wards by population
function getPopulationColor(population) {
  if (population > 40000) return '#1a365d';
  if (population > 30000) return '#2a4a7f';
  if (population > 25000) return '#2b6cb0';
  if (population > 20000) return '#3182ce';
  if (population > 15000) return '#63b3ed';
  return '#bee3f8';
}

// Ward center coordinates
const wardCenters = {
  'Zomba Central': { lat: -15.3833, lng: 35.3167 },
  'Naisi':         { lat: -15.4012, lng: 35.2890 },
  'Domasi':        { lat: -15.2741, lng: 35.4123 },
  'Likangala':     { lat: -15.3560, lng: 35.2650 },
  'Malemia':       { lat: -15.4234, lng: 35.3456 },
  'Mpemba':        { lat: -15.4567, lng: 35.2345 },
  'Chikanda':      { lat: -15.3100, lng: 35.3890 },
  'Machinjiri':    { lat: -15.3678, lng: 35.2123 },
  'Songani':       { lat: -15.4890, lng: 35.3210 },
  'Thondwe':       { lat: -15.3234, lng: 35.4560 },
  'Chingwe':       { lat: -15.2980, lng: 35.2780 },
};

export default function MapView() {
  const [schools,    setSchools]    = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [population, setPopulation] = useState([]);
  const [showSchools,    setShowSchools]    = useState(true);
  const [showHealth,     setShowHealth]     = useState(true);
  const [showPopulation, setShowPopulation] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/schools`),
      axios.get(`${API}/api/health-facilities`),
      axios.get(`${API}/api/population`),
    ]).then(([s, h, p]) => {
      setSchools(s.data);
      setFacilities(h.data);
      setPopulation(p.data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load map data:', err);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      <p>Loading map data...</p>
    </div>
  );

  return (
    <div className="map-wrapper">

      {/* Layer toggles */}
      <div className="map-controls">
        <span className="controls-title">Layers</span>
        <label className="toggle">
          <input type="checkbox" checked={showSchools}
            onChange={e => setShowSchools(e.target.checked)} />
          <span className="dot school" /> Schools
        </label>
        <label className="toggle">
          <input type="checkbox" checked={showHealth}
            onChange={e => setShowHealth(e.target.checked)} />
          <span className="dot health" /> Health Facilities
        </label>
        <label className="toggle">
          <input type="checkbox" checked={showPopulation}
            onChange={e => setShowPopulation(e.target.checked)} />
          <span className="dot pop" /> Population Density
        </label>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <span className="controls-title">Population</span>
        {[
          { color: '#1a365d', label: '40,000+' },
          { color: '#2b6cb0', label: '25,000–40,000' },
          { color: '#63b3ed', label: '15,000–25,000' },
          { color: '#bee3f8', label: 'Under 15,000' },
        ].map(item => (
          <div key={item.label} className="legend-row">
            <span className="legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={[-15.3833, 35.3167]}
        zoom={11}
        style={{ height: '600px', width: '100%', borderRadius: '10px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Population circles per ward */}
        {showPopulation && population.map(ward => {
          const center = wardCenters[ward.ward];
          if (!center) return null;
          return (
            <CircleMarker
              key={ward.id}
              center={[center.lat, center.lng]}
              radius={Math.sqrt(ward.population / 100)}
              fillColor={getPopulationColor(ward.population)}
              color={getPopulationColor(ward.population)}
              fillOpacity={0.45}
              weight={1.5}
            >
              <Tooltip>
                <strong>{ward.ward}</strong><br />
                Population: {ward.population.toLocaleString()}<br />
                Households: {ward.households.toLocaleString()}<br />
                Area: {ward.area_km2} km²
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* School markers */}
        {showSchools && schools.map(school => (
          <Marker key={school.id} position={[school.lat, school.lng]} icon={schoolIcon}>
            <Popup>
              <div className="popup">
                <h3>🏫 {school.name}</h3>
                <p><strong>Ward:</strong> {school.ward}</p>
                <p><strong>Type:</strong> {school.type}</p>
                <p><strong>Enrollment:</strong> {school.enrollment.toLocaleString()} students</p>
                <p><strong>Teachers:</strong> {school.teachers}</p>
                <p><strong>Ratio:</strong> {Math.round(school.enrollment / school.teachers)}:1 students/teacher</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Health facility markers */}
        {showHealth && facilities.map(facility => (
          <Marker key={facility.id} position={[facility.lat, facility.lng]} icon={healthIcon}>
            <Popup>
              <div className="popup">
                <h3>🏥 {facility.name}</h3>
                <p><strong>Ward:</strong> {facility.ward}</p>
                <p><strong>Type:</strong> {facility.type}</p>
                <p><strong>Beds:</strong> {facility.beds}</p>
                <p><strong>Monthly visits:</strong> {facility.monthly_visits.toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}