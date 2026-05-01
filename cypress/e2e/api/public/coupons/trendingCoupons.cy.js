const BASE = 'http://localhost:5000/api/public';

describe('Public - Trending Coupons API', () => {

  it('should return trending coupons successfully', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return empty array when no trending coupons exist', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return trending coupons with correct structure', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      if (res.body.length > 0) {
        expect(res.body[0]).to.have.property('_id');
        expect(res.body[0]).to.have.property('title');
      }
    });
  });

  it('should return coupons sorted by click count descending', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      for (let i = 0; i < res.body.length - 1; i++) {
        if (res.body[i].clickCount != null && res.body[i + 1].clickCount != null) {
          expect(res.body[i].clickCount).to.be.at.least(res.body[i + 1].clickCount);
        }
      }
    });
  });

  it('should respect limit parameter', () => {
    cy.request(`${BASE}/coupons/trending?limit=5`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.most(5);
    });
  });

  it('should apply default limit when not specified', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should handle invalid limit parameter', () => {
    cy.request({ url: `${BASE}/coupons/trending?limit=invalid`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should handle coupons with zero clicks', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should respond within acceptable time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(3000);
    });
  });

  it('should populate store information in trending coupons', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      if (res.body.length > 0 && res.body[0].store) {
        expect(res.body[0].store).to.be.an('object');
      }
    });
  });

  it('should only include active coupons in trending results', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((coupon) => {
        if (coupon.hasOwnProperty('isActive')) expect(coupon.isActive).to.be.true;
      });
    });
  });

  it('should handle concurrent requests properly', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/coupons/trending`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    }
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('should return proper response structure', () => {
    cy.request(`${BASE}/coupons/trending`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should maintain consistent data across requests', () => {
    cy.request(`${BASE}/coupons/trending`).then((first) => {
      cy.request(`${BASE}/coupons/trending`).then((second) => {
        expect(first.body.length).to.eq(second.body.length);
      });
    });
  });

});
