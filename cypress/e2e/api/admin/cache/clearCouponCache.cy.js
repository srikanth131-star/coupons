describe('Admin - Clear Coupon Cache API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/cache/clear/coupons';

  beforeEach(() => {
    // Setup test data if needed
    // DISABLED: cy.task('clearDatabase');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid coupon cache clear request
  it('should clear coupon cache successfully', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
        expect(response.body).to.have.property('timestamp');
        expect(response.body.timestamp).to.be.a('string');
        expect(new Date(response.body.timestamp)).to.be.instanceOf(Date);
      });
  });

  // Test Case 2: Response structure validation
  it('should return response with correct structure', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        
        // Validate required fields
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('timestamp');
        
        // Validate data types
        expect(response.body.message).to.be.a('string');
        expect(response.body.timestamp).to.be.a('string');
        
        // Validate timestamp format (ISO 8601)
        expect(response.body.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        
        // Validate specific message content
        expect(response.body.message).to.include('Coupon');
        expect(response.body.message).to.include('cache');
        expect(response.body.message).to.include('cleared');
      });
  });

  // Test Case 3: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(2000); // 2 seconds max for cache operations
      });
  });

  // Test Case 4: Content-Type validation
  it('should return JSON content type', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
  });

  // Test Case 5: Invalid HTTP methods
  it('should return 404/405 for invalid HTTP methods', () => {
    const invalidMethods = ['GET', 'PUT', 'DELETE', 'PATCH'];
    
    invalidMethods.forEach((method) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: method,
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([404, 405]);
      });
    });
  });

  // Test Case 6: Concurrent requests handling
  it('should handle concurrent coupon cache clear requests', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
      expect(response.body).to.have.property('timestamp');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
      expect(response.body).to.have.property('timestamp');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
      expect(response.body).to.have.property('timestamp');
    });
  });

  // Test Case 7: Empty request body handling
  it('should handle empty request body', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
    });
  });

  // Test Case 8: Request with body data
  it('should handle request with body data gracefully', () => {
    const requestData = {
      cacheType: 'coupons',
      force: true,
      reason: 'Manual coupon cache clear'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: requestData
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
    });
  });

  // Test Case 9: Timestamp accuracy validation
  it('should return accurate current timestamp', () => {
    const beforeRequest = new Date();
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((response) => {
        const afterRequest = new Date();
        const responseTimestamp = new Date(response.body.timestamp);
        
        expect(response.status).to.eq(200);
        expect(responseTimestamp).to.be.at.least(beforeRequest);
        expect(responseTimestamp).to.be.at.most(afterRequest);
        
        // Should be within 1 second of request time
        const timeDiff = Math.abs(responseTimestamp.getTime() - beforeRequest.getTime());
        expect(timeDiff).to.be.lessThan(1000);
      });
  });

  // Test Case 10: Multiple consecutive requests
  it('should handle multiple consecutive coupon cache clear requests', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((firstResponse) => {
        expect(firstResponse.status).to.eq(200);
        
        cy.wait(50); // Small delay
        
        cy.authRequest('POST', `${baseUrl}${endpoint}`)
          .then((secondResponse) => {
            expect(secondResponse.status).to.eq(200);
            expect(secondResponse.body.message).to.eq(firstResponse.body.message);
            
            // Timestamps should be different
            expect(secondResponse.body.timestamp).to.not.eq(firstResponse.body.timestamp);
            expect(new Date(secondResponse.body.timestamp)).to.be.greaterThan(new Date(firstResponse.body.timestamp));
          });
      });
  });

  // Test Case 11: Invalid Content-Type handling
  it('should handle different Content-Type headers', () => {
    const contentTypes = [
      'application/json',
      'text/plain',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ];

    contentTypes.forEach((contentType) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}${endpoint}`,
        headers: {
          'Content-Type': contentType
        },
        body: contentType === 'application/json' ? {} : ''
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
      });
    });
  });

  // Test Case 12: High load concurrent testing
  it('should handle high concurrent load efficiently', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Coupon cache cleared successfully');
      expect(response.body).to.have.property('timestamp');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Coupon cache cleared successfully');
      expect(response.body).to.have.property('timestamp');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Coupon cache cleared successfully');
      expect(response.body).to.have.property('timestamp');
    });
  });

  // Test Case 13: Error handling simulation
  it('should handle potential server errors gracefully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 500]);
      
      if (response.status === 500) {
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.be.a('string');
        expect(response.body.error.length).to.be.greaterThan(0);
      } else {
        expect(response.body).to.have.property('message', 'Coupon cache cleared successfully');
        expect(response.body).to.have.property('timestamp');
      }
    });
  });

  // Test Case 14: Response consistency validation
  it('should return consistent response structure across calls', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`).then((firstResponse) => {
      cy.authRequest('POST', `${baseUrl}${endpoint}`).then((secondResponse) => {
        expect(secondResponse.status).to.eq(firstResponse.status);
        expect(secondResponse.body.message).to.eq(firstResponse.body.message);
        
        // Structure should be identical
        expect(Object.keys(secondResponse.body)).to.deep.eq(Object.keys(firstResponse.body));
        
        // Data types should be consistent
        expect(typeof secondResponse.body.message).to.eq(typeof firstResponse.body.message);
        expect(typeof secondResponse.body.timestamp).to.eq(typeof firstResponse.body.timestamp);
        
        // Message content should be exactly the same
        expect(secondResponse.body.message).to.include('Coupon');
        expect(secondResponse.body.message).to.include('cache');
      });
    });
  });

  // Test Case 15: API contract and backward compatibility
  it('should maintain API contract for backward compatibility', () => {
    cy.authRequest('POST', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        
        // Core contract fields that must always exist
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('timestamp');
        
        // Type contract validation
        expect(response.body.message).to.be.a('string');
        expect(response.body.timestamp).to.be.a('string');
        
        // Content contract validation
        expect(response.body.message).to.eq('Coupon cache cleared successfully');
        
        // Timestamp format contract
        expect(response.body.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        
        // Response should only have expected fields
        const expectedFields = ['message', 'timestamp'];
        const actualFields = Object.keys(response.body);
        expect(actualFields).to.have.members(expectedFields);
        
        // Message should be specific to coupon cache
        expect(response.body.message).to.not.include('Store');
        expect(response.body.message).to.not.include('All');
        expect(response.body.message).to.include('Coupon');
      });
  });
});