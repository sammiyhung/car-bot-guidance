const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const { detectIntent } = require('./dialogFlowService');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.io instance
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Listen for new connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
  
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});


// Vehicles: Get all vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM vehicles');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving vehicles');
    }
  });

// Broadcast a new vehicle addition
app.post('/api/vehicles', (req, res) => {
  const newVehicle = req.body;
  // Add vehicle to the database (mock or real logic)
  io.emit('newVehicle', newVehicle); // Notify all clients
  res.status(201).json(newVehicle);
});
  
// Vehicles: Get vehicle by ID
app.get('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Vehicle not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving vehicle');
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
});
// Vehicles: Add a new vehicle (for future use)
app.post('/api/vehicles', async (req, res) => {
  const { make, model, year, price, engine_type, fuel_economy, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO vehicles (make, model, year, price, engine_type, fuel_economy, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [make, model, year, price, engine_type, fuel_economy, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding vehicle');
  }
});

// Users: Add new user
app.post('/api/users', async (req, res) => {
  const { name, email, phone, preferences } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (name, email, phone, preferences) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, preferences]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding user');
  }
});

// Users: Get user by email
app.get('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user');
  }
});

// Chatbot route
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await detectIntent(message);
    res.json({ reply: response.fulfillmentText });
  } catch (err) {
    console.error('Error with Dialogflow:', err);
    res.status(500).send('Error processing chatbot request');
  }
});

// Listen on a specific port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
