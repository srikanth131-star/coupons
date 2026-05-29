import multer from 'multer';
import getCloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

export const upload = multer({ storage, fileFilter });

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env' });
    }

    const logoType = req.body.logoType || 'image';
    const oldPublicId = req.body.oldPublicId || null;
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Delete old image from Cloudinary if provided
    if (oldPublicId) {
      try {
        await getCloudinary().uploader.destroy(oldPublicId);
      } catch (e) {
        console.log('Failed to delete old image:', e.message);
      }
    }

    const result = await getCloudinary().uploader.upload(base64, {
      folder: `coupon-feast/${logoType}s`,
    });

    res.json({
      message: 'Uploaded successfully',
      logoUrl: result.secure_url,
      publicId: result.public_id,
      filename: result.public_id,
      logoType,
    });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteLogo = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const publicId = decodeURIComponent(filename);
    const result = await getCloudinary().uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      return res.json({ message: 'Image deleted successfully' });
    }

    res.status(500).json({ error: 'Failed to delete image', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
