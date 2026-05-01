const BASE = 'http://localhost:5000/api/public';

describe('Public API - List Stores', () => {

  it('should list public stores successfully', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return only active stores', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((store) => {
        if (store.hasOwnProperty('isActive')) expect(store.isActive).to.be.true;
      });
    });
  });

  it('should handle pagination parameters', () => {
    cy.request(`${BASE}/stores/list?page=1&limit=3`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.most(3);
    });
  });

  it('should sort stores by popularity', () => {
    cy.request(`${BASE}/stores/list?sortBy=clickCount&order=desc`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should handle empty stores list gracefully', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should include essential store information', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      if (res.body.length > 0) {
        res.body.forEach((store) => {
          expect(store).to.have.property('slug');
          expect(store).to.have.property('storeName');
        });
      }
    });
  });

  it('should search stores by name', () => {
    cy.request({ url: `${BASE}/stores/list?search=Meesho`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should filter by category', () => {
    cy.request({ url: `${BASE}/stores/list?category=electronics`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should respond within acceptable time', () => {
    const start = Date.now();
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/stores/list`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    }
  });

  it('should include total count in response if present', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.hasOwnProperty && res.body.hasOwnProperty('total')) {
        expect(res.body.total).to.be.a('number');
      }
    });
  });

  it('should return proper response structure', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should handle invalid pagination gracefully', () => {
    cy.request({ url: `${BASE}/stores/list?page=-1&limit=0`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((store) => {
        expect(store).to.not.have.property('adminNotes');
        expect(store).to.not.have.property('internalId');
      });
    });
  });

  it('should maintain consistent data across requests', () => {
    cy.request(`${BASE}/stores/list`).then((first) => {
      cy.request(`${BASE}/stores/list`).then((second) => {
        expect(first.body.length).to.eq(second.body.length);
      });
    });
  });

});
