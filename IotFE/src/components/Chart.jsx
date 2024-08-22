import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { format } from 'date-fns';

export default function SensorBarChart({ data }) {
  const [title, setTitle] = useState('Biểu đồ Nhiệt độ - Độ ẩm - Ánh sáng');

  // Formatting data for the chart
  const formattedData = data?.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.date), 'dd/MM/yyyy'),
  }));

  const labels = formattedData.map((item) => item.formattedDate);
  const temperatureData = formattedData.map((item) => item.temperature);
  const humidityData = formattedData.map((item) => item.humidity);
  const lightData = formattedData.map((item) => item.light);

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ display: 'flex', alignItems: 'stretch' }}>
        <Box sx={{ flexGrow: 1, paddingLeft: '10px' }}>
          <BarChart
            series={[
              { label: 'Nhiệt độ (°C)', data: temperatureData },
              { label: 'Độ ẩm (%)', data: humidityData },
              { label: 'Ánh sáng (Lux)', data: lightData },
            ]}
            height={400}
            width={850}
            xAxis={[{ data: labels, scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            colors={['#FF6384', '#36A2EB', '#FFCE56']}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
