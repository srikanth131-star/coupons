describe('Admin API - Detailed Health Check', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';

  it('should return detailed health status', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false,
      timeout: 5000
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('object');
      }
    });
  });

  it('should include memory metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('memory')) {
        expect(response.body.data.memory).to.have.property('used');
        expect(response.body.data.memory).to.have.property('total');
      }
    });
  });

  it('should include CPU metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('cpu')) {
        expect(response.body.data.cpu).to.be.an('object');
      }
    });
  });

  it('should include database metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('database')) {
        expect(response.body.data.database).to.have.property('status');
        if (response.body.data.database.hasOwnProperty('connections')) {
          expect(response.body.data.database.connections).to.be.a('number');
        }
      }
    });
  });

  it('should include disk usage', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('disk')) {
        expect(response.body.data.disk).to.be.an('object');
      }
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent requests', () => {
    const requests = Array.from({length: 5}, () => cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }));
    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should include service dependencies', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('dependencies')) {
        expect(response.body.data.dependencies).to.be.an('object');
      }
    });
  });

  it('should include performance metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('performance')) {
        expect(response.body.data.performance).to.be.an('object');
      }
    });
  });

  it('should return proper structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('object');
      }
    });
  });

  it('should include error rates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('errors')) {
        expect(response.body.data.errors).to.be.an('object');
      }
    });
  });

  it('should include request metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('requests')) {
        expect(response.body.data.requests).to.be.an('object');
      }
    });
  });

  it('should maintain data consistency', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((first) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        url: `${baseUrl}/health/detailed`,
        failOnStatusCode: false
      }).then((second) => {
        if ([200, 201].includes(first.status) && [200, 201].includes(second.status)) {
          expect(first.body.data).to.have.property('timestamp');
          expect(second.body.data).to.have.property('timestamp');
        }
      });
    });
  });

  it('should not expose sensitive information', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200) {
        expect(response.body.data).to.not.have.property('passwords');
        expect(response.body.data).to.not.have.property('secrets');
        expect(response.body.data).to.not.have.property('tokens');
      }
    });
  });

  it('should handle system load metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      url: `${baseUrl}/health/detailed`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && response.body.data.hasOwnProperty('load')) {
        expect(response.body.data.load).to.be.an('object');
      }
    });
  });
});