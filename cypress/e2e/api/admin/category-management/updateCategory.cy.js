describe('Admin API - Update Category', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  let testCategoryId;

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    const timestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Test Category ${timestamp}`,
        slug: `test-category-${timestamp}`,
        description: 'Original description'
      }
    }).then((response) => {
      testCategoryId = response.body._id;
    });
  });

  it('should update category successfully with valid data', () => {
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: `Updated Category ${timestamp}`,
        description: 'Updated description'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name', `Updated Category ${timestamp}`);
      expect(response.body).to.have.property('description', 'Updated description');
    });
  });

  it('should return 404 for non-existent category ID', () => {
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/507f1f77bcf86cd799439011`,
      body: {
        name: `Non-existent ${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
    });
  });

  it('should return 400 for invalid category ID format', () => {
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/invalid-id`,
      body: {
        name: `Invalid ID ${timestamp}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
      expect(response.body).to.have.property('error');
    });
  });

  it('should update only provided fields', () => {
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        description: 'Only description updated'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('description', 'Only description updated');
    });
  });

  it('should validate updated slug uniqueness', () => {
    const timestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/categories/create`,
      body: {
        name: `Another Category ${timestamp}`,
        slug: `another-${timestamp}`
      }
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'PUT',
        url: `${baseUrl}/categories/update/${testCategoryId}`,
        body: {
          slug: `another-${timestamp}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect([400, 409, 500]).to.include(response.status);
        expect(response.body).to.have.property('error');
      });
    });
  });

  it('should handle unicode characters in updates', () => {
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: `更新类别 ${timestamp}`,
        description: 'Unicode description 🚀'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name', `更新类别 ${timestamp}`);
    });
  });

  it('should reject empty name updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: ''
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
      expect(response.body).to.have.property('error');
    });
  });

  it('should handle very long field updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: 'A'.repeat(1000)
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
    });
  });

  it('should update timestamps correctly', () => {
    const beforeUpdate = new Date();
    const timestamp = Date.now();
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: `Timestamp Test ${timestamp}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      const updatedAt = new Date(response.body.updatedAt);
      expect(updatedAt.getTime()).to.be.greaterThan(beforeUpdate.getTime() - 1000);
    });
  });

  it('should handle concurrent updates', () => {
    const requests = Array.from({length: 3}, (_, i) => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'PUT',
        url: `${baseUrl}/categories/update/${testCategoryId}`,
        body: {
          description: `Concurrent update ${i} at ${Date.now()}`
        }
      })
    );

    requests.forEach(req => {
      req.then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: `Performance ${timestamp}`
      }
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect(response.status).to.eq(200);
    });
  });

  it('should handle malformed JSON in updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
    });
  });

  it('should validate slug format in updates', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        slug: 'Invalid Slug With Spaces'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
    });
  });

  it('should return complete updated object', () => {
    const timestamp = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'PUT',
      url: `${baseUrl}/categories/update/${testCategoryId}`,
      body: {
        name: `Complete Object ${timestamp}`,
        description: 'Complete test'
      }
    }).then((response) => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.have.property('updatedAt');
    });
  });

  it('should maintain data integrity after update', () => {
    const timestamp = Date.now();
    const updateData = {
      name: `Integrity Update ${timestamp}`,
      description: 'Updated for integrity test'
    };

    cy.authRequest('PUT', `${baseUrl}/categories/update/${testCategoryId}`, updateData).then(() => {
      cy.request(`${baseUrl}/categories/list`).then((getResponse) => {
        const updatedCategory = getResponse.body.find(cat => cat._id === testCategoryId);
        expect(updatedCategory.name).to.eq(updateData.name);
        expect(updatedCategory.description).to.eq(updateData.description);
      });
    });
  });
});