const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration based on DATABASE_TYPE
let sequelizeConfig;
const dbType = process.env.DATABASE_TYPE || 'sqlite';

if (dbType === 'postgresql') {
  // PostgreSQL configuration
  const dbUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
  sequelizeConfig = {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: false,
    dialectOptions: {
      ssl: false
    }
  };
} else {
  // SQLite configuration (default)
  sequelizeConfig = {
    dialect: 'sqlite',
    storage: process.env.SQLITE_DATABASE_URL?.replace('sqlite:///', '') || path.join(__dirname, 'instance', 'insurance.db'),
    logging: false
  };
}

// Database setup
const sequelize = new Sequelize(sequelizeConfig);

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
  }, premium: {
    type: DataTypes.BIGINT, // Changed to BIGINT for VND (no decimals)
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

// Premium calculation logic for VND currency
function calculatePremium(insuranceType, coverageAmount, age) {
  // Base rates for VND (monthly premium as percentage of coverage)
  const baseRates = {
    'life': 0.0042,      // 0.42% monthly for life insurance
    'auto': 0.0125,      // 1.25% monthly for auto insurance
    'home': 0.0028,      // 0.28% monthly for home insurance
    'health': 0.0068     // 0.68% monthly for health insurance
  };

  const coverage = parseInt(coverageAmount);
  const ageInt = parseInt(age);
  const baseRate = baseRates[insuranceType] || 0.0042;

  // Age factor for Vietnamese market
  let ageFactor;
  if (ageInt < 25) {
    ageFactor = 1.2;     // Young drivers/people higher risk
  } else if (ageInt < 35) {
    ageFactor = 1.0;     // Prime age, standard rate
  } else if (ageInt < 50) {
    ageFactor = 1.1;     // Middle age, slight increase
  } else {
    ageFactor = 1.3;     // Senior, higher risk
  }

  // Calculate monthly premium in VND (round to nearest 1000 VND)
  const premium = coverage * baseRate * ageFactor;
  return Math.round(premium / 1000) * 1000; // Round to nearest 1000 VND
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
    ); const quote = await Quote.create({
      purchaserName: data.purchaserName,
      insuredName: data.insuredName,
      email: data.email,
      phone: data.phone,
      insuranceType: data.insuranceType,
      coverageAmount: data.coverageAmount,
      age: data.age,
      premium: premium
    }); res.status(201).json({
      message: 'Quote created successfully',
      quote: {
        id: quote.id,
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
    }); const quotesData = quotes.map(quote => ({
      id: quote.id,
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
    await quote.save(); res.json({
      id: quote.id,
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

// Delete quote
app.delete('/api/quotes/:id', async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    await quote.destroy();

    res.json({ message: 'Quote deleted successfully' });
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