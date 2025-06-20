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

// Use in-memory SQLite for testing
if (process.env.NODE_ENV === 'test') {
  sequelizeConfig = {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  };
} else if (dbType === 'postgresql') {
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

// Claim Model
const Claim = sequelize.define('Claim', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Policyholder Information
  policyholderName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'policyholder_name'
  },
  policyNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'policy_number'
  },
  contactNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'contact_number'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Incident Details
  incidentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'incident_date'
  },
  incidentTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'incident_time'
  },
  incidentLocation: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'incident_location'
  },
  incidentDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'incident_description'
  },
  claimType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'claim_type'
  },
  // Claim Details
  estimatedCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'estimated_cost'
  },
  itemsAffected: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'items_affected'
  },
  policeReportFiled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'police_report_filed'
  },
  policeReportNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'police_report_number'
  },
  // Banking Information
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'bank_name'
  },
  accountHolderName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'account_holder_name'
  },
  accountNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'account_number'
  },
  swiftCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'swift_code'
  },
  // Declaration
  informationConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'information_confirmed'
  },
  signature: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Status and timestamps
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'submitted'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'claim',
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

// Claim Routes
// Create claim
app.post('/api/claim', async (req, res) => {
  try {
    const data = req.body;

    const claim = await Claim.create({
      policyholderName: data.policyholderName,
      policyNumber: data.policyNumber,
      contactNumber: data.contactNumber,
      email: data.email,
      incidentDate: data.incidentDate,
      incidentTime: data.incidentTime,
      incidentLocation: data.incidentLocation,
      incidentDescription: data.incidentDescription,
      claimType: data.claimType,
      estimatedCost: data.estimatedCost,
      itemsAffected: data.itemsAffected,
      policeReportFiled: data.policeReportFiled,
      policeReportNumber: data.policeReportNumber || null,
      bankName: data.bankName,
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      swiftCode: data.swiftCode || null,
      informationConfirmed: data.informationConfirmed,
      signature: data.signature
    });

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim: {
        id: claim.id,
        policyholderName: claim.policyholderName,
        policyNumber: claim.policyNumber,
        contactNumber: claim.contactNumber,
        email: claim.email,
        incidentDate: claim.incidentDate,
        incidentTime: claim.incidentTime,
        incidentLocation: claim.incidentLocation,
        incidentDescription: claim.incidentDescription,
        claimType: claim.claimType,
        estimatedCost: claim.estimatedCost,
        itemsAffected: claim.itemsAffected,
        policeReportFiled: claim.policeReportFiled,
        policeReportNumber: claim.policeReportNumber,
        bankName: claim.bankName,
        accountHolderName: claim.accountHolderName,
        accountNumber: claim.accountNumber,
        swiftCode: claim.swiftCode,
        informationConfirmed: claim.informationConfirmed,
        signature: claim.signature,
        status: claim.status,
        createdAt: claim.createdAt.toISOString()
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all claims
app.get('/api/claims', async (req, res) => {
  try {
    const claims = await Claim.findAll({
      order: [['createdAt', 'DESC']]
    });

    const claimsData = claims.map(claim => ({
      id: claim.id,
      policyholderName: claim.policyholderName,
      policyNumber: claim.policyNumber,
      contactNumber: claim.contactNumber,
      email: claim.email,
      incidentDate: claim.incidentDate,
      incidentTime: claim.incidentTime,
      incidentLocation: claim.incidentLocation,
      incidentDescription: claim.incidentDescription,
      claimType: claim.claimType,
      estimatedCost: typeof claim.estimatedCost === 'string' ? Number(claim.estimatedCost) : claim.estimatedCost,
      itemsAffected: claim.itemsAffected,
      policeReportFiled: claim.policeReportFiled,
      policeReportNumber: claim.policeReportNumber,
      bankName: claim.bankName,
      accountHolderName: claim.accountHolderName,
      accountNumber: claim.accountNumber,
      swiftCode: claim.swiftCode,
      informationConfirmed: claim.informationConfirmed,
      signature: claim.signature,
      status: claim.status,
      createdAt: claim.createdAt ? claim.createdAt.toISOString() : null
    }));

    res.json(claimsData);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get specific claim
app.get('/api/claim/:id', async (req, res) => {
  try {
    const claim = await Claim.findByPk(req.params.id);

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json({
      id: claim.id,
      policyholderName: claim.policyholderName,
      policyNumber: claim.policyNumber,
      contactNumber: claim.contactNumber,
      email: claim.email,
      incidentDate: claim.incidentDate,
      incidentTime: claim.incidentTime,
      incidentLocation: claim.incidentLocation,
      incidentDescription: claim.incidentDescription,
      claimType: claim.claimType,
      estimatedCost: claim.estimatedCost,
      itemsAffected: claim.itemsAffected,
      policeReportFiled: claim.policeReportFiled,
      policeReportNumber: claim.policeReportNumber,
      bankName: claim.bankName,
      accountHolderName: claim.accountHolderName,
      accountNumber: claim.accountNumber,
      swiftCode: claim.swiftCode,
      informationConfirmed: claim.informationConfirmed,
      signature: claim.signature,
      status: claim.status,
      createdAt: claim.createdAt.toISOString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update claim status
app.put('/api/claim/:id/status', async (req, res) => {
  try {
    const claim = await Claim.findByPk(req.params.id);

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    claim.status = req.body.status;
    await claim.save();

    res.json({
      id: claim.id,
      policyholderName: claim.policyholderName,
      policyNumber: claim.policyNumber,
      status: claim.status,
      createdAt: claim.createdAt.toISOString()
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

// Export for testing
module.exports = { app, calculatePremium, sequelize, Quote, Claim };

// Start server only if this file is run directly
if (require.main === module) {
  startServer();
}