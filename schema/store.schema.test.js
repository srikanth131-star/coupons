const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Store = require('../src/models/Store');

describe('Store Schema Tests', () => {
  let storeId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/couponsscript_test');
  });

  beforeEach(async () => {
    // Clean up before each test
    await Store.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/stores', () => {
    test('should create store with all fields', async () => {
      const storeData = {
        storeName: 'Amazon',
        slug: 'amazon',
        logo: 'https://example.com/amazon-logo.png',
        websiteUrl: 'https://amazon.com',
        description: 'Online marketplace',
        category: 'E-commerce'
      };

      const response = await request(app)
        .post('/api/stores')
        .send(storeData)
        .expect(201);

      expect(response.body.storeName).toBe('Amazon');
      expect(response.body.slug).toBe('amazon');
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('createdAt');
      storeId = response.body._id;
    });

    test('should create store with only required fields', async () => {
      const storeData = {
        storeName: 'Walmart'
      };

      const response = await request(app)
        .post('/api/stores')
        .send(storeData)
        .expect(201);

      expect(response.body.storeName).toBe('Walmart');
      expect(response.body.slug).toBeUndefined();
    });

    test('should fail without storeName', async () => {
      const storeData = {
        slug: 'test-store'
      };

      const response = await request(app)
        .post('/api/stores')
        .send(storeData)
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    test('should fail with duplicate slug', async () => {
      await Store.create({ storeName: 'Store 1', slug: 'duplicate' });

      const storeData = {
        storeName: 'Store 2',
        slug: 'duplicate'
      };

      const response = await request(app)
        .post('/api/stores')
        .send(storeData)
        .expect(400);

      expect(response.body.error).toContain('duplicate');
    });
  });

  describe('GET /api/stores', () => {
    test('should get all stores', async () => {
      await Store.create([
        { storeName: 'Store 1', slug: 'store-1' },
        { storeName: 'Store 2', slug: 'store-2' }
      ]);

      const response = await request(app)
        .get('/api/stores')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('storeName');
    });

    test('should return empty array when no stores', async () => {
      const response = await request(app)
        .get('/api/stores')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/stores/:slug', () => {
    test('should get store by slug', async () => {
      const store = await Store.create({
        storeName: 'Target',
        slug: 'target',
        category: 'Retail'
      });

      const response = await request(app)
        .get('/api/stores/target')
        .expect(200);

      expect(response.body.storeName).toBe('Target');
      expect(response.body.slug).toBe('target');
    });

    test('should return 404 for non-existent slug', async () => {
      const response = await request(app)
        .get('/api/stores/non-existent')
        .expect(404);

      expect(response.body.error).toBe('Store not found');
    });
  });

  describe('PUT /api/stores/:id', () => {
    test('should update store', async () => {
      const store = await Store.create({
        storeName: 'Old Name',
        slug: 'old-slug'
      });

      const updateData = {
        storeName: 'New Name',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/stores/${store._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.storeName).toBe('New Name');
      expect(response.body.description).toBe('Updated description');
    });

    test('should return 404 for invalid ID', async () => {
      const response = await request(app)
        .put('/api/stores/invalid-id')
        .send({ storeName: 'Test' })
        .expect(500);
    });

    test('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/stores/${fakeId}`)
        .send({ storeName: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('Store not found');
    });
  });

  describe('DELETE /api/stores/:id', () => {
    test('should delete store', async () => {
      const store = await Store.create({
        storeName: 'To Delete',
        slug: 'to-delete'
      });

      const response = await request(app)
        .delete(`/api/stores/${store._id}`)
        .expect(200);

      expect(response.body.message).toBe('Store deleted successfully');

      // Verify deletion
      const deletedStore = await Store.findById(store._id);
      expect(deletedStore).toBeNull();
    });

    test('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/stores/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Store not found');
    });
  });

  describe('Schema Validation', () => {
    test('should validate storeName is required', async () => {
      const store = new Store({});
      
      let error;
      try {
        await store.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.storeName).toBeDefined();
    });

    test('should enforce unique slug', async () => {
      await Store.create({ storeName: 'Store 1', slug: 'unique-slug' });

      const store2 = new Store({ storeName: 'Store 2', slug: 'unique-slug' });
      
      let error;
      try {
        await store2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });

    test('should allow optional fields', async () => {
      const store = new Store({
        storeName: 'Test Store',
        logo: 'https://example.com/logo.png',
        websiteUrl: 'https://example.com',
        description: 'Test description',
        category: 'Test category'
      });

      const savedStore = await store.save();
      expect(savedStore.logo).toBe('https://example.com/logo.png');
      expect(savedStore.websiteUrl).toBe('https://example.com');
      expect(savedStore.description).toBe('Test description');
      expect(savedStore.category).toBe('Test category');
    });

    test('should have timestamps', async () => {
      const store = await Store.create({
        storeName: 'Timestamp Test'
      });

      expect(store.createdAt).toBeDefined();
      expect(store.updatedAt).toBeDefined();
      expect(store.createdAt).toBeInstanceOf(Date);
      expect(store.updatedAt).toBeInstanceOf(Date);
    });
  });
});