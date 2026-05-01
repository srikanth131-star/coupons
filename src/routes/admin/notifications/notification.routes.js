import express from 'express';
import {
  sendNotification,
  listNotifications,
  getNotification,
  deleteNotification
} from '../../../controllers/notificationController.js';

const router = express.Router();

// Send notification
router.post('/send', sendNotification);

// List notifications
router.get('/', listNotifications);

// Get notification by ID
router.get('/:id', getNotification);

// Delete notification
router.delete('/:id', deleteNotification);

export default router;