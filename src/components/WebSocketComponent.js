import React, { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import {Checkbox, Button, TextField, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchTables, fetchComparisonData } from '../api';


const WebSocketComponent = () => {
  const [tableData, setTableData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchRank, setSearchRank] = useState('')
  const [selectedTables, setSelectedTables] = useState([]);
  useEffect(() => {
    const newSocket = new WebSocketClient('wss://vinividivici.onrender.com');

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
      fetchInitialData();
    };
    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleSocketMessage(message);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(newSocket);

    // Fetch initial data and set up interval for periodic data updates
    fetchInitialData();
    const interval = setInterval(fetchInitialData, 10 * 1000); // Update every 10 seconds

    return () => {
      if (socket) {
        socket.close();
      }
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const handleSocketMessage = (message) => {
    if (message.success) {
      console.log('Table update success:', message.message);
      fetchInitialData();
    } else {
      console.error('Table update error:', message.message);
    }
  };

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const initialData = await fetchTables(token);
      console.log(initialData)
      setTableData(initialData);
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  if (tableData === null) {
    return <p>Loading...</p>;
  }

  // Reverse the tableData array to display the newest at the top
  const reversedTableData = [...tableData].reverse();

  const parseTableName = (tableName) => {
    console.log(tableName);
    if (tableName && tableName.length > 6) {
      const datePart = tableName.split('_')[1];
      const year = datePart.slice(0, 4);
      const month = datePart.slice(4, 6);
      const day = datePart.slice(6, 8);
      const hour = datePart.slice(8, 10);
      const minute = datePart.slice(10, 12);
  
      return {
        day,
        month,
        year,
        hour,
        minute,
      };
    }
    return null;
  };
  const handleCheckboxChange = (tableName) => {
    setSelectedTables((prevSelectedTables) =>
      prevSelectedTables.includes(tableName) // Check if the tableName is already in the selectedTables array
        ? prevSelectedTables.filter((table) => table !== tableName) // If yes, remove it from the array
        : [...prevSelectedTables, tableName] // If not, add it to the array
    );
  };
  
  const handleAddRemoveTables = () => {
    
    const token = localStorage.getItem('token');
    
    fetchComparisonData(token, selectedTables)
      .then((comparisonData) => {
        if (comparisonData) {
          // Handle the comparison data, e.g., update state, display results, etc.
          console.log('Comparison Data:', comparisonData);
        } else {
          console.error('Failed to fetch comparison data.');
        }
      })
      .catch((error) => {
        console.error('Error fetching comparison data:', error);
      });
  };
  
  return (
    <Container maxWidth="md">
      <Button
      variant="contained"
      onClick={handleAddRemoveTables}
      disabled={selectedTables.length < 2}
    ></Button>
      {reversedTableData.map((table) => (
        <Accordion key={table.tableName}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Checkbox
            checked={selectedTables.includes(table.tableName)}
            onChange={() => handleCheckboxChange(table.tableName)}
          />
          <Typography>
  {table.tableName} -{' '}
  {parseTableName(table.tableName)?.day}/{parseTableName(table.tableName)?.month}{' '}
  {parseTableName(table.tableName)?.hour}:{parseTableName(table.tableName)?.minute}
</Typography>

          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><TextField
                        label="Rank"
                        value={searchRank}
                        onChange={(e) => setSearchRank(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>Member ID</TableCell>
                    <TableCell>
                      <TextField
                        label="Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {table.data
                    .filter((row) =>
                      row.name.toLowerCase().includes(searchName.toLowerCase()) &&
                      (searchRank === '' || parseInt(searchRank, 10) === row.rank) // Convert searchRank to a number
                    )
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.rank}</TableCell>
                        <TableCell>{row.memberId}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default WebSocketComponent;








