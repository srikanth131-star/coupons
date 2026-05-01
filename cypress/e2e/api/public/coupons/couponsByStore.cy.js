const BASE = 'http://localhost:5000/api/public';

const getSlug = () =>
  cy.request(`${BASE}/stores/list`).then((res) => {
    expect(res.body.length).to.be.greaterThan(0, 'No stores in DB — seed stores first');
    return res.body[0].slug;
  });

describe('Public - Coupons by Store API', () => {

  beforeEach(() => { cy.task('seedStores'); });

  it('should return store details for valid slug', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('slug', slug);
        expect(res.body).to.have.property('storeName');
      });
    });
  });

  it('should return 404 for invalid store slug', () => {
    cy.request({ url: `${BASE}/stores/details/invalid-store-slug-xyz`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

  it('should return 404 for non-existent store slug', () => {
    cy.request({ url: `${BASE}/stores/details/non-existent-store`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

  it('should return store with correct data structure', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('storeName');
        expect(res.body).to.have.property('slug');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('updatedAt');
        expect(res.body._id).to.be.a('string');
        expect(res.body.storeName).to.be.a('string');
        expect(res.body.slug).to.be.a('string');
      });
    });
  });

  it('should include coupons if returned by store details', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        if (res.body.coupons) {
          expect(res.body.coupons).to.be.an('array');
        }
      });
    });
  });

  it('should respond within acceptable time limit', () => {
    getSlug().then((slug) => {
      const start = Date.now();
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(Date.now() - start).to.be.lessThan(2000);
      });
    });
  });

  it('should be case sensitive for store slug', () => {
    getSlug().then((slug) => {
      cy.request({ url: `${BASE}/stores/details/${slug.toUpperCase()}`, failOnStatusCode: false }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  it('should handle concurrent requests for same store', () => {
    getSlug().then((slug) => {
      for (let i = 0; i < 5; i++) {
        cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.slug).to.eq(slug);
        });
      }
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

  it('should return consistent data across requests', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((first) => {
        cy.request(`${BASE}/stores/details/${slug}`).then((second) => {
          expect(first.body.slug).to.eq(second.body.slug);
          expect(first.body.storeName).to.eq(second.body.storeName);
        });
      });
    });
  });

  it('should return 404 for empty string slug', () => {
    cy.request({ url: `${BASE}/stores/details/`, failOnStatusCode: false }).then((res) => {
      expect([400, 404]).to.include(res.status);
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

  it('should not expose sensitive information', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.not.have.property('adminNotes');
        expect(res.body).to.not.have.property('internalId');
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

  it('should handle store with logo field', () => {
    getSlug().then((slug) => {
      cy.request(`${BASE}/stores/details/${slug}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('logo');
      });
    });
  });

});
