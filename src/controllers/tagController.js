import { Tag } from '../models/index.js';
import { buildIdFilter, cleanUpdateData } from '../utils/idHelper.js';

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = req.body.slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tag = new Tag({ name, slug });
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Tag slug already exists' });
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    const data = cleanUpdateData(req.body);
    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    let tag = await Tag.findOneAndUpdate(filter, data, { new: true, runValidators: true });
    
    // Fallback to native driver for legacy Mixed _id data
    if (!tag) {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const id = req.params.id;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('tags').findOneAndUpdate(
        nativeFilter, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' }
      );
      if (result) return res.json(result);
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Tag slug already exists' });
    if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const filter = buildIdFilter(req.params.id);
    let tag = await Tag.findOneAndDelete(filter);
    
    // Fallback to native driver for legacy Mixed _id data
    if (!tag) {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      const id = req.params.id;
      const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      const nativeFilter = objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id };
      const result = await db.collection('tags').findOneAndDelete(nativeFilter);
      if (result) return res.json({ message: 'Tag deleted successfully' });
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
