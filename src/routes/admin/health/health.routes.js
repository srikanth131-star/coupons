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

export default router;