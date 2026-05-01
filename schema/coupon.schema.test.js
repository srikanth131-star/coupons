const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Coupon = require('../src/models/Coupon');
const Store = require('../src/models/Store');

describe('Coupon Schema Tests', () => {
  let storeId;
  let couponId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/couponsscript_test');
    
    // Create a test store for coupon references
    const store = await Store.create({
      storeName: 'Test Store',
      slug: 'test-store'
    });
    storeId = store._id;
  });

  beforeEach(async () => {
    // Clean up before each test
    await Coupon.deleteMany({});
  });

  afterAll(async () => {
    await Store.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/coupons', () => {
    test('should create coupon with all fields', async () => {
      const couponData = {
        title: '50% Off Electronics',
        code: 'SAVE50',
        description: 'Get 50% discount on all electronics',
        storeId: storeId,
        discountType: 'percentage',
        discountValue: 50,
        expiryDate: new Date('2024-12-31'),
        category: 'Electronics',
        tags: ['electronics', 'discount', 'sale']
      };

      const response = await request(app)
        .post('/api/coupons')
        .send(couponData)
        .expect(201);

      expect(response.body.title).toBe('50% Off Electronics');
      expect(response.body.code).toBe('SAVE50');
      expect(response.body.discountType).toBe('percentage');
      expect(response.body.discountValue).toBe(50);
      expect(response.body.clickCount).toBe(0);
      expect(response.body.tags).toEqual(['electronics', 'discount', 'sale']);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('createdAt');
      couponId = response.body._id;
    });

    test('should create coupon with only required fields', async () => {
      const couponData = {
        title: 'Basic Coupon',
        code: 'BASIC10',
        storeId: storeId
      };

      const response = await request(app)
        .post('/api/coupons')
        .send(couponData)
        .expect(201);

      expect(response.body.title).toBe('Basic Coupon');
      expect(response.body.code).toBe('BASIC10');
      expect(response.body.clickCount).toBe(0);
    });

    test('should fail without title', async () => {
      const couponData = {
        code: 'NOTITLE',
        storeId: storeId
      };

      const response = await request(app)
        .post('/api/coupons')
        .send(couponData)
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    test('should fail without code', async () => {
      const couponData = {
        title: 'No Code Coupon',
        storeId: storeId
      };

      const response = await request(app)
        .post('/api/coupons')
        .send(couponData)
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    test('should fail without storeId', async () => {
      const couponData = {
        title: 'No Store Coupon',
        code: 'NOSTORE'
      };

      const response = await request(app)
        .post('/api/coupons')
        .send(couponData)
        .expect(400);

      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /api/coupons', () => {
    test('should get all coupons', async () => {
      await Coupon.create([
        { title: 'Coupon 1', code: 'CODE1', storeId: storeId },
        { title: 'Coupon 2', code: 'CODE2', storeId: storeId }
      ]);

      const response = await request(app)
        .get('/api/coupons')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('clickCount');
    });

    test('should return empty array when no coupons', async () => {
      const response = await request(app)
        .get('/api/coupons')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/coupons/:id', () => {
    test('should get coupon by id', async () => {
      const coupon = await Coupon.create({
        title: 'Test Coupon',
        code: 'TEST123',
        storeId: storeId,
        description: 'Test description',
        category: 'Test'
      });

      const response = await request(app)
        .get(`/api/coupons/${coupon._id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Coupon');
      expect(response.body.code).toBe('TEST123');
    });

    test('should return 404 for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/coupons/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Coupon not found');
    });
  });

  describe('PUT /api/coupons/:id', () => {
    test('should update coupon', async () => {
      const coupon = await Coupon.create({
        title: 'Old Title',
        code: 'OLDCODE',
        storeId: storeId
      });

      const updateData = {
        title: 'New Title',
        description: 'Updated description',
        discountValue: 25
      };

      const response = await request(app)
        .put(`/api/coupons/${coupon._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('New Title');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.discountValue).toBe(25);
    });

    test('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/coupons/${fakeId}`)
        .send({ title: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('Coupon not found');
    });
  });

  describe('DELETE /api/coupons/:id', () => {
    test('should delete coupon', async () => {
      const coupon = await Coupon.create({
        title: 'To Delete',
        code: 'DELETE123',
        storeId: storeId
      });

      const response = await request(app)
        .delete(`/api/coupons/${coupon._id}`)
        .expect(200);

      expect(response.body.message).toBe('Coupon deleted successfully');

      // Verify deletion
      const deletedCoupon = await Coupon.findById(coupon._id);
      expect(deletedCoupon).toBeNull();
    });

    test('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/coupons/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Coupon not found');
    });
  });

  describe('POST /api/coupons/:id/click', () => {
    test('should increment click count', async () => {
      const coupon = await Coupon.create({
        title: 'Click Test',
        code: 'CLICK123',
        storeId: storeId,
        clickCount: 5
      });

      const response = await request(app)
        .post(`/api/coupons/${coupon._id}/click`)
        .expect(200);

      expect(response.body.clickCount).toBe(6);
    });
  });

  describe('Schema Validation', () => {
    test('should validate title is required', async () => {
      const coupon = new Coupon({
        code: 'TEST',
        storeId: storeId
      });
      
      let error;
      try {
        await coupon.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.title).toBeDefined();
    });

    test('should validate code is required', async () => {
      const coupon = new Coupon({
        title: 'Test Coupon',
        storeId: storeId
      });
      
      let error;
      try {
        await coupon.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.code).toBeDefined();
    });

    test('should validate storeId is required', async () => {
      const coupon = new Coupon({
        title: 'Test Coupon',
        code: 'TEST123'
      });
      
      let error;
      try {
        await coupon.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.storeId).toBeDefined();
    });

    test('should set default clickCount to 0', async () => {
      const coupon = await Coupon.create({
        title: 'Default Click Count',
        code: 'DEFAULT123',
        storeId: storeId
      });

      expect(coupon.clickCount).toBe(0);
    });

    test('should allow optional fields', async () => {
      const coupon = new Coupon({
        title: 'Full Coupon',
        code: 'FULL123',
        description: 'Full description',
        storeId: storeId,
        discountType: 'fixed',
        discountValue: 10,
        expiryDate: new Date('2024-12-31'),
        category: 'Electronics',
        tags: ['tag1', 'tag2']
      });

      const savedCoupon = await coupon.save();
      expect(savedCoupon.description).toBe('Full description');
      expect(savedCoupon.discountType).toBe('fixed');
      expect(savedCoupon.discountValue).toBe(10);
      expect(savedCoupon.category).toBe('Electronics');
      expect(savedCoupon.tags).toEqual(['tag1', 'tag2']);
    });

    test('should have timestamps', async () => {
      const coupon = await Coupon.create({
        title: 'Timestamp Test',
        code: 'TIMESTAMP123',
        storeId: storeId
      });

      expect(coupon.createdAt).toBeDefined();
      expect(coupon.updatedAt).toBeDefined();
      expect(coupon.createdAt).toBeInstanceOf(Date);
      expect(coupon.updatedAt).toBeInstanceOf(Date);
    });

    test('should validate storeId reference', async () => {
      const invalidStoreId = new mongoose.Types.ObjectId();
      
      const coupon = new Coupon({
        title: 'Invalid Store',
        code: 'INVALID123',
        storeId: invalidStoreId
      });

      // This should save but reference validation would happen at application level
      const savedCoupon = await coupon.save();
      expect(savedCoupon.storeId).toEqual(invalidStoreId);
    });
  });
});