import React, { useEffect, useState } from 'react';
import { getStatistics } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, ShieldEllipsis, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStatistics().then(data => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return <div className="card fade-in">Loading dashboard data...</div>;

  const pieData = [
    { name: 'High Risk', value: stats.high_risk, color: 'var(--risk-high)' },
    { name: 'Medium Risk', value: stats.medium_risk, color: 'var(--risk-medium)' },
    { name: 'Low Risk', value: stats.low_risk, color: 'var(--risk-low)' }
  ];

  const barData = [
    { name: 'Predicted Yes', count: stats.predicted_yes, fill: 'var(--accent-primary)' },
    { name: 'Predicted No', count: stats.predicted_no, fill: 'var(--accent-secondary)' }
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Workforce Intelligence</h1>
          <p style={{ marginTop: '0.25rem' }}>Monitor employee attrition predictions and workforce risk signals.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>
          Prediction engine online
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Card 1 */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Predictions</p>
            <Activity size={18} color="var(--text-secondary)" />
          </div>
          <h2 style={{ fontSize: '32px', margin: 0 }}>{stats.total_predictions}</h2>
          <small style={{ marginTop: '0.5rem' }}>All predictions</small>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>High Risk</p>
            <ShieldAlert size={18} color="var(--risk-high)" />
          </div>
          <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--risk-high)' }}>{stats.high_risk}</h2>
          <small style={{ marginTop: '0.5rem' }}>{stats.total_predictions > 0 ? Math.round((stats.high_risk / stats.total_predictions) * 100) : 0}% of predictions</small>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medium Risk</p>
            <ShieldEllipsis size={18} color="var(--risk-medium)" />
          </div>
          <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--risk-medium)' }}>{stats.medium_risk}</h2>
          <small style={{ marginTop: '0.5rem' }}>Moderate risk employees</small>
        </div>

        {/* Card 4 */}
        <div className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Low Risk</p>
            <ShieldCheck size={18} color="var(--risk-low)" />
          </div>
          <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--risk-low)' }}>{stats.low_risk}</h2>
          <small style={{ marginTop: '0.5rem' }}>Safe employees</small>
        </div>
        
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3>Risk Distribution</h3>
          <div style={{ height: '250px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Attrition Prediction Trend</h3>
          <div style={{ height: '250px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-card-hover)'}} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
