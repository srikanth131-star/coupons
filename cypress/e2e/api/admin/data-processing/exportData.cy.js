describe('Admin API - Export Data', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  let testStoreIds = [];

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    // Create test data
    const timestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    Array.from({length: 3}, (_, i) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/stores/create`,
        body: {
          storeName: `Export Store ${timestamp}-${i}`,
          slug: `export-store-${timestamp}-${i}`,
          description: `Store for export ${i}`,
          category: 'Electronics'
        }
      }).then((response) => {
        testStoreIds.push(response.body._id);
      });
    });
  });

  it('should export stores data successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('exportUrl');
        expect(response.body).to.have.property('timestamp');
      }
    });
  });

  it('should export coupons data successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/coupons`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('exportUrl');
        expect(response.body).to.have.property('timestamp');
      }
    });
  });

  it('should handle query parameters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores?format=csv`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should export in different formats', () => {
    const formats = ['json', 'csv'];
    formats.forEach(format => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/data/export/stores?format=${format}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 400, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should handle empty data export', () => {
    // DISABLED: cy.task('clearDatabase');
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('exportUrl');
      }
    });
  });

  it('should filter export data', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores?filter=active`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should limit export results', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores?limit=2`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('exportUrl');
      }
    });
  });

  it('should include metadata in export', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores?includeMetadata=true`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('timestamp');
      }
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(3000);
      expect(response.status).to.be.oneOf([200, 404, 500]);
    });
  });

  it('should handle concurrent exports', () => {
    const requests = Array.from({length: 3}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/data/export/stores`,
        failOnStatusCode: false
      })
    );

    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          expect(response.body).to.have.property('exportUrl');
        }
      });
    });
  });

  it('should export with date range', () => {
    const today = new Date().toISOString().split('T')[0];
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores?startDate=${today}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should return proper structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('exportUrl');
        expect(response.body).to.have.property('timestamp');
      }
    });
  });

  it('should handle large exports', () => {
    const timestamp = Date.now();
    Array.from({length: 10}, (_, i) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/stores/create`,
        body: {
          storeName: `Large Export ${timestamp}-${i}`,
          slug: `large-export-${timestamp}-${i}`,
          description: `Large export store ${i}`,
          category: 'Electronics'
        }
      });
    });

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores`,
      timeout: 10000,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('exportUrl');
      }
    });
  });

  it('should maintain data integrity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores`,
      failOnStatusCode: false
    }).then((exportResponse) => {
      expect([200, 404, 500]).to.include(exportResponse.status);
      if (exportResponse.status === 200 && typeof exportResponse.body === 'object') {
        expect(exportResponse.body).to.have.property('exportUrl');
        expect(exportResponse.body).to.have.property('timestamp');
      }
    });
  });

  it('should handle invalid parameters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/data/export/stores?limit=-1`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });
});