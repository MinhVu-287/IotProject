import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { format } from 'date-fns';

export default function CO2BarChart({ data }) {
  const [title, setTitle] = useState('Biểu đồ CO2');

  // Check if data exists
  if (!data || data.length === 0) {
    console.log('No data available:', data);
    return <div>Không có dữ liệu để hiển thị biểu đồ.</div>;
  }

  // Log raw data received
  console.log('Raw data:', data);

  // Format data for the chart
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.time), 'dd/MM/yyyy HH:mm:ss'), // Format date-time
  }));

  // Log formatted data
  console.log('Formatted data:', formattedData);

  const labels = formattedData.map((item) => item.formattedDate);
  const co2Data = formattedData.map((item) => parseFloat(item.co2));

  // Log CO2 data for the chart
  console.log('CO2 Data:', co2Data);

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ display: 'flex', alignItems: 'stretch' }}>
        <Box sx={{ flexGrow: 1, paddingLeft: '10px' }}>
          <BarChart
            series={[
              { label: 'CO2 (ppm)', data: co2Data },
            ]}
            height={400}
            width={850}
            xAxis={[{ data: labels, scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            colors={['#56ff8e']} // Set color for CO2 bar
          />
        </Box>
      </CardContent>
    </Card>
  );
}
