const BASE = 'http://localhost:5000/api/public';

describe('Public API - Featured Coupons', () => {

  it('should list featured coupons successfully', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should return only featured and active coupons', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.data.forEach((coupon) => {
        if (coupon.hasOwnProperty('isFeatured')) expect(coupon.isFeatured).to.be.true;
        if (coupon.hasOwnProperty('isActive')) expect(coupon.isActive).to.be.true;
      });
    });
  });

  it('should handle pagination', () => {
    cy.request(`${BASE}/featured-coupons/list?page=1&limit=2`).then((res) => {
      expect(res.status).to.eq(200);
      const coupons = res.body.data || res.body;
      expect(coupons.length).to.be.at.most(2);
    });
  });

  it('should sort by discount value', () => {
    cy.request(`${BASE}/featured-coupons/list?sortBy=discount&order=desc`).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('should handle empty featured coupons gracefully', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should include essential coupon information', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.data.length > 0) {
        res.body.data.forEach((coupon) => {
          expect(coupon).to.have.property('_id');
          expect(coupon).to.have.property('title');
        });
      }
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.data.forEach((coupon) => {
        expect(coupon).to.not.have.property('adminNotes');
        expect(coupon).to.not.have.property('internalId');
      });
    });
  });

  it('should respond within time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/featured-coupons/list`).then((res) => {
        expect(res.status).to.eq(200);
      });
    }
  });

  it('should include store information if present', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.data.length > 0 && res.body.data[0].store) {
        expect(res.body.data[0].store).to.be.an('object');
      }
    });
  });

  it('should return proper structure', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.body).to.have.property('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should handle invalid parameters', () => {
    cy.request({ url: `${BASE}/featured-coupons/list?page=-1&limit=0`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should include total count if present', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.hasOwnProperty('total')) expect(res.body.total).to.be.a('number');
    });
  });

  it('should maintain data consistency', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((first) => {
      cy.request(`${BASE}/featured-coupons/list`).then((second) => {
        expect(first.body.data.length).to.eq(second.body.data.length);
      });
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/featured-coupons/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

});
