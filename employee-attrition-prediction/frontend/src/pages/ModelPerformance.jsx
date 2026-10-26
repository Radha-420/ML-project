import React, { useEffect, useState } from 'react';
import { getModelInfo } from '../services/api';
import { BarChart3 } from 'lucide-react';

const ModelPerformance = () => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    getModelInfo().then(data => setModel(data)).catch(() => {});
  }, []);

  return (
    <div className="fade-in">
      <h1 style={{ marginBottom: '1.5rem' }}>Model Performance</h1>
      
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Current Model: {model ? model.model_name : 'Loading...'}</h2>
            <p>Evaluation metrics from the trained model on test dataset</p>
          </div>
        </div>

        {model ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>F1 Score</p>
              <h2 style={{ margin: 0, color: 'var(--accent-primary)' }}>{model.metrics.F1.toFixed(4)}</h2>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Accuracy</p>
              <h2 style={{ margin: 0 }}>{model.metrics.Accuracy.toFixed(4)}</h2>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Precision</p>
              <h2 style={{ margin: 0 }}>{model.metrics.Precision.toFixed(4)}</h2>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Recall</p>
              <h2 style={{ margin: 0 }}>{model.metrics.Recall.toFixed(4)}</h2>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>ROC-AUC</p>
              <h2 style={{ margin: 0 }}>{model.metrics['ROC-AUC'].toFixed(4)}</h2>
            </div>
          </div>
        ) : (
          <p>Loading metrics...</p>
        )}
      </div>
      
      <div className="card">
        <h3>Model Comparison</h3>
        <p style={{ marginBottom: '1.5rem' }}>Overview of algorithm selection process.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Logistic Regression</td>
              <td><span className="badge badge-medium">Selected Model</span></td>
            </tr>
            <tr>
              <td>Decision Tree</td>
              <td>Evaluated</td>
            </tr>
            <tr>
              <td>Random Forest</td>
              <td>Evaluated</td>
            </tr>
            <tr>
              <td>XGBoost</td>
              <td>Evaluated</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelPerformance;
