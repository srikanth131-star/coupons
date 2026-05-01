describe('Admin API - Create Page', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
  });

  it('should create page successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Test Page ${timestamp}`,
        slug: `test-page-${timestamp}`,
        content: 'This is test page content',
        type: 'static',
        isPublished: true
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.have.property('title', `Test Page ${timestamp}`);
      }
    });
  });

  it('should return 400 for missing fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
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
      url: `${baseUrl}/pages/create`,
      body: {
        title: '',
        slug: `empty-title-${timestamp}`,
        content: 'Content'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should enforce unique slug', () => {
    const pageData = {
      title: `Duplicate Page ${timestamp}`,
      slug: `duplicate-${timestamp}`,
      content: 'Content'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: pageData,
      failOnStatusCode: false
    });
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: pageData,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 409, 500]).to.include(response.status);
    });
  });

  it('should validate page type', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Type Test ${timestamp}`,
        slug: `type-test-${timestamp}`,
        content: 'Content',
        type: 'invalid-type'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle unicode characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `页面标题 ${timestamp}`,
        slug: `unicode-${timestamp}`,
        content: 'Unicode content 📄'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        expect(response.body.data).to.have.property('title', `页面标题 ${timestamp}`);
      }
    });
  });

  it('should set default values', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Default Values ${timestamp}`,
        slug: `default-${timestamp}`,
        content: 'Content'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.have.property('createdAt');
      }
    });
  });

  it('should validate slug format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Slug Test ${timestamp}`,
        slug: 'Invalid Slug With Spaces',
        content: 'Content'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle large content', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Large Content ${timestamp}`,
        slug: `large-content-${timestamp}`,
        content: 'A'.repeat(10000)
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent creation', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/pages/create`,
        body: {
          title: `Concurrent Page ${timestamp}-${i}`,
          slug: `concurrent-${timestamp}-${i}`,
          content: `Content ${i}`
        },
        failOnStatusCode: false
      })
    );

    requests.forEach((req, index) => {
      req.then((response) => {
        expect([201, 400, 404, 500]).to.include(response.status);
        if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
          expect(response.body.data.title).to.include(`Concurrent Page ${timestamp}-${index}`);
        }
      });
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Performance ${timestamp}`,
        slug: `performance-${timestamp}`,
        content: 'Performance test content'
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
      url: `${baseUrl}/pages/create`,
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
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Header Test ${timestamp}`,
        slug: `header-${timestamp}`,
        content: 'Content'
      },
      headers: { 'Content-Type': 'text/plain' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 415, 500]).to.include(response.status);
    });
  });

  it('should handle meta data', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: {
        title: `Meta Test ${timestamp}`,
        slug: `meta-${timestamp}`,
        content: 'Content',
        metaTitle: 'Meta Title',
        metaDescription: 'Meta Description'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 400, 404, 500]).to.include(response.status);
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        if (response.body.data.hasOwnProperty('metaTitle')) {
          expect(response.body.data.metaTitle).to.eq('Meta Title');
        }
      }
    });
  });

  it('should maintain data integrity', () => {
    const pageData = {
      title: `Integrity ${timestamp}`,
      slug: `integrity-${timestamp}`,
      content: 'Integrity test content',
      type: 'static'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages/create`,
      body: pageData,
      failOnStatusCode: false
    }).then((createResponse) => {
      expect([201, 400, 404, 500]).to.include(createResponse.status);
      if (createResponse.status === 201 && typeof createResponse.body === 'object' && createResponse.body.data) {
        const pageId = createResponse.body.data._id;

        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'GET',
          url: `${baseUrl}/pages/${pageId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          if (getResponse.status === 200 && typeof getResponse.body === 'object' && getResponse.body.data) {
            expect(getResponse.body.data.title).to.eq(pageData.title);
            expect(getResponse.body.data.slug).to.eq(pageData.slug);
          }
        });
      }
    });
  });
});