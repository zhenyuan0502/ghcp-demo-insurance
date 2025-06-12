const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || path.join(__dirname, 'instance', 'insurance.db'),
  logging: false
});

// Middleware
app.use(cors());
app.use(express.json());

// Quote Model
const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name'
  },
  purchaserName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'purchaser_name'
  },
  insuredName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'insured_name'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  insuranceType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'insurance_type'
  },
  coverageAmount: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'coverage_amount'
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  premium: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'quote',
  timestamps: false
});

// Premium calculation logic (same as Python backend)
function calculatePremium(insuranceType, coverageAmount, age) {
  const baseRates = {
    'life': 0.005,
    'auto': 0.015,
    'home': 0.003,
    'health': 0.008
  };
  
  const coverage = parseInt(coverageAmount);
  const ageInt = parseInt(age);
  const baseRate = baseRates[insuranceType] || 0.005;
  
  // Age factor
  let ageFactor;
  if (ageInt < 25) {
    ageFactor = 1.2;
  } else if (ageInt < 35) {
    ageFactor = 1.0;
  } else if (ageInt < 50) {
    ageFactor = 1.1;
  } else {
    ageFactor = 1.3;
  }
  
  const premium = coverage * baseRate * ageFactor / 12; // Monthly premium
  return Math.round(premium * 100) / 100; // Round to 2 decimal places
}

// Routes
// Create quote
app.post('/api/quote', async (req, res) => {
  try {
    const data = req.body;
    
    // Calculate premium
    const premium = calculatePremium(
      data.insuranceType,
      data.coverageAmount,
      data.age
    );
    
    const quote = await Quote.create({
      firstName: data.firstName,
      lastName: data.lastName,
      purchaserName: data.purchaserName,
      insuredName: data.insuredName,
      email: data.email,
      phone: data.phone,
      insuranceType: data.insuranceType,
      coverageAmount: data.coverageAmount,
      age: data.age,
      premium: premium
    });
    
    res.status(201).json({
      message: 'Quote created successfully',
      quote: {
        id: quote.id,
        firstName: quote.firstName,
        lastName: quote.lastName,
        purchaserName: quote.purchaserName,
        insuredName: quote.insuredName,
        email: quote.email,
        phone: quote.phone,
        insuranceType: quote.insuranceType,
        coverageAmount: quote.coverageAmount,
        age: quote.age,
        premium: quote.premium,
        status: quote.status,
        createdAt: quote.createdAt.toISOString()
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all quotes
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    const quotesData = quotes.map(quote => ({
      id: quote.id,
      firstName: quote.firstName,
      lastName: quote.lastName,
      purchaserName: quote.purchaserName,
      insuredName: quote.insuredName,
      email: quote.email,
      phone: quote.phone,
      insuranceType: quote.insuranceType,
      coverageAmount: quote.coverageAmount,
      age: quote.age,
      premium: quote.premium,
      status: quote.status,
      createdAt: quote.createdAt.toISOString()
    }));
    
    res.json(quotesData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific quote
app.get('/api/quote/:id', async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json({
      id: quote.id,
      firstName: quote.firstName,
      lastName: quote.lastName,
      purchaserName: quote.purchaserName,
      insuredName: quote.insuredName,
      email: quote.email,
      phone: quote.phone,
      insuranceType: quote.insuranceType,
      coverageAmount: quote.coverageAmount,
      age: quote.age,
      premium: quote.premium,
      status: quote.status,
      createdAt: quote.createdAt.toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update quote status (both endpoints like Python backend)
app.put('/api/quote/:id/status', async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    quote.status = req.body.status;
    await quote.save();
    
    res.json({
      id: quote.id,
      firstName: quote.firstName,
      lastName: quote.lastName,
      purchaserName: quote.purchaserName,
      insuredName: quote.insuredName,
      email: quote.email,
      phone: quote.phone,
      insuranceType: quote.insuranceType,
      coverageAmount: quote.coverageAmount,
      age: quote.age,
      premium: quote.premium,
      status: quote.status,
      createdAt: quote.createdAt.toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/quotes/:id/status', async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    quote.status = req.body.status;
    await quote.save();
    
    res.json({
      id: quote.id,
      firstName: quote.firstName,
      lastName: quote.lastName,
      purchaserName: quote.purchaserName,
      insuredName: quote.insuredName,
      email: quote.email,
      phone: quote.phone,
      insuranceType: quote.insuranceType,
      coverageAmount: quote.coverageAmount,
      age: quote.age,
      premium: quote.premium,
      status: quote.status,
      createdAt: quote.createdAt.toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Create instance directory if it doesn't exist
    const fs = require('fs');
    const instanceDir = path.join(__dirname, 'instance');
    if (!fs.existsSync(instanceDir)) {
      fs.mkdirSync(instanceDir, { recursive: true });
    }
    
    // Sync database
    await sequelize.sync();
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();