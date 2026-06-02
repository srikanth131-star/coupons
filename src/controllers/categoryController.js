import Category from '../models/Category.js';
import PopularStore from '../models/PopularStore.js';
import { buildIdFilter, cleanUpdateData } from '../utils/idHelper.js';

// Category Controllers
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Category slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    const data = cleanUpdateData(req.body);
    let category = await Category.findOneAndUpdate(filter, data, { new: true, runValidators: true });
    
    // Fallback to native driver for legacy Mixed _id data
    if (!category) {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const id = req.params.id;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('categories').findOneAndUpdate(
        nativeFilter, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' }
      );
      if (result) return res.json(result);
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Category slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    let category = await Category.findOneAndDelete(filter);
    
    // Fallback to native driver for legacy Mixed _id data
    if (!category) {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const id = req.params.id;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('categories').findOneAndDelete(nativeFilter);
      if (result) return res.json({ message: 'Category deleted successfully' });
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Popular Store Controllers
export const getPopularStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search, category } = req.query;
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    const stores = await PopularStore.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await PopularStore.countDocuments(query);
    
    res.json({
      success: true,
      data: stores,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const createPopularStore = async (req, res) => {
  try {
    const storeData = {
      ...req.body,
      isPopular: true // Auto-set for popular stores
    };
    const store = new PopularStore(storeData);
    await store.save();
    res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Store slug already exists' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const updatePopularStore = async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    const data = cleanUpdateData(req.body);
    data.isPopular = true; // Maintain popular status
    const store = await PopularStore.findOneAndUpdate(filter, data, { new: true, runValidators: true });
    if (!store) {
      return res.status(404).json({ 
        success: false,
        error: 'Popular store not found' 
      });
    }
    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Store slug already exists' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const deletePopularStore = async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    const store = await PopularStore.findOneAndDelete(filter);
    if (!store) {
      return res.status(404).json({ 
        success: false,
        error: 'Popular store not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Popular store deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};