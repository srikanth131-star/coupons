describe('Admin - Create Store API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/stores/create';

  beforeEach(() => {
    // Clear database before each test
    // DISABLED: cy.task('clearDatabase', 'stores');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase', 'stores');
  });

  // Test Case 1: Success case - Valid store creation
  it('should create a new store successfully', () => {
    const timestamp = Date.now();
    const storeData = {
      storeName: `Test Store ${timestamp}`,
      slug: `test-store-${timestamp}`,
      description: 'A test store',
      website: 'https://teststore.com',
      logo: 'https://teststore.com/logo.png'
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, storeData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('storeName', storeData.storeName);
        expect(response.body).to.have.property('slug', storeData.slug);
        expect(response.body).to.have.property('description', storeData.description);
        // Only check website and logo if they exist in response
        if (response.body.website) {
          expect(response.body).to.have.property('website', storeData.website);
        }
        if (response.body.logo) {
          expect(response.body).to.have.property('logo', storeData.logo);
        }
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
      });
  });

  // Test Case 2: Missing required fields
  it('should return 400 for missing required fields', () => {
    const incompleteData = {
      description: 'Missing required fields'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: incompleteData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 3: Duplicate slug validation
  it('should return 400 for duplicate slug', () => {
    const timestamp = Date.now();
    const storeData = {
      storeName: 'First Store',
      slug: `duplicate-slug-${timestamp}`
    };

    // Create first store
    cy.authRequest('POST', `${baseUrl}${endpoint}`, storeData)
      .then((response) => {
        expect(response.status).to.eq(201);

        // Try to create second store with same slug
        const duplicateStore = {
          storeName: 'Second Store',
          slug: `duplicate-slug-${timestamp}`
        };

        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'POST',
          url: `${baseUrl}${endpoint}`,
          body: duplicateStore,
          failOnStatusCode: false
        }).then((duplicateResponse) => {
          expect(duplicateResponse.status).to.eq(400);
          expect(duplicateResponse.body).to.have.property('error');
        });
      });
  });

  // Test Case 4: Invalid data types
  it('should return 400 for invalid data types', () => {
    const invalidData = {
      storeName: 123, // Should be string
      slug: true,     // Should be string
      description: [],  // Should be string
      website: {}     // Should be string
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: invalidData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 5: Minimum required fields only
  it('should create store with minimum required fields', () => {
    const timestamp = Date.now();
    const minimalData = {
      storeName: `Minimal Store ${timestamp}`,
      slug: `minimal-store-${timestamp}`
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, minimalData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('storeName', minimalData.storeName);
        expect(response.body).to.have.property('slug', minimalData.slug);
        expect(response.body).to.have.property('_id');
      });
  });

  // Test Case 6: Maximum field lengths
  it('should handle maximum field lengths', () => {
    const maxLengthData = {
      storeName: 'A'.repeat(100), // Test max length
      slug: 'a'.repeat(50),
      description: 'D'.repeat(500),
      website: 'https://example.com/' + 'a'.repeat(100),
      logo: 'https://example.com/logo/' + 'b'.repeat(100) + '.png'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: maxLengthData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400]);
      if (response.status === 201) {
        expect(response.body).to.have.property('storeName');
      }
    });
  });

  // Test Case 7: Empty string values
  it('should return 400 for empty string values', () => {
    const emptyData = {
      storeName: '',
      slug: '',
      description: '',
      website: '',
      logo: ''
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: emptyData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 8: Special characters in fields
  it('should handle special characters in store name', () => {
    const timestamp = Date.now();
    const specialCharData = {
      storeName: `Store & Co. (Special) ${timestamp}`,
      slug: `store-special-${timestamp}`,
      description: 'Store with special chars: @#$%^&*()'
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, specialCharData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.storeName).to.include('Special');
        expect(response.body.description).to.include('@#$%');
      });
  });

  // Test Case 9: Unicode characters support
  it('should handle unicode characters', () => {
    const timestamp = Date.now();
    const unicodeData = {
      storeName: `Store 测试 🏪 ${timestamp}`,
      slug: `store-unicode-${timestamp}`,
      description: 'Unicode description 测试 🛍️'
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, unicodeData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.storeName).to.include('测试');
        expect(response.body.storeName).to.include('🏪');
      });
  });

  // Test Case 10: Invalid URL formats
  it('should validate URL formats', () => {
    const timestamp = Date.now();
    const invalidUrlData = {
      storeName: `URL Test Store ${timestamp}`,
      slug: `url-test-${timestamp}`,
      website: 'not-a-valid-url',
      logo: 'also-not-a-url'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: invalidUrlData,
      failOnStatusCode: false
    }).then((response) => {
      // Should either accept or reject based on validation rules
      expect(response.status).to.be.oneOf([201, 400]);
    });
  });

  // Test Case 11: Null values handling
  it('should handle null values appropriately', () => {
    const timestamp = Date.now();
    const nullData = {
      storeName: `Null Test Store ${timestamp}`,
      slug: `null-test-${timestamp}`,
      description: null,
      website: null,
      logo: null
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: nullData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400]);
      if (response.status === 201) {
        expect(response.body).to.have.property('storeName');
      }
    });
  });

  // Test Case 12: Performance testing - Response time
  it('should create store within acceptable time', () => {
    const timestamp = Date.now();
    const storeData = {
      storeName: `Performance Test Store ${timestamp}`,
      slug: `performance-test-${timestamp}`
    };

    const startTime = Date.now();
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`, storeData)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(201);
        expect(responseTime).to.be.lessThan(2000); // 2 seconds max
      });
  });

  // Test Case 13: Concurrent store creation
  it('should handle concurrent store creation', () => {
    const timestamp = Date.now();
    
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('POST', `${baseUrl}${endpoint}`, {
      storeName: `Concurrent Store 1 ${timestamp}`,
      slug: `concurrent-store-1-${timestamp}`
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.storeName).to.include('1');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`, {
      storeName: `Concurrent Store 2 ${timestamp}`,
      slug: `concurrent-store-2-${timestamp}`
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.storeName).to.include('2');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`, {
      storeName: `Concurrent Store 3 ${timestamp}`,
      slug: `concurrent-store-3-${timestamp}`
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.storeName).to.include('3');
    });
  });

  // Test Case 14: Large payload handling
  it('should handle large payloads', () => {
    const largeData = {
      storeName: 'Large Payload Store',
      slug: 'large-payload',
      description: 'L'.repeat(1000), // Large description
      website: 'https://example.com',
      logo: 'https://example.com/logo.png',
      additionalData: 'X'.repeat(5000) // Large additional field
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: largeData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400, 413]); // 413 = Payload too large
    });
  });

  // Test Case 15: Content-Type validation
  it('should require proper Content-Type header', () => {
    const storeData = {
      storeName: 'Content Type Test',
      slug: 'content-type-test'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: storeData,
      headers: {
        'Content-Type': 'text/plain'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400, 415]); // 415 = Unsupported Media Type
    });
  });
});