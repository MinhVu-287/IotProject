import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

const DataSensorHistory = () => {
    // Placeholder data for the table
    const rows = [
        { id: 1, temperature: '25°C', humidity: '60%', light: '300 lux', timestamp: '2024-09-12 10:30:00' },
        { id: 2, temperature: '26°C', humidity: '58%', light: '320 lux', timestamp: '2024-09-12 10:31:00' },
    ];

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'temperature', headerName: 'Nhiệt độ', width: 150 },
        { field: 'humidity', headerName: 'Độ ẩm', width: 150 },
        { field: 'light', headerName: 'Ánh sáng', width: 150 },
        { field: 'timestamp', headerName: 'Thời gian', width: 200 },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Data Sensor History</h1>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    );
}

export default DataSensorHistory;
