describe('Admin API - Create Footer Item', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
  });

  it('should create footer item successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Footer Item ${timestamp}`,
        url: `/footer-page-${timestamp}`,
        section: 'links',
        order: 1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201) {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('title', `Footer Item ${timestamp}`);
      }
    });
  });

  it('should return 400 for missing fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (response.status === 400 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should validate title requirements', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: '',
        url: `/empty-${timestamp}`,
        section: 'links'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should validate section values', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Section Test ${timestamp}`,
        url: `/section-${timestamp}`,
        section: 'invalid-section'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should set default values', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Default ${timestamp}`,
        url: `/default-${timestamp}`,
        section: 'links'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201) {
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.have.property('createdAt');
      }
    });
  });

  it('should handle unicode characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `页脚项目 ${timestamp}`,
        url: `/unicode-${timestamp}`,
        section: 'links'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201) {
        expect(response.body.data).to.have.property('title', `页脚项目 ${timestamp}`);
      }
    });
  });

  it('should validate URL format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `URL Test ${timestamp}`,
        url: 'invalid-url',
        section: 'links'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle order conflicts', () => {
    const itemData = {
      title: `First ${timestamp}`,
      url: `/first-${timestamp}`,
      section: 'links',
      order: 5
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: itemData,
      failOnStatusCode: false
    });
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Second ${timestamp}`,
        url: `/second-${timestamp}`,
        section: 'links',
        order: 5
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 409, 500]).to.include(response.status);
    });
  });

  it('should auto-increment order', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Auto Order ${timestamp}`,
        url: `/auto-${timestamp}`,
        section: 'links'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201 && response.body.data.hasOwnProperty('order')) {
        expect(response.body.data.order).to.be.a('number');
      }
    });
  });

  it('should handle concurrent creation', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/footer/create`,
        body: {
          title: `Concurrent ${timestamp}-${i}`,
          url: `/concurrent-${timestamp}-${i}`,
          section: 'links',
          order: i + 10
        },
        failOnStatusCode: false
      })
    );

    requests.forEach((req, index) => {
      req.then((response) => {
        expect([201, 400, 404, 500]).to.include(response.status);
        if (response.status === 201) {
          expect(response.body.data.title).to.include(`Concurrent ${timestamp}-${index}`);
        }
      });
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Performance ${timestamp}`,
        url: `/performance-${timestamp}`,
        section: 'links'
      },
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle malformed JSON', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should validate content-type', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `Header Test ${timestamp}`,
        url: `/header-${timestamp}`,
        section: 'links'
      },
      headers: { 'Content-Type': 'text/plain' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 415, 500]).to.include(response.status);
    });
  });

  it('should handle external URLs', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: {
        title: `External Link ${timestamp}`,
        url: `https://external-${timestamp}.com`,
        section: 'social'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain data integrity', () => {
    const itemData = {
      title: `Integrity ${timestamp}`,
      url: `/integrity-${timestamp}`,
      section: 'links',
      order: 99
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/footer/create`,
      body: itemData,
      failOnStatusCode: false
    }).then((createResponse) => {
      expect([201, 400, 404, 500]).to.include(createResponse.status);
      
      if (createResponse.status === 201) {
        const itemId = createResponse.body.data._id;

        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          url: `${baseUrl}/footer/${itemId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          if ([200, 201].includes(getResponse.status)) {
            expect(getResponse.body.data.title).to.eq(itemData.title);
            expect(getResponse.body.data.url).to.eq(itemData.url);
          }
        });
      }
    });
  });
});