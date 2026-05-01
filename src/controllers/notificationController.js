import { Notification } from '../models/Notification.js';

// Send notification
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, recipients, priority, scheduledAt, metadata } = req.body;

    // Validation
    if (!title || !message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and recipients are required'
      });
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of recipients) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: `Invalid email address: ${email}`
        });
      }
    }

    // Create notification
    const notification = new Notification({
      title,
      message,
      type: type || 'info',
      recipients,
      priority: priority || 'normal',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      metadata: metadata || {}
    });

    // If not scheduled, mark as sent immediately (simulate sending)
    if (!scheduledAt) {
      notification.status = 'sent';
      notification.sentAt = new Date();
    }

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        recipients: notification.recipients,
        status: notification.status,
        priority: notification.priority,
        scheduledAt: notification.scheduledAt,
        sentAt: notification.sentAt,
        createdAt: notification.createdAt
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
};

// List notifications
export const listNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      search,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    // Execute query
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .select('-metadata -__v')
        .lean(),
      Notification.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      total
    });
  } catch (error) {
    console.error('List notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Get notification by ID
export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id).select('-__v');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification',
      error: error.message
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};