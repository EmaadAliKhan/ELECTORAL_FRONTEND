import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import Card from '../components/common/Card';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../assets/css/BusinessAnalysis.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const BusinessAnalysis = () => {
  // State for controls
  const [boothList, setBoothList] = useState([]);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [selectedBooths, setSelectedBooths] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');

  // State for results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1️⃣ Fetch initial data for dropdowns (booths and business profiles)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [boothsRes, profilesRes] = await Promise.all([
          apiClient.get('/booths'),
          apiClient.get('/analysis/business-profiles')
        ]);
        setBoothList(boothsRes.data);
        setBusinessProfiles(profilesRes.data);
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError('Could not load data for filters. Please try refreshing the page.');
      }
    };
    fetchInitialData();
  }, []);

  // 2️⃣ Handle checkbox changes for booth selection
  const handleBoothSelection = (boothNumber) => {
    setSelectedBooths(prev =>
      prev.includes(boothNumber)
        ? prev.filter(b => b !== boothNumber) // Deselect
        : [...prev, boothNumber] // Select
    );
  };
  
  // 3️⃣ Handle the analysis logic
  const handleAnalyzeClick = async () => {
    if (selectedBooths.length === 0 || !selectedProfile) {
      setError('Please select at least one booth and a business type.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await apiClient.post('/analysis/business-suitability', {
        booths: selectedBooths,
        business_type: selectedProfile
      });
      setAnalysisResult(response.data);
    } catch (err) {
      console.error("Failed to fetch analysis", err);
      setError('An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to get color for suitability level
  const getLevelColor = (level) => {
    if (level === 'High') return 'level-high';
    if (level === 'Medium') return 'level-medium';
    return 'level-low';
  };

  // Chart data setup
  const ageChartData = {
    labels: analysisResult ? Object.keys(analysisResult.demographics.age_breakdown) : [],
    datasets: [{
      label: 'Matched Population by Age',
      data: analysisResult ? Object.values(analysisResult.demographics.age_breakdown) : [],
      backgroundColor: 'rgba(74, 144, 226, 0.7)',
    }]
  };
  
  const genderChartData = {
    labels: analysisResult ? Object.keys(analysisResult.demographics.gender_breakdown) : [],
    datasets: [{
      data: analysisResult ? Object.values(analysisResult.demographics.gender_breakdown) : [],
      backgroundColor: ['#4A90E2', '#FF6B6B'],
    }]
  };

  return (
    <div className="business-analysis-container">
      <h2>Business Suitability Analysis</h2>
      <div className="analysis-grid">
        {/* --- CONTROLS --- */}
        <div className="controls-container">
          <Card title="1. Select Area (Booths)">
            <div className="booth-selection">
              <div className="booth-actions">
                <button onClick={() => setSelectedBooths(boothList)}>Select All</button>
                <button onClick={() => setSelectedBooths([])}>Deselect All</button>
              </div>
              <div className="booth-checkbox-list">
                {boothList.map(booth => (
                  <label key={booth}>
                    <input
                      type="checkbox"
                      checked={selectedBooths.includes(booth)}
                      onChange={() => handleBoothSelection(booth)}
                    />
                    Booth {booth}
                  </label>
                ))}
              </div>
            </div>
          </Card>
          <Card title="2. Select Business Type">
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="business-select"
            >
              <option value="" disabled>-- Choose a business --</option>
              {businessProfiles.map(profile => (
                <option key={profile.key} value={profile.key}>
                  {profile.label}
                </option>
              ))}
            </select>
          </Card>
          <button
            onClick={handleAnalyzeClick}
            disabled={loading || selectedBooths.length === 0 || !selectedProfile}
            className="analyze-button"
          >
            {loading ? 'Analyzing...' : '⚡ Run Analysis'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* --- RESULTS --- */}
        <div className="results-container">
          {loading && <div className="loading">Calculating Score...</div>}
          {analysisResult && (
            <div className="results-grid">
              <Card title="Suitability Level">
                <div className={`level-indicator ${getLevelColor(analysisResult.level)}`}>
                  {analysisResult.level}
                </div>
              </Card>
               <Card title="Suitability Score">
                <div className="stat-number">{analysisResult.score}%</div>
              </Card>
              <Card title="Matched Population">
                <div className="stat-number">{analysisResult.matched_population.toLocaleString()}</div>
                 <small>out of {analysisResult.total_population.toLocaleString()} total voters</small>
              </Card>
              <Card title="Matched Age Demographics">
                <Bar data={ageChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Card>
              <Card title="Matched Gender Demographics">
                <Pie data={genderChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Card>
            </div>
          )}
          {!loading && !analysisResult && (
             <div className="placeholder">
                <p>📊</p>
                <p>Your analysis results will appear here.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalysis;
