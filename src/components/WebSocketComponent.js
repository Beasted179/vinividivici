import React, { useState, useEffect } from 'react';
import { w3cwebsocket as WebSocketClient } from 'websocket';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchTables } from '../api';

const WebSocketComponent = () => {
  const [tableData, setTableData] = useState(null);
  const [socket, setSocket] = useState(null);

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

  return (
    <Container maxWidth="md">
      {reversedTableData.map((table) => (
        <Accordion key={table.tableName}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{table.tableName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
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
                      row.name.toLowerCase().includes(searchName.toLowerCase())
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








