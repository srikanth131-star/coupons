import Coupon from "../models/Coupon.js";
import { CouponClick } from "../models/index.js";
import ga4Analytics from "../utils/ga4Analytics.js";
import { getClientId } from "../middleware/ga4Analytics.js";

// POST /api/coupons/reveal/:id
export const revealCoupon = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id).populate('store');
    
    if (!coupon) {
      await ga4Analytics.trackError('/api/coupons/reveal/:id', 'POST', 'Coupon not found', 404, clientId);
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    coupon.clickCount += 1;
    await coupon.save();
    
    await CouponClick.create({
      coupon: coupon._id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });
    
    // Track successful coupon reveal
    ga4Analytics.trackCouponReveal(
      coupon._id.toString(),
      coupon.store._id.toString(),
      coupon.store.storeName,
      coupon.code,
      clientId
    ).catch(err => console.error('GA4 coupon reveal tracking failed:', err.message));
    
    // Track database operations
    ga4Analytics.trackDatabaseOperation('update', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    ga4Analytics.trackDatabaseOperation('create', 'couponclicks', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(200).json({ 
      code: coupon.code,
      clickCount: coupon.clickCount,
      title: coupon.title
    });
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/reveal/:id', 'POST', error.message, 500, clientId);
    await ga4Analytics.trackDatabaseOperation('update', 'coupons', false, clientId);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons/trending
export const getTrendingCoupons = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const trendingCoupons = await Coupon.find({ isActive: true })
      .sort({ clickCount: -1 })
      .limit(limit)
      .populate('store', 'storeName logo slug');
    
    // Track trending request
    ga4Analytics.sendEvent('trending_coupons_request', {
      limit: limit,
      results_count: trendingCoupons.length,
      event_category: 'Coupon'
    }, clientId).catch(err => console.error('GA4 trending tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(200).json(trendingCoupons);
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/trending', 'GET', error.message, 500, clientId);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons/search
export const searchCoupons = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const { query } = req.query;
    
    if (!query) {
      const coupons = await Coupon.find({ isActive: true }).populate('store');
      ga4Analytics.trackSearch('', coupons.length, null, clientId)
        .catch(err => console.error('GA4 search tracking failed:', err.message));
      return res.status(200).json({ coupons });
    }
    
    const searchRegex = { $regex: query, $options: 'i' };
    
    const coupons = await Coupon.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { code: searchRegex }
      ],
      isActive: true
    }).populate('store');
    
    // Track search query
    ga4Analytics.trackSearch(query, coupons.length, null, clientId)
      .catch(err => console.error('GA4 search tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(200).json({ coupons });
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/search', 'GET', error.message, 500, clientId);
    await ga4Analytics.trackDatabaseOperation('read', 'coupons', false, clientId);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons/store/:storeId
export const getCouponsByStore = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const { storeId } = req.params;
    
    const coupons = await Coupon.find({ 
      store: storeId,
      isActive: true 
    }).populate('store', 'storeName logo');
    
    // Track store coupons request
    ga4Analytics.sendEvent('store_coupons_request', {
      store_id: storeId,
      results_count: coupons.length,
      event_category: 'Store'
    }, clientId).catch(err => console.error('GA4 store coupons tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(200).json(coupons);
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/store/:storeId', 'GET', error.message, 500, clientId);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons/category/:category
export const getCouponsByCategory = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const { category } = req.params;
    
    const coupons = await Coupon.find({ 
      category: category,
      isActive: true 
    }).populate('store category');
    
    // Track category coupons request
    ga4Analytics.sendEvent('category_coupons_request', {
      category: category,
      results_count: coupons.length,
      event_category: 'Category'
    }, clientId).catch(err => console.error('GA4 category coupons tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'coupons', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(200).json(coupons);
  } catch (error) {
    await ga4Analytics.trackError('/api/coupons/category/:category', 'GET', error.message, 500, clientId);
    res.status(500).json({ message: error.message });
  }
};
