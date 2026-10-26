import React from 'react';

const About = () => {
  return (
    <div className="fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>About the Project</h1>
      
      <div className="card">
        <h3>Project Objective</h3>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          AttriSense is an academic Machine Learning web application designed to predict whether an employee is likely to leave an organization based on HR data. It empowers HR professionals to take proactive retention measures rather than reactive responses.
        </p>

        <h3>Machine Learning Workflow</h3>
        <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', margin: '1rem 0' }}>
          Dataset<br/>
          &nbsp;&nbsp;↓<br/>
          Preprocessing<br/>
          &nbsp;&nbsp;↓<br/>
          Exploratory Data Analysis<br/>
          &nbsp;&nbsp;↓<br/>
          Model Training (LR, DT, RF, XGB)<br/>
          &nbsp;&nbsp;↓<br/>
          Evaluation<br/>
          &nbsp;&nbsp;↓<br/>
          Prediction Service
        </div>

        <h3>Limitations</h3>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '0.5rem' }}>Predictions are probabilistic, not absolute certainties.</li>
          <li style={{ marginBottom: '0.5rem' }}>Dataset quality and historical HR biases directly affect the predictions.</li>
          <li style={{ marginBottom: '0.5rem' }}>Correlation does not imply causation.</li>
          <li style={{ marginBottom: '0.5rem' }}>The system is a decision-support tool, and should not automatically determine employment actions.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
