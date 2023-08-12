const dotenv = require("dotenv")
dotenv.config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authController = require('./controllers/authController');
const dataController = require('./controllers/dataController');
const {client} = require("./client.js")
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Authentication route
app.post('/api/authenticate', authController.authenticate);

// Protected route that requires authentication
app.get('/api/user', authController.authenticateToken, async (req, res) => {
  try {
    const data = await dataController.fetchUser(req.user.apiKey);
    console.log(data)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

client.connect()

// Start the server
const PORT = process.env.PGPORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

