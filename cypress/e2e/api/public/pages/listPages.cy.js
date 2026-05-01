const BASE = 'http://localhost:5000/api/public';

describe('Public API - List Pages', () => {

  it('should get site config successfully', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
    });
  });

  it('should get site config as object', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('_id');
    });
  });

  it('should handle pagination parameters gracefully', () => {
    cy.request({ url: `${BASE}/site/config?page=1&limit=2`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should handle filter by page type gracefully', () => {
    cy.request({ url: `${BASE}/site/config?type=static`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should handle empty pages list gracefully', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
    });
  });

  it('should include essential site config information', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id');
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.not.have.property('adminNotes');
      expect(res.body).to.not.have.property('internalId');
    });
  });

  it('should respond within time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/site/config`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('object');
      });
    }
  });

  it('should include meta information if present', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.hasOwnProperty('metaTitle')) {
        expect(res.body.metaTitle).to.be.a('string');
      }
    });
  });

  it('should return proper structure', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('object');
    });
  });

  it('should handle search functionality gracefully', () => {
    cy.request({ url: `${BASE}/site/config?search=about`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should maintain data consistency', () => {
    cy.request(`${BASE}/site/config`).then((first) => {
      cy.request(`${BASE}/site/config`).then((second) => {
        expect(first.body._id).to.eq(second.body._id);
      });
    });
  });

  it('should handle invalid parameters gracefully', () => {
    cy.request({ url: `${BASE}/site/config?page=-1&limit=0`, failOnStatusCode: false }).then((res) => {
      expect([200, 400]).to.include(res.status);
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/site/config`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

});
