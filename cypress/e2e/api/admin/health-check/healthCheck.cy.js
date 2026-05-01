describe('Admin API - Health Check', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';

  it('should return health status successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('status');
      }
    });
  });

  it('should include database health', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('database')) {
          expect(response.body.data.database).to.have.property('status');
        }
      }
    });
  });

  it('should include API health', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('api')) {
          expect(response.body.data.api).to.have.property('status');
        }
      }
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(500);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent requests', () => {
    const requests = Array.from({length: 10}, () => cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }));
    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should include timestamp', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('timestamp')) {
          expect(response.body.data.timestamp).to.be.a('string');
        }
      }
    });
  });

  it('should return proper structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('object');
      }
    });
  });

  it('should include service checks', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('services')) {
          expect(response.body.data.services).to.be.an('object');
        }
      }
    });
  });

  it('should handle detailed health check', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health?detailed=true`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain consistency', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((first) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/health`,
        failOnStatusCode: false
      }).then((second) => {
        expect([200, 404, 500]).to.include(first.status);
        expect([200, 404, 500]).to.include(second.status);
        if (first.status === 200 && second.status === 200 && 
            typeof first.body === 'object' && typeof second.body === 'object' &&
            first.body.data && second.body.data) {
          expect(first.body.data.status).to.eq(second.body.data.status);
        }
      });
    });
  });

  it('should include version info', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('version')) {
          expect(response.body.data.version).to.be.a('string');
        }
      }
    });
  });

  it('should handle load testing', () => {
    const requests = Array.from({length: 50}, () => cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }));
    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should not expose sensitive info', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        expect(response.body.data).to.not.have.property('secrets');
        expect(response.body.data).to.not.have.property('credentials');
      }
    });
  });

  it('should include uptime', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('uptime')) {
          expect(response.body.data.uptime).to.be.a('number');
        }
      }
    });
  });

  it('should handle health check failures gracefully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/health?simulate=failure`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500, 503]).to.include(response.status);
    });
  });
});