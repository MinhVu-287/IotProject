import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { format } from 'date-fns';

export default function SensorBarChart({ data }) {
  const [title, setTitle] = useState('Biểu đồ Nhiệt độ - Độ ẩm - Ánh sáng');

  // Kiểm tra xem `data` có tồn tại hay không
  if (!data || data.length === 0) {
    console.log('No data available:', data);
    return <div>Không có dữ liệu để hiển thị biểu đồ.</div>;
  }

  // Log dữ liệu ban đầu nhận được
  console.log('Raw data:', data);

  // Formatting data for the chart
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.time), 'dd/MM/yyyy HH:mm:ss'), // Format date-time
  }));

  // Log dữ liệu đã format
  console.log('Formatted data:', formattedData);

  const labels = formattedData.map((item) => item.formattedDate);
  const temperatureData = formattedData.map((item) => parseFloat(item.temperature));
  const humidityData = formattedData.map((item) => parseFloat(item.humidity));
  const lightData = formattedData.map((item) => parseFloat(item.light));
  const gasData = formattedData.map((item) => parseFloat(item.gas));

  // Log các phần dữ liệu để truyền vào biểu đồ
  console.log('Labels:', labels);
  console.log('Temperature Data:', temperatureData);
  console.log('Humidity Data:', humidityData);
  console.log('Light Data:', lightData);

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
              { label: 'Gas', data: gasData },
            ]}
            height={400}
            width={850}
            xAxis={[{ data: labels, scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            colors={['#FF6384', '#36A2EB', '#FFCE56','#56ff8e']}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
