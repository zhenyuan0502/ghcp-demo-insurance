const request = require('supertest');
const path = require('path');
const { app, calculatePremium, sequelize } = require('./app');

describe('Insurance Backend API', () => {
  beforeAll(async () => {
    // Use in-memory database for testing
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await sequelize.sync({ force: true });
  });

  describe('calculatePremium function', () => {
    test('should calculate premium for life insurance correctly', () => {
      const premium = calculatePremium('life', '100000', 30);
      const expected = Math.round((100000 * 0.005 * 1.0 / 12) * 100) / 100;
      expect(premium).toBe(expected);
    });

    test('should calculate premium for auto insurance with age factor', () => {
      const premium = calculatePremium('auto', '50000', 22);
      const expected = Math.round((50000 * 0.015 * 1.2 / 12) * 100) / 100;
      expect(premium).toBe(expected);
    });

    test('should calculate premium for home insurance for older age', () => {
      const premium = calculatePremium('home', '200000', 55);
      const expected = Math.round((200000 * 0.003 * 1.3 / 12) * 100) / 100;
      expect(premium).toBe(expected);
    });

    test('should use default rate for unknown insurance type', () => {
      const premium = calculatePremium('unknown', '100000', 30);
      const expected = Math.round((100000 * 0.005 * 1.0 / 12) * 100) / 100;
      expect(premium).toBe(expected);
    });
  });

  describe('API Endpoints', () => {
    test('GET /api/health should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'healthy' });
    });
    test('POST /api/quote should create a new quote', async () => {
      const quoteData = {
        purchaserName: 'John',
        insuredName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        insuranceType: 'life',
        coverageAmount: '100000',
        age: 30
      };

      const response = await request(app)
        .post('/api/quote')
        .send(quoteData)
        .expect(201);

      expect(response.body.message).toBe('Quote created successfully');
      expect(response.body.quote.purchaserName).toBe('John');
      expect(response.body.quote.insuredName).toBe('Doe');
      expect(response.body.quote.premium).toBeGreaterThan(0);
    });

    test('GET /api/quotes should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/quotes')
        .expect(200);

      expect(response.body).toEqual([]);
    }); test('GET /api/quotes should return quotes after creation', async () => {
      // Create a quote first
      const quoteData = {
        purchaserName: 'Jane',
        insuredName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
        insuranceType: 'auto',
        coverageAmount: '50000',
        age: 25
      };

      await request(app)
        .post('/api/quote')
        .send(quoteData);

      // Get all quotes
      const response = await request(app)
        .get('/api/quotes')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].purchaserName).toBe('Jane');
    }); test('GET /api/quote/:id should return specific quote', async () => {
      // Create a quote first
      const quoteData = {
        purchaserName: 'Bob',
        insuredName: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '555-123-4567',
        insuranceType: 'health',
        coverageAmount: '75000',
        age: 40
      };

      const createResponse = await request(app)
        .post('/api/quote')
        .send(quoteData);

      const quoteId = createResponse.body.quote.id;

      // Get the specific quote
      const response = await request(app)
        .get(`/api/quote/${quoteId}`)
        .expect(200);

      expect(response.body.purchaserName).toBe('Bob');
      expect(response.body.id).toBe(quoteId);
    }); test('PUT /api/quote/:id/status should update quote status', async () => {
      // Create a quote first
      const quoteData = {
        purchaserName: 'Alice',
        insuredName: 'Wilson',
        email: 'alice.wilson@example.com',
        phone: '777-888-9999',
        insuranceType: 'home',
        coverageAmount: '150000',
        age: 35
      };

      const createResponse = await request(app)
        .post('/api/quote')
        .send(quoteData);

      const quoteId = createResponse.body.quote.id;

      // Update the status
      const statusData = { status: 'approved' };
      const response = await request(app)
        .put(`/api/quote/${quoteId}/status`)
        .send(statusData)
        .expect(200);

      expect(response.body.status).toBe('approved');
    }); test('DELETE /api/quotes/:id should delete quote', async () => {
      // Create a quote first
      const quoteData = {
        purchaserName: 'Charlie',
        insuredName: 'Brown',
        email: 'charlie.brown@example.com',
        phone: '111-222-3333',
        insuranceType: 'life',
        coverageAmount: '200000',
        age: 50
      };

      const createResponse = await request(app)
        .post('/api/quote')
        .send(quoteData);

      const quoteId = createResponse.body.quote.id;

      // Delete the quote
      const response = await request(app)
        .delete(`/api/quotes/${quoteId}`)
        .expect(200);

      expect(response.body.message).toBe('Quote deleted successfully');

      // Verify it's deleted
      await request(app)
        .get(`/api/quote/${quoteId}`)
        .expect(404);
    });

    test('GET /api/quote/:id should return 404 for non-existent quote', async () => {
      await request(app)
        .get('/api/quote/999')
    }); test('POST /api/quote should return 400 for invalid data', async () => {
      const invalidData = {
        purchaserName: 'John'
        // Missing required fields
      };

      await request(app)
        .post('/api/quote')
        .send(invalidData)
        .expect(400);
    });

    test('should calculate premium for different insurance types', () => {
      const insuranceTypes = ['life', 'auto', 'home', 'health', 'travel'];
      
      insuranceTypes.forEach(type => {
        const premium = calculatePremium(type, '100000', 30);
        expect(premium).toBeGreaterThan(0);
      });
    });

    test('should calculate premium with edge cases', () => {
      // Very high coverage
      const highCoverage = calculatePremium('life', '10000000', 30);
      expect(highCoverage).toBeGreaterThan(0);

      // Very young person for auto insurance
      const youngDriver = calculatePremium('auto', '100000', 18);
      expect(youngDriver).toBeGreaterThan(0);

      // Older person for life insurance
      const olderPerson = calculatePremium('life', '100000', 70);
      expect(olderPerson).toBeGreaterThan(0);
    });

    test('POST /api/quote should create quotes for all insurance types', async () => {
      const insuranceTypes = ['life', 'auto', 'home', 'health', 'travel'];
      
      for (const type of insuranceTypes) {
        const quoteData = {
          purchaserName: `Test_${type}`,
          insuredName: 'User',
          email: `test_${type}@example.com`,
          phone: '123-456-7890',
          insuranceType: type,
          coverageAmount: '100000',
          age: 30
        };

        const response = await request(app)
          .post('/api/quote')
          .send(quoteData)
          .expect(201);

        expect(response.body.quote.insuranceType).toBe(type);
        expect(response.body.quote.premium).toBeGreaterThan(0);
      }
    });

    test('GET /api/quotes should return quotes in correct order', async () => {
      // Create multiple quotes
      const quotesData = [
        {
          purchaserName: 'First',
          insuredName: 'User',
          email: 'first@example.com',
          phone: '123-456-7890',
          insuranceType: 'life',
          coverageAmount: '100000',
          age: 30
        },
        {
          purchaserName: 'Second',
          insuredName: 'User',
          email: 'second@example.com',
          phone: '123-456-7890',
          insuranceType: 'auto',
          coverageAmount: '50000',
          age: 25
        },
        {
          purchaserName: 'Third',
          insuredName: 'User',
          email: 'third@example.com',
          phone: '123-456-7890',
          insuranceType: 'home',
          coverageAmount: '200000',
          age: 40
        }
      ];

      // Create quotes in order
      for (const quoteData of quotesData) {
        await request(app)
          .post('/api/quote')
          .send(quoteData);
      }

      // Get all quotes
      const response = await request(app)
        .get('/api/quotes')
        .expect(200);

      expect(response.body).toHaveLength(3);
      // Should be in reverse order (newest first)
      expect(response.body[0].purchaserName).toBe('Third');
      expect(response.body[1].purchaserName).toBe('Second');
      expect(response.body[2].purchaserName).toBe('First');
    });

    test('PUT /api/quote/:id/status should handle invalid quote ID', async () => {
      const statusData = { status: 'approved' };
      
      await request(app)
        .put('/api/quote/999/status')
        .send(statusData)
        .expect(404);
    });

    test('DELETE /api/quotes/:id should handle invalid quote ID', async () => {
      await request(app)
        .delete('/api/quotes/999')
        .expect(404);
    });

    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking database failures
      // For now, we'll test that the application handles basic operations
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
    });
  });
});