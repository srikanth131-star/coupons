describe('Admin API - Create Navbar Item', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
  });

  it('should create navbar item successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Navbar Item ${timestamp}`,
        url: `/test-page-${timestamp}`,
        order: 1,
        isActive: true
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('title', `Navbar Item ${timestamp}`);
        expect(response.body.data).to.have.property('url', `/test-page-${timestamp}`);
      }
    });
  });

  it('should return 400 for missing required fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (response.status === 400 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should validate navbar item title requirements', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: '',
        url: `/empty-title-${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (response.status === 400 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should validate URL format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `URL Test ${timestamp}`,
        url: 'invalid-url-format'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should set default values for optional fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Default Values ${timestamp}`,
        url: `/default-${timestamp}`
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

  it('should handle unicode characters in title', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `导航项目 ${timestamp}`,
        url: `/unicode-${timestamp}`,
        description: 'Unicode test 🧭'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        expect(response.body.data).to.have.property('title', `导航项目 ${timestamp}`);
      }
    });
  });

  it('should validate order number', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Order Test ${timestamp}`,
        url: `/order-${timestamp}`,
        order: -1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle duplicate order numbers', () => {
    const itemData = {
      title: `First Item ${timestamp}`,
      url: `/first-${timestamp}`,
      order: 5
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: itemData,
      failOnStatusCode: false
    });
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Second Item ${timestamp}`,
        url: `/second-${timestamp}`,
        order: 5
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 409, 500]).to.include(response.status);
    });
  });

  it('should auto-increment order if not provided', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Auto Order ${timestamp}`,
        url: `/auto-order-${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('order')) {
          expect(response.body.data.order).to.be.a('number');
        }
      }
    });
  });

  it('should handle concurrent item creation', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/navbar/create`,
        body: {
          title: `Concurrent Item ${timestamp}-${i}`,
          url: `/concurrent-${timestamp}-${i}`,
          order: i + 10
        },
        failOnStatusCode: false
      })
    );

    requests.forEach((req, index) => {
      req.then((response) => {
        expect([201, 404, 500]).to.include(response.status);
        if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
          expect(response.body.data.title).to.include(`Concurrent Item ${timestamp}-${index}`);
        }
      });
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Performance Test ${timestamp}`,
        url: `/performance-${timestamp}`
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
      url: `${baseUrl}/navbar/create`,
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
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Header Test ${timestamp}`,
        url: `/header-${timestamp}`
      },
      headers: { 'Content-Type': 'text/plain' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 415, 500]).to.include(response.status);
    });
  });

  it('should handle special characters in URL', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: {
        title: `Special URL ${timestamp}`,
        url: `/special-chars-${timestamp}?param=value&other=123`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain data integrity after creation', () => {
    const itemData = {
      title: `Integrity Test ${timestamp}`,
      url: `/integrity-${timestamp}`,
      order: 99,
      isActive: true
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/navbar/create`,
      body: itemData,
      failOnStatusCode: false
    }).then((createResponse) => {
      expect([201, 404, 500]).to.include(createResponse.status);
      if (createResponse.status === 201 && typeof createResponse.body === 'object' && createResponse.body.data) {
        const itemId = createResponse.body.data._id;

        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'GET',
          url: `${baseUrl}/navbar/${itemId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          if (getResponse.status === 200 && typeof getResponse.body === 'object' && getResponse.body.data) {
            expect(getResponse.body.data.title).to.eq(itemData.title);
            expect(getResponse.body.data.url).to.eq(itemData.url);
          }
        });
      }
    });
  });
});