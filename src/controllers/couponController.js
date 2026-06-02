import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";
import { CouponClick } from "../models/index.js";
import ga4Analytics from "../utils/ga4Analytics.js";
import { getClientId, getUserProperties } from "../middleware/ga4Analytics.js";
import { buildIdFilter, cleanUpdateData } from "../utils/idHelper.js";

export const getCoupons = async (req, res) => {
  const clientId = getClientId(req);
  const userProps = getUserProperties(req);
  
  try {
    const { sort, store, category, tag, limit, status } = req.query;
    let query = {};
    
    // For admin routes, show all coupons; for public, only active
    if (status === 'all') {
      // No filter - show all
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'active' || !req.adminId) {
      query.isActive = true;
    }
    // If req.adminId exists (admin route) and no status filter, show all
    
    if (store) query.store = store;
    if (category) query.category = category;
    if (tag) query.tags = { $regex: tag, $options: 'i' };
    
    const sortOption = sort === "clickCount" ? { clickCount: -1 } : { createdAt: -1 };
    
    // Admin gets all coupons, public gets limited
    const queryLimit = limit ? parseInt(limit) : (req.adminId ? 0 : 20);
    
    let couponQuery = Coupon.find(query)
      .populate("store")
      .sort(sortOption);
    
    if (queryLimit > 0) {
      couponQuery = couponQuery.limit(queryLimit);
    }
    
    const coupons = await couponQuery;
    
    // Enhanced coupon listing tracking
    ga4Analytics.sendEvent('coupons_list_request', {
      filter_store: store || 'none',
      filter_category: category || 'none',
      filter_tag: tag || 'none',
      sort_by: sort || 'createdAt',
      limit: limit,
      results_count: coupons.length,
      event_category: 'Coupon',
      content_type: 'coupon_list',
      item_list_name: 'All Coupons'
    }, clientId, userProps).catch(err => console.error('GA4 coupons list tracking failed:', err.message));
    
    // Track page view
    ga4Analytics.trackPageView('/api/coupons', clientId, userProps)
      .catch(err => console.error('GA4 page view tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'coupons', true, clientId, userProps)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(coupons);
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons', 'GET', error.message, 500, clientId, userProps);
    await ga4Analytics.trackDatabaseOperation('read', 'coupons', false, clientId, userProps);
    res.status(500).json({ error: error.message });
  }
};

export const getCouponById = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const filter = buildIdFilter(req.params.id);
    
    let coupon = await Coupon.findOne(filter).populate("store");
    
    if (!coupon) {
      await ga4Analytics.trackError('/api/coupons/:id', 'GET', 'Coupon not found', 404, clientId);
      return res.status(404).json({ error: "Coupon not found" });
    }
    
    // Track coupon view
    ga4Analytics.sendEvent('coupon_view', {
      coupon_id: coupon._id.toString(),
      store_id: coupon.store ? coupon.store._id.toString() : 'no_store',
      store_name: coupon.store ? coupon.store.storeName : 'No Store',
      coupon_code: coupon.code,
      category: coupon.category,
      click_count: coupon.clickCount,
      event_category: 'Coupon'
    }, clientId).catch(err => console.error('GA4 coupon view tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(coupon);
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/:id', 'GET', error.message, 500, clientId);
    res.status(500).json({ error: error.message });
  }
};

export const createCoupon = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const data = { ...req.body };
    // Remove _id and system fields if sent
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;
    // Remove empty store to avoid ObjectId cast error
    if (!data.store) delete data.store;
    
    const coupon = await Coupon.create(data);
    
    // Track coupon creation
    ga4Analytics.sendEvent('coupon_created', {
      coupon_id: coupon._id.toString(),
      store_id: coupon.store ? coupon.store.toString() : 'no_store',
      coupon_code: coupon.code,
      category: coupon.category,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 coupon creation tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('create', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(201).json(coupon);
  } catch (error) {
    let statusCode = 400;
    let errorMessage = error.message;
    
    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      statusCode = 409;
      if (error.keyPattern && error.keyPattern.code) {
        errorMessage = 'Coupon code already exists';
      } else {
        errorMessage = 'Duplicate value detected';
      }
    }
    // Handle validation errors
    else if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = error.message;
    }
    
    await ga4Analytics.trackError('/api/coupons', 'POST', errorMessage, statusCode, clientId);
    await ga4Analytics.trackDatabaseOperation('create', 'coupons', false, clientId);
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const updateCoupon = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const id = req.params.id;
    const updateData = cleanUpdateData(req.body);
    const filter = buildIdFilter(id);
    
    // Remove empty store to avoid ObjectId cast error
    if (!updateData.store) delete updateData.store;
    
    let coupon = await Coupon.findOneAndUpdate(filter, updateData, { new: true });
    
    // Fallback to native driver for legacy Mixed _id data
    if (!coupon) {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('coupons').findOneAndUpdate(
        nativeFilter, { $set: { ...updateData, updatedAt: new Date() } }, { returnDocument: 'after' }
      );
      if (result) {
        ga4Analytics.trackDatabaseOperation('update', 'coupons', true, clientId)
          .catch(err => console.error('GA4 DB tracking failed:', err.message));
        return res.json(result);
      }
      await ga4Analytics.trackError('/api/coupons/:id', 'PUT', 'Coupon not found', 404, clientId);
      return res.status(404).json({ error: "Coupon not found" });
    }
    
    // Track coupon update
    ga4Analytics.sendEvent('coupon_updated', {
      coupon_id: coupon._id.toString(),
      coupon_code: coupon.code,
      category: coupon.category,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 coupon update tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('update', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(coupon);
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/:id', 'PUT', error.message, 400, clientId);
    await ga4Analytics.trackDatabaseOperation('update', 'coupons', false, clientId);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    console.log(`[DELETE COUPON] Attempting to delete coupon: ${id}`);
    
    let coupon = await Coupon.findOneAndDelete(filter);
    
    // Fallback to native driver if Mongoose couldn't find it (legacy Mixed _id data)
    if (!coupon) {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('coupons').findOneAndDelete(nativeFilter);
      if (result) {
        console.log(`[DELETE COUPON] Deleted via native driver: ${id}`);
        return res.json({ message: "Coupon deleted" });
      }
      console.log(`[DELETE COUPON] Coupon not found: ${id}`);
      await ga4Analytics.trackError('/api/coupons/:id', 'DELETE', 'Coupon not found', 404, clientId);
      return res.status(404).json({ error: "Coupon not found" });
    }
    
    console.log(`[DELETE COUPON] Successfully deleted: ${coupon.title} (${req.params.id})`);
    
    // Track coupon deletion
    ga4Analytics.sendEvent('coupon_deleted', {
      coupon_id: coupon._id.toString(),
      coupon_code: coupon.code,
      category: coupon.category,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 coupon deletion tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('delete', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/:id', 'DELETE', error.message, 500, clientId);
    res.status(500).json({ error: error.message });
  }
};

export const trackClick = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    const coupon = await Coupon.findOne(filter).populate('store');
    
    if (!coupon) {
      // Fallback: try native driver
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const nativeDoc = await db.collection('coupons').findOneAndUpdate(
        nativeFilter, { $inc: { clickCount: 1 } }, { returnDocument: 'after' }
      );
      if (nativeDoc) {
        await CouponClick.create({ coupon: id, ipAddress: req.ip, userAgent: req.get("user-agent") }).catch(() => {});
        return res.json({ message: "Click tracked" });
      }
      await ga4Analytics.trackError('/api/coupons/:id/click', 'POST', 'Coupon not found', 404, clientId);
      return res.status(404).json({ error: "Coupon not found" });
    }
    
    const oldClickCount = coupon.clickCount;
    
    // Use native driver to ensure the increment works regardless of _id type
    const mongoose = (await import('mongoose')).default;
    const db = mongoose.connection.db;
    const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
    await db.collection('coupons').updateOne(nativeFilter, { $inc: { clickCount: 1 } });
    
    await CouponClick.create({
      coupon: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    }).catch(() => {});
    
    // Track coupon click with detailed info
    if (coupon.store) {
      ga4Analytics.trackCouponClick(
        coupon._id.toString(),
        coupon.store._id.toString(),
        coupon.store.storeName,
        coupon.code,
        clientId
      ).catch(err => console.error('GA4 coupon click tracking failed:', err.message));
    }
    
    // Track click count increase
    ga4Analytics.sendEvent('coupon_click_count_updated', {
      coupon_id: coupon._id.toString(),
      old_click_count: oldClickCount,
      new_click_count: oldClickCount + 1,
      store_name: coupon.store ? coupon.store.storeName : 'No Store',
      coupon_code: coupon.code,
      event_category: 'Engagement'
    }, clientId).catch(err => console.error('GA4 click count tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('update', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json({ message: "Click tracked" });
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/:id/click', 'POST', error.message, 500, clientId);
    res.status(500).json({ error: error.message });
  }
};
