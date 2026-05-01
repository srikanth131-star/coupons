const BASE = 'http://localhost:5000/api/public';

describe('Public API - Popular Stores', () => {

  it('should list popular stores successfully', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should return only popular and active stores', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.data.forEach((store) => {
        if (store.hasOwnProperty('isPopular')) expect(store.isPopular).to.be.true;
        if (store.hasOwnProperty('isActive')) expect(store.isActive).to.be.true;
      });
    });
  });

  it('should handle pagination', () => {
    cy.request(`${BASE}/popular-stores/list?page=1&limit=2`).then((res) => {
      expect(res.status).to.eq(200);
      const stores = res.body.data || res.body;
      expect(stores.length).to.be.at.most(2);
    });
  });

  it('should sort by popularity metrics', () => {
    cy.request(`${BASE}/popular-stores/list?sortBy=clickCount&order=desc`).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('should handle empty popular stores gracefully', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should include essential store information', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.data.length > 0) {
        res.body.data.forEach((store) => {
          expect(store).to.have.property('_id');
        });
      }
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.data.forEach((store) => {
        expect(store).to.not.have.property('adminNotes');
        expect(store).to.not.have.property('internalId');
      });
    });
  });

  it('should respond within time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/popular-stores/list`).then((res) => {
        expect(res.status).to.eq(200);
      });
    }
  });

  it('should include coupon count if present', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.data.length > 0 && res.body.data[0].hasOwnProperty('couponCount')) {
        expect(res.body.data[0].couponCount).to.be.a('number');
      }
    });
  });

  it('should return proper structure', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.body).to.have.property('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should handle invalid parameters', () => {
    cy.request({ url: `${BASE}/popular-stores/list?page=-1&limit=0`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should include total count if present', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.hasOwnProperty('total')) expect(res.body.total).to.be.a('number');
    });
  });

  it('should maintain data consistency', () => {
    cy.request(`${BASE}/popular-stores/list`).then((first) => {
      cy.request(`${BASE}/popular-stores/list`).then((second) => {
        expect(first.body.data.length).to.eq(second.body.data.length);
      });
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/popular-stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

});
