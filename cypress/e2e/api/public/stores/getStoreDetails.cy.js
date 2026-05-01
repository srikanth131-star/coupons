const BASE = 'http://localhost:5000/api/public';

const getSlug = () =>
  cy.request(`${BASE}/stores/list`).then((res) => {
    expect(res.body.length).to.be.greaterThan(0, 'No stores in DB — seed stores first');
    return res.body[0].slug;
  });

describe('Public API - Get Store Details', () => {

  beforeEach(() => { cy.task('seedStores'); });

  it('should get store details by slug successfully', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('slug', slug);
        expect(res.body).to.have.property('storeName');
      });
    });
  });

  it('should return 404 for non-existent store slug', () => {
    cy.request({ url: `${BASE}/stores/details/non-existent-store-xyz`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

  it('should include all public store information', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('slug');
        expect(res.body).to.have.property('storeName');
      });
    });
  });

  it('should not expose sensitive information', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.not.have.property('adminNotes');
        expect(res.body).to.not.have.property('internalId');
      });
    });
  });

  it('should return store details dynamically from list', () => {
    cy.request(`${BASE}/stores/list`).then((res) => {
      const slug = res.body[0]?.slug;
      if (!slug) return;
      cy.request(`${BASE}/stores/details/${slug}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(r.body.slug).to.eq(slug);
      });
    });
  });

  it('should respond within acceptable time', () => {
    getSlug().then((slug) => {
      const start = Date.now();
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(Date.now() - start).to.be.lessThan(2000);
      });
    });
  });

  it('should handle concurrent requests', () => {
    getSlug().then((slug) => {
      for (let i = 0; i < 5; i++) {
        cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property('slug', slug);
        });
      }
    });
  });

  it('should return proper response structure', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
      });
    });
  });

  it('should handle case-sensitive slug matching', () => {
    getSlug().then((slug) => {
      cy.request({ url: `${BASE}/stores/details/${slug.toUpperCase()}`, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  it('should maintain data consistency', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((first) => {
        cy.request(`${BASE}/stores/details/${slug}`).then((second) => {
          expect(first.body.storeName).to.eq(second.body.storeName);
          expect(first.body.slug).to.eq(second.body.slug);
        });
      });
    });
  });

  it('should return JSON content type', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.headers['content-type']).to.include('application/json');
      });
    });
  });

  it('should handle logo field', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('logo');
      });
    });
  });

});
