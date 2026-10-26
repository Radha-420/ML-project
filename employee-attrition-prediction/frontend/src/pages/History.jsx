import React, { useEffect, useState } from 'react';
import { getHistory, deleteHistoryRecord } from '../services/api';
import { Trash2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    getHistory().then(data => {
      setHistory(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) return;
    try {
      await deleteHistoryRecord(id);
      setHistory(history.filter(record => record.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const getBadgeClass = (risk) => {
    if(risk === 'High') return 'badge badge-high';
    if(risk === 'Medium') return 'badge badge-medium';
    return 'badge badge-low';
  };

  return (
    <div className="fade-in">
      <h1 style={{ marginBottom: '1.5rem' }}>Prediction History</h1>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && history.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : history.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No predictions yet. Run your first employee prediction to see history here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee ID</th>
                  <th>Prediction</th>
                  <th style={{ textAlign: 'right' }}>Probability</th>
                  <th style={{ paddingLeft: '2rem' }}>Risk Level</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(row => (
                  <tr key={row.id}>
                    <td>{new Date(row.created_at).toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>{row.employee_reference !== 'Unknown' ? row.employee_reference : row.id.split('-')[0]}</td>
                    <td style={{ fontWeight: 600, color: row.prediction === 'Yes' ? 'var(--text-main)' : 'var(--text-secondary)' }}>{row.prediction}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '13px' }}>{(row.probability * 100).toFixed(1)}%</td>
                    <td style={{ paddingLeft: '2rem' }}>
                      <span className={getBadgeClass(row.risk_level)}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                        {row.risk_level}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="action-btn"
                        title="Delete record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
