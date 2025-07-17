import React, { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../components/common/Card';
import '../assets/css/Analytics.css';

const Analytics = () => {
  const [boothData, setBoothData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchBoothCounts = async () => {
    try {
      const boothList = await apiClient.get('/booths');
      const boothNumbers = boothList.data;
      const boothCounts = [];

      for (const booth of boothNumbers) {
        const countRes = await apiClient.get(`/voters/count?booth_number=${booth}`);
        boothCounts.push({
          booth_number: booth,
          count: countRes.data.count
        });
      }

      setBoothData({
        labels: boothCounts.map(b => `Area ${b.booth_number}`),
        datasets: [{
          label: 'Voters per Booth',
          data: boothCounts.map(b => b.count),
          backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#9013FE'],
        }]
      });
    } catch (error) {
      console.error("Failed to fetch booth-wise counts", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBoothCounts();
}, []);

  if (loading) return <div>Loading Analytics...</div>;

  return (
    <div>
      <h2>Analytics</h2>
      <div className="analytics-grid">
        {boothData && (
          <Card title="Population-wise Distribution">
            <Bar 
  data={boothData}
  height={boothData.labels.length * 10}  // dynamic height per booth
  options={{
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Population per Area',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        ticks: {
          autoSkip: false,   // <-- ensures labels like Booth 135 aren't skipped
        }
      }
    }
  }}
/>

          </Card>
        )}
        {/* You can add more charts here by fetching other analysis endpoints */}
      </div>
    </div>
  );
};

export default Analytics;