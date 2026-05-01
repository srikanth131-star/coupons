import express from 'express';
import { ContactMessage } from '../../../models/ContactMessage.js';

const router = express.Router();

// POST /api/public/contact/submit
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const contact = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', id: contact._id });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
