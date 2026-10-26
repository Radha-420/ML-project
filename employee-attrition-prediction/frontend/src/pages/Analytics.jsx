import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="fade-in">Loading analytics...</div>;
  if (!data) return <div className="fade-in">Failed to load analytics.</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Workforce Analytics</h1>
        <p style={{ marginTop: '0.25rem' }}>Deep dive into historical attrition factors across the company.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Attrition by Department</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.department} margin={{ top: 5, right: 0, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="Department" stroke="var(--text-secondary)" tick={{fontSize: 11}} angle={-45} textAnchor="end" />
                <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="No" name="Retained" stackId="a" fill="var(--risk-low)" />
                <Bar dataKey="Yes" name="Attrited" stackId="a" fill="var(--risk-high)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Attrition by Salary Range</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salary} margin={{ top: 5, right: 0, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="SalaryRange" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="No" name="Retained" stackId="a" fill="var(--risk-low)" />
                <Bar dataKey="Yes" name="Attrited" stackId="a" fill="var(--risk-high)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Attrition by Job Role</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.role} margin={{ top: 5, right: 0, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="JobRole" stroke="var(--text-secondary)" tick={{fontSize: 11}} angle={-45} textAnchor="end" />
                <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="No" name="Retained" stackId="a" fill="var(--risk-low)" />
                <Bar dataKey="Yes" name="Attrited" stackId="a" fill="var(--risk-high)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
