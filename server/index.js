require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: ['https://asiasib.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Mock data
let products = [
  {
    id: '1',
    name: 'Огурцы свежие',
    category: 'овощи',
    price: 50,
    minOrder: 10,
    unit: 'кг',
    description: 'Свежие огурцы',
    image: 'https://images.unsplash.com/photo-1560433802-62c9db426a4d?w=400'
  }
];

let orders = [];

// Auth middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', authenticateAdmin, (req, res) => {
  const product = { ...req.body, id: Date.now().toString() };
  products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', authenticateAdmin, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  products[index] = { ...req.body, id: req.params.id };
  res.json(products[index]);
});

app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ message: 'Deleted' });
});

app.post('/api/orders', (req, res) => {
  const order = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', authenticateAdmin, (req, res) => {
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || '633100admin')) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});