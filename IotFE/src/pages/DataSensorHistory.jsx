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
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box'; // Import Box for layout
import { dataSensorService } from '../service/dataSensorService';

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

  useEffect(() => {
    const fetchDataSensors = async () => {
      try {
        const response = await dataSensorService.getAllDataSensorsWithCondition(page, rowsPerPage, search);
        if (response && response.content) {
          setRows(response.content.map(data => ({
            id: data.id,
            temperature: data.temperature ? `${data.temperature}°C` : 'N/A',
            humidity: data.humidity || 'N/A',
            light: data.light ? `${data.light} lux` : 'N/A',
            co2:data.co2 || 'N/A',
            timestamp: data.time || 'N/A',
          })));
          setTotalRows(response.totalElements);
        }
      } catch (error) {
        console.error('Error fetching data sensors:', error);
      }
    };

    fetchDataSensors();
  }, [page, rowsPerPage, search]);

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
        {/* Use Box to position the title and search input */}
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
                        {row[column.id]}
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
