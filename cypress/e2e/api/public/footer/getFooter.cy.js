const BASE = 'http://localhost:5000/api/public';

describe('Public API - Footer', () => {

  it('should get footer links successfully', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body).to.have.property('data');
      expect(res.body).to.have.property('allLinks');
    });
  });

  it('should return only active footer items', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.allLinks.forEach((item) => {
        if (item.hasOwnProperty('isActive')) expect(item.isActive).to.be.true;
      });
    });
  });

  it('should group items by section', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data).to.have.property('main');
      expect(res.body.data).to.have.property('myRmn');
      expect(res.body.data).to.have.property('bottom');
    });
  });

  it('should return items in correct order within sections', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      const mainItems = res.body.data.main || [];
      for (let i = 0; i < mainItems.length - 1; i++) {
        if (mainItems[i].order && mainItems[i + 1].order) {
          expect(mainItems[i].order).to.be.at.most(mainItems[i + 1].order);
        }
      }
    });
  });

  it('should handle empty footer gracefully', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.allLinks).to.be.an('array');
    });
  });

  it('should include essential footer information', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.allLinks.length > 0) {
        res.body.allLinks.forEach((item) => {
          expect(item).to.have.property('_id');
        });
      }
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.allLinks.forEach((item) => {
        expect(item).to.not.have.property('adminNotes');
        expect(item).to.not.have.property('internalId');
      });
    });
  });

  it('should respond within time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(1000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/footer/links`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
      });
    }
  });

  it('should return proper structure', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('data');
      expect(res.body).to.have.property('allLinks');
      expect(res.body.allLinks).to.be.an('array');
    });
  });

  it('should handle caching headers if present', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.headers.hasOwnProperty('cache-control')) {
        expect(res.headers['cache-control']).to.be.a('string');
      }
    });
  });

  it('should maintain data consistency', () => {
    cy.request(`${BASE}/footer/links`).then((first) => {
      cy.request(`${BASE}/footer/links`).then((second) => {
        expect(first.body.allLinks.length).to.eq(second.body.allLinks.length);
      });
    });
  });

  it('should validate href formats if href field exists', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.allLinks.forEach((item) => {
        if (item.hasOwnProperty('href')) {
          expect(item.href).to.be.a('string');
          expect(item.href.length).to.be.greaterThan(0);
        }
      });
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/footer/links`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('should handle invalid HTTP method', () => {
    cy.request({ method: 'POST', url: `${BASE}/footer/links`, failOnStatusCode: false }).then((res) => {
      expect([404, 405]).to.include(res.status);
    });
  });

});
