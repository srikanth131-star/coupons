const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const CouponClick = require('../src/models/CouponClick');
const Coupon = require('../src/models/Coupon');
const Store = require('../src/models/Store');

describe('CouponClick Schema Tests', () => {
  let storeId;
  let couponId;
  let clickId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/couponsscript_test');
    
    // Create test store and coupon for references
    const store = await Store.create({
      storeName: 'Test Store',
      slug: 'test-store'
    });
    storeId = store._id;

    const coupon = await Coupon.create({
      title: 'Test Coupon',
      code: 'TEST123',
      storeId: storeId
    });
    couponId = coupon._id;
  });

  beforeEach(async () => {
    // Clean up before each test
    await CouponClick.deleteMany({});
  });

  afterAll(async () => {
    await Coupon.deleteMany({});
    await Store.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/coupon-clicks', () => {
    test('should create coupon click with all fields', async () => {
      const clickData = {
        couponId: couponId,
        storeId: storeId,
        ipAddress: '192.168.1.1'
      };

      const response = await request(app)
        .post('/api/coupon-clicks')
        .send(clickData)
        .expect(201);

      expect(response.body.couponId).toBe(couponId.toString());
      expect(response.body.storeId).toBe(storeId.toString());
      expect(response.body.ipAddress).toBe('192.168.1.1');
      expect(response.body).toHaveProperty('clickedAt');
      expect(response.body).toHaveProperty('_id');
      clickId = response.body._id;
    });

    test('should create coupon click with auto clickedAt', async () => {
      const clickData = {
        couponId: couponId,
        storeId: storeId,
        ipAddress: '10.0.0.1'
      };

      const response = await request(app)
        .post('/api/coupon-clicks')
        .send(clickData)
        .expect(201);

      expect(response.body.clickedAt).toBeDefined();
      expect(new Date(response.body.clickedAt)).toBeInstanceOf(Date);
    });

    test('should fail without couponId', async () => {
      const clickData = {
        storeId: storeId,
        ipAddress: '192.168.1.1'
      };

      const response = await request(app)
        .post('/api/coupon-clicks')
        .send(clickData)
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    test('should fail without storeId', async () => {
      const clickData = {
        couponId: couponId,
        ipAddress: '192.168.1.1'
      };

      const response = await request(app)
        .post('/api/coupon-clicks')
        .send(clickData)
        .expect(400);

      expect(response.body.error).toContain('required');
    });

    test('should allow without ipAddress', async () => {
      const clickData = {
        couponId: couponId,
        storeId: storeId
      };

      const response = await request(app)
        .post('/api/coupon-clicks')
        .send(clickData)
        .expect(201);

      expect(response.body.couponId).toBe(couponId.toString());
      expect(response.body.storeId).toBe(storeId.toString());
      expect(response.body.ipAddress).toBeUndefined();
    });
  });

  describe('GET /api/coupon-clicks', () => {
    test('should get all coupon clicks', async () => {
      await CouponClick.create([
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.1' },
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.2' }
      ]);

      const response = await request(app)
        .get('/api/coupon-clicks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('couponId');
      expect(response.body[0]).toHaveProperty('clickedAt');
    });

    test('should return empty array when no clicks', async () => {
      const response = await request(app)
        .get('/api/coupon-clicks')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/coupon-clicks/coupon/:couponId', () => {
    test('should get clicks by coupon', async () => {
      await CouponClick.create([
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.1' },
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.2' }
      ]);

      const response = await request(app)
        .get(`/api/coupon-clicks/coupon/${couponId}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].couponId).toBe(couponId.toString());
    });
  });

  describe('GET /api/coupon-clicks/store/:storeId', () => {
    test('should get clicks by store', async () => {
      await CouponClick.create([
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.1' },
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.2' }
      ]);

      const response = await request(app)
        .get(`/api/coupon-clicks/store/${storeId}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].storeId).toBe(storeId.toString());
    });
  });

  describe('GET /api/coupon-clicks/analytics', () => {
    test('should get click analytics', async () => {
      const today = new Date();
      await CouponClick.create([
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.1', clickedAt: today },
        { couponId: couponId, storeId: storeId, ipAddress: '192.168.1.2', clickedAt: today }
      ]);

      const response = await request(app)
        .get('/api/coupon-clicks/analytics')
        .expect(200);

      expect(response.body).toHaveProperty('totalClicks');
      expect(response.body).toHaveProperty('uniqueIPs');
      expect(response.body.totalClicks).toBe(2);
    });
  });

  describe('DELETE /api/coupon-clicks/:id', () => {
    test('should delete coupon click', async () => {
      const click = await CouponClick.create({
        couponId: couponId,
        storeId: storeId,
        ipAddress: '192.168.1.1'
      });

      const response = await request(app)
        .delete(`/api/coupon-clicks/${click._id}`)
        .expect(200);

      expect(response.body.message).toBe('Coupon click deleted successfully');

      // Verify deletion
      const deletedClick = await CouponClick.findById(click._id);
      expect(deletedClick).toBeNull();
    });

    test('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/coupon-clicks/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe('Coupon click not found');
    });
  });

  describe('Schema Validation', () => {
    test('should validate couponId is required', async () => {
      const click = new CouponClick({
        storeId: storeId,
        ipAddress: '192.168.1.1'
      });
      
      let error;
      try {
        await click.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.couponId).toBeDefined();
    });

    test('should validate storeId is required', async () => {
      const click = new CouponClick({
        couponId: couponId,
        ipAddress: '192.168.1.1'
      });
      
      let error;
      try {
        await click.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.storeId).toBeDefined();
    });

    test('should set default clickedAt', async () => {
      const click = await CouponClick.create({
        couponId: couponId,
        storeId: storeId,
        ipAddress: '192.168.1.1'
      });

      expect(click.clickedAt).toBeDefined();
      expect(click.clickedAt).toBeInstanceOf(Date);
    });

    test('should allow custom clickedAt', async () => {
      const customDate = new Date('2024-01-01T10:00:00Z');
      const click = await CouponClick.create({
        couponId: couponId,
        storeId: storeId,
        ipAddress: '192.168.1.1',
        clickedAt: customDate
      });

      expect(click.clickedAt.getTime()).toBe(customDate.getTime());
    });

    test('should allow optional ipAddress', async () => {
      const click = await CouponClick.create({
        couponId: couponId,
        storeId: storeId
      });

      expect(click.couponId).toEqual(couponId);
      expect(click.storeId).toEqual(storeId);
      expect(click.ipAddress).toBeUndefined();
    });

    test('should validate couponId reference', async () => {
      const invalidCouponId = new mongoose.Types.ObjectId();
      
      const click = new CouponClick({
        couponId: invalidCouponId,
        storeId: storeId,
        ipAddress: '192.168.1.1'
      });

      // Should save but reference validation happens at application level
      const savedClick = await click.save();
      expect(savedClick.couponId).toEqual(invalidCouponId);
    });

    test('should validate storeId reference', async () => {
      const invalidStoreId = new mongoose.Types.ObjectId();
      
      const click = new CouponClick({
        couponId: couponId,
        storeId: invalidStoreId,
        ipAddress: '192.168.1.1'
      });

      // Should save but reference validation happens at application level
      const savedClick = await click.save();
      expect(savedClick.storeId).toEqual(invalidStoreId);
    });

    test('should store IP address formats', async () => {
      const ipAddresses = [
        '192.168.1.1',      // IPv4
        '::1',              // IPv6 localhost
        '2001:db8::1',      // IPv6
        '127.0.0.1'         // IPv4 localhost
      ];

      for (const ip of ipAddresses) {
        const click = await CouponClick.create({
          couponId: couponId,
          storeId: storeId,
          ipAddress: ip
        });

        expect(click.ipAddress).toBe(ip);
        await CouponClick.findByIdAndDelete(click._id);
      }
    });
  });
});