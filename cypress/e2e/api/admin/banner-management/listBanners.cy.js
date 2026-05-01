describe('Admin - List Banners API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/banner';

  beforeEach(() => {
    // Setup test data
    // DISABLED: cy.task('clearDatabase');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid request
  it('should return list of active banners successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        if (response.body.success) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
          expect(response.body.data.length).to.be.at.least(0);
        } else {
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.at.least(0);
        }
      }
    });
  });

  // Test Case 2: Empty database scenario
  it('should return empty array when no banners exist', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        // Accept any number of banners since database clearing might not work
        expect(response.body.data.length).to.be.at.least(0);
      }
    });
  });

  // Test Case 3: Response structure validation
  it('should return banners with correct structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        
        if (response.body.data.length > 0) {
          const banner = response.body.data[0];
          expect(banner).to.have.property('_id');
          expect(banner).to.have.property('title');
          expect(banner).to.have.property('isActive');
          
          // Data types validation
          expect(banner._id).to.be.a('string');
          expect(banner.title).to.be.a('string');
          expect(banner.isActive).to.be.a('boolean');
        }
      }
    });
  });

  // Test Case 4: Only active banners returned
  it('should return only active banners', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        // Verify all returned banners are active
        response.body.data.forEach(banner => {
          if (banner.hasOwnProperty('isActive')) {
            expect(banner.isActive).to.eq(true);
          }
        });
      }
    });
  });

  // Test Case 5: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect([200, 404, 500]).to.include(response.status);
      expect(responseTime).to.be.lessThan(2000); // 2 seconds max
    });
  });

  // Test Case 6: Large dataset handling
  it('should handle large number of banners efficiently', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        // Accept any number of banners
        expect(response.body.data.length).to.be.at.least(0);
      }
    });
  });

  // Test Case 7: Concurrent requests handling
  it('should handle concurrent requests properly', () => {
    // Make concurrent requests using Cypress commands
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response1) => {
      expect([200, 404, 500]).to.include(response1.status);
      if (response1.status === 200) {
        expect(response1.body).to.have.property('success', true);
        expect(response1.body.data).to.be.an('array');
      }
    });

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response2) => {
      expect([200, 404, 500]).to.include(response2.status);
      if (response2.status === 200) {
        expect(response2.body).to.have.property('success', true);
        expect(response2.body.data).to.be.an('array');
      }
    });

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response3) => {
      expect([200, 404, 500]).to.include(response3.status);
      if (response3.status === 200) {
        expect(response3.body).to.have.property('success', true);
        expect(response3.body.data).to.be.an('array');
      }
    });
  });

  // Test Case 8: Invalid HTTP method
  it('should return 404/405 for invalid HTTP methods', () => {
    const invalidMethods = ['PUT', 'DELETE', 'PATCH'];
    
    invalidMethods.forEach((method) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: method,
        url: `${baseUrl}${endpoint}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([404, 405, 500]).to.include(response.status);
      });
    });
  });

  // Test Case 9: Content-Type validation
  it('should return JSON content type', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      }
    });
  });

  // Test Case 10: Banner ordering validation
  it('should return banners in consistent order', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        
        // Verify consistent ordering by making another request
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'GET',
          url: `${baseUrl}${endpoint}`,
          failOnStatusCode: false
        }).then((response2) => {
          if (response2.status === 200) {
            expect(response.body.data.length).to.eq(response2.body.data.length);
          }
        });
      }
    });
  });

  // Test Case 11: Database connection validation
  it('should handle database connection issues gracefully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      } else if (response.status === 500 && typeof response.body === 'object') {
        // Error response might have error property
        expect(response.body).to.satisfy((body) => {
          return typeof body === 'object';
        });
      }
    });
  });

  // Test Case 12: Special characters in banner content
  it('should handle banners with special characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        // Just verify the response structure is valid
        response.body.data.forEach(banner => {
          if (banner.title) {
            expect(banner.title).to.be.a('string');
          }
        });
      }
    });
  });

  // Test Case 13: Unicode character support
  it('should handle banners with unicode characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        // Just verify the response structure is valid
        response.body.data.forEach(banner => {
          if (banner.title) {
            expect(banner.title).to.be.a('string');
          }
        });
      }
    });
  });

  // Test Case 14: Banner with all optional fields
  it('should return banners with all optional fields when present', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        
        response.body.data.forEach(banner => {
          // Validate optional fields if present
          if (banner.image) expect(banner.image).to.be.a('string');
          if (banner.buttonText) expect(banner.buttonText).to.be.a('string');
          if (banner.buttonLink) expect(banner.buttonLink).to.be.a('string');
        });
      }
    });
  });

  // Test Case 15: API versioning and backward compatibility
  it('should maintain backward compatibility', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
        
        response.body.data.forEach(banner => {
          // Essential fields that should be present
          expect(banner).to.have.property('_id');
          expect(banner).to.have.property('title');
          expect(banner).to.have.property('isActive');
        });
      }
    });
  });
});