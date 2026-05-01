/**
 * CouponsScript Backend API
 * Copyright (c) 2026 BrewCode, Bangalore, India
 * 
 * PROPRIETARY SOFTWARE - All Rights Reserved
 * This software is licensed under the CouponsScript Proprietary License.
 * See LICENSE file for complete terms and conditions.
 * 
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/database.js';
import routes from './src/routes/index.js';

import { seedAllData } from './src/utils/seedData.js';
import { seedAdmin } from './src/controllers/authController.js';

// Load environment variables FIRST
dotenv.config();

// Import GA4 AFTER environment variables are loaded
import ga4Analytics from './src/utils/ga4Analytics.js';

const app = express();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://coupons-script-frontend.vercel.app',
    ];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-client-id'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

connectDB();

// Load main routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Coupons Script API Running',
    version: '1.0.0',
    totalAPIs: 16,
    testEndpoint: '/api/test',
    documentation: '/api/test/status',
    ga4Analytics: process.env.GA4_MEASUREMENT_ID ? 'Enabled' : 'Disabled',
  });
});

// Global error handler with GA4 analytics
app.use((err, req, res, next) => {
  console.error(err.stack);

  const clientId = req.headers['x-client-id'] || 'server_error';
  ga4Analytics
    .trackError(req.path, req.method, err.message, 500, clientId)
    .catch((trackErr) => console.error('GA4 error tracking failed:', trackErr.message));

  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('Connecting to MongoDB Atlas...');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test all APIs: http://localhost:${PORT}/api/test`);
  console.log(`API Status: http://localhost:${PORT}/api/test/status`);

  await seedAdmin();
  await seedAllData();

  // Drop stale unique index on coupon 'code' field
  try {
    const mongoose = (await import('mongoose')).default;
    await mongoose.connection.db.collection('coupons').dropIndex('code_1');
    console.log('Dropped stale unique index on coupons.code');
  } catch (e) {
    /* index does not exist, thats fine */
  }

  // GA4 status check
  console.log(`GA4 Analytics: ${process.env.GA4_MEASUREMENT_ID ? 'Enabled' : 'Disabled'}`);

  // Track server startup AFTER server is fully initialized
  setTimeout(() => {
    ga4Analytics
      .trackServerEvent('startup', {
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        timestamp: new Date().toISOString(),
      })
      .catch((err) => console.error('GA4 startup tracking failed:', err.message));
  }, 1000);
});
