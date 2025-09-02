const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: ['https://asiasib-clean.vercel.app', 'https://asiasib.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Auth middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error');
    process.exit(1);
  });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Multer configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  minOrder: { type: Number, required: true },
  unit: { type: String, default: 'кг' },
  description: String,
  shelfLife: String,
  allergens: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  customerInfo: {
    name: String,
    phone: { type: String, required: true },
    address: String,
    telegramId: Number
  },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Принят', 'В обработке', 'В доставке', 'Завершен', 'Отменен'],
    default: 'Принят' 
  },
  comments: String,
  orderSource: { type: String, enum: ['web', 'telegram'], default: 'web' },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.replace(/[<>]/g, '').trim();
  }
  return input;
};

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'OptBazar API is running', timestamp: new Date().toISOString() });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    const transformedProducts = products.map(product => ({
      ...product.toObject(),
      id: product._id.toString()
    }));
    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products');
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const sanitizedBody = {
      name: sanitizeInput(req.body.name),
      category: sanitizeInput(req.body.category),
      price: Number(req.body.price),
      minOrder: Number(req.body.minOrder),
      description: sanitizeInput(req.body.description),
      shelfLife: sanitizeInput(req.body.shelfLife),
      allergens: sanitizeInput(req.body.allergens),
      image: sanitizeInput(req.body.image)
    };

    const product = new Product(sanitizedBody);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Invalid product data' });
  }
});

app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const sanitizedBody = {
      name: sanitizeInput(req.body.name),
      category: sanitizeInput(req.body.category),
      price: Number(req.body.price),
      minOrder: Number(req.body.minOrder),
      description: sanitizeInput(req.body.description),
      shelfLife: sanitizeInput(req.body.shelfLife),
      allergens: sanitizeInput(req.body.allergens),
      image: sanitizeInput(req.body.image)
    };

    const product = await Product.findByIdAndUpdate(req.params.id, sanitizedBody, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Invalid product data' });
  }
});

app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Orders API
app.post('/api/orders', async (req, res) => {
  try {
    const sanitizedOrder = {
      ...req.body,
      customerInfo: {
        name: sanitizeInput(req.body.customerInfo?.name),
        phone: sanitizeInput(req.body.customerInfo?.phone),
        address: sanitizeInput(req.body.customerInfo?.address)
      },
      comments: sanitizeInput(req.body.comments)
    };

    const order = new Order(sanitizedOrder);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Invalid order data' });
  }
});

app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Принят', 'В обработке', 'В доставке', 'Завершен', 'Отменен'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Admin authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_PASSWORD || !JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error occurred');
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database
const initializeDatabase = async () => {
  try {
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      const sampleProducts = [
        {
          name: "Огурцы свежие",
          category: "овощи",
          price: 50,
          minOrder: 10,
          unit: "кг",
          description: "Свежие огурцы прямо с грядки",
          shelfLife: "7 дней",
          allergens: "Нет",
          image: "https://images.unsplash.com/photo-1560433802-62c9db426a4d?w=400"
        },
        {
          name: "Яблоки Гала",
          category: "фрукты",
          price: 120,
          minOrder: 20,
          unit: "кг",
          description: "Сладкие и сочные яблоки",
          shelfLife: "14 дней",
          allergens: "Нет",
          image: "https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?w=400"
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('Sample products added');
    }
  } catch (error) {
    console.error('Database initialization error');
  }
};

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server start error');
    process.exit(1);
  }
}

startServer();