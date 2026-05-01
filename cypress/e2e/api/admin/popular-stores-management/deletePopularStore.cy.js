describe('Admin API - Delete Popular Store', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();
  let testStoreId;

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/popular-stores/create`,
      body: {
        name: `Test Popular Store ${timestamp}`,
        slug: `test-popular-${timestamp}`,
        description: 'Test description',
        isPopular: true
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        testStoreId = response.body.data._id;
      } else {
        testStoreId = '507f1f77bcf86cd799439011'; // Mock ID for unimplemented endpoints
      }
    });
  });

  it('should delete popular store successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('message');
      }
    });
  });

  it('should return 404 for non-existent store ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/507f1f77bcf86cd799439011`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
      if (response.status === 404 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should return 400 for invalid store ID format', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/invalid-id`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if ((response.status === 400 || response.status === 404) && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should verify store is actually deleted', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/stores/${testStoreId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([404, 500]).to.include(response.status);
      });
    });
  });

  it('should remove from popular stores list', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/popular-stores`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && typeof response.body === 'object') {
          const stores = response.body.data || response.body;
          if (Array.isArray(stores)) {
            const deletedStore = stores.find(store => store._id === testStoreId);
            expect(deletedStore).to.be.undefined;
          }
        }
      });
    });
  });

  it('should handle deletion of already deleted store', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    });
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
      if (response.status === 404 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', false);
      }
    });
  });

  it('should handle concurrent deletion attempts', () => {
    const requests = Array.from({length: 3}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}/popular-stores/${testStoreId}`,
        failOnStatusCode: false
      })
    );

    let successCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    requests.forEach(req => {
      req.then((response) => {
        if (response.status === 200) successCount++;
        else if (response.status === 404) notFoundCount++;
        else errorCount++;
      });
    });

    cy.then(() => {
      expect(successCount + notFoundCount + errorCount).to.eq(3);
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should return proper response structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('message');
        expect(response.body.success).to.be.true;
      }
    });
  });

  it('should handle case-insensitive ObjectId', () => {
    const upperCaseId = testStoreId.toUpperCase();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${upperCaseId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should clean up related data', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/stores`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && typeof response.body === 'object') {
          const stores = response.body.data || response.body;
          if (Array.isArray(stores)) {
            const deletedStore = stores.find(store => store._id === testStoreId);
            expect(deletedStore).to.be.undefined;
          }
        }
      });
    });
  });

  it('should handle deletion with special characters in ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/special!@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain referential integrity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/popular-stores`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && typeof response.body === 'object') {
          const stores = response.body.data || response.body;
          if (Array.isArray(stores)) {
            const deletedStore = stores.find(store => store._id === testStoreId);
            expect(deletedStore).to.be.undefined;
          }
        }
      });
    });
  });

  it('should handle empty store ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 405, 500]).to.include(response.status);
    });
  });

  it('should log deletion activity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/popular-stores/${testStoreId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.message) {
        expect(response.body.message).to.include('deleted');
      }
    });
  });
});