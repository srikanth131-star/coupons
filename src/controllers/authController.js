import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_EXPIRES = '7d';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ error: 'Admin not found' });

    res.json({ admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const seedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@couponsscript.com';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const name = process.env.ADMIN_NAME || 'Admin';
      await Admin.create({ email, password, name });
      console.log(`✅ Default admin created: ${email}`);
    }
  } catch (error) {
    if (error.code !== 11000) console.error('Admin seed error:', error.message);
  }
};
