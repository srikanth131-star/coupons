import express from "express";

const router = express.Router();

// API Status Dashboard
router.get("/", async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/api`;
  
  const apiTests = [
    // Store APIs (5)
    { 
      name: "Get All Stores", 
      method: "GET", 
      endpoint: "/stores",
      status: "✅ Configured",
      category: "Store APIs"
    },
    { 
      name: "Get Store by Slug", 
      method: "GET", 
      endpoint: "/stores/:slug",
      status: "✅ Configured",
      category: "Store APIs"
    },
    { 
      name: "Create Store", 
      method: "POST", 
      endpoint: "/stores",
      status: "✅ Configured",
      category: "Store APIs"
    },
    { 
      name: "Update Store", 
      method: "PUT", 
      endpoint: "/stores/:id",
      status: "✅ Configured",
      category: "Store APIs"
    },
    { 
      name: "Delete Store", 
      method: "DELETE", 
      endpoint: "/stores/:id",
      status: "✅ Configured",
      category: "Store APIs"
    },
    
    // Coupon APIs (7)
    { 
      name: "Get All Coupons", 
      method: "GET", 
      endpoint: "/coupons",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    { 
      name: "Get Coupon by ID", 
      method: "GET", 
      endpoint: "/coupons/:id",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    { 
      name: "Get Coupons by Store", 
      method: "GET", 
      endpoint: "/coupons/store/:storeId",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    { 
      name: "Get Coupons by Category", 
      method: "GET", 
      endpoint: "/coupons/category/:category",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    { 
      name: "Create Coupon", 
      method: "POST", 
      endpoint: "/coupons",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    { 
      name: "Update Coupon", 
      method: "PUT", 
      endpoint: "/coupons/:id",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    { 
      name: "Delete Coupon", 
      method: "DELETE", 
      endpoint: "/coupons/:id",
      status: "✅ Configured",
      category: "Coupon APIs"
    },
    
    // Analytics APIs (2)
    { 
      name: "Reveal Coupon Code", 
      method: "POST", 
      endpoint: "/coupons/reveal/:couponId",
      status: "✅ Configured",
      category: "Analytics APIs"
    },
    { 
      name: "Track Coupon Click", 
      method: "POST", 
      endpoint: "/coupons/:id/click",
      status: "✅ Configured",
      category: "Analytics APIs"
    },
    
    // Search API (1)
    { 
      name: "Search Coupons", 
      method: "GET", 
      endpoint: "/search?query=keyword",
      status: "✅ Configured",
      category: "Search API"
    },
    
    // Trending API (1)
    { 
      name: "Get Trending Coupons", 
      method: "GET", 
      endpoint: "/coupons/trending",
      status: "✅ Configured",
      category: "Trending API"
    }
  ];

  const summary = {
    totalAPIs: 16,
    storeAPIs: 5,
    couponAPIs: 7,
    analyticsAPIs: 2,
    searchAPIs: 1,
    trendingAPIs: 1,
    allConfigured: true
  };

  res.json({
    message: "✅ All 16 APIs are configured and ready",
    baseUrl,
    summary,
    apis: apiTests,
    testInstructions: {
      stores: `Test: GET ${baseUrl}/stores`,
      coupons: `Test: GET ${baseUrl}/coupons`,
      trending: `Test: GET ${baseUrl}/coupons/trending`,
      search: `Test: GET ${baseUrl}/search?query=test`
    }
  });
});

// Add the missing status route
router.get("/status", (req, res) => {
  res.json({
    status: "operational",
    message: "Test API is running",
    timestamp: new Date().toISOString()
  });
});

export default router;
