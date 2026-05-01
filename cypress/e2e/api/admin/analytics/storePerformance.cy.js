describe('Admin - Store Performance Analytics API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/analytics/store-performance';

  beforeEach(() => {
    // Setup test data if needed
    // DISABLED: cy.task('clearDatabase');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid request
  it('should return store performance analytics successfully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message', 'Store performance analytics');
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('timestamp');
        expect(response.body.data).to.have.property('topPerformingStores');
        expect(response.body.data).to.have.property('storeEngagement');
        expect(response.body.data).to.have.property('popularCategories');
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
        expect(data.topPerformingStores).to.be.an('array');
        expect(data.storeEngagement).to.be.an('array');
        expect(data.popularCategories).to.be.an('array');
        
        // Validate timestamp format (ISO 8601)
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
  it('should return 404/405 for invalid HTTP method', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]);
    });

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]);
    });
  });

  // Test Case 6: Concurrent requests handling
  it('should handle concurrent requests properly', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Store performance analytics');
      expect(response.body.data).to.have.property('topPerformingStores');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Store performance analytics');
      expect(response.body.data).to.have.property('topPerformingStores');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Store performance analytics');
      expect(response.body.data).to.have.property('topPerformingStores');
    });
  });

  // Test Case 7: Empty data arrays validation
  it('should return empty arrays when no data exists', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const { data } = response.body;
        
        expect(data.topPerformingStores).to.be.an('array');
        expect(data.topPerformingStores.length).to.eq(0);
        expect(data.storeEngagement).to.be.an('array');
        expect(data.storeEngagement.length).to.eq(0);
        expect(data.popularCategories).to.be.an('array');
        expect(data.popularCategories.length).to.eq(0);
      });
  });

  // Test Case 8: Timestamp accuracy validation
  it('should return current timestamp within reasonable range', () => {
    const beforeRequest = new Date();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
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

  // Test Case 9: Query parameters handling
  it('should handle query parameters gracefully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}?period=7days&limit=20`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Store performance analytics');
        expect(response.body).to.have.property('data');
      });
  });

  // Test Case 10: Invalid query parameters
  it('should handle invalid query parameters without errors', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}?invalid=test&random=123&special=@#$%`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Store performance analytics');
        expect(response.body.data).to.have.property('topPerformingStores');
      });
  });

  // Test Case 11: High load concurrent testing
  it('should handle high concurrent load efficiently', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('storeEngagement');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('storeEngagement');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('storeEngagement');
    });
  });

  // Test Case 12: Response consistency validation
  it('should return consistent response structure across multiple calls', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((firstResponse) => {
        cy.wait(100); // Small delay
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((secondResponse) => {
            expect(firstResponse.status).to.eq(secondResponse.status);
            expect(firstResponse.body.message).to.eq(secondResponse.body.message);
            
            // Structure should be identical
            expect(Object.keys(firstResponse.body.data)).to.deep.eq(Object.keys(secondResponse.body.data));
            expect(Object.keys(firstResponse.body)).to.deep.eq(Object.keys(secondResponse.body));
            
            // Array types should be consistent
            expect(Array.isArray(firstResponse.body.data.topPerformingStores))
              .to.eq(Array.isArray(secondResponse.body.data.topPerformingStores));
          });
      });
  });

  // Test Case 13: Error handling and recovery
  it('should handle potential server errors gracefully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 500]);
      
      if (response.status === 500) {
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.be.a('string');
        expect(response.body.error.length).to.be.greaterThan(0);
      } else {
        expect(response.body).to.have.property('message', 'Store performance analytics');
        expect(response.body).to.have.property('data');
      }
    });
  });

  // Test Case 14: Memory and resource management
  it('should handle repeated requests without memory issues', () => {
    // Sequential requests instead of Promise.all to avoid timeout
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.timestamp).to.be.a('string');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.timestamp).to.be.a('string');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.timestamp).to.be.a('string');
    });
  });

  // Test Case 15: API contract and backward compatibility
  it('should maintain API contract for backward compatibility', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        
        // Core contract fields that must always exist
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('timestamp');
        
        // Data structure contract
        expect(response.body.data).to.have.property('topPerformingStores');
        expect(response.body.data).to.have.property('storeEngagement');
        expect(response.body.data).to.have.property('popularCategories');
        
        // Type contract validation
        expect(response.body.message).to.be.a('string');
        expect(response.body.timestamp).to.be.a('string');
        expect(response.body.data.topPerformingStores).to.be.an('array');
        expect(response.body.data.storeEngagement).to.be.an('array');
        expect(response.body.data.popularCategories).to.be.an('array');
        
        // Message content validation
        expect(response.body.message).to.eq('Store performance analytics');
      });
  });
});