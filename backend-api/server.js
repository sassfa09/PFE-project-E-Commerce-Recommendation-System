console.log("Server Started")

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Test Route
app.get('/', (req, res) => {
  res.send('🚀 Backend API is running...');
});

// 2. Get All Products (Test Database)
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product');
    res.json(rows);
  } catch (err) {
    console.error('❌ Database Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is flying on port ${PORT}`);
});