import React, { useEffect, useState, useRef } from 'react';
import { getCompany, retrainModel, uploadDataset } from '../services/api';
import { Database, Upload, RefreshCw } from 'lucide-react';

const DatasetManagement = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getCompany().then(data => {
      setCompany(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setMessage('Error: Only CSV files are allowed.');
      return;
    }

    setUploading(true);
    setMessage('Uploading dataset...');
    try {
      const res = await uploadDataset(file);
      if (res.success) {
        setMessage('File uploaded successfully! You must now retrain the model.');
      } else {
        setMessage('Error: ' + res.error);
      }
    } catch (err) {
      setMessage('Failed to upload dataset.');
    }
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetrain = async () => {
    if (!window.confirm("Retraining the model will overwrite the current best_model.pkl. Proceed?")) return;
    setRetraining(true);
    setMessage('Retraining model... This may take a minute.');
    try {
      const res = await retrainModel();
      if (res.success) {
        setMessage('Model retrained successfully!');
        fetchData(); // refresh metadata
      } else {
        setMessage('Error: ' + res.error);
      }
    } catch (e) {
      setMessage('Failed to trigger retrain.');
    }
    setRetraining(false);
  };

  if (loading) return <div className="fade-in">Loading dataset info...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Dataset Management</h1>
        <p style={{ marginTop: '0.25rem' }}>Manage the master employee dataset and retrain the ML model.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Database size={24} color="var(--accent-secondary)" />
            <h2 style={{ margin: 0 }}>Current Dataset</h2>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>File</p>
              <h3 style={{ margin: 0 }}>{company?.dataset || 'employees.csv'}</h3>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Records</p>
              <h3 style={{ margin: 0 }}>{company?.training_records ? company.training_records.toLocaleString() : 'N/A'} Employees</h3>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Target Variable</p>
              <h3 style={{ margin: 0 }}>{company?.target || 'Attrition'}</h3>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Last Updated</p>
              <h3 style={{ margin: 0 }}>{company?.trained_at || 'N/A'}</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ margin: '0 0 1.5rem 0' }}>Actions</h2>
          
          <div style={{ padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' }}>
            <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
            <p style={{ marginBottom: '1rem' }}>Upload a new employees.csv file to update the master record.</p>
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
            <button 
              className="btn-primary" 
              onClick={() => fileInputRef.current.click()} 
              disabled={uploading || retraining}
              style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            >
              {uploading ? 'Uploading...' : 'Choose CSV File'}
            </button>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Retrain Machine Learning Model</h3>
            <p style={{ fontSize: '13px', marginBottom: '1.5rem' }}>A new dataset will require the model to be retrained. This process will evaluate multiple algorithms and select the best one.</p>
            <button className="btn-primary" onClick={handleRetrain} disabled={retraining || uploading}>
              <RefreshCw size={18} className={retraining ? 'spin' : ''} />
              {retraining ? 'Training in progress...' : 'Retrain Model'}
            </button>
            {message && <p style={{ marginTop: '1rem', fontSize: '13px', color: 'var(--accent-primary)' }}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetManagement;
