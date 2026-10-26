import React, { useState, useEffect } from 'react';
import { predictNewEmployee, getDatasetSchema, getEmployeeById } from '../services/api';
import { TriangleAlert, CircleCheck, Brain, Loader2, Search } from 'lucide-react';

const Predict = () => {
  const [schema, setSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [autofillId, setAutofillId] = useState('');
  const [autofillMsg, setAutofillMsg] = useState({ text: '', type: '' });
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    getDatasetSchema().then(data => {
      setSchema(data);
      // Initialize defaults based on schema
      const initial = {};
      data.forEach(field => {
        if (field.type === 'numerical') {
          initial[field.name] = Math.round(field.mean) || 0;
        } else {
          initial[field.name] = field.options[0] || '';
        }
      });
      setFormData(initial);
      setSchemaLoading(false);
    }).catch(err => {
      console.error(err);
      setSchemaLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Find field type
    const field = schema.find(f => f.name === name);
    if (field && field.type === 'numerical') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAutofill = async () => {
    if (!autofillId) {
      setAutofillMsg({ text: '', type: '' });
      setEmployeeName('');
      return;
    }
    setAutofillMsg({ text: 'Fetching...', type: 'info' });
    try {
      const data = await getEmployeeById(autofillId);
      if (data) {
        // Map the fields from data to formData if they exist in the schema
        const updated = { ...formData };
        schema.forEach(field => {
          if (data[field.name] !== undefined) {
            updated[field.name] = data[field.name];
          }
        });
        setFormData(updated);
        setEmployeeName(data.EmployeeName || data.Name || '');
        setAutofillMsg({ text: '✓ Data loaded successfully!', type: 'success' });
      }
    } catch (err) {
      setEmployeeName('');
      if (err.response && err.response.status === 404) {
        setAutofillMsg({ text: 'Employee ID not found.', type: 'error' });
      } else {
        setAutofillMsg({ text: 'Error fetching data.', type: 'error' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (autofillId) {
        payload.EmployeeCode = autofillId;
      }
      const res = await predictNewEmployee(payload);
      setResult(res);
    } catch (err) {
      alert("Error generating prediction. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    // Add spaces before capital letters for label
    const label = field.name.replace(/([A-Z])/g, ' $1').trim();
    
    // Format value safely
    let displayValue = formData[field.name];
    if (displayValue === undefined || displayValue === null) displayValue = 'N/A';
    
    return (
      <div className="form-group" key={field.name}>
        <label className="form-label">{label}</label>
        <div style={{
          padding: '0.5rem 0.75rem',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          color: 'var(--text-main)',
          minHeight: '38px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.8
        }}>
          {displayValue}
        </div>
      </div>
    );
  };

  if (schemaLoading) return <div className="fade-in" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}><Loader2 className="spin" /> Loading dynamic form schema from CSV...</div>;

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 600px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Predict New Employee</h1>
        <p style={{ marginBottom: '2rem' }}>Manually enter employee attributes to generate a risk assessment based on the trained ML model.</p>
        
        <form onSubmit={handleSubmit}>
          
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              Autofill from Existing Employee
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Enter an existing Employee ID to populate the form with their current data. You can then tweak the values to see how it affects their attrition risk.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                style={{ flex: 1, textTransform: 'uppercase' }}
                placeholder="Enter Employee ID (e.g., 12, NTS001)" 
                value={autofillId}
                onChange={e => setAutofillId(e.target.value.toUpperCase())}
                onBlur={handleAutofill}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAutofill(); } }}
              />
              <button type="button" className="btn-secondary" onClick={handleAutofill}>
                <Search size={16} /> Autofill Data
              </button>
            </div>
            
            {autofillMsg.text && (
              <div style={{ marginTop: '0.75rem', fontSize: '13px', fontWeight: 500, color: autofillMsg.type === 'error' ? 'var(--risk-high)' : autofillMsg.type === 'success' ? 'var(--risk-low)' : 'var(--text-secondary)' }}>
                {autofillMsg.text}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              Employee Attributes
            </h3>
            <div className="form-grid">
              {employeeName && (
                <div className="form-group" style={{ gridColumn: '1 / -1', padding: '1rem', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Predicting for Employee:</p>
                  <h4 style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '18px' }}>{employeeName}</h4>
                </div>
              )}
              {schema.map(field => renderField(field))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={loading || !employeeName}>
              <Brain size={18} />
              {loading ? 'Analyzing...' : 'Predict Attrition →'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="card fade-in" style={{ flex: '1 1 350px', position: 'sticky', top: '90px', borderTop: `4px solid var(--risk-${result.risk_level.toLowerCase()})`, textAlign: 'center' }}>
          <h2 style={{ fontSize: '13px', letterSpacing: '1px', color: 'var(--text-secondary)' }}>MODEL PREDICTION</h2>
          
          <div style={{ margin: '2rem 0' }}>
            {result.risk_level === 'High' ? <TriangleAlert size={40} color="var(--risk-high)" style={{margin: '0 auto'}}/> : <CircleCheck size={40} color="var(--risk-low)" style={{margin: '0 auto'}}/>}
          </div>

          <h1 style={{ fontSize: '20px', color: `var(--risk-${result.risk_level.toLowerCase()})`, textTransform: 'uppercase' }}>
            {result.prediction === 'Yes' ? 'High Attrition Risk' : 'Low Attrition Risk'}
          </h1>
          
          <div style={{ margin: '2rem 0' }}>
            <h1 style={{ fontSize: '42px', margin: 0 }}>{(result.probability * 100).toFixed(1)}%</h1>
            <p>predicted probability</p>
          </div>

          {/* Probability Meter */}
          <div style={{ margin: '2rem 0', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: '1px', background: 'var(--bg-card)' }}></div>
              <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: '1px', background: 'var(--bg-card)' }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: `${result.probability * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: `var(--risk-${result.risk_level.toLowerCase()})`,
                boxShadow: `0 0 10px var(--risk-${result.risk_level.toLowerCase()})`,
                transition: 'left 1s ease'
              }}></div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{marginBottom: '0.5rem', fontWeight: 600}}>
              {result.prediction === 'Yes' ? 'The model predicts a higher probability of employee attrition.' : 'The model predicts a lower probability of employee attrition.'}
            </p>
            Model-based prediction only.<br/>
            Not a certainty.
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;
