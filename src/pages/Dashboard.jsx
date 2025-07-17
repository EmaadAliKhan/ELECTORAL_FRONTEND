import React, { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import Card from '../components/common/Card';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import '../assets/css/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for booth list and selected booth
  const [boothList, setBoothList] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(""); // "" means 'All Booths'

  // 1️⃣ Fetch the list of available booths only once on component mount
  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const res = await apiClient.get("/booths");
        setBoothList(res.data);
      } catch (err) {
        console.error("Failed to fetch booth list", err);
      }
    };
    fetchBooths();
  }, []);

  // 2️⃣ Fetch dashboard data whenever the selectedBooth changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Build query string only if a specific booth is selected
        const query = selectedBooth ? `?booth_number=${selectedBooth}` : "";
        
        // Fetch all data in parallel
        const [countRes, genderRes, ageRes] = await Promise.all([
          apiClient.get(`/voters/count${query}`),
          apiClient.get(`/analysis/gender${query}`),
          apiClient.get(`/analysis/age-groups${query}`)
        ]);
        
        setStats({
          totalVoters: countRes.data.count,
          gender: genderRes.data,
          ageGroups: ageRes.data,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setStats(null); // Clear stats on error
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedBooth]); // <-- This effect re-runs when selectedBooth changes

  // 3️⃣ Handle dropdown change
  const handleBoothChange = (e) => {
    setSelectedBooth(e.target.value);
  };

  // Chart data setup (safe for when stats might be null)
  const genderChartData = {
    labels: stats ? Object.keys(stats.gender).filter(k => k !== 'married_women' && stats.gender[k] > 0) : [],
    datasets: [{
      data: stats ? Object.keys(stats.gender)
        .filter(k => k !== 'married_women' && stats.gender[k] > 0)
        .map(k => stats.gender[k]) : [],
      backgroundColor: ['#4A90E2', '#FF6B6B', '#F8E71C', '#7ED321', '#9013FE'],
    }]
  };

  const ageGroupChartData = {
    labels: stats ? Object.keys(stats.ageGroups) : [],
    datasets: [{
      label: 'Population by Age',
      data: stats ? Object.values(stats.ageGroups) : [],
      backgroundColor: 'rgba(74, 144, 226, 0.7)',
    }]
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;
  if (!stats) return <div className="error-message">No data available. Try importing data first.</div>;

  return (
    <div>
      {/* --- Booth Selector Dropdown --- */}
      <div className="dashboard-header">
        <h2>Dashboard {selectedBooth ? `(Booth #${selectedBooth})` : ""}</h2>
        <div className="dropdown-wrapper">
          <label htmlFor="booth-select">Filter by Areas:</label>
          <select id="booth-select" value={selectedBooth} onChange={handleBoothChange}>
            <option value="">All Areas</option>
            {boothList.map((booth) => (
              <option key={booth} value={booth}>
                Area {booth}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* --- Main Grid --- */}
      <div className="dashboard-grid">
        <Card title="Total Population">
          <div className="stat-number">{stats.totalVoters?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Male Population">
          <div className="stat-number">{stats.gender.male?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Female Population">
          <div className="stat-number">{stats.gender.female?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Married Women">
          <div className="stat-number">{stats.gender.married_women?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Age Group 18-25">
          <div className="stat-number">{stats.ageGroups["18_25"]?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Age Group 26-35">
          <div className="stat-number">{stats.ageGroups["26_35"]?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Age Group 36-45">
          <div className="stat-number">{stats.ageGroups["36_45"]?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Age Group 46-60">
          <div className="stat-number">{stats.ageGroups["46_60"]?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Age Group 60+">
          <div className="stat-number">{stats.ageGroups["60_plus"]?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Gender Distribution">
          <Pie data={genderChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>
        <Card title="Population Age Groups">
          <Bar data={ageGroupChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
