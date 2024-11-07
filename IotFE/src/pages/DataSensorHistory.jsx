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
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const columns = [
  { id: 'id', label: 'ID', minWidth: 70 },
  { id: 'temperature', label: 'Nhiệt độ', minWidth: 150 },
  { id: 'humidity', label: 'Độ ẩm', minWidth: 150 },
  { id: 'light', label: 'Ánh sáng', minWidth: 150 },
  { id: 'co2', label: 'Co2', minWidth: 150 },
  { id: 'timestamp', label: 'Thời gian', minWidth: 200 },
];

const DataSensorHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchDataSensors = async () => {
      try {
        const response = await dataSensorService.getAllDataSensorsWithCondition(page, rowsPerPage, search, startDate, endDate);
        if (response && response.content) {
          setRows(response.content.map(data => ({
            id: data.id,
            temperature: data.temperature ? `${data.temperature}°C` : 'N/A',
            humidity: data.humidity || 'N/A',
            light: data.light ? `${data.light} lux` : 'N/A',
            co2: data.co2 || 'N/A',
            timestamp: data.time || 'N/A',
          })));
          setTotalRows(response.totalElements);
        }
      } catch (error) {
        console.error('Error fetching data sensors:', error);
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
  };

  return (
    <Card className="p-4">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h1 className="text-2xl font-bold">Data Sensor History</h1>
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
                        {row[column.id] ?? 'N/A'}
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

export default DataSensorHistory;
