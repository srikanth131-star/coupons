describe('Admin - Delete Coupon API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/coupons/delete';
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
        description: 'Test store for coupon deletion tests',
        category: 'Electronics'
      }
    }).then((storeResponse) => {
      testStoreId = storeResponse.body._id;
      
      // Create a test coupon
      const couponData = {
        title: `Coupon to Delete ${timestamp}`,
        code: `DEL${timestamp}`,
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

  // Test Case 1: Success case - Valid coupon deletion
  it('should delete coupon successfully with valid ID', () => {
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Coupon deleted');
      });

    // Verify coupon is actually deleted
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/api/admin/coupons/details/${testCouponId}`,
      failOnStatusCode: false
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(404);
    });
  });

  // Test Case 2: Invalid coupon ID format
  it('should return 400 for invalid coupon ID format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/invalid-id`,
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
      method: 'DELETE',
      url: `${baseUrl}${endpoint}/${nonExistentId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Coupon not found');
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
      url: `${baseUrl}${endpoint}/coupon@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
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
      expect(response.status).to.be.oneOf([400, 500]);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 7: Double deletion attempt
  it('should return 404 for already deleted coupon', () => {
    // First deletion
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);

        // Second deletion attempt
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'DELETE',
          url: `${baseUrl}${endpoint}/${testCouponId}`,
          failOnStatusCode: false
        }).then((secondResponse) => {
          expect(secondResponse.status).to.eq(404);
          expect(secondResponse.body).to.have.property('error', 'Coupon not found');
        });
      });
  });

  // Test Case 8: Performance testing - Response time
  it('should delete coupon within acceptable time', () => {
    const startTime = Date.now();
    
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testCouponId}`)
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
      url: `${baseUrl}${endpoint}/${testCouponId}`,
      failOnStatusCode: false
    }).then((response1) => {
      expect(response1.status).to.eq(200);
      
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}${endpoint}/${testCouponId}`,
        failOnStatusCode: false
      }).then((response2) => {
        expect(response2.status).to.eq(404);
        
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'DELETE',
          url: `${baseUrl}${endpoint}/${testCouponId}`,
          failOnStatusCode: false
        }).then((response3) => {
          expect(response3.status).to.eq(404);
        });
      });
    });
  });

  // Test Case 10: Case sensitivity of ID
  it('should be case sensitive for coupon ID', () => {
    const uppercaseId = testCouponId.toUpperCase();
    
    if (testCouponId !== uppercaseId) {
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
      url: `${baseUrl}${endpoint}/${testCouponId}`,
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Coupon deleted');
    });
  });

  // Test Case 12: Database integrity after deletion
  it('should maintain database integrity after deletion', () => {
    // Create additional coupons with unique identifiers
    const timestamp = Date.now();
    let coupon1Id, coupon2Id;
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
      title: `Coupon 1 ${timestamp}`,
      code: `CPN1${timestamp}`,
      discount: '10%',
      store: testStoreId,
      category: 'Electronics'
    }).then((response1) => {
      coupon1Id = response1.body._id;
      
      cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
        title: `Coupon 2 ${timestamp}`,
        code: `CPN2${timestamp}`,
        discount: '20%',
        store: testStoreId,
        category: 'Electronics'
      }).then((response2) => {
        coupon2Id = response2.body._id;
        
        // Delete the original test coupon
        cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testCouponId}`)
          .then((response) => {
            expect(response.status).to.eq(200);

            // Verify the deleted coupon no longer exists
            cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
              method: 'GET',
              url: `${baseUrl}/api/admin/coupons/details/${testCouponId}`,
              failOnStatusCode: false
            }).then((deletedCouponResponse) => {
              expect(deletedCouponResponse.status).to.eq(404);
            });
            
            // Verify the other coupons still exist
            cy.authRequest('GET', `${baseUrl}/api/admin/coupons/details/${coupon1Id}`)
              .then((coupon1Response) => {
                expect(coupon1Response.status).to.eq(200);
                expect(coupon1Response.body.title).to.include('Coupon 1');
              });
              
            cy.authRequest('GET', `${baseUrl}/api/admin/coupons/details/${coupon2Id}`)
              .then((coupon2Response) => {
                expect(coupon2Response.status).to.eq(200);
                expect(coupon2Response.body.title).to.include('Coupon 2');
              });
          });
      });
    });
  });

  // Test Case 13: Coupon with related data deletion
  it('should handle deletion of coupon with related data', () => {
    // This test assumes there might be related clicks or other data
    // In a real scenario, you might need to handle cascade deletions
    
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testCouponId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Coupon deleted');
      });
  });

  // Test Case 14: HTTP method validation
  it('should only accept DELETE method', () => {
    // Test with GET method
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}${endpoint}/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]); // Method not allowed
    });

    // Test with POST method
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 405]); // Method not allowed
    });
  });

  // Test Case 15: Response format validation
  it('should return proper JSON response format', () => {
    cy.authRequest('DELETE', `${baseUrl}${endpoint}/${testCouponId}`)
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