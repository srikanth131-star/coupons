import Store from "../models/Store.js";
import Coupon from "../models/Coupon.js";
import ga4Analytics from "../utils/ga4Analytics.js";
import { getClientId } from "../middleware/ga4Analytics.js";

export const getStores = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const { page, limit, search, category, sortBy, order } = req.query;

    const filter = {};
    if (search) filter.storeName = { $regex: search, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };

    const sortObj = sortBy ? { [sortBy]: order === 'desc' ? -1 : 1 } : { updatedAt: -1 };

    let query = Store.find(filter).sort(sortObj);

    if (page && limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.skip(Math.max(0, skip)).limit(Math.max(1, parseInt(limit)));
    }

    const stores = await query;
    console.log('Found stores:', stores.length);
    
    // Track stores listing request
    ga4Analytics.sendEvent('stores_list_request', {
      results_count: stores.length,
      event_category: 'Store'
    }, clientId).catch(err => console.error('GA4 stores list tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'stores', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(stores);
  } catch (error) {
    await ga4Analytics.trackError('/api/stores', 'GET', error.message, 500, clientId);
    await ga4Analytics.trackDatabaseOperation('read', 'stores', false, clientId);
    res.status(500).json({ error: error.message });
  }
};

export const getStoreBySlug = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const slug = req.params.slug;
    const store = await Store.findOne({ slug });
    
    if (!store) {
      await ga4Analytics.trackError('/api/stores/:slug', 'GET', 'Store not found', 404, clientId);
      return res.status(404).json({ error: "Store not found" });
    }
    
    // Track store page view
    ga4Analytics.trackStoreOperation('view', store._id.toString(), store.storeName, clientId)
      .catch(err => console.error('GA4 store view tracking failed:', err.message));
    
    ga4Analytics.sendEvent('store_page_view', {
      store_id: store._id.toString(),
      store_name: store.storeName,
      store_slug: store.slug,
      event_category: 'Navigation'
    }, clientId).catch(err => console.error('GA4 store page view tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'stores', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(store);
  } catch (error) {
    await ga4Analytics.trackError('/api/stores/:slug', 'GET', error.message, 500, clientId);
    res.status(500).json({ error: error.message });
  }
};

export const getStoreById = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const store = await Store.findById(req.params.id);
    
    if (!store) {
      await ga4Analytics.trackError('/api/admin/stores/details/:id', 'GET', 'Store not found', 404, clientId);
      return res.status(404).json({ error: "Store not found" });
    }
    
    // Track store details view
    ga4Analytics.trackStoreOperation('admin_view', store._id.toString(), store.storeName, clientId)
      .catch(err => console.error('GA4 store admin view tracking failed:', err.message));
    
    ga4Analytics.sendEvent('admin_store_details_view', {
      store_id: store._id.toString(),
      store_name: store.storeName,
      store_slug: store.slug,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 admin store details tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('read', 'stores', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(store);
  } catch (error) {
    await ga4Analytics.trackError('/api/admin/stores/details/:id', 'GET', error.message, 500, clientId);
    res.status(500).json({ error: error.message });
  }
};

export const createStore = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const existing = await Store.findOne({ slug: req.body.slug });
    if (existing) return res.status(400).json({ error: 'Store already exists with this slug' });

    const store = await Store.create(req.body);
    
    // Track store creation
    ga4Analytics.trackStoreOperation('create', store._id.toString(), store.storeName, clientId)
      .catch(err => console.error('GA4 store creation tracking failed:', err.message));
    
    ga4Analytics.sendEvent('store_created', {
      store_id: store._id.toString(),
      store_name: store.storeName,
      store_slug: store.slug,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 store creation event tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('create', 'stores', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.status(201).json(store);
  } catch (error) {
    await ga4Analytics.trackError('/api/stores', 'POST', error.message, 400, clientId);
    await ga4Analytics.trackDatabaseOperation('create', 'stores', false, clientId);
    res.status(400).json({ error: error.message });
  }
};

export const updateStore = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    if (req.body.slug) {
      const existing = await Store.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ error: 'Store already exists with this slug' });
    }

    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!store) {
      await ga4Analytics.trackError('/api/stores/:id', 'PUT', 'Store not found', 404, clientId);
      return res.status(404).json({ error: "Store not found" });
    }
    
    // Track store update
    ga4Analytics.trackStoreOperation('update', store._id.toString(), store.storeName, clientId)
      .catch(err => console.error('GA4 store update tracking failed:', err.message));
    
    ga4Analytics.sendEvent('store_updated', {
      store_id: store._id.toString(),
      store_name: store.storeName,
      store_slug: store.slug,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 store update event tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('update', 'stores', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json(store);
  } catch (error) {
    await ga4Analytics.trackError('/api/stores/:id', 'PUT', error.message, 400, clientId);
    await ga4Analytics.trackDatabaseOperation('update', 'stores', false, clientId);
    res.status(400).json({ error: error.message });
  }
};

export const deleteStore = async (req, res) => {
  const clientId = getClientId(req);
  
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    
    if (!store) {
      await ga4Analytics.trackError('/api/stores/:id', 'DELETE', 'Store not found', 404, clientId);
      return res.status(404).json({ error: "Store not found" });
    }

    // Only delete associated coupons when explicitly requested by admin
    let couponsDeleted = 0;
    if (req.query.deleteCoupons === 'true') {
      const couponResult = await Coupon.deleteMany({ store: req.params.id });
      couponsDeleted = couponResult.deletedCount;
    }
    
    // Track store deletion
    ga4Analytics.trackStoreOperation('delete', store._id.toString(), store.storeName, clientId)
      .catch(err => console.error('GA4 store deletion tracking failed:', err.message));
    
    ga4Analytics.sendEvent('store_deleted', {
      store_id: store._id.toString(),
      store_name: store.storeName,
      store_slug: store.slug,
      coupons_deleted: couponsDeleted,
      event_category: 'Admin'
    }, clientId).catch(err => console.error('GA4 store deletion event tracking failed:', err.message));
    
    ga4Analytics.trackDatabaseOperation('delete', 'stores', true, clientId)
      .catch(err => console.error('GA4 DB tracking failed:', err.message));
    
    res.json({ message: "Store deleted", couponsDeleted });
  } catch (error) {
    await ga4Analytics.trackError('/api/stores/:id', 'DELETE', error.message, 500, clientId);
    res.status(500).json({ error: error.message });
  }
};
