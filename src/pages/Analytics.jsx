import React, { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../components/common/Card';
import '../assets/css/Analytics.css';

const Analytics = () => {
  const [boothData, setBoothData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const boothRes = await apiClient.get('/analysis/booth-wise');
        setBoothData({
          labels: boothRes.data.map(b => `Booth ${b.booth_number}`),
          datasets: [{
            label: 'Voters per Booth',
            data: boothRes.data.map(b => b.count),
            backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#9013FE'],
          }]
        });
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div>
      <h2>Analytics</h2>
      <div className="analytics-grid">
        {boothData && (
          <Card title="Booth-wise Voter Distribution">
            <Bar data={boothData} options={{ indexAxis: 'y' }}/>
          </Card>
        )}
        {/* You can add more charts here by fetching other analysis endpoints */}
      </div>
    </div>
  );
};

export default Analytics;