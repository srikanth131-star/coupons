import Coupon from "../models/Coupon.js";
import { CouponClick } from "../models/index.js";
import ga4Analytics from "../utils/ga4Analytics.js";
import { getClientId, getUserProperties } from "../middleware/ga4Analytics.js";

export const getCoupons = async (req, res) => {
  const clientId = getClientId(req);
  const userProps = getUserProperties(req);
  
  try {
    const { sort, store, category, tag, limit = 20 } = req.query;
    let query = { isActive: true };
    
    if (store) query.store = store;
    if (category) query.category = category;
    if (tag) query.tags = { $regex: tag, $options: 'i' };
    
    const sortOption = sort === "clickCount" ? { clickCount: -1 } : { createdAt: -1 };
    
    const coupons = await Coupon.find(query)
      .populate("store category")
      .sort(sortOption)
      .limit(parseInt(limit));
    
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
    const coupon = await Coupon.findById(req.params.id).populate("store category tags");
    
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
    const coupon = await Coupon.create(req.body);
    
    // Track coupon creation
    ga4Analytics.sendEvent('coupon_created', {
      coupon_id: coupon._id.toString(),
      store_id: coupon.store.toString(),
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
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!coupon) {
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
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      await ga4Analytics.trackError('/api/coupons/:id', 'DELETE', 'Coupon not found', 404, clientId);
      return res.status(404).json({ error: "Coupon not found" });
    }
    
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
    const coupon = await Coupon.findById(req.params.id).populate('store');
    
    if (!coupon) {
      await ga4Analytics.trackError('/api/coupons/:id/click', 'POST', 'Coupon not found', 404, clientId);
      return res.status(404).json({ error: "Coupon not found" });
    }
    
    const oldClickCount = coupon.clickCount;
    
    await Coupon.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    await CouponClick.create({
      coupon: req.params.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });
    
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
