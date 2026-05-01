import FeaturedCoupon from '../models/FeaturedCoupon.js';
import Coupon from '../models/Coupon.js';

// Get all featured coupons
export const getFeaturedCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'order', order = 'asc', search } = req.query;
    
    let query = { isActive: true };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };
    
    const featuredCoupons = await FeaturedCoupon.find(query)
      .populate('couponId')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await FeaturedCoupon.countDocuments(query);
    
    // Transform the data to include coupon properties at the top level
    const transformedData = featuredCoupons.map(fc => {
      const coupon = fc.couponId;
      return {
        _id: fc._id,
        title: fc.title || (coupon ? coupon.title : ''),
        code: coupon ? coupon.code : '',
        discount: coupon ? coupon.discount : '',
        store: coupon ? coupon.store : '',
        category: coupon ? coupon.category : '',
        description: coupon ? coupon.description : '',
        expiryDate: coupon ? coupon.expiryDate : null,
        isFeatured: true,
        clickCount: coupon ? coupon.clickCount : 0,
        isActive: fc.isActive,
        priority: fc.priority,
        order: fc.order,
        createdAt: fc.createdAt,
        updatedAt: fc.updatedAt
      };
    });
    
    res.json({
      success: true,
      data: transformedData,
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

// Create featured coupon
export const createFeaturedCoupon = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.code || !req.body.discount || !req.body.store) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, code, discount, store'
      });
    }

    // Validate discount value
    if (req.body.discount < 0) {
      return res.status(400).json({
        success: false,
        error: 'Discount value must be non-negative'
      });
    }

    // Validate expiry date if provided
    if (req.body.expiryDate && isNaN(Date.parse(req.body.expiryDate))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid expiry date format'
      });
    }

    // Check for duplicate coupon code
    const existingCoupon = await Coupon.findOne({ code: req.body.code });
    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        error: 'Coupon code already exists'
      });
    }

    // Create the coupon first
    const couponData = {
      title: req.body.title,
      code: req.body.code,
      discount: req.body.discount.toString(),
      store: req.body.store,
      category: req.body.category || 'General',
      description: req.body.description || '',
      expiryDate: req.body.expiryDate,
      isFeatured: true,
      clickCount: 0
    };
    
    const coupon = new Coupon(couponData);
    await coupon.save();
    
    // Create featured coupon entry
    const featuredCouponData = {
      couponId: coupon._id,
      title: req.body.title,
      priority: req.body.priority || 1,
      featured: true,
      isActive: true,
      order: req.body.order || 0
    };
    
    const featuredCoupon = new FeaturedCoupon(featuredCouponData);
    await featuredCoupon.save();
    
    // Return the coupon data with isFeatured property
    const responseData = {
      _id: coupon._id,
      title: coupon.title,
      code: coupon.code,
      discount: coupon.discount,
      store: coupon.store,
      category: coupon.category,
      description: coupon.description,
      expiryDate: coupon.expiryDate,
      isFeatured: true,
      clickCount: coupon.clickCount,
      isActive: coupon.isActive,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt
    };
    
    res.status(201).json({
      success: true,
      data: responseData
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
        error: 'Coupon code already exists' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Update featured coupon
export const updateFeaturedCoupon = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      featured: true // Maintain featured status
    };
    
    const coupon = await FeaturedCoupon.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        new: true,
        runValidators: true
      }
    ).populate('couponId');
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false,
        error: 'Featured coupon not found' 
      });
    }
    
    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Delete featured coupon
export const deleteFeaturedCoupon = async (req, res) => {
  try {
    const coupon = await FeaturedCoupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ 
        success: false,
        error: 'Featured coupon not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Featured coupon deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};