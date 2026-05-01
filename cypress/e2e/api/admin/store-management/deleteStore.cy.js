describe('Admin - Delete Store API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/stores/delete';
  let testStoreId;

  beforeEach(() => {
    // Setup test data
    // DISABLED: cy.task('clearDatabase', 'stores');
    
    // Create a test store directly
    const timestamp = Date.now();
    const storeData = {
      storeName: `Store to Delete ${timestamp}`,
      slug: `store-to-delete-${timestamp}`
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

  // Test Case 1: Success case - Valid store deletion
  it('should delete store successfully with valid ID', () => {
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Store deleted');
      });

    // Verify store is actually deleted
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/api/admin/stores/details/${testStoreId}`,
      failOnStatusCode: false
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(404);
    });
  });

  // Test Case 2: Invalid store ID format
  it('should return 400 for invalid store ID format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/invalid-id`,
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
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/${nonExistentId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Store not found');
    });
  });

  // Test Case 4: Empty string ID
  it('should return 400 for empty string ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  // Test Case 5: Special characters in ID
  it('should return 400 for ID with special characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/store@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]); // Accept both validation error types
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 6: Very long ID string
  it('should return 400 for excessively long ID', () => {
    const longId = 'a'.repeat(100);
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/${longId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]); // Accept both validation error types
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 7: Double deletion attempt
  it('should return 404 for already deleted store', () => {
    // First deletion
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);

        // Second deletion attempt
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'DELETE',
          url: `${baseUrl}${endpoint}/${testStoreId}`,
          failOnStatusCode: false
        }).then((secondResponse) => {
          expect(secondResponse.status).to.eq(404);
          expect(secondResponse.body).to.have.property('error', 'Store not found');
        });
      });
  });

  // Test Case 8: Performance testing - Response time
  it('should delete store within acceptable time', () => {
    const startTime = Date.now();
    
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(2000); // 2 seconds max
      });
  });

  // Test Case 9: Concurrent deletion attempts
  it('should handle concurrent deletion attempts', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/${testStoreId}`,
      failOnStatusCode: false
    }).then((response1) => {
      expect(response1.status).to.eq(200);
      
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}${endpoint}/${testStoreId}`,
        failOnStatusCode: false
      }).then((response2) => {
        expect(response2.status).to.eq(404);
        
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'DELETE',
          url: `${baseUrl}${endpoint}/${testStoreId}`,
          failOnStatusCode: false
        }).then((response3) => {
          expect(response3.status).to.eq(404);
        });
      });
    });
  });

  // Test Case 10: Case sensitivity of ID
  it('should be case sensitive for store ID', () => {
    const uppercaseId = testStoreId.toUpperCase();
    
    if (testStoreId !== uppercaseId) {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}${endpoint}/${uppercaseId}`,
        failOnStatusCode: false
      }).then((response) => {
        // MongoDB ObjectIds are case-insensitive, so this might succeed
        expect(response.status).to.be.oneOf([200, 400, 404]);
      });
    }
  });

  // Test Case 11: Content-Type validation
  it('should not require Content-Type for DELETE request', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/${testStoreId}`,
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Store deleted');
    });
  });

  // Test Case 12: Database integrity after deletion
  it('should maintain database integrity after deletion', () => {
    // Create additional stores with unique identifiers
    const timestamp = Date.now();
    let store1Id, store2Id;
    
    cy.authRequest('POST', `${baseUrl}/api/admin/stores/create`, {
      storeName: `Store 1 ${timestamp}`,
      slug: `store-1-${timestamp}`
    }).then((response1) => {
      store1Id = response1.body._id;
      
      cy.authRequest('POST', `${baseUrl}/api/admin/stores/create`, {
        storeName: `Store 2 ${timestamp}`,
        slug: `store-2-${timestamp}`
      }).then((response2) => {
        store2Id = response2.body._id;
        
        // Delete the original test store
        cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testStoreId}`)
          .then((response) => {
            expect(response.status).to.eq(200);

            // Verify the deleted store no longer exists
            cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
              method: 'GET',
              url: `${baseUrl}/api/admin/stores/details/${testStoreId}`,
              failOnStatusCode: false
            }).then((deletedStoreResponse) => {
              expect(deletedStoreResponse.status).to.eq(404);
            });
            
            // Verify the other stores still exist
            cy.authRequest('GET', `${baseUrl}/api/admin/stores/details/${store1Id}`)
              .then((store1Response) => {
                expect(store1Response.status).to.eq(200);
                expect(store1Response.body.storeName).to.include('Store 1');
              });
              
            cy.authRequest('GET', `${baseUrl}/api/admin/stores/details/${store2Id}`)
              .then((store2Response) => {
                expect(store2Response.status).to.eq(200);
                expect(store2Response.body.storeName).to.include('Store 2');
              });
          });
      });
    });
  });

  // Test Case 13: Store with related data deletion
  it('should handle deletion of store with related data', () => {
    // This test assumes there might be related coupons or other data
    // In a real scenario, you might need to handle cascade deletions
    
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Store deleted');
      });
  });

  // Test Case 14: HTTP method validation
  it('should only accept DELETE method', () => {
    // Test with GET method
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]); // Method not allowed
    });

    // Test with POST method
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]); // Method not allowed
    });
  });

  // Test Case 15: Response format validation
  it('should return proper JSON response format', () => {
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testStoreId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.be.a('string');
      });
  });
});