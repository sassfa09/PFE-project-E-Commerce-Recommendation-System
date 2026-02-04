require('dotenv').config(); // Always load this first
const express = require('express');
const cors = require('cors');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // One time is enough
app.use(express.json());

// --- ROUTES ---
// All routes are now separated into their own files (Clean Code)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('Backend API is running safely...');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is flying on port ${PORT}`);
});
