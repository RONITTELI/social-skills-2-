import React, { useState, useEffect } from 'react';
import { generateFeedback } from './feedbackEngine';

const Dashboard = () => {
  // Simulating incoming data from an audio processor
  const [inputData, setInputData] = useState({
    wpm: 110,
    fillerWords: 2,
    confidenceScore: 7,
    tone: 'confident',
    duration: 45,
    personality: 'ambivert'
  });

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const result = generateFeedback(inputData);
    setAnalysis(result);
  }, [inputData]);

  // Helper to simulate changing data (for demo purposes)
  const simulateSession = () => {
    setInputData({
      wpm: Math.floor(Math.random() * (170 - 90) + 90),
      fillerWords: Math.floor(Math.random() * 6),
      confidenceScore: Math.floor(Math.random() * 5 + 5),
      tone: Math.random() > 0.5 ? 'confident' : 'nervous',
      duration: 30,
      personality: 'ambivert'
    });
  };

  // Handle manual input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: (name === 'tone' || name === 'personality') ? value : Number(value)
    }));
  };

  if (!analysis) return <div>Loading AI Model...</div>;

  return (
    <div className="main-content">
      <div className="header">
        <h1>Session Analysis</h1>
        <p>Real-time AI feedback on your communication skills.</p>
      </div>

      {/* Input Configuration */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>🎛️ Session Parameters</h3>
          <button 
            onClick={simulateSession}
            style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            🎲 Randomize
          </button>
        </div>
        
        <div className="dashboard-grid" style={{ marginBottom: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Speaking Pace (WPM)</label>
            <input type="number" name="wpm" value={inputData.wpm} onChange={handleInputChange} className="input-control" />
          </div>
          
          <div className="input-group">
            <label className="input-label">Filler Words</label>
            <input type="number" name="fillerWords" value={inputData.fillerWords} onChange={handleInputChange} className="input-control" />
          </div>

          <div className="input-group">
            <label className="input-label">Confidence (1-10)</label>
            <input type="number" name="confidenceScore" min="1" max="10" value={inputData.confidenceScore} onChange={handleInputChange} className="input-control" />
          </div>

          <div className="input-group">
            <label className="input-label">Duration (sec)</label>
            <input type="number" name="duration" value={inputData.duration} onChange={handleInputChange} className="input-control" />
          </div>

          <div className="input-group">
            <label className="input-label">Tone</label>
            <select name="tone" value={inputData.tone} onChange={handleInputChange} className="input-control">
              <option value="confident">Confident</option>
              <option value="nervous">Nervous</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Personality Type</label>
            <select name="personality" value={inputData.personality} onChange={handleInputChange} className="input-control">
              <option value="introvert">Introvert</option>
              <option value="ambivert">Ambivert</option>
              <option value="extrovert">Extrovert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="dashboard-grid">
        {/* Overall Score Card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Communication Score</h3>
          <div className="score-circle" style={{ 
            borderColor: analysis.overallScore > 80 ? 'var(--accent-success)' : 
                         analysis.overallScore > 60 ? 'var(--accent-warning)' : 'var(--accent-danger)'
          }}>
            {analysis.overallScore}
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Based on fluency, pacing, and tone.</p>
        </div>

        {/* Key Metrics */}
        <div className="card">
          <h3>Vocal Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pacing (WPM)</div>
              <div className="metric-value">{inputData.wpm} <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>words/min</span></div>
              <div style={{ height: '6px', background: '#334155', borderRadius: '3px', marginTop: '5px' }}>
                <div style={{ 
                  width: `${Math.min((inputData.wpm / 200) * 100, 100)}%`, 
                  height: '100%', 
                  background: inputData.wpm > 100 && inputData.wpm < 160 ? 'var(--accent-success)' : 'var(--accent-warning)',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Confidence Level</div>
              <div className="metric-value">{inputData.confidenceScore}/10</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Filler Words</div>
              <div className="metric-value" style={{ color: inputData.fillerWords > 3 ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                {inputData.fillerWords}
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card">
          <h3>AI Coach Recommendations</h3>
          <div style={{ marginTop: '1rem' }}>
            {analysis.recommendations.length > 0 ? (
              analysis.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  {rec}
                </div>
              ))
            ) : (
              <div className="recommendation-item" style={{ borderLeftColor: 'var(--accent-success)' }}>
                🎉 Perfect session! No immediate improvements needed.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Feedback Logs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Detailed Analysis Logs</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {analysis.feedback.map((item, idx) => (
            <div key={idx} style={{ padding: '10px', borderBottom: '1px solid var(--glass-border)' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;