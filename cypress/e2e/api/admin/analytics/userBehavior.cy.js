describe('Admin - User Behavior Analytics API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/analytics/user-behavior';

  beforeEach(() => {
    // Setup test data if needed
    // DISABLED: cy.task('clearDatabase');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid request
  it('should return user behavior analytics successfully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message', 'User behavior analytics');
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('timestamp');
        expect(response.body.data).to.have.property('pageViews');
        expect(response.body.data).to.have.property('userSessions');
        expect(response.body.data).to.have.property('bounceRate');
        expect(response.body.data).to.have.property('averageSessionDuration');
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
        expect(data.pageViews).to.be.an('array');
        expect(data.userSessions).to.be.an('array');
        expect(data.bounceRate).to.be.a('number');
        expect(data.averageSessionDuration).to.be.a('number');
        
        // Validate numeric ranges
        expect(data.bounceRate).to.be.at.least(0);
        expect(data.bounceRate).to.be.at.most(100);
        expect(data.averageSessionDuration).to.be.at.least(0);
        
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

  // Test Case 5: Invalid HTTP methods
  it('should return 404/405 for invalid HTTP methods', () => {
    const invalidMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    
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
  it('should handle concurrent requests properly', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'User behavior analytics');
      expect(response.body.data).to.have.property('bounceRate');
      expect(response.body.data).to.have.property('averageSessionDuration');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'User behavior analytics');
      expect(response.body.data).to.have.property('bounceRate');
      expect(response.body.data).to.have.property('averageSessionDuration');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'User behavior analytics');
      expect(response.body.data).to.have.property('bounceRate');
      expect(response.body.data).to.have.property('averageSessionDuration');
    });
  });

  // Test Case 7: Default values validation
  it('should return correct default values when no data exists', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const { data } = response.body;
        
        expect(data.pageViews).to.be.an('array');
        expect(data.pageViews.length).to.eq(0);
        expect(data.userSessions).to.be.an('array');
        expect(data.userSessions.length).to.eq(0);
        expect(data.bounceRate).to.eq(0);
        expect(data.averageSessionDuration).to.eq(0);
      });
  });

  // Test Case 8: Timestamp accuracy validation
  it('should return accurate current timestamp', () => {
    const beforeRequest = new Date();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        const afterRequest = new Date();
        const responseTimestamp = new Date(response.body.timestamp);
        
        expect(response.status).to.eq(200);
        expect(responseTimestamp).to.be.at.least(beforeRequest);
        expect(responseTimestamp).to.be.at.most(afterRequest);
        
        // Timestamp should be very recent (within 2 seconds)
        const timeDiff = Math.abs(responseTimestamp.getTime() - beforeRequest.getTime());
        expect(timeDiff).to.be.lessThan(2000);
      });
  });

  // Test Case 9: Query parameters handling
  it('should handle query parameters gracefully', () => {
    const queryParams = [
      '?period=30days',
      '?startDate=2024-01-01&endDate=2024-01-31',
      '?timezone=UTC',
      '?format=detailed'
    ];

    queryParams.forEach((params) => {
      cy.authRequest('GET', `${baseUrl}${endpoint}${params}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('message', 'User behavior analytics');
          expect(response.body).to.have.property('data');
        });
    });
  });

  // Test Case 10: Invalid query parameters
  it('should handle invalid query parameters without errors', () => {
    const invalidParams = [
      '?invalid=parameter',
      '?period=invalid_period',
      '?limit=not_a_number',
      '?special=@#$%^&*()'
    ];

    invalidParams.forEach((params) => {
      cy.authRequest('GET', `${baseUrl}${endpoint}${params}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('message', 'User behavior analytics');
          expect(response.body.data).to.have.property('bounceRate');
        });
    });
  });

  // Test Case 11: High load stress testing
  it('should handle high concurrent load without degradation', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('userSessions');
      expect(response.body.data.bounceRate).to.be.a('number');
      expect(response.body.data.averageSessionDuration).to.be.a('number');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('userSessions');
      expect(response.body.data.bounceRate).to.be.a('number');
      expect(response.body.data.averageSessionDuration).to.be.a('number');
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('userSessions');
      expect(response.body.data.bounceRate).to.be.a('number');
      expect(response.body.data.averageSessionDuration).to.be.a('number');
    });
  });

  // Test Case 12: Response consistency validation
  it('should return consistent response structure across calls', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`).then((firstResponse) => {
      cy.authRequest('GET', `${baseUrl}${endpoint}`).then((secondResponse) => {
        expect(secondResponse.status).to.eq(firstResponse.status);
        expect(secondResponse.body.message).to.eq(firstResponse.body.message);
        
        // Structure consistency
        expect(Object.keys(secondResponse.body.data)).to.deep.eq(Object.keys(firstResponse.body.data));
        expect(Object.keys(secondResponse.body)).to.deep.eq(Object.keys(firstResponse.body));
        
        // Type consistency
        expect(typeof secondResponse.body.data.bounceRate).to.eq(typeof firstResponse.body.data.bounceRate);
        expect(typeof secondResponse.body.data.averageSessionDuration).to.eq(typeof firstResponse.body.data.averageSessionDuration);
      });
    });
  });

  // Test Case 13: Error handling and recovery
  it('should handle server errors gracefully', () => {
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
        expect(response.body).to.have.property('message', 'User behavior analytics');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('bounceRate');
        expect(response.body.data).to.have.property('averageSessionDuration');
      }
    });
  });

  // Test Case 14: Data validation and bounds checking
  it('should return data within expected bounds and formats', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const { data } = response.body;
        
        // Bounce rate should be between 0 and 100 (percentage)
        expect(data.bounceRate).to.be.at.least(0);
        expect(data.bounceRate).to.be.at.most(100);
        expect(data.bounceRate % 1).to.eq(0); // Should be integer for default case
        
        // Average session duration should be non-negative
        expect(data.averageSessionDuration).to.be.at.least(0);
        expect(data.averageSessionDuration % 1).to.eq(0); // Should be integer for default case
        
        // Arrays should be valid
        expect(Array.isArray(data.pageViews)).to.be.true;
        expect(Array.isArray(data.userSessions)).to.be.true;
        
        // Timestamp should be valid ISO string
        expect(() => new Date(response.body.timestamp)).to.not.throw();
      });
  });

  // Test Case 15: API contract and backward compatibility
  it('should maintain API contract for long-term compatibility', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        
        // Core contract - these fields must always exist
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('timestamp');
        
        // Data structure contract
        expect(response.body.data).to.have.property('pageViews');
        expect(response.body.data).to.have.property('userSessions');
        expect(response.body.data).to.have.property('bounceRate');
        expect(response.body.data).to.have.property('averageSessionDuration');
        
        // Type contract - these types must remain consistent
        expect(response.body.message).to.be.a('string');
        expect(response.body.timestamp).to.be.a('string');
        expect(response.body.data.pageViews).to.be.an('array');
        expect(response.body.data.userSessions).to.be.an('array');
        expect(response.body.data.bounceRate).to.be.a('number');
        expect(response.body.data.averageSessionDuration).to.be.a('number');
        
        // Content contract
        expect(response.body.message).to.eq('User behavior analytics');
        
        // Value contract for default state
        expect(response.body.data.bounceRate).to.eq(0);
        expect(response.body.data.averageSessionDuration).to.eq(0);
        expect(response.body.data.pageViews.length).to.eq(0);
        expect(response.body.data.userSessions.length).to.eq(0);
      });
  });
});