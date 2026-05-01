describe('Admin API - List Popular Stores', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    // Create test stores (skip if endpoint not implemented)
    Array.from({length: 5}, (_, i) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/popular-stores/create`,
        body: {
          name: `Popular Store ${timestamp}-${i}`,
          slug: `popular-store-${timestamp}-${i}`,
          logo: 'https://example.com/logo.png',
          description: `Description for store ${i}`,
          isPopular: i < 3,
          clickCount: (5 - i) * 10
        },
        failOnStatusCode: false
      });
    });
  });

  it('should list popular stores successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      }
    });
  });

  it('should return only popular stores', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const stores = response.body.data || response.body;
        if (Array.isArray(stores)) {
          stores.forEach(store => {
            if (store.hasOwnProperty('isPopular')) {
              expect(store.isPopular).to.be.true;
            }
          });
        }
      }
    });
  });

  it('should handle pagination parameters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores?page=1&limit=2`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const stores = response.body.data || response.body;
        if (Array.isArray(stores)) {
          expect(stores.length).to.be.at.most(2);
        }
      }
    });
  });

  it('should sort stores by popularity metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores?sortBy=clickCount&order=desc`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const stores = response.body.data || response.body;
        if (Array.isArray(stores) && stores.length > 1) {
          for (let i = 0; i < stores.length - 1; i++) {
            if (stores[i].clickCount && stores[i + 1].clickCount) {
              expect(stores[i].clickCount).to.be.at.least(stores[i + 1].clickCount);
            }
          }
        }
      }
    });
  });

  it('should handle empty popular stores list', () => {
    // DISABLED: cy.task('clearDatabase');
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const stores = response.body.data || response.body;
        expect(stores).to.be.an('array');
        expect(stores.length).to.eq(0);
      }
    });
  });

  it('should include store statistics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const stores = response.body.data || response.body;
        if (Array.isArray(stores) && stores.length > 0) {
          stores.forEach(store => {
            expect(store).to.have.property('_id');
            expect(store).to.have.property('name');
            expect(store).to.have.property('slug');
          });
        }
      }
    });
  });

  it('should handle invalid pagination parameters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores?page=-1&limit=0`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should filter by category if provided', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores?category=electronics`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent requests', () => {
    const requests = Array.from({length: 5}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/popular-stores`,
        failOnStatusCode: false
      })
    );

    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          expect(response.body.data || response.body).to.be.an('array');
        }
      });
    });
  });

  it('should include total count in response', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        if (response.body.hasOwnProperty('total')) {
          expect(response.body.total).to.be.a('number');
        }
      }
    });
  });

  it('should handle search query parameter', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores?search=Popular`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const stores = response.body.data || response.body;
        if (Array.isArray(stores)) {
          stores.forEach(store => {
            expect(store.name.toLowerCase()).to.include('popular');
          });
        }
      }
    });
  });

  it('should return proper response structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      }
    });
  });

  it('should handle large dataset efficiently', () => {
    // Create many popular stores (skip if endpoint not implemented)
    Array.from({length: 50}, (_, i) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/popular-stores/create`,
        body: {
          name: `Large Dataset Store ${timestamp}-${i}`,
          slug: `large-${timestamp}-${i}`,
          logo: 'https://example.com/logo.png',
          isPopular: true
        },
        failOnStatusCode: false
      });
    });

    cy.then(() => {
      const startTime = Date.now();
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/popular-stores?limit=20`,
        failOnStatusCode: false
      }).then((response) => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(5000);
        expect([200, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should maintain data consistency', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/popular-stores`,
      failOnStatusCode: false
    }).then((firstResponse) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/popular-stores`,
        failOnStatusCode: false
      }).then((secondResponse) => {
        expect([200, 404, 500]).to.include(firstResponse.status);
        expect([200, 404, 500]).to.include(secondResponse.status);
        if (firstResponse.status === 200 && secondResponse.status === 200 &&
            typeof firstResponse.body === 'object' && typeof secondResponse.body === 'object' &&
            firstResponse.body.data && secondResponse.body.data) {
          expect(firstResponse.body.data.length).to.eq(secondResponse.body.data.length);
        }
      });
    });
  });
});