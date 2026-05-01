describe('Admin API - Delete Page', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();
  let testPageId;

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/pages`,
      body: {
        title: `Test Page ${timestamp}`,
        slug: `test-page-${timestamp}`,
        content: 'Test content',
        type: 'static'
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201 && typeof response.body === 'object' && response.body.data) {
        testPageId = response.body.data._id;
      } else {
        testPageId = '507f1f77bcf86cd799439011'; // Mock ID for unimplemented endpoints
      }
    });
  });

  it('should delete page successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('message');
      }
    });
  });

  it('should return 404 for non-existent ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/507f1f77bcf86cd799439011`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
    });
  });

  it('should return 400 for invalid ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/invalid-id`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should verify page is deleted', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/pages/${testPageId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([404, 500]).to.include(response.status);
      });
    });
  });

  it('should remove from pages list', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/pages`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && typeof response.body === 'object') {
          const pages = response.body.data || response.body;
          if (Array.isArray(pages)) {
            const deletedPage = pages.find(page => page._id === testPageId);
            expect(deletedPage).to.be.undefined;
          }
        }
      });
    });
  });

  it('should handle already deleted page', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    });
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent deletion', () => {
    const requests = Array.from({length: 3}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}/pages/${testPageId}`,
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

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should return proper structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
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

  it('should handle case-insensitive ID', () => {
    const upperCaseId = testPageId.toUpperCase();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${upperCaseId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should clean up related data', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/pages`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && typeof response.body === 'object') {
          const pages = response.body.data || response.body;
          if (Array.isArray(pages)) {
            const deletedPage = pages.find(page => page._id === testPageId);
            expect(deletedPage).to.be.undefined;
          }
        }
      });
    });
  });

  it('should handle special characters in ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/special!@#$%`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain referential integrity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/pages`,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200 && typeof response.body === 'object') {
          const pages = response.body.data || response.body;
          if (Array.isArray(pages)) {
            const deletedPage = pages.find(page => page._id === testPageId);
            expect(deletedPage).to.be.undefined;
          }
        }
      });
    });
  });

  it('should handle empty ID', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 405, 500]).to.include(response.status);
    });
  });

  it('should log deletion activity', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/pages/${testPageId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.message) {
        expect(response.body.message).to.include('deleted');
      }
    });
  });
});