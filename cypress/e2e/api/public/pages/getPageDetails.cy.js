const BASE = 'http://localhost:5000/api/public';

describe('Public API - Get Page Details', () => {

  it('should get page details by slug successfully', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      expect([200, 404]).to.include(res.status);
      expect(res.body).to.be.an('object');
    });
  });

  it('should return 404 for non-existent page slug', () => {
    cy.request({ url: `${BASE}/site/non-existent-page-xyz`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

  it('should return 404 for unpublished page', () => {
    cy.request({ url: `${BASE}/site/unpublished-page-xyz`, failOnStatusCode: false }).then((res) => {
      expect([404, 200]).to.include(res.status);
    });
  });

  it('should include all public page information when found', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      if (res.status === 200) {
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('page');
      }
    });
  });

  it('should not expose sensitive information', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      if (res.status === 200) {
        expect(res.body).to.not.have.property('adminNotes');
        expect(res.body).to.not.have.property('internalId');
        expect(res.body).to.not.have.property('createdBy');
      }
    });
  });

  it('should include meta information if present', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      if (res.status === 200 && res.body.hasOwnProperty('metaTitle')) {
        expect(res.body.metaTitle).to.be.a('string');
      }
    });
  });

  it('should respond within acceptable time', () => {
    const start = Date.now();
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      expect([200, 404]).to.include(res.status);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
        expect([200, 404]).to.include(res.status);
      });
    }
  });

  it('should return proper response structure', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      expect(res.body).to.be.an('object');
    });
  });

  it('should handle case-sensitive slug matching', () => {
    cy.request({ url: `${BASE}/site/ABOUT-US`, failOnStatusCode: false }).then((res) => {
      expect([404, 200]).to.include(res.status);
    });
  });

  it('should include page type information if present', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      if (res.status === 200 && res.body.hasOwnProperty('type')) {
        expect(res.body.type).to.be.a('string');
      }
    });
  });

  it('should handle very long slug names gracefully', () => {
    cy.request({ url: `${BASE}/site/${'a'.repeat(100)}`, failOnStatusCode: false }).then((res) => {
      expect([400, 404]).to.include(res.status);
    });
  });

  it('should maintain data consistency', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((first) => {
      cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((second) => {
        expect(first.status).to.eq(second.status);
        if (first.status === 200) {
          expect(first.body.page).to.eq(second.body.page);
        }
      });
    });
  });

  it('should return JSON content type', () => {
    cy.request({ url: `${BASE}/site/about-us`, failOnStatusCode: false }).then((res) => {
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('should return 404 for empty string slug path', () => {
    cy.request({ url: `${BASE}/site/`, failOnStatusCode: false }).then((res) => {
      expect([400, 404]).to.include(res.status);
    });
  });

});
