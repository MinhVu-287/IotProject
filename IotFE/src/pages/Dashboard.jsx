import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add axios for HTTP requests
import Card from '../components/Card';
import Chart from '../components/Chart'; // Adjust path if necessary
import { FaThermometerHalf, FaTint, FaSun , FaGasPump } from 'react-icons/fa';
import { Grid, Paper, Typography } from '@mui/material';
import SwitchComponent from '../components/Switch'; // Import the new Switch component
import { dataSensorService } from '../service/dataSensorService';

const Dashboard = () => {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [lightSwitchChecked, setLightSwitchChecked] = useState(false); // New state for FAN switch
  const [latestData, setLatestData] = useState({ temperature: 0, humidity: 0, light: 0 ,gas:0});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    // Fetch data when the component mounts
    fetchLatestData();
    fetchChartData();
    setLoading(false);
  }, []);

  // Function to handle LED switch change
  const handleSwitchChange = async (event) => {
    const isChecked = event.target.checked;
    setSwitchChecked(isChecked);
  
    // Log the state to verify the switch is working
    console.log('LED Switch State:', isChecked);
  
    try {
      const payload = { led: isChecked ? '1' : '0' }; // Payload to send in the request
      console.log('Sending LED control payload:', payload); // Log the payload
  
      // Send the request with the payload
      const response = await axios.post('http://localhost:8080/api/v1/action', payload);
      console.log('LED control response:', response.data); // Log the server's response
    } catch (err) {
      console.error('Error controlling LED:', err); // Log any errors
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

  return (
    <div className="bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="pt-24"> {/* Adjust the top padding to create space below the NavBar */}
        <div className="p-8"> {/* Inner div for content spacing */}
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {/* Cards section for temperature, humidity, and light */}
          <Grid container spacing={2} mb={8}>
            <Grid item lg={3} md={3} xs={12}>
              <Card
                title={`Nhiệt độ: ${latestData.temperature}°C`}
                icon={<FaThermometerHalf />}
                style={{ backgroundColor: '#FF6384' }} // Color for temperature
              />
            </Grid>
            <Grid item lg={3} md={3} xs={12}>
              <Card
                title={`Độ ẩm: ${latestData.humidity}%`}
                icon={<FaTint />}
                style={{ backgroundColor: '#36A2EB' }} // Color for humidity
              />
            </Grid>
            <Grid item lg={3} md={3} xs={12}>
              <Card
                title={`Ánh sáng: ${latestData.light} Lux`}
                icon={<FaSun />}
                style={{ backgroundColor: '#FFCE56' }} // Color for light
              />
            </Grid>
            <Grid item lg={3} md={3} xs={12}>
              <Card
                title={`Gas: ${latestData.gas}`}
                icon={<FaGasPump />}
                style={{ backgroundColor: '#FFCE56' }} // Color for light
              />
            </Grid>
          </Grid>

          {/* Main content section: chart and controls */}
          <Grid container spacing={2} mb={8}>
            <Grid item lg={8} md={8} xs={12}>
              {/* Chart component for displaying sensor data */}
              <Chart data={chartData} />
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              {/* Grid for two switches that are aligned next to each other */}
              <Grid container spacing={2} direction="column">
                <Grid item>
                  {/* First switch (LED control) */}
                  <Paper
                    elevation={3}
                    className="p-4 bg-white rounded-lg border border-gray-300"
                    sx={{
                      minHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }} // Paper styling for the first switch
                  >
                    <Typography variant="h6" gutterBottom>
                      LED
                    </Typography>
                    <SwitchComponent
                      checked={switchChecked}
                      onChange={handleSwitchChange}
                    />
                  </Paper>
                </Grid>
                <Grid item>
                  {/* Second switch (FAN control) */}
                  <Paper
                    elevation={3}
                    className="p-4 bg-white rounded-lg border border-gray-300"
                    sx={{
                      minHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }} // Paper styling for the second switch
                  >
                    <Typography variant="h6" gutterBottom>
                      FAN
                    </Typography>
                    <SwitchComponent
                      checked={lightSwitchChecked}
                      onChange={handleLightSwitchChange}
                    />
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
