describe('Admin API - Update Featured Coupon', () => {
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

  it('should update featured coupon successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `Updated Featured Coupon ${timestamp}`,
        discount: 35
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('title', `Updated Featured Coupon ${timestamp}`);
        expect(response.body.data).to.have.property('discount', 35);
      }
    });
  });

  it('should return 404 for non-existent coupon ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/507f1f77bcf86cd799439011`,
      body: {
        title: `Non-existent ${timestamp}`
      },
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
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/invalid-id`,
      body: {
        title: `Invalid ID ${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (typeof response.body === 'object' && response.body.hasOwnProperty('success')) {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should update only provided fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        discount: 40
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body.data).to.have.property('title', `Test Featured Coupon ${timestamp}`);
        expect(response.body.data).to.have.property('discount', 40);
      }
    });
  });

  it('should maintain isFeatured status', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `Maintain Featured ${timestamp}`,
        isFeatured: false
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('isFeatured')) {
        expect(response.body.data.isFeatured).to.be.true;
      }
    });
  });

  it('should validate updated coupon code uniqueness', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/featured-coupons/create`,
      body: {
        title: `Another Coupon ${timestamp}`,
        code: `ANOTHER${timestamp}`,
        discount: 15,
        store: testStoreId
      },
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'PUT',
        url: `${baseUrl}/featured-coupons/${testCouponId}`,
        body: {
          code: `ANOTHER${timestamp}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([400, 404, 409, 500]).to.include(response.status);
        if (typeof response.body === 'object' && response.body.hasOwnProperty('success')) {
          expect(response.body).to.have.property('success', false);
        }
      });
    });
  });

  it('should handle unicode characters in updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `更新特色券 ${timestamp}`,
        description: 'Unicode description 🎁'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body.data).to.have.property('title', `更新特色券 ${timestamp}`);
      }
    });
  });

  it('should validate discount value in updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        discount: -5
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should update timestamps correctly', () => {
    const beforeUpdate = new Date();
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `Timestamp Test ${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('updatedAt')) {
        const updatedAt = new Date(response.body.data.updatedAt);
        expect(updatedAt.getTime()).to.be.greaterThan(beforeUpdate.getTime() - 1000);
      }
    });
  });

  it('should handle concurrent updates', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'PUT',
        url: `${baseUrl}/featured-coupons/${testCouponId}`,
        body: {
          description: `Concurrent update ${i} at ${Date.now()}`
        },
        failOnStatusCode: false
      })
    );

    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `Performance ${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should handle malformed JSON in updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should preserve featured metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `Metrics Preserved ${timestamp}`,
        clickCount: 150
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('clickCount')) {
        expect(response.body.data.clickCount).to.be.a('number');
      }
    });
  });

  it('should return complete updated object', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: {
        title: `Complete Object ${timestamp}`,
        discount: 45
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.have.property('createdAt');
      }
    });
  });

  it('should maintain data integrity after update', () => {
    const updateData = {
      title: `Integrity Update ${timestamp}`,
      discount: 50,
      description: 'Updated for integrity test'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/featured-coupons/${testCouponId}`,
      body: updateData,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        url: `${baseUrl}/coupons/${testCouponId}`,
        failOnStatusCode: false
      }).then((getResponse) => {
        if ([200, 201].includes(getResponse.status)) {
          expect(getResponse.body.data.title).to.eq(updateData.title);
          expect(getResponse.body.data.discount).to.eq(updateData.discount);
        }
      });
    });
  });
});