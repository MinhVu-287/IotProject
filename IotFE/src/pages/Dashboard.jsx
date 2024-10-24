import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add axios for HTTP requests
import Card from '../components/Card';
import Chart from '../components/Chart'; // Adjust path if necessary
import { FaThermometerHalf, FaTint, FaSun } from 'react-icons/fa';
import { Grid, Paper, Typography } from '@mui/material';
import SwitchComponent from '../components/Switch'; // Import the new Switch component
import { dataSensorService } from '../service/dataSensorService';

const Dashboard = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [lightSwitchChecked, setLightSwitchChecked] = useState(false); // New state for FAN switch
  const [warningChecked, setWarningChecked] = useState(false); // New state for Warning switch
  const [latestData, setLatestData] = useState({ temperature: 0, humidity: 0, light: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLatestData = async () => {
    try {
      const data = await dataSensorService.getLatestDataSensor();
      setLatestData(data);
    } catch (err) {
      console.error('Error fetching latest data:', err);
      setError('Failed to fetch latest data.');
    }
  };

  const fetchChartData = async () => {
    try {
      const data = await dataSensorService.getAllDataSensors();
      setChartData(data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  useEffect(() => {
    fetchLatestData();
    fetchChartData();
    setLoading(false);

    const intervalId = setInterval(() => {
      fetchLatestData();
      fetchChartData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to handle LED switch change
  const handleSwitchChange = async (event) => {
    const isChecked = event.target.checked;
    setSwitchChecked(isChecked);

    try {
      const payload = { led: isChecked ? '1' : '0' };
      const response = await axios.post('http://localhost:8080/api/v1/action', payload);
      console.log('LED control response:', response.data);
    } catch (err) {
      console.error('Error controlling LED:', err);
    }
  };

  // Function to handle FAN switch change
  const handleLightSwitchChange = async (event) => {
    const isChecked = event.target.checked;
    setLightSwitchChecked(isChecked);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/action', { fan: isChecked ? '1' : '0' });
      console.log('FAN control response:', response.data);
    } catch (err) {
      console.error('Error controlling FAN:', err);
    }
  };

  // Function to handle Warning switch polling and action
  useEffect(() => {
    const fetchWarningStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/action/latest');
        const { device, action } = response.data.result;
        
        if (device === 'warning led' && action === 'high') {
          setWarningChecked(true);
          
          // Turn on the light for 5 seconds
          setTimeout(() => {
            setWarningChecked(false); // Turn off after 5 seconds
          }, 5000);
        }
      } catch (err) {
        console.error('Error fetching warning status:', err);
      }
    };

    // Poll every 0.5s
    const intervalId = setInterval(fetchWarningStatus, 500);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="pt-24">
        <div className="p-8">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <Grid container spacing={2} mb={8}>
            <Grid item lg={4} md={6} xs={12}>
              <Card
                title={`Nhiệt độ: ${latestData.temperature}°C`}
                icon={<FaThermometerHalf />}
                style={{ backgroundColor: '#FF6384' }}
              />
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <Card
                title={`Độ ẩm: ${latestData.humidity}%`}
                icon={<FaTint />}
                style={{ backgroundColor: '#36A2EB' }}
              />
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <Card
                title={`Ánh sáng: ${latestData.light} Lux`}
                icon={<FaSun />}
                style={{ backgroundColor: '#FFCE56' }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={8}>
            <Grid item lg={8} md={8} xs={12}>
              <Chart data={chartData} />
            </Grid>
            <Grid item lg={4} md={8} xs={12}>
              <Grid container spacing={7} direction="column">
                <Grid item>
                  <Paper
                    elevation={4}
                    className="p-4 bg-white rounded-lg border border-gray-300"
                    sx={{ minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                  >
                    <Typography variant="h6" gutterBottom>
                      LED
                    </Typography>
                    <SwitchComponent checked={switchChecked} onChange={handleSwitchChange} />
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper
                    elevation={4}
                    className="p-4 bg-white rounded-lg border border-gray-300"
                    sx={{ minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                  >
                    <Typography variant="h6" gutterBottom>
                      FAN
                    </Typography>
                    <SwitchComponent checked={lightSwitchChecked} onChange={handleLightSwitchChange} />
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper
                    elevation={4}
                    className="p-4 bg-white rounded-lg border border-gray-300"
                    sx={{ minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                  >
                    <Typography variant="h6" gutterBottom>
                      WARNING
                    </Typography>
                    <SwitchComponent checked={warningChecked} disabled />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
