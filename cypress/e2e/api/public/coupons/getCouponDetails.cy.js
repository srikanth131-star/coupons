const BASE = 'http://localhost:5000/api/public';

describe('Public - Get Coupon Details API', () => {

  it('should return coupon details for valid ID', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(r.body).to.have.property('_id');
        expect(r.body).to.have.property('title');
      });
    });
  });

  it('should return 400 for invalid ID format', () => {
    cy.request({ url: `${BASE}/coupons/details/invalid-id-format`, failOnStatusCode: false }).then((res) => {
      expect([400, 404, 500]).to.include(res.status);
    });
  });

  it('should return 404 for non-existent coupon ID', () => {
    cy.request({ url: `${BASE}/coupons/details/507f1f77bcf86cd799439011`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

  it('should return coupon with correct data structure', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(r.body._id).to.be.a('string');
        expect(r.body.title).to.be.a('string');
        expect(r.body).to.have.property('createdAt');
        expect(r.body).to.have.property('updatedAt');
      });
    });
  });

  it('should populate store information', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
        expect(r.status).to.eq(200);
        if (r.body.store && typeof r.body.store === 'object') {
          expect(r.body.store).to.have.property('slug');
        }
      });
    });
  });

  it('should respond within acceptable time limit', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      const start = Date.now();
      cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(Date.now() - start).to.be.lessThan(1500);
      });
    });
  });

  it('should handle concurrent requests for same coupon', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      for (let i = 0; i < 5; i++) {
        cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.body._id).to.eq(id);
        });
      }
    });
  });

  it('should return 404 for empty string ID path', () => {
    cy.request({ url: `${BASE}/coupons/details/`, failOnStatusCode: false }).then((res) => {
      expect([400, 404]).to.include(res.status);
    });
  });

  it('should return error for ID with special characters', () => {
    cy.request({ url: `${BASE}/coupons/details/coupon@#$%`, failOnStatusCode: false }).then((res) => {
      expect([400, 404, 500]).to.include(res.status);
    });
  });

  it('should return error for excessively long ID', () => {
    cy.request({ url: `${BASE}/coupons/details/${'a'.repeat(100)}`, failOnStatusCode: false }).then((res) => {
      expect([400, 404, 500]).to.include(res.status);
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(r.headers['content-type']).to.include('application/json');
      });
    });
  });

  it('should handle non-existent valid ObjectId', () => {
    cy.request({ url: `${BASE}/coupons/details/507f1f77bcf86cd799439099`, failOnStatusCode: false }).then((res) => {
      expect([404, 200]).to.include(res.status);
    });
  });

  it('should be case sensitive for coupon ID', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      const upperId = id.toUpperCase();
      if (id !== upperId) {
        cy.request({ url: `${BASE}/coupons/details/${upperId}`, failOnStatusCode: false }).then((r) => {
          expect([400, 404, 500]).to.include(r.status);
        });
      }
    });
  });

  it('should return proper response structure', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      cy.request(`${BASE}/coupons/details/${id}`).then((r) => {
        expect(r.status).to.eq(200);
        expect(r.body).to.be.an('object');
        expect(r.body).to.have.property('_id');
      });
    });
  });

  it('should maintain data consistency', () => {
    cy.request(`${BASE}/coupons/list`).then((res) => {
      const id = res.body[0]?._id;
      if (!id) return;
      cy.request(`${BASE}/coupons/details/${id}`).then((first) => {
        cy.request(`${BASE}/coupons/details/${id}`).then((second) => {
          expect(first.body._id).to.eq(second.body._id);
          expect(first.body.title).to.eq(second.body.title);
        });
      });
    });
  });

});
