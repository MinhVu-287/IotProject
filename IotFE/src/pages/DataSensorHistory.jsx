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
import Box from '@mui/material/Box';
import { dataSensorService } from '../service/dataSensorService';

const columns = [
  { id: 'id', label: 'ID', minWidth: 70 },
  { id: 'temperature', label: 'Nhiệt độ', minWidth: 150 },
  { id: 'humidity', label: 'Độ ẩm', minWidth: 150 },
  { id: 'light', label: 'Ánh sáng', minWidth: 150 },
  { id: 'time', label: 'Thời gian', minWidth: 200 },
];

const DataSensorHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataSensors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dataSensorService.getAllDataSensorsWithCondition(
          page,
          rowsPerPage,
          search,
          startDate,
          endDate
        );

        if (response && response.content) {
          setRows(
            response.content.map((data) => ({
              id: data.id,
              temperature: data.temperature ? `${data.temperature}°C` : 'N/A',
              humidity: data.humidity || 'N/A',
              light: data.light ? `${data.light} lux` : 'N/A',
              time: data.time || 'N/A',
            }))
          );
          setTotalRows(response.totalElements);
        } else {
          console.warn('Unexpected response structure:', response);
          setRows([]);
          setTotalRows(0);
        }
      } catch (error) {
        console.error('Error fetching data sensors:', error);
        setError('Failed to fetch data sensors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDataSensors();
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
    setPage(0);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setPage(0);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setPage(0);
  };

  return (
    <Card className="p-4">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h1 className="text-2xl font-bold">Data Sensor History</h1>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              size="small"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              size="small"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
          />
        </Box>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {rows.length === 0 && !loading && <div>No data sensors available.</div>}
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
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
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

export default DataSensorHistory;
