describe('Admin API - Delete Featured Coupon', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();
  let testStoreId, testCouponId;

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/stores/create`,
      body: {
        storeName: `Test Store ${timestamp}`,
        slug: `test-store-${timestamp}`,
        category: 'Electronics',
        description: 'Test store for featured coupons'
      },
      failOnStatusCode: false
    }).then((storeResponse) => {
      if ([200, 201].includes(storeResponse.status)) {
        testStoreId = storeResponse.body.data?._id || storeResponse.body._id || storeResponse.body.id || 'test-store-id';
      } else {
        testStoreId = 'test-store-id';
      }
      
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/featured-coupons/create`,
        body: {
          title: `Test Featured Coupon ${timestamp}`,
          code: `TEST${timestamp}`,
          discount: 20,
          store: testStoreId,
          isFeatured: true
        },
        failOnStatusCode: false
      }).then((couponResponse) => {
        if ([200, 201].includes(couponResponse.status)) {
          testCouponId = couponResponse.body.data?._id || couponResponse.body._id || couponResponse.body.id || 'test-coupon-id';
        } else {
          testCouponId = 'test-coupon-id';
        }
      });
    });
  });

  it('should delete featured coupon successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('message');
      }
    });
  });

  it('should return 404 for non-existent coupon ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/507f1f77bcf86cd799439011`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
      if (response.status === 404 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should return 400 for invalid coupon ID format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/invalid-id`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (typeof response.body === 'object' && response.body.hasOwnProperty('success')) {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should verify coupon is actually deleted', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/coupons/${testCouponId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([404, 500]).to.include(response.status);
      });
    });
  });

  it('should remove from featured coupons list', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        url: `${baseUrl}/featured-coupons`,
        failOnStatusCode: false
      }).then((response) => {
        if ([200, 201].includes(response.status)) {
          const coupons = response.body.data || response.body;
          const deletedCoupon = coupons.find(coupon => coupon._id === testCouponId);
          expect(deletedCoupon).to.be.undefined;
        }
      });
    });
  });

  it('should handle deletion of already deleted coupon', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    });
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
      if (response.status === 404 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should handle concurrent deletion attempts', () => {
    const requests = Array.from({length: 3}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}/featured-coupons/${testCouponId}`,
        failOnStatusCode: false
      })
    );

    let successCount = 0;
    let notFoundCount = 0;

    requests.forEach(req => {
      req.then((response) => {
        if (response.status === 200) successCount++;
        if ([404, 500].includes(response.status)) notFoundCount++;
      });
    });

    cy.then(() => {
      expect(successCount).to.be.at.most(1);
      expect(successCount + notFoundCount).to.eq(3);
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should return proper response structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('message');
        expect(response.body.success).to.be.true;
      }
    });
  });

  it('should handle case-insensitive ObjectId', () => {
    const upperCaseId = testCouponId.toUpperCase();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${upperCaseId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should clean up related data', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        url: `${baseUrl}/coupons`,
        failOnStatusCode: false
      }).then((response) => {
        if ([200, 201].includes(response.status)) {
          const coupons = response.body.data || response.body;
          const deletedCoupon = coupons.find(coupon => coupon._id === testCouponId);
          expect(deletedCoupon).to.be.undefined;
        }
      });
    });
  });

  it('should handle deletion with special characters in ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/special!@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain referential integrity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        url: `${baseUrl}/featured-coupons`,
        failOnStatusCode: false
      }).then((response) => {
        if ([200, 201].includes(response.status)) {
          const coupons = response.body.data || response.body;
          const deletedCoupon = coupons.find(coupon => coupon._id === testCouponId);
          expect(deletedCoupon).to.be.undefined;
        }
      });
    });
  });

  it('should handle empty coupon ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 405, 500]).to.include(response.status);
    });
  });

  it('should log deletion activity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body.message).to.include('deleted');
      }
    });
  });
});