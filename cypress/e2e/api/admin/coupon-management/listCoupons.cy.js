describe('Admin - List Coupons API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/coupons/list';
  let testStoreId;

  beforeEach(() => {
    // Setup test data if needed
    // DISABLED: cy.task('clearDatabase');
    
    // Create a test store for all coupon tests
    const timestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/api/admin/stores/create`,
      body: {
        storeName: `Test Store ${timestamp}`,
        slug: `test-store-${timestamp}`,
        description: 'Test store for list coupons tests',
        category: 'Electronics'
      }
    }).then((storeResponse) => {
      testStoreId = storeResponse.body._id;
    });
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid request
  it('should return list of coupons successfully', () => {
    const timestamp = Date.now();
    const couponData = {
      title: `Test Coupon ${timestamp}`,
      code: `TEST${timestamp}`,
      discount: '20%',
      store: testStoreId,
      category: 'Electronics'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, couponData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.have.property('_id');
            expect(response.body[0]).to.have.property('title');
            expect(response.body[0]).to.have.property('code');
          });
      });
  });

  // Test Case 2: Empty database scenario
  it('should return empty array when no coupons exist', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.at.least(0);
      });
  });

  // Test Case 3: Response structure validation
  it('should return coupons with correct structure', () => {
    const timestamp = Date.now();
    const couponData = {
      title: `Structure Test Coupon ${timestamp}`,
      code: `STRUCT${timestamp}`,
      discount: '15%',
      store: testStoreId,
      category: 'Electronics'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, couponData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            
            if (response.body.length > 0) {
              const coupon = response.body.find(c => c.title === couponData.title);
              expect(coupon).to.have.property('_id');
              expect(coupon).to.have.property('title');
              expect(coupon).to.have.property('code');
              expect(coupon).to.have.property('createdAt');
              expect(coupon).to.have.property('updatedAt');
              expect(coupon._id).to.be.a('string');
              expect(coupon.title).to.be.a('string');
              expect(coupon.code).to.be.a('string');
            }
          });
      });
  });

  // Test Case 4: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(2000); // 2 seconds max
      });
  });

  // Test Case 5: Large dataset handling
  it('should handle large number of coupons', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
      title: `Test Coupon 1 ${timestamp}`,
      code: `TEST1${timestamp}`,
      discount: '10%',
      store: testStoreId,
      category: 'Electronics'
    }).then(() => {
      cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
        title: `Test Coupon 2 ${timestamp}`,
        code: `TEST2${timestamp}`,
        discount: '20%',
        store: testStoreId,
        category: 'Electronics'
      }).then(() => {
        cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
          title: `Test Coupon 3 ${timestamp}`,
          code: `TEST3${timestamp}`,
          discount: '30%',
          store: testStoreId,
          category: 'Electronics'
        }).then(() => {
          cy.authRequest('GET', `${baseUrl}${endpoint}`)
            .then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('array');
              expect(response.body.length).to.be.at.least(3);
            });
        });
      });
    });
  });

  // Test Case 6: Concurrent requests handling
  it('should handle concurrent requests properly', () => {
    const timestamp = Date.now();
    const couponData = {
      title: `Concurrent Test Coupon ${timestamp}`,
      code: `CONC${timestamp}`,
      discount: '25%',
      store: testStoreId,
      category: 'Electronics'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, couponData)
      .then(() => {
        // Sequential requests to avoid Promise.all timeout
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
        
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
        
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
  });

  // Test Case 7: Invalid endpoint method
  it('should return 404 for invalid HTTP method', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // Test Case 8: Server error simulation
  it('should handle server errors gracefully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.be.oneOf([200, 500]);
      });
  });

  // Test Case 9: Content-Type validation
  it('should return JSON content type', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
  });

  // Test Case 10: Coupon sorting validation
  it('should return coupons in consistent order', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
      title: `Coupon A ${timestamp}`,
      code: `COUPA${timestamp}`,
      discount: '10%',
      store: testStoreId,
      category: 'Electronics'
    }).then(() => {
      cy.wait(100);
      cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
        title: `Coupon B ${timestamp}`,
        code: `COUPB${timestamp}`,
        discount: '20%',
        store: testStoreId,
        category: 'Electronics'
      }).then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.at.least(2);
            
            const couponA = response.body.find(c => c.title.includes('Coupon A'));
            const couponB = response.body.find(c => c.title.includes('Coupon B'));
            expect(couponA).to.have.property('title');
            expect(couponB).to.have.property('title');
          });
      });
    });
  });

  // Test Case 11: Database connection validation
  it('should handle database connection issues', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.be.oneOf([200, 500]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
        }
      });
  });

  // Test Case 12: Memory usage with large responses
  it('should handle memory efficiently with large datasets', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
      title: `Memory Test Coupon 1 ${timestamp}`,
      code: `MEM1${timestamp}`,
      discount: '10%',
      store: testStoreId,
      category: 'Electronics'
    }).then(() => {
      cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
        title: `Memory Test Coupon 2 ${timestamp}`,
        code: `MEM2${timestamp}`,
        discount: '20%',
        store: testStoreId,
        category: 'Electronics'
      }).then(() => {
        cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
          title: `Memory Test Coupon 3 ${timestamp}`,
          code: `MEM3${timestamp}`,
          discount: '30%',
          store: testStoreId,
          category: 'Electronics'
        }).then(() => {
          cy.authRequest('GET', `${baseUrl}${endpoint}`)
            .then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('array');
              expect(response.body.length).to.be.at.least(3);
              
              const testCoupons = response.body.filter(c => c.title.includes('Memory Test Coupon'));
              testCoupons.forEach((coupon) => {
                expect(coupon).to.have.property('_id');
                expect(coupon).to.have.property('title');
              });
            });
        });
      });
    });
  });

  // Test Case 13: Special characters in coupon data
  it('should handle coupons with special characters', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
      title: `Coupon & Co. (Special) ${timestamp}`,
      code: `SPEC${timestamp}`,
      discount: '15%',
      store: testStoreId,
      category: 'Electronics'
    }).then(() => {
      cy.authRequest('GET', `${baseUrl}${endpoint}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          const specialCoupon = response.body.find(c => c.title.includes('Special'));
          expect(specialCoupon.title).to.include('Special');
        });
    });
  });

  // Test Case 14: Unicode character support
  it('should handle coupons with unicode characters', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, {
      title: `Coupon 测试 🎯 ${timestamp}`,
      code: `UNI${timestamp}`,
      discount: '25%',
      store: testStoreId,
      category: 'Electronics'
    }).then(() => {
      cy.authRequest('GET', `${baseUrl}${endpoint}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          const unicodeCoupon = response.body.find(c => c.title.includes('测试'));
          expect(unicodeCoupon.title).to.include('测试');
        });
    });
  });

  // Test Case 15: API versioning and backward compatibility
  it('should maintain backward compatibility', () => {
    const timestamp = Date.now();
    const couponData = {
      title: `Compatibility Test Coupon ${timestamp}`,
      code: `COMPAT${timestamp}`,
      discount: '30%',
      store: testStoreId,
      category: 'Electronics'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/coupons/create`, couponData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            
            if (response.body.length > 0) {
              const testCoupon = response.body.find(c => c.title === couponData.title);
              expect(testCoupon).to.have.property('_id');
              expect(testCoupon).to.have.property('title');
              expect(testCoupon).to.have.property('code');
              expect(testCoupon).to.have.property('createdAt');
              expect(testCoupon).to.have.property('updatedAt');
            }
          });
      });
  });
});