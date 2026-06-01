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
    const tag = await Tag.findOneAndUpdate(filter, data, { new: true, runValidators: true });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
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
    const tag = await Tag.findOneAndDelete(filter);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
