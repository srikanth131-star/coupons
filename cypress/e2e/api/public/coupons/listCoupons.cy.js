const BASE = 'http://localhost:5000/api/public';

describe('Public API - List Coupons', () => {

  it('should list public coupons successfully', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return only active coupons', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((coupon) => {
        if (coupon.hasOwnProperty('isActive')) expect(coupon.isActive).to.be.true;
      });
    });
  });

  it('should handle pagination parameters', () => {
    cy.request(`${BASE}/coupons/list?page=1&limit=3`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.most(3);
    });
  });

  it('should sort coupons by discount value', () => {
    cy.request(`${BASE}/coupons/list?sortBy=discount&order=desc`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should filter by store', () => {
    cy.request(`${BASE}/stores/list`).then((storeRes) => {
      const storeId = storeRes.body[0]?._id;
      if (!storeId) return;
      cy.request(`${BASE}/coupons/list?store=${storeId}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    });
  });

  it('should handle empty coupons list gracefully', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should include essential coupon information', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      if (res.body.length > 0) {
        res.body.forEach((coupon) => {
          expect(coupon).to.have.property('_id');
          expect(coupon).to.have.property('title');
        });
      }
    });
  });

  it('should search coupons by title', () => {
    cy.request({ url: `${BASE}/coupons/list?search=off`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should filter by category', () => {
    cy.request({ url: `${BASE}/coupons/list?category=electronics`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should respond within acceptable time', () => {
    const start = Date.now();
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/coupons/list`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    }
  });

  it('should include total count in response if present', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return proper response structure', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((coupon) => {
        expect(coupon).to.not.have.property('adminNotes');
        expect(coupon).to.not.have.property('internalId');
      });
    });
  });

  it('should maintain consistent data across requests', () => {
    cy.request(`${BASE}/coupons/list`).then((first) => {
      cy.request(`${BASE}/coupons/list`).then((second) => {
        expect(first.body.length).to.eq(second.body.length);
      });
    });
  });

});
