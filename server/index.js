require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Memory optimization
process.setMaxListeners(10);

// CORS
app.use(cors({
  origin: ['https://asiasib.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Check required env vars
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// MongoDB connection with optimization
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  minOrder: { type: Number, required: true },
  unit: { type: String, default: 'кг' },
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  clientName: String,
  clientPhone: String,
  clientAddress: String,
  totalAmount: Number,
  status: { type: String, default: 'Принят' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Auth middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products.map(p => ({ ...p, id: p._id.toString() })));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(400).json({ error: 'Error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch {
    res.status(400).json({ error: 'Invalid order' });
  }
});

app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Server start error:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});