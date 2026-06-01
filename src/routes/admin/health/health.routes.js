import express from 'express';
import mongoose from 'mongoose';
import os from 'os';

const router = express.Router();

// GET /api/admin/health - Basic health check
router.get('/', async (req, res) => {
  try {
    const { detailed } = req.query;
    
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus
      },
      api: {
        status: 'healthy'
      },
      services: {
        mongodb: dbStatus,
        api: 'healthy'
      }
    };

    // Add detailed info if requested
    if (detailed === 'true') {
      healthData.memory = process.memoryUsage();
      healthData.cpu = os.cpus();
      healthData.load = os.loadavg();
    }

    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/admin/health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    const memoryUsage = process.memoryUsage();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss
      },
      cpu: {
        count: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        usage: os.loadavg()
      },
      database: {
        status: dbStatus,
        connections: mongoose.connections.length
      },
      disk: {
        free: os.freemem(),
        total: os.totalmem()
      },
      load: {
        average: os.loadavg(),
        uptime: os.uptime()
      },
      dependencies: {
        mongodb: dbStatus,
        node: process.version
      },
      performance: {
        uptime: process.uptime(),
        memoryUsage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
      },
      errors: {
        count: 0,
        rate: '0%'
      },
      requests: {
        total: 0,
        rate: '0/min'
      }
    };

    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/admin/health/db-check - Check database collections and counts
router.get('/db-check', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    
    // Get collection counts
    const collections = await mongoose.connection.db.listCollections().toArray();
    const counts = {};
    for (const col of collections) {
      counts[col.name] = await mongoose.connection.db.collection(col.name).countDocuments();
    }

    // Check a specific ID if provided
    let idCheck = null;
    if (req.query.id && req.query.collection) {
      try {
        const doc = await mongoose.connection.db.collection(req.query.collection).findOne({ 
          _id: new mongoose.Types.ObjectId(req.query.id) 
        });
        idCheck = { found: !!doc, collection: req.query.collection, id: req.query.id };
      } catch (e) {
        idCheck = { found: false, error: e.message };
      }
    }

    res.json({
      success: true,
      database: { name: dbName, host: dbHost, state: dbState === 1 ? 'connected' : 'disconnected' },
      collections: counts,
      idCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;