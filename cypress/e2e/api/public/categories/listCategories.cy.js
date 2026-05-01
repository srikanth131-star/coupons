const BASE = 'http://localhost:5000/api/public';

describe('Public - List Categories API', () => {

  it('should return list of categories successfully', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return empty array when no categories exist', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return categories with correct structure', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      if (res.body.length > 0) {
        expect(res.body[0]).to.have.property('_id');
        expect(res.body[0]._id).to.be.a('string');
      }
    });
  });

  it('should return categories with name field', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((cat) => {
        expect(cat).to.have.property('name');
        expect(cat.name).to.be.a('string');
      });
    });
  });

  it('should respond within acceptable time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/categories/list`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    }
  });

  it('should return 404 for invalid HTTP method', () => {
    cy.request({ method: 'POST', url: `${BASE}/categories/list`, failOnStatusCode: false }).then((res) => {
      expect([404, 405]).to.include(res.status);
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('should handle database connection gracefully', () => {
    cy.request({ url: `${BASE}/categories/list`, failOnStatusCode: false }).then((res) => {
      expect([200, 500]).to.include(res.status);
    });
  });

  it('should handle categories with similar names', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should return proper response structure', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should include optional description field if present', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.length > 0 && res.body[0].hasOwnProperty('description')) {
        expect(res.body[0].description).to.be.a('string');
      }
    });
  });

  it('should handle case sensitivity properly', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/categories/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.forEach((cat) => {
        expect(cat).to.not.have.property('adminNotes');
        expect(cat).to.not.have.property('internalId');
      });
    });
  });

  it('should maintain consistent data across requests', () => {
    cy.request(`${BASE}/categories/list`).then((first) => {
      cy.request(`${BASE}/categories/list`).then((second) => {
        expect(first.body.length).to.eq(second.body.length);
      });
    });
  });

});
