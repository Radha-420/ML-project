import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, predictExistingEmployee } from '../services/api';
import { Brain, TriangleAlert, CircleCheck, ArrowLeft } from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getEmployeeById(id).then(data => {
      setEmployee(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const res = await predictExistingEmployee(id);
      setResult(res);
    } catch (err) {
      alert("Failed to run prediction.");
    }
    setPredicting(false);
  };

  if (loading) return <div className="fade-in">Loading profile...</div>;
  if (!employee) return <div className="fade-in">Employee not found.</div>;

  return (
    <div className="fade-in">
      <button onClick={() => navigate('/employees')} className="nav-btn" style={{ marginBottom: '1.5rem', gap: '0.5rem', color: 'var(--accent-primary)' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Profile Info */}
        <div style={{ flex: '1 1 500px' }}>
          <div className="card">
            <h1 style={{ margin: '0 0 0.5rem 0' }}>{employee.EmployeeName}</h1>
            <p style={{ fontSize: '16px', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: 500 }}>
              {employee.JobRole} &nbsp;&bull;&nbsp; {employee.Department}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Employee Details</h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {Object.entries(employee).map(([key, value]) => {
                    if (['EmployeeID', 'EmployeeName', 'Department', 'JobRole', 'id', 'Attrition'].includes(key)) return null;
                    
                    // Format keys (e.g. MonthlyIncome -> Monthly Income)
                    const label = key.replace(/([A-Z])/g, ' $1').trim();
                    
                    // Add some unit formatting if identifiable
                    let displayValue = value;
                    if (key === 'Salary' || key === 'MonthlyIncome') displayValue = `₹${Number(value).toLocaleString()}`;
                    else if (key.includes('Years') || key === 'Experience') displayValue = `${value} yrs`;
                    
                    return (
                      <p key={key}><strong>{label}:</strong> {displayValue}</p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Panel */}
        <div style={{ flex: '1 1 350px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '13px', letterSpacing: '1px', color: 'var(--text-secondary)' }}>ATTRISENSE ENGINE</h2>
            
            {!result ? (
              <div style={{ padding: '3rem 0' }}>
                <Brain size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ marginBottom: '2rem' }}>Generate a real-time risk assessment using the NovaTech ML model.</p>
                <button onClick={handlePredict} className="btn-primary" disabled={predicting}>
                  <Brain size={18} /> {predicting ? 'Analyzing...' : 'Predict Attrition Risk'}
                </button>
              </div>
            ) : (
              <div className="fade-in" style={{ borderTop: `4px solid var(--risk-${result.risk_level.toLowerCase()})`, marginTop: '1rem', paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  {result.risk_level === 'High' ? <TriangleAlert size={40} color="var(--risk-high)" style={{margin: '0 auto'}}/> : <CircleCheck size={40} color="var(--risk-low)" style={{margin: '0 auto'}}/>}
                </div>

                <h1 style={{ fontSize: '20px', color: `var(--risk-${result.risk_level.toLowerCase()})`, textTransform: 'uppercase' }}>
                  {result.prediction === 'Yes' ? 'High Attrition Risk' : 'Low Attrition Risk'}
                </h1>
                
                <div style={{ margin: '2rem 0' }}>
                  <h1 style={{ fontSize: '42px', margin: 0 }}>{(result.probability * 100).toFixed(1)}%</h1>
                  <p>predicted probability</p>
                </div>

                <div style={{ margin: '2rem 0', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span>Low</span><span>Medium</span><span>High</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: '1px', background: 'var(--bg-card)' }}></div>
                    <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: '1px', background: 'var(--bg-card)' }}></div>
                    <div style={{
                      position: 'absolute', top: '50%', left: `${result.probability * 100}%`, transform: 'translate(-50%, -50%)',
                      width: '12px', height: '12px', borderRadius: '50%', background: `var(--risk-${result.risk_level.toLowerCase()})`,
                      boxShadow: `0 0 10px var(--risk-${result.risk_level.toLowerCase()})`, transition: 'left 1s ease'
                    }}></div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <p style={{marginBottom: '0.5rem', fontWeight: 600}}>
                    {result.prediction === 'Yes' ? 'The model predicts a higher probability of employee attrition.' : 'The model predicts a lower probability of employee attrition.'}
                  </p>
                  Model-based prediction only. Not a certainty.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
