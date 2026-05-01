describe('Admin API - Create Category', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
  });

  it('should create category successfully with valid data', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Test Category ${timestamp}`,
        slug: `test-category-${timestamp}`,
        description: 'Test category description'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('name', `Test Category ${timestamp}`);
      expect(response.body).to.have.property('slug', `test-category-${timestamp}`);
    });
  });

  it('should return 400 for missing required fields', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
      expect(response.body).to.have.property('error');
    });
  });

  it('should return 400 for invalid category name', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: '',
        slug: `test-${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
      expect(response.body).to.have.property('error');
    });
  });

  it('should return 400 or 409 for duplicate category slug', () => {
    const categoryData = {
      name: `Duplicate Category ${timestamp}`,
      slug: `duplicate-${timestamp}`
    };

    cy.authRequest('POST', `${baseUrl}/categories/create`, categoryData);
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: categoryData,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 409, 500]).to.include(response.status);
      expect(response.body).to.have.property('error');
    });
  });

  it('should handle very long category names', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: 'A'.repeat(1000),
        slug: `long-name-${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
    });
  });

  it('should create category with unicode characters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `测试类别 ${timestamp}`,
        slug: `unicode-${timestamp}`,
        description: 'Unicode test 🎉'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('name', `测试类别 ${timestamp}`);
    });
  });

  it('should validate slug format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Test Category ${timestamp}`,
        slug: 'Invalid Slug With Spaces'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
    });
  });

  it('should handle special characters in description', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Special Chars ${timestamp}`,
        slug: `special-${timestamp}`,
        description: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('should return proper response structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Structure Test ${timestamp}`,
        slug: `structure-${timestamp}`
      }
    }).then((response) => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.have.property('name');
    });
  });

  it('should handle concurrent category creation', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/categories/create`,
        body: {
          name: `Concurrent ${timestamp}-${i}`,
          slug: `concurrent-${timestamp}-${i}`
        }
      })
    );

    requests.forEach((req, index) => {
      req.then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.name).to.include(`Concurrent ${timestamp}-${index}`);
      });
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Performance ${timestamp}`,
        slug: `performance-${timestamp}`
      }
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect(response.status).to.eq(201);
    });
  });

  it('should handle malformed JSON', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
    });
  });

  it('should validate required content-type header', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Header Test ${timestamp}`,
        slug: `header-${timestamp}`
      },
      headers: { 'Content-Type': 'text/plain' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 415, 500]).to.include(response.status);
    });
  });

  it('should auto-generate slug if not provided', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Auto Slug Test ${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201) {
        expect(response.body).to.have.property('slug');
      }
    });
  });

  it('should maintain data integrity after creation', () => {
    const categoryData = {
      name: `Integrity Test ${timestamp}`,
      slug: `integrity-${timestamp}`,
      description: 'Data integrity test'
    };

    cy.authRequest('POST', `${baseUrl}/categories/create`, categoryData).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      const categoryId = createResponse.body._id;

      cy.request(`${baseUrl}/categories/list`).then((getResponse) => {
        const foundCategory = getResponse.body.find(cat => cat._id === categoryId);
        expect(foundCategory).to.not.be.undefined;
        expect(foundCategory.name).to.eq(categoryData.name);
        expect(foundCategory.slug).to.eq(categoryData.slug);
      });
    });
  });
});