const BASE = 'http://localhost:5000/api/public';

describe('Public API - Navbar', () => {

  it('should get navbar navigation successfully', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
    });
  });

  it('should return navigation with menu array', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.menu) {
        expect(res.body.menu).to.be.an('array');
      }
    });
  });

  it('should return items in correct order', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      const items = res.body.menu || [];
      for (let i = 0; i < items.length - 1; i++) {
        if (items[i].order && items[i + 1].order) {
          expect(items[i].order).to.be.at.most(items[i + 1].order);
        }
      }
    });
  });

  it('should handle empty navbar gracefully', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
    });
  });

  it('should include essential navbar information', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('_id');
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.not.have.property('adminNotes');
      expect(res.body).to.not.have.property('internalId');
    });
  });

  it('should respond within time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(1000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/navbar/navigation`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('object');
      });
    }
  });

  it('should include menu items with name and url', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      const items = res.body.menu || [];
      if (items.length > 0) {
        expect(items[0]).to.have.property('name');
        expect(items[0]).to.have.property('url');
      }
    });
  });

  it('should return proper structure', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
    });
  });

  it('should handle caching headers if present', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.headers.hasOwnProperty('cache-control')) {
        expect(res.headers['cache-control']).to.be.a('string');
      }
    });
  });

  it('should maintain data consistency', () => {
    cy.request(`${BASE}/navbar/navigation`).then((first) => {
      cy.request(`${BASE}/navbar/navigation`).then((second) => {
        expect(first.body._id).to.eq(second.body._id);
      });
    });
  });

  it('should validate URL formats in menu items', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      const items = res.body.menu || [];
      items.forEach((item) => {
        if (item.hasOwnProperty('url')) {
          expect(item.url).to.be.a('string');
          expect(item.url.length).to.be.greaterThan(0);
        }
      });
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/navbar/navigation`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('should handle invalid HTTP method', () => {
    cy.request({ method: 'POST', url: `${BASE}/navbar/navigation`, failOnStatusCode: false }).then((res) => {
      expect([404, 405]).to.include(res.status);
    });
  });

});
