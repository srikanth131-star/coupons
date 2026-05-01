import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import Admin from './src/models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    
    const email = process.env.ADMIN_EMAIL || 'admin@couponsfeast.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Admin';
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${email}`);
      process.exit(0);
    }
    
    // Create new admin
    const admin = await Admin.create({ email, password, name });
    console.log(`✅ Admin created successfully: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();