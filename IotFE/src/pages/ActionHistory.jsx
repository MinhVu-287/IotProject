import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

const ActionHistory = () => {
    // Placeholder data for the table
    const rows = [
        { id: 1, action: 'Created new sensor', timestamp: '2024-09-12 10:30:00' },
        { id: 2, action: 'Updated sensor configuration', timestamp: '2024-09-12 11:00:00' },
    ];

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'action', headerName: 'Hành động', width: 300 },
        { field: 'timestamp', headerName: 'Thời gian', width: 200 },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Action History</h1>
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

export default ActionHistory;

