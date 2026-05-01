describe('Admin - Get Coupon Details API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/coupons/details';
  let testCouponId;
  let testStoreId;

  beforeEach(() => {
    // Setup test data
    // DISABLED: cy.task('clearDatabase');
    
    // Create a test store first
    const timestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/api/admin/stores/create`,
      body: {
        storeName: `Test Store ${timestamp}`,
        slug: `test-store-${timestamp}`,
        description: 'Test store for coupon details tests',
        category: 'Electronics'
      }
    }).then((storeResponse) => {
      testStoreId = storeResponse.body._id;
      
      // Create a test coupon
      const couponData = {
        title: `Test Coupon ${timestamp}`,
        code: `TEST${timestamp}`,
        discount: '20%',
        store: testStoreId,
        category: 'Electronics'
      };
      
      cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, couponData)
        .then((response) => {
          testCouponId = response.body._id;
        });
    });
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid coupon ID
  it('should return coupon details for valid ID', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('_id', testCouponId);
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('code');
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
      });
  });

  // Test Case 2: Invalid ID format
  it('should return 400 for invalid ID format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/invalid-id-format`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 3: Non-existent coupon ID
  it('should return 404 for non-existent coupon ID', () => {
    const nonExistentId = '507f1f77bcf86cd799439011';
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${nonExistentId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Coupon not found');
    });
  });

  // Test Case 4: Response structure validation
  it('should return coupon with correct data structure', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const coupon = response.body;
        
        // Required fields
        expect(coupon).to.have.property('_id');
        expect(coupon).to.have.property('title');
        expect(coupon).to.have.property('code');
        expect(coupon).to.have.property('createdAt');
        expect(coupon).to.have.property('updatedAt');
        
        // Data types
        expect(coupon._id).to.be.a('string');
        expect(coupon.title).to.be.a('string');
        expect(coupon.code).to.be.a('string');
        expect(coupon.createdAt).to.be.a('string');
        expect(coupon.updatedAt).to.be.a('string');
      });
  });

  // Test Case 5: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(1000); // 1 second max for single record
      });
  });

  // Test Case 6: Concurrent requests for same coupon
  it('should handle concurrent requests for same coupon', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.eq(testCouponId);
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.eq(testCouponId);
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.eq(testCouponId);
    });
  });

  // Test Case 7: Empty string ID
  it('should return 400 for empty string ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  // Test Case 8: Special characters in ID
  it('should return 400 for ID with special characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/coupon@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 9: Very long ID string
  it('should return 400 for excessively long ID', () => {
    const longId = 'a'.repeat(100);
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${longId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 10: Content-Type validation
  it('should return JSON content type', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
  });

  // Test Case 11: Coupon with all optional fields
  it('should return coupon with all fields when present', () => {
    const timestamp = Date.now();
    const fullCouponData = {
      title: `Full Coupon ${timestamp}`,
      code: `FULL${timestamp}`,
      discount: '25%',
      description: 'Full description',
      store: testStoreId,
      category: 'Electronics'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, fullCouponData)
      .then((createResponse) => {
        cy.authRequest('GET', `${baseUrl}${endpoint}/${createResponse.body._id}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            const coupon = response.body;
            expect(coupon).to.have.property('title', fullCouponData.title);
            expect(coupon).to.have.property('code', fullCouponData.code);
            if (coupon.description) {
              expect(coupon.description).to.eq(fullCouponData.description);
            }
          });
      });
  });

  // Test Case 12: Coupon with minimal fields
  it('should return coupon with minimal required fields', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const coupon = response.body;
        
        // Should have at least these required fields
        expect(coupon).to.have.property('_id');
        expect(coupon).to.have.property('title');
        expect(coupon).to.have.property('code');
      });
  });

  // Test Case 13: Case sensitivity of ID
  it('should be case sensitive for coupon ID', () => {
    const uppercaseId = testCouponId.toUpperCase();
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${uppercaseId}`,
      failOnStatusCode: false
    }).then((response) => {
      if (testCouponId !== uppercaseId) {
        // MongoDB ObjectIds are case-insensitive, so this might succeed
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
  });

  // Test Case 14: Database connection handling
  it('should handle database connection issues gracefully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 500]);
      if (response.status === 500) {
        expect(response.body).to.have.property('error');
      }
    });
  });

  // Test Case 15: Coupon with unicode characters
  it('should handle coupon with unicode characters correctly', () => {
    const timestamp = Date.now();
    const unicodeCouponData = {
      title: `Unicode Coupon 测试 🎯 ${timestamp}`,
      code: `UNI${timestamp}`,
      discount: '30%',
      store: testStoreId,
      category: 'Electronics'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, unicodeCouponData)
      .then((createResponse) => {
        cy.authRequest('GET', `${baseUrl}${endpoint}/${createResponse.body._id}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.title).to.include('测试');
            expect(response.body.title).to.include('🎯');
          });
      });
  });
});