require('dotenv').config(); // Always load this first
const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();

// --- MIDDLEWARES ---
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',   // admin frontend
    'http://localhost:3000',   // fallback
    'http://127.0.0.1:5173',
  ],
  credentials: true,           // ← allows cookies & Authorization headers
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors());      // ← handles preflight for all routes
app.use(express.json());

// --- SERVE STATIC FILES  ---

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('Backend API is running safely...');
});

// --- ERROR HANDLING (Optional but good) ---

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Something went wrong!' });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
  console.log(`📸 Images are served at: http://localhost:${PORT}/uploads`);
});