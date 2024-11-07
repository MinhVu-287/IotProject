import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box'; // Import Box for layout
import { actionLogService } from '../service/actionLogService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the date picker

const columns = [
    { id: 'id', label: 'ID', minWidth: 70 },
    { id: 'device', label: 'Device', minWidth: 100 },
    { id: 'action', label: 'Action', minWidth: 200 },
    { id: 'time', label: 'Time', minWidth: 200 },
];

const ActionHistory = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState(null); // For start date
    const [endDate, setEndDate] = useState(null); // For end date

    useEffect(() => {
        const fetchActions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await actionLogService.getAllActionsWithCondition(page, rowsPerPage, search, startDate, endDate);
                console.log('Fetched actions response:', response);

                if (response && response.content) {
                    setRows(response.content);
                    setTotalRows(response.totalElements || 0);
                } else {
                    console.warn('Unexpected response structure:', response);
                    setError('No data available.');
                }
            } catch (error) {
                console.error('Error fetching actions:', error);
                setError('Failed to fetch actions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, [page, rowsPerPage, search, startDate, endDate]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <Card className="p-4">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <h1 className="text-2xl font-bold">Action History</h1>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        sx={{ width: 300 }}
                    />
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <div>
                        <span>Start Date: </span>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select Start Date"
                            className="date-picker"
                        />
                    </div>
                    <div>
                        <span>End Date: </span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select End Date"
                            className="date-picker"
                        />
                    </div>
                </Box>

                {loading && <div>Loading...</div>}
                {error && <div className="text-red-600 mb-4">{error}</div>}
                {rows.length === 0 && !loading && <div>No actions available.</div>} {/* Empty state handling */}
                
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                {row[column.id] ?? 'N/A'} {/* Handle null values */}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </CardContent>
        </Card>
    );
};

export default ActionHistory;
