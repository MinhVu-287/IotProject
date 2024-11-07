import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { FaGasPump } from 'react-icons/fa';
import { Grid } from '@mui/material';
import { dataSensorService } from '../service/dataSensorService';
import CO2BarChart from '../components/CO2BarChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

const Dashboard2 = () => {
    const [latestData, setLatestData] = useState({ co2: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        const fetchLatestData = async () => {
            try {
                const data = await dataSensorService.getLatestDataSensor();
                setLatestData(data);
                if (data.co2 > 60) {
                    setBlink(true);
                }
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
    
        const fetchData = async () => {
            await fetchLatestData();
            await fetchChartData();
            setLoading(false);
        };
    
        fetchData();
        
        const intervalId = setInterval(() => {
            fetchLatestData();
            fetchChartData();
        }, 5000);
    
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (blink) {
            const timer = setTimeout(() => setBlink(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [blink]);

    return (
        <div className="bg-gradient-to-br from-blue-200 to-purple-300">
            <style>
                {`
                    @keyframes blink-animation {
                        0% { opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 1; }
                    }

                    .blink {
                        animation: blink-animation 0.5s steps(5, start) 3;
                    }
                `}
            </style>
            <div className="pt-24">
                <div className="p-8">
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-600 mb-4">{error}</div>}

                    <Grid container spacing={2} mb={8}>
                        <Grid item lg={4} md={4} xs={12}>
                            <Card
                                title={`CO2: ${latestData.co2}`}
                                icon={<FaGasPump />}
                                style={{ backgroundColor: '#FFCE56' }}
                            />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12}>
                            <CO2BarChart data={chartData} />
                        </Grid>

                        <Grid item lg={4} md={4} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon
                                icon={faLightbulb}
                                className={blink ? 'blink' : ''}
                                style={{
                                    fontSize: 97,
                                    color: latestData.co2 > 60 ? '#FFCE56' : '#9e9e9e',
                                    marginBottom: '16px',
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default Dashboard2;
