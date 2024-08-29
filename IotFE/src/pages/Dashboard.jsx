import React, { useState } from 'react';
import Card from '../components/Card';
import Chart from '../components/Chart'; // Adjust path if necessary
import { FaThermometerHalf, FaTint, FaSun } from 'react-icons/fa';
import { Grid, Paper } from '@mui/material';
import SwitchComponent from '../components/Switch'; // Import the new Switch component

// Sample data for the chart
const sampleData = [
  { date: '2024-08-01', temperature: 25, humidity: 60, light: 300 },
  { date: '2024-08-02', temperature: 26, humidity: 62, light: 320 },
  { date: '2024-08-03', temperature: 27, humidity: 65, light: 310 },
  // Add more data as needed
];

const Dashboard = () => {
  const [switchChecked, setSwitchChecked] = useState(false);

  const handleSwitchChange = (event) => {
    setSwitchChecked(event.target.checked);
  };

  return (
    <div className="bg-gradient-to-br from-blue-200 to-purple-300">
      {/* Navbar section */}
      {/* <div className="min-h-screen sticky top-0 z-10"> 
        <NavBar />
      </div> */}

      {/* Content section */}
      <div className="pt-24"> {/* Adjust the top padding to create space below the NavBar */}
        <div className="p-8"> {/* Inner div for content spacing */}
          {/* Cards section for temperature, humidity, and light */}
          <Grid container spacing={2} mb={8}>
            <Grid item lg={4} md={6} xs={12}>
              <Card
                title="Nhiệt độ: °C"
                icon={<FaThermometerHalf />}
                style={{ backgroundColor: '#FF6384' }} // Color for temperature
              />
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <Card
                title="Độ ẩm: %"
                icon={<FaTint />}
                style={{ backgroundColor: '#36A2EB' }} // Color for humidity
              />
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <Card
                title="Ánh sáng: Lux"
                icon={<FaSun />}
                style={{ backgroundColor: '#FFCE56' }} // Color for light
              />
            </Grid>
          </Grid>

          {/* Main content section: chart and controls */}
          <Grid container spacing={2} mb={8}>
            <Grid item lg={8} md={8} xs={12}>
              {/* Chart component for displaying sensor data */}
              <Chart data={sampleData} />
            </Grid>
            <Grid item lg={4} md={4} xs={12}>
              {/* Controls section with card-like appearance */}
              <Paper
                elevation={3}
                className="p-4 bg-white rounded-lg border border-gray-300"
                sx={{
                  minHeight: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }} // Adjust the height to match the chart and center the content
              >
                <SwitchComponent
                  checked={switchChecked}
                  onChange={handleSwitchChange}
                />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
