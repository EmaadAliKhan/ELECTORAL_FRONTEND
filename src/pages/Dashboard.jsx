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

  const [boothList, setBoothList] = useState([]);
const [selectedBooth, setSelectedBooth] = useState("");

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

const handleBoothChange = (e) => {
  setSelectedBooth(e.target.value);
};

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const query = selectedBooth ? `?booth_number=${selectedBooth}` : "";
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
    } finally {
      setLoading(false);
    }
  };
  fetchDashboardData();
}, [selectedBooth]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [countRes, genderRes, ageRes] = await Promise.all([
          apiClient.get('/voters/count'),
          apiClient.get('/analysis/gender'),
          apiClient.get('/analysis/age-groups')
        ]);
        setStats({
          totalVoters: countRes.data.count,
          gender: genderRes.data,
          ageGroups: ageRes.data,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;
  if (!stats) return <div>No data available.</div>;

  const genderChartData = {
    labels: Object.keys(stats.gender).filter(k => k !== 'married_women'),
    datasets: [{
      data: Object.keys(stats.gender)
        .filter(k => k !== 'married_women')
        .map(k => stats.gender[k]),
      backgroundColor: ['#4A90E2', '#FF6B6B', '#F8E71C'],
    }]
  };

  const ageGroupChartData = {
    labels: Object.keys(stats.ageGroups),
    datasets: [{
      label: 'Voters by Age',
      data: Object.values(stats.ageGroups),
      backgroundColor: 'rgba(74, 144, 226, 0.7)',
    }]
  };

  return (
    <div className="dashboard-grid">
      <Card title="Total Voters">
        <div className="stat-number">{stats.totalVoters.toLocaleString()}</div>
      </Card>

      <Card title="Male Voters">
        <div className="stat-number">{stats.gender.male?.toLocaleString() || 0}</div>
      </Card>

      <Card title="Female Voters">
        <div className="stat-number">{stats.gender.female?.toLocaleString() || 0}</div>
      </Card>

      <Card title="Married Women">
        <div className="stat-number">{stats.gender.married_women?.toLocaleString() || 0}</div>
      </Card>

      <Card title="Age Group 18-25">
        <div className="stat-number">{stats.ageGroups["18_25"]}</div>
      </Card>

      <Card title="Age Group 26-35">
        <div className="stat-number">{stats.ageGroups["26_35"]}</div>
      </Card>

      <Card title="Age Group 36-45">
        <div className="stat-number">{stats.ageGroups["36_45"]}</div>
      </Card>

      <Card title="Age Group 46-60">
        <div className="stat-number">{stats.ageGroups["46_60"]}</div>
      </Card>

      <Card title="Age Group 60+">
        <div className="stat-number">{stats.ageGroups["60_plus"]}</div>
      </Card>

      <Card title="Gender Distribution (Pie)">
        <Pie data={genderChartData} />
      </Card>

      <Card title="Voter Age Groups (Bar)">
        <Bar data={ageGroupChartData} options={{ responsive: true }} />
      </Card>
      <div className="dropdown-wrapper">
  <label>Select Booth:</label>
  <select value={selectedBooth} onChange={handleBoothChange}>
    <option value="">All Booths</option>
    {boothList.map((booth) => (
      <option key={booth} value={booth}>
        Booth {booth}
      </option>
    ))}
  </select>
</div>
    </div>
  );
};

export default Dashboard;
