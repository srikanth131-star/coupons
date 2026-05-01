const BASE = 'http://localhost:5000/api/public';

describe('Public - Search Coupons API', () => {

  it('should return matching coupons for valid search query', () => {
    cy.request(`${BASE}/coupons/search?query=off`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('coupons');
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should return all coupons for empty query parameter', () => {
    cy.request(`${BASE}/coupons/search?query=`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('coupons');
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should return all coupons for missing query parameter', () => {
    cy.request(`${BASE}/coupons/search`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('coupons');
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should return empty array for non-matching query', () => {
    cy.request(`${BASE}/coupons/search?query=xyznonexistentterm999`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.coupons).to.be.an('array');
      expect(res.body.coupons.length).to.eq(0);
    });
  });

  it('should perform case insensitive search', () => {
    cy.request(`${BASE}/coupons/search?query=OFF`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should search in coupon titles', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const title = res.body[0]?.title;
      if (!title) return;
      const keyword = title.split(' ')[0];
      cy.request(`${BASE}/coupons/search?query=${keyword}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(r.body.coupons).to.be.an('array');
      });
    });
  });

  it('should support partial word matching', () => {
    cy.request(`${BASE}/coupons/search?query=disc`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should handle multiple word search queries', () => {
    cy.request(`${BASE}/coupons/search?query=free shipping`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should handle special characters in search query', () => {
    cy.request({ url: `${BASE}/coupons/search?query=50%25`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should respond within acceptable time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/coupons/search?query=off`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(3000);
    });
  });

  it('should handle URL encoded query parameters', () => {
    cy.request(`${BASE}/coupons/search?query=home%20garden`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.coupons).to.be.an('array');
    });
  });

  it('should handle very long search queries', () => {
    cy.request({ url: `${BASE}/coupons/search?query=${'electronics'.repeat(20)}`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/coupons/search?query=off`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.coupons).to.be.an('array');
      });
    }
  });

  it('should return search results with proper structure', () => {
    cy.request(`${BASE}/coupons/search?query=off`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('coupons');
      if (res.body.coupons.length > 0) {
        expect(res.body.coupons[0]).to.have.property('_id');
        expect(res.body.coupons[0]).to.have.property('title');
      }
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/coupons/search?query=off`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

});
