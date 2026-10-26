import React, { useEffect, useState } from 'react';
import { getEmployees } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees().then(data => {
      setEmployees(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = employees.filter(e => {
    const searchLower = search.toLowerCase();
    const idMatch = String(e.EmployeeID || '').toLowerCase().includes(searchLower);
    const nameMatch = String(e.EmployeeName || '').toLowerCase().includes(searchLower);
    const deptMatch = String(e.Department || '').toLowerCase().includes(searchLower);
    const roleMatch = String(e.JobRole || '').toLowerCase().includes(searchLower);
    return idMatch || nameMatch || deptMatch || roleMatch;
  });

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>NovaTech Employees</h1>
          <p style={{ marginTop: '0.25rem' }}>Manage and explore the company workforce.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search ID, name, or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading employees...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Job Role</th>
                  <th>Level</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(emp => (
                  <tr key={emp.EmployeeID} style={{ cursor: 'pointer' }} onClick={() => navigate(`/employees/${emp.EmployeeID}`)}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{emp.EmployeeID}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.EmployeeName || 'Unknown'}</td>
                    <td>{emp.Department || 'N/A'}</td>
                    <td>{emp.JobRole || 'N/A'}</td>
                    <td>{emp.JobLevel ? `L${emp.JobLevel}` : 'N/A'}</td>
                    <td>{emp.TotalWorkingYears !== undefined ? emp.TotalWorkingYears : (emp.Experience !== undefined ? emp.Experience : 'N/A')} yrs</td>
                    <td style={{ fontFamily: 'monospace' }}>
                      ₹{emp.MonthlyIncome ? Number(emp.MonthlyIncome).toLocaleString() : (emp.Salary ? Number(emp.Salary).toLocaleString() : 'N/A')}
                    </td>
                    <td>
                      <span className={emp.Attrition === 'Yes' ? 'badge badge-high' : 'badge badge-low'}>
                        {emp.Attrition === 'Yes' ? 'Past Employee' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 100 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Showing 100 of {filtered.length} employees. Use search to refine.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
