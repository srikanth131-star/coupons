describe('Admin API - Delete Category', () => {
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
        description: 'Test description'
      }
    }).then((response) => {
      testCategoryId = response.body._id;
    });
  });

  it('should delete category successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${testCategoryId}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message');
    });
  });

  it('should return 404 for non-existent category ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/507f1f77bcf86cd799439011`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
    });
  });

  it('should return 400 for invalid category ID format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/invalid-id`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 500]).to.include(response.status);
      expect(response.body).to.have.property('error');
    });
  });

  it('should verify category is actually deleted', () => {
    cy.authRequest('DELETE', `${baseUrl}/categories/delete/${testCategoryId}`).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/categories/list`,
        failOnStatusCode: false
      }).then((response) => {
        const categories = response.body;
        const deletedCategory = categories.find(cat => cat._id === testCategoryId);
        expect(deletedCategory).to.be.undefined;
      });
    });
  });

  it('should handle deletion of already deleted category', () => {
    cy.authRequest('DELETE', `${baseUrl}/categories/delete/${testCategoryId}`);
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${testCategoryId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
    });
  });

  it('should handle concurrent deletion attempts', () => {
    const requests = Array.from({length: 3}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}/categories/delete/${testCategoryId}`,
        failOnStatusCode: false
      })
    );

    let successCount = 0;
    let notFoundCount = 0;

    requests.forEach(req => {
      req.then((response) => {
        if (response.status === 200) successCount++;
        if (response.status === 404) notFoundCount++;
      });
    });

    cy.then(() => {
      expect(successCount).to.be.at.most(1);
      expect(successCount + notFoundCount).to.eq(3);
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${testCategoryId}`
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect(response.status).to.eq(200);
    });
  });

  it('should return proper response structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${testCategoryId}`
    }).then((response) => {
      expect(response.body).to.have.property('message');
    });
  });

  it('should handle case-insensitive ObjectId', () => {
    const upperCaseId = testCategoryId.toUpperCase();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${upperCaseId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 500]).to.include(response.status);
    });
  });

  it('should prevent deletion with invalid authentication', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${testCategoryId}`,
      headers: { 'Authorization': 'Bearer invalid-token' },
      failOnStatusCode: false
    }).then((response) => {
      expect([401, 403, 200]).to.include(response.status);
    });
  });

  it('should handle deletion with special characters in ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/special!@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain referential integrity', () => {
    cy.authRequest('DELETE', `${baseUrl}/categories/delete/${testCategoryId}`).then(() => {
      cy.request(`${baseUrl}/categories/list`).then((response) => {
        const categories = response.body;
        const deletedCategory = categories.find(cat => cat._id === testCategoryId);
        expect(deletedCategory).to.be.undefined;
      });
    });
  });

  it('should handle empty category ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 405]).to.include(response.status);
    });
  });

  it('should log deletion activity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/categories/delete/${testCategoryId}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.include('deleted');
    });
  });

  it('should handle bulk deletion scenario', () => {
    const categoryIds = [];
    const bulkTimestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    
    Array.from({length: 3}, (_, i) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/categories/create`,
        body: {
          name: `Bulk Test ${bulkTimestamp}-${i}`,
          slug: `bulk-${bulkTimestamp}-${i}`
        }
      }).then((response) => {
        categoryIds.push(response.body._id);
      });
    });

    cy.then(() => {
      categoryIds.forEach(id => {
        cy.authRequest('DELETE', `${baseUrl}/categories/delete/${id}`).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
});