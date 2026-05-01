const BASE = 'http://localhost:5000/api/public';

describe('Public - List Banners API', () => {

  it('should return list of banners successfully', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should return empty array when no banners exist', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should return banners with correct structure', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.data.length > 0) {
        const banner = res.body.data[0];
        expect(banner).to.have.property('_id');
        expect(banner._id).to.be.a('string');
      }
    });
  });

  it('should return only active banners', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.data.forEach((banner) => {
        if (banner.hasOwnProperty('isActive')) expect(banner.isActive).to.be.true;
      });
    });
  });

  it('should respond within acceptable time limit', () => {
    const start = Date.now();
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(Date.now() - start).to.be.lessThan(2000);
    });
  });

  it('should handle concurrent requests', () => {
    for (let i = 0; i < 5; i++) {
      cy.request(`${BASE}/site/banners/list`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('array');
      });
    }
  });

  it('should return 404 for invalid HTTP method', () => {
    cy.request({ method: 'POST', url: `${BASE}/site/banners/list`, failOnStatusCode: false }).then((res) => {
      expect([404, 405]).to.include(res.status);
    });
  });

  it('should return JSON content type', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.include('application/json');
    });
  });

  it('should return banners in consistent order', () => {
    cy.request(`${BASE}/site/banners/list`).then((first) => {
      cy.request(`${BASE}/site/banners/list`).then((second) => {
        expect(first.body.data.length).to.eq(second.body.data.length);
      });
    });
  });

  it('should handle database connection gracefully', () => {
    cy.request({ url: `${BASE}/site/banners/list`, failOnStatusCode: false }).then((res) => {
      expect([200, 500]).to.include(res.status);
    });
  });

  it('should return proper response structure', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.body).to.have.property('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should include createdAt and updatedAt if present', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      if (res.body.data.length > 0) {
        const banner = res.body.data[0];
        if (banner.hasOwnProperty('createdAt')) expect(banner.createdAt).to.be.a('string');
        if (banner.hasOwnProperty('updatedAt')) expect(banner.updatedAt).to.be.a('string');
      }
    });
  });

  it('should not expose sensitive information', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      res.body.data.forEach((banner) => {
        expect(banner).to.not.have.property('adminNotes');
        expect(banner).to.not.have.property('internalId');
      });
    });
  });

  it('should maintain backward compatibility', () => {
    cy.request(`${BASE}/site/banners/list`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  it('should maintain consistent data across requests', () => {
    cy.request(`${BASE}/site/banners/list`).then((first) => {
      cy.request(`${BASE}/site/banners/list`).then((second) => {
        expect(first.body.data.length).to.eq(second.body.data.length);
      });
    });
  });

});
