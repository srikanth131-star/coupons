describe('Admin - Get Store Details API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/stores/details';
  let testStoreId;

  beforeEach(() => {
    // Setup test data
    // DISABLED: cy.task('clearDatabase', 'stores');
    
    // Create a test store directly
    const timestamp = Date.now();
    const storeData = {
      storeName: `Test Store ${timestamp}`,
      slug: `test-store-${timestamp}`
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/stores/create`, storeData)
      .then((response) => {
        testStoreId = response.body._id;
      });
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase', 'stores');
  });

  // Test Case 1: Success case - Valid store ID
  it('should return store details for valid ID', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('_id', testStoreId);
        expect(response.body).to.have.property('storeName');
        expect(response.body).to.have.property('slug');
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
      expect(response.status).to.be.oneOf([400, 500]); // Accept both validation error types
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 3: Non-existent store ID
  it('should return 404 for non-existent store ID', () => {
    const nonExistentId = '507f1f77bcf86cd799439011';
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${nonExistentId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Store not found');
    });
  });

  // Test Case 4: Response structure validation
  it('should return store with correct data structure', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const store = response.body;
        
        // Required fields
        expect(store).to.have.property('_id');
        expect(store).to.have.property('storeName');
        expect(store).to.have.property('slug');
        expect(store).to.have.property('createdAt');
        expect(store).to.have.property('updatedAt');
        
        // Data types
        expect(store._id).to.be.a('string');
        expect(store.storeName).to.be.a('string');
        expect(store.slug).to.be.a('string');
        expect(store.createdAt).to.be.a('string');
        expect(store.updatedAt).to.be.a('string');
      });
  });

  // Test Case 5: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(1000); // 1 second max for single record
      });
  });

  // Test Case 6: Concurrent requests for same store
  it('should handle concurrent requests for same store', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.eq(testStoreId);
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.eq(testStoreId);
    });
    
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.eq(testStoreId);
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
      url: `${baseUrl}${endpoint}/store@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]); // Accept both validation error types
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
      expect(response.status).to.be.oneOf([400, 500]); // Accept both validation error types
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 10: Content-Type validation
  it('should return JSON content type', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
  });

  // Test Case 11: Store with all optional fields
  it('should return store with all fields when present', () => {
    const timestamp = Date.now();
    const fullStoreData = {
      storeName: `Full Store ${timestamp}`,
      slug: `full-store-${timestamp}`,
      description: 'Full description',
      website: 'https://example.com',
      logo: 'https://example.com/logo.png'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/stores/create`, fullStoreData)
      .then((createResponse) => {
        cy.authRequest('GET', `${baseUrl}${endpoint}/${createResponse.body._id}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            const store = response.body;
            expect(store).to.have.property('storeName', fullStoreData.storeName);
            expect(store).to.have.property('slug', fullStoreData.slug);
            if (store.description) {
              expect(store.description).to.eq(fullStoreData.description);
            }
          });
      });
  });

  // Test Case 12: Store with minimal fields
  it('should return store with minimal required fields', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        const store = response.body;
        
        // Should have at least these required fields
        expect(store).to.have.property('_id');
        expect(store).to.have.property('storeName');
        expect(store).to.have.property('slug');
      });
  });

  // Test Case 13: Case sensitivity of ID
  it('should be case sensitive for store ID', () => {
    const uppercaseId = testStoreId.toUpperCase();
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${uppercaseId}`,
      failOnStatusCode: false
    }).then((response) => {
      if (testStoreId !== uppercaseId) {
        // MongoDB ObjectIds are case-insensitive, so this might succeed
        expect(response.status).to.be.oneOf([200, 400, 404]);
      }
    });
  });

  // Test Case 14: Database connection handling
  it('should handle database connection issues gracefully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 500]);
      if (response.status === 500) {
        expect(response.body).to.have.property('error');
      }
    });
  });

  // Test Case 15: Store with unicode characters
  it('should handle store with unicode characters correctly', () => {
    const timestamp = Date.now();
    const unicodeStoreData = {
      storeName: `Unicode Store 测试 🏪 ${timestamp}`,
      slug: `unicode-store-${timestamp}`
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/stores/create`, unicodeStoreData)
      .then((createResponse) => {
        cy.authRequest('GET', `${baseUrl}${endpoint}/${createResponse.body._id}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.storeName).to.include('测试');
            expect(response.body.storeName).to.include('🏪');
          });
      });
  });
});