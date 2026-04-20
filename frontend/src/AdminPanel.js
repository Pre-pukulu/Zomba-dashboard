import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEPARTMENT_ORDER = ['education', 'health', 'disaster', 'welfare'];

function formatDepartmentLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminPanel() {
  const [overview, setOverview] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [department, setDepartment] = useState('education');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const departmentOptions = !overview
    ? []
    : DEPARTMENT_ORDER
        .filter(key => overview.departments[key])
        .map(key => ({ id: key, ...overview.departments[key] }));

  const activeDepartment = departmentOptions.find(option => option.id === department);

  const loadAdminData = async () => {
    const [overviewResponse, datasetsResponse] = await Promise.all([
      axios.get(`${API}/api/admin/pipeline`),
      axios.get(`${API}/api/admin/staged-datasets`),
    ]);
    setOverview(overviewResponse.data);
    setDatasets(datasetsResponse.data);
  };

  useEffect(() => {
    loadAdminData().catch(error => {
      console.error('Failed to load admin data:', error);
      setFeedback({ type: 'error', message: 'Unable to load admin pipeline data.' });
    });
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Choose a file before uploading.' });
      return;
    }

    const payload = new FormData();
    payload.append('department', department);
    payload.append('file', selectedFile);

    setUploading(true);
    setFeedback(null);

    try {
      const response = await axios.post(`${API}/api/admin/upload`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFeedback({
        type: 'success',
        message: `${response.data.original_filename} processed successfully and is ready for integration.`,
      });
      setSelectedFile(null);
      const fileInput = document.getElementById('admin-upload-input');
      if (fileInput) fileInput.value = '';
      await loadAdminData();
    } catch (error) {
      const message = error.response?.data?.error || 'Upload failed.';
      setFeedback({ type: 'error', message });
    } finally {
      setUploading(false);
    }
  };

  if (!overview) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading admin pipeline...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Pipeline jobs', value: overview.stats.total_jobs || 0 },
    { label: 'Ready datasets', value: overview.stats.ready_jobs || 0 },
    { label: 'Needs integration', value: overview.stats.waiting_for_integration || 0 },
    { label: 'Failed jobs', value: overview.stats.failed_jobs || 0 },
  ];

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Layer 5 - Admin Panel</p>
          <h2>Department uploads and processing pipeline</h2>
          <p>
            Upload incoming files by department, validate them through load, clean and harmonize stages,
            then hold them in staging before the centralized database is built.
          </p>
        </div>
        <div className="admin-status-callout">
          <strong>Central database status</strong>
          <span>{overview.database_plan.message}</span>
        </div>
      </section>

      <section className="admin-stats-grid">
        {statCards.map(card => (
          <div key={card.label} className="admin-stat-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="pipeline-architecture">
        <div className="pipeline-layer">
          <span className="layer-title">Layer 1 - Data sources</span>
          <div className="layer-items">
            {departmentOptions.map(option => (
              <div key={option.id} className="layer-chip">
                <strong>{formatDepartmentLabel(option.id)}</strong>
                <span>{option.accepted_formats.join(' / ')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pipeline-layer">
          <span className="layer-title">Layer 2 - Processing pipeline</span>
          <div className="layer-steps">
            <div className="step-card"><strong>1. Load</strong><span>CSV, Excel, JSON and disaster file bundles.</span></div>
            <div className="step-card"><strong>2. Clean</strong><span>Trim blanks, drop empty rows and normalize columns.</span></div>
            <div className="step-card"><strong>3. Harmonize</strong><span>Map each upload to a canonical schema by department.</span></div>
            <div className="step-card"><strong>4. Integrate</strong><span>Prepared and queued for the future centralized DB.</span></div>
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">Upload intake</p>
              <h3>Send department data into the pipeline</h3>
            </div>
          </div>

          <div className="department-picker">
            {departmentOptions.map(option => (
              <button
                key={option.id}
                type="button"
                className={department === option.id ? 'department-btn active' : 'department-btn'}
                onClick={() => setDepartment(option.id)}
              >
                {formatDepartmentLabel(option.id)}
              </button>
            ))}
          </div>

          {activeDepartment && (
            <div className="department-guidance">
              <p>{activeDepartment.description}</p>
              <p><strong>Accepted:</strong> {activeDepartment.accepted_formats.join(', ')}</p>
              <p><strong>Canonical fields:</strong> {activeDepartment.canonical_fields.join(', ')}</p>
            </div>
          )}

          <form className="upload-form" onSubmit={handleSubmit}>
            <label>
              <span>Department</span>
              <select value={department} onChange={event => setDepartment(event.target.value)}>
                {departmentOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {formatDepartmentLabel(option.id)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Data file</span>
              <input
                id="admin-upload-input"
                type="file"
                onChange={event => setSelectedFile(event.target.files?.[0] || null)}
              />
            </label>

            <button type="submit" className="primary-btn" disabled={uploading}>
              {uploading ? 'Processing...' : 'Upload and process'}
            </button>
          </form>

          {feedback && (
            <div className={feedback.type === 'error' ? 'feedback error' : 'feedback success'}>
              {feedback.message}
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">Pipeline queue</p>
              <h3>Recent ingestion jobs</h3>
            </div>
          </div>

          <div className="job-list">
            {overview.jobs.length === 0 && <p className="empty-state">No uploads yet. Start with a department file.</p>}
            {overview.jobs.map(job => (
              <div key={job.id} className="job-item">
                <div className="job-meta">
                  <strong>{formatDepartmentLabel(job.department)}</strong>
                  <span>{job.original_filename}</span>
                </div>
                <div className="job-badges">
                  <span className={`status-badge ${job.status}`}>{job.status}</span>
                  <span className="stage-badge">{job.pipeline_stage}</span>
                </div>
                <p>{job.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">Staging area</p>
            <h3>Harmonized dataset previews</h3>
          </div>
        </div>

        <div className="dataset-grid">
          {datasets.length === 0 && <p className="empty-state">Processed datasets will appear here after upload.</p>}
          {datasets.map(dataset => (
            <article key={dataset.id} className="dataset-card">
              <div className="dataset-header">
                <div>
                  <strong>{dataset.original_filename}</strong>
                  <span>{formatDepartmentLabel(dataset.department)} - {dataset.record_count} records</span>
                </div>
                <span className="status-badge ready">{dataset.status}</span>
              </div>

              <div className="dataset-section">
                <span className="dataset-label">Schema</span>
                <p>{dataset.schema.join(', ') || 'No detected fields'}</p>
              </div>

              <div className="dataset-section">
                <span className="dataset-label">Quality</span>
                <p>
                  Raw: {dataset.quality_report.raw_records || 0} | Clean: {dataset.quality_report.clean_records || 0} |
                  Missing ward: {dataset.quality_report.missing_ward || 0}
                </p>
              </div>

              <div className="dataset-section">
                <span className="dataset-label">Harmonized preview</span>
                <pre>{JSON.stringify(dataset.harmonized_preview[0] || {}, null, 2)}</pre>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
