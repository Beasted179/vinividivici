const { client } = require('./client.js');
const { dataController, authController } = require('./controllers/index.js');
const { intervalFunction } = require('./intervalLogic/intervalFunction.js');
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to handle all routes under /api
app.use('/api', authController.authenticateToken);

app.get('/', function (req, res) {
  res.render('index', {});
});

// Authentication route
app.post('/api/authenticate', authController.authenticate);

// Protected route that requires authentication
app.get('/api/user',authController.authenticateToken, async (req, res) => {
  try {
    const data = await dataController.fetchUser(req.user.apiKey);
    console.log(data)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

app.get('/api/tables', async (req, res) => {
  try {
    const tables = await dataController.fetchTableData(req.user.apiKey);
    console.log('Tables sent to user:', tables); // Log the tables data
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables.' });
  }
});

const server = http.createServer(app); // Create the HTTP server
const wss = new WebSocket.Server({ server }); // Create the WebSocket server

const interval = 1800* 1000; // 1 minute in milliseconds

// Connect to the database and start the server
client.connect()
  .then(() => {
    const preferredPort = 3001;
    const fallbackPort = 3002;
    const PORT = process.env.PORT || preferredPort;

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      setInterval(() => {
        intervalFunction(); // Pass the wss instance here
      }, interval);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying fallback port ${fallbackPort}`);
        server.listen(fallbackPort, () => {
          console.log(`Server is running on fallback port ${fallbackPort}`);
          setInterval(() => {
            intervalFunction(); // Pass the wss instance here
          }, interval);
        });
      } else {
        console.error('An error occurred:', err);
      }
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });


