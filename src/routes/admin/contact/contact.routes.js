import express from 'express';
import { ContactMessage } from '../../../models/ContactMessage.js';

const router = express.Router();

// GET /api/admin/contact-messages
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET /api/admin/contact-messages/stats
router.get('/stats', async (req, res) => {
  try {
    const [total, unread] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'unread' }),
    ]);
    res.json({ total, unread });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// PUT /api/admin/contact-messages/:id
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status, adminNotes }, { new: true });
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/admin/contact-messages/:id
router.delete('/:id', async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
