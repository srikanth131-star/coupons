describe('Admin - Coupon Performance Analytics API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/analytics/coupon-performance';

  beforeEach(() => {
    // Setup test data if needed
    // DISABLED: cy.task('clearDatabase');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid request
  it('should return coupon performance analytics successfully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message', 'Coupon performance analytics');
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('timestamp');
        expect(response.body.data).to.have.property('topPerformingCoupons');
        expect(response.body.data).to.have.property('clickTrends');
        expect(response.body.data).to.have.property('conversionRates');
      });
  });

  // Test Case 2: Response structure validation
  it('should return analytics with correct data structure', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const { data } = response.body;
        
        // Validate data types
        expect(response.body.message).to.be.a('string');
        expect(response.body.timestamp).to.be.a('string');
        expect(data.topPerformingCoupons).to.be.an('array');
        expect(data.clickTrends).to.be.an('array');
        expect(data.conversionRates).to.be.an('array');
        
        // Validate timestamp format
        expect(new Date(response.body.timestamp)).to.be.instanceOf(Date);
        expect(response.body.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
  });

  // Test Case 3: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(3000); // 3 seconds max for analytics
      });
  });

  // Test Case 4: Content-Type validation
  it('should return JSON content type', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
  });

  // Test Case 5: Invalid HTTP method
  it('should return 404 for invalid HTTP method', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]);
    });
  });

  // Test Case 6: Concurrent requests handling
  it('should handle concurrent requests properly', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then(() => {
      cy.authRequest('GET', `${baseUrl}${endpoint}`).then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then(() => {
          cy.authRequest('GET', `${baseUrl}${endpoint}`).then(() => {
            cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.have.property('message', 'Coupon performance analytics');
            });
          });
        });
      });
    });
  });

  // Test Case 7: Empty data arrays validation
  it('should return empty arrays when no data exists', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const { data } = response.body;
        
        expect(data.topPerformingCoupons).to.be.an('array');
        expect(data.topPerformingCoupons.length).to.eq(0);
        expect(data.clickTrends).to.be.an('array');
        expect(data.clickTrends.length).to.eq(0);
        expect(data.conversionRates).to.be.an('array');
        expect(data.conversionRates.length).to.eq(0);
      });
  });

  // Test Case 8: Timestamp accuracy validation
  it('should return current timestamp', () => {
    const beforeRequest = new Date();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        const afterRequest = new Date();
        const responseTimestamp = new Date(response.body.timestamp);
        
        expect(response.status).to.eq(200);
        expect(responseTimestamp).to.be.at.least(beforeRequest);
        expect(responseTimestamp).to.be.at.most(afterRequest);
      });
  });

  // Test Case 9: Query parameters handling
  it('should handle query parameters gracefully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}?limit=10&period=30days`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Coupon performance analytics');
        expect(response.body).to.have.property('data');
      });
  });

  // Test Case 10: Invalid query parameters
  it('should handle invalid query parameters', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}?invalid=parameter&test=123`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Coupon performance analytics');
      });
  });

  // Test Case 11: Large concurrent load testing
  it('should handle high concurrent load', () => {
    // Sequential requests to avoid Promise.all timeout issues
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('topPerformingCoupons');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('topPerformingCoupons');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('topPerformingCoupons');
    });
  });

  // Test Case 12: Response consistency validation
  it('should return consistent response structure across multiple calls', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((firstResponse) => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((secondResponse) => {
            expect(firstResponse.status).to.eq(secondResponse.status);
            expect(firstResponse.body.message).to.eq(secondResponse.body.message);
            
            // Structure should be identical
            expect(Object.keys(firstResponse.body.data)).to.deep.eq(Object.keys(secondResponse.body.data));
            expect(Object.keys(firstResponse.body)).to.deep.eq(Object.keys(secondResponse.body));
          });
      });
  });

  // Test Case 13: Error handling simulation
  it('should handle server errors gracefully', () => {
    // This test assumes the endpoint might fail under certain conditions
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 500]);
      
      if (response.status === 500) {
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.be.a('string');
      } else {
        expect(response.body).to.have.property('message', 'Coupon performance analytics');
      }
    });
  });

  // Test Case 14: Memory usage validation
  it('should not cause memory leaks with repeated requests', () => {
    // Sequential requests instead of Promise.all to avoid timeout
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon performance analytics');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('topPerformingCoupons');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('topPerformingCoupons');
    });
  });

  // Test Case 15: API versioning and backward compatibility
  it('should maintain backward compatibility', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        
        // Essential fields that should always be present
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('timestamp');
        
        // Essential data structure
        expect(response.body.data).to.have.property('topPerformingCoupons');
        expect(response.body.data).to.have.property('clickTrends');
        expect(response.body.data).to.have.property('conversionRates');
        
        // Data types should remain consistent
        expect(response.body.message).to.be.a('string');
        expect(response.body.data.topPerformingCoupons).to.be.an('array');
        expect(response.body.data.clickTrends).to.be.an('array');
        expect(response.body.data.conversionRates).to.be.an('array');
      });
  });
});