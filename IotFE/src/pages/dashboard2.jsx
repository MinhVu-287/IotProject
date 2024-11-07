import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add axios for HTTP requests
import Card from '../components/Card';
import { FaGasPump, FaLightbulb } from 'react-icons/fa';
import { Grid } from '@mui/material';
import { dataSensorService } from '../service/dataSensorService';
import CO2BarChart from '../components/CO2BarChart';
import SwitchComponent from '../components/Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
const Dashboard2 = () => {
    const [latestData, setLatestData] = useState({ co2: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Function to fetch latest data
        const fetchLatestData = async () => {
            try {
                const data = await dataSensorService.getLatestDataSensor();
                setLatestData(data);
            } catch (err) {
                console.error('Error fetching latest data:', err);
                setError('Failed to fetch latest data.');
            }
        };

        // Function to fetch chart data
        const fetchChartData = async () => {
            try {
                const data = await dataSensorService.getAllDataSensors();
                setChartData(data);
            } catch (err) {
                console.error('Error fetching chart data:', err);
            }
        };

        // Fetch data when the component mounts
        const fetchData = async () => {
            await fetchLatestData();
            await fetchChartData();
            setLoading(false);
        };

        fetchData(); // Initial fetch
        
        // Set interval to fetch data every 5 seconds
        const intervalId = setInterval(fetchLatestData, 5000);

        // Cleanup function to clear the interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-gradient-to-br from-blue-200 to-purple-300">
            <div className="pt-24">
                <div className="p-8">
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-600 mb-4">{error}</div>}

                    {/* Grid Container for Cards */}
                    <Grid container spacing={2} mb={8}>
                        {/* Single Card for CO2 Levels */}
                        <Grid item lg={6} md={6} xs={12}>
                            <Card
                                title={`CO2: ${latestData.co2}`}
                                icon={<FaGasPump />}
                                style={{ backgroundColor: '#FFCE56' }} // Custom color for CO2 card
                            />
                        </Grid>

                        {/* Card for Light Indicator */}
                        <Grid item lg={6} md={6} xs={12}>
                                {/* Lightbulb icon using FontAwesome */}
                                <FontAwesomeIcon
                                    icon={faLightbulb}
                                    style={{
                                        fontSize: 97, // Size of the icon
                                        color: latestData.co2 > 80 ? '#FFCE56' : '#9e9e9e', // Yellow when CO2 > 10, gray otherwise
                                        marginBottom: '16px', // Space below the icon
                                    }}
                                />
                                {/* <SwitchComponent checked={latestData.co2 > 10} onChange={() => {}} /> */}
                        </Grid>
                    </Grid>

                    {/* Chart section for CO2 Data */}
                    <Grid container spacing={2} mb={8}>
                        <Grid item lg={12} md={12} xs={12}>
                            <CO2BarChart data={chartData} />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default Dashboard2;
