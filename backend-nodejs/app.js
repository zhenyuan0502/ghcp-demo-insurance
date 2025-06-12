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
    allowNull: false,
    field: 'purchaser_name'
  },
  insuredName: {
    type: DataTypes.STRING(100),
    allowNull: false,
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
    type: DataTypes.FLOAT, // Allow decimals for premium
    allowNull: false
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
  // Base rates as expected by the tests (annual rates)
  const baseRates = {
    'life': 0.005,      // 0.5% annual for life insurance
    'auto': 0.015,      // 1.5% annual for auto insurance
    'home': 0.003       // 0.3% annual for home insurance
  };

  const coverage = parseInt(coverageAmount);
  const ageInt = parseInt(age);
  const baseRate = baseRates[insuranceType] || 0.005;

  // Age factor as expected by the tests
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

  // Calculate monthly premium (divide by 12), round to 2 decimals
  const premium = coverage * baseRate * ageFactor / 12;
  return Math.round(premium * 100) / 100;
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
      premium: typeof quote.premium === 'string' ? Number(quote.premium) : quote.premium,
      status: quote.status,
      createdAt: quote.createdAt ? quote.createdAt.toISOString() : null
    }));

    res.json(quotesData);
  } catch (error) {
    console.error('Error fetching quotes:', error);
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

// Export for testing
module.exports = { app, calculatePremium, sequelize, Quote };

// Start server only if this file is run directly
if (require.main === module) {
  startServer();
}