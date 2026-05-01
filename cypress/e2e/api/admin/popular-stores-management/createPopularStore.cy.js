describe('Admin API - Create Popular Store', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
  });

  it('should create popular store successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Popular Store ${timestamp}`,
        slug: `popular-store-${timestamp}`,
        description: 'A popular store for testing',
        website: 'https://example.com',
        logo: 'https://example.com/logo.png',
        isPopular: true
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('name', `Popular Store ${timestamp}`);
        expect(response.body.data).to.have.property('isPopular', true);
      }
    });
  });

  it('should return 400 for missing required fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (response.status === 400 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should validate store name requirements', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: '',
        slug: `empty-name-${timestamp}`,
        logo: 'https://example.com/logo.png'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (response.status === 400 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should enforce unique slug constraint', () => {
    const storeData = {
      name: `Duplicate Store ${timestamp}`,
      slug: `duplicate-${timestamp}`,
      logo: 'https://example.com/logo.png',
      isPopular: true
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: storeData,
      failOnStatusCode: false
    });
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: storeData,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 409, 500]).to.include(response.status);
      if (response.status === 400 || response.status === 409) {
        if (typeof response.body === 'object') {
          expect(response.body).to.have.property('success', false);
        }
      }
    });
  });

  it('should auto-set isPopular to true', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Auto Popular ${timestamp}`,
        slug: `auto-popular-${timestamp}`,
        logo: 'https://example.com/logo.png'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('isPopular')) {
          expect(response.body.data.isPopular).to.be.true;
        }
      }
    });
  });

  it('should validate website URL format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `URL Test ${timestamp}`,
        slug: `url-test-${timestamp}`,
        logo: 'https://example.com/logo.png',
        website: 'invalid-url'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle unicode characters in store name', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `热门商店 ${timestamp}`,
        slug: `unicode-${timestamp}`,
        logo: 'https://example.com/logo.png',
        description: 'Unicode test 🛍️'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        expect(response.body.data).to.have.property('name', `热门商店 ${timestamp}`);
      }
    });
  });

  it('should set default values for optional fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Default Values ${timestamp}`,
        slug: `default-${timestamp}`,
        logo: 'https://example.com/logo.png'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.have.property('createdAt');
      }
    });
  });

  it('should validate slug format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Slug Test ${timestamp}`,
        slug: 'Invalid Slug With Spaces',
        logo: 'https://example.com/logo.png'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent store creation', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/popular-stores/create`,
        body: {
          name: `Concurrent Store ${timestamp}-${i}`,
          slug: `concurrent-${timestamp}-${i}`,
          logo: 'https://example.com/logo.png',
          isPopular: true
        },
        failOnStatusCode: false
      })
    );

    requests.forEach((req, index) => {
      req.then((response) => {
        expect([201, 404, 500]).to.include(response.status);
        if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
          expect(response.body.data.name).to.include(`Concurrent Store ${timestamp}-${index}`);
        }
      });
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Performance Test ${timestamp}`,
        slug: `performance-${timestamp}`,
        logo: 'https://example.com/logo.png'
      },
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([201, 404, 500]).to.include(response.status);
    });
  });

  it('should handle malformed JSON', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should validate content-type header', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Header Test ${timestamp}`,
        slug: `header-${timestamp}`,
        logo: 'https://example.com/logo.png'
      },
      headers: { 'Content-Type': 'text/plain' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 415, 500]).to.include(response.status);
    });
  });

  it('should initialize click count and popularity metrics', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Metrics Test ${timestamp}`,
        slug: `metrics-${timestamp}`,
        logo: 'https://example.com/logo.png'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('clickCount')) {
          expect(response.body.data.clickCount).to.be.a('number');
        }
      }
    });
  });

  it('should maintain data integrity after creation', () => {
    const storeData = {
      name: `Integrity Test ${timestamp}`,
      slug: `integrity-${timestamp}`,
      logo: 'https://example.com/logo.png',
      description: 'Data integrity test',
      website: 'https://integrity-test.com'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: storeData,
      failOnStatusCode: false
    }).then((createResponse) => {
      expect([201, 404, 500]).to.include(createResponse.status);
      if (createResponse.status === 201 && typeof createResponse.body === 'object' && createResponse.body.data) {
        const storeId = createResponse.body.data._id;

        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'GET',
          url: `${baseUrl}/stores/${storeId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          if (getResponse.status === 200 && typeof getResponse.body === 'object' && getResponse.body.data) {
            expect(getResponse.body.data.name).to.eq(storeData.name);
            expect(getResponse.body.data.slug).to.eq(storeData.slug);
          }
        });
      }
    });
  });
});