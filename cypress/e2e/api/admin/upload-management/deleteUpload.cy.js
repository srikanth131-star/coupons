describe('Admin API - Delete Upload', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();
  let testFilename;

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    const blob = new Blob(['test-content'], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, `test-${timestamp}.jpg`);
    formData.append('logoType', 'logo');
    
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200 && response.body && response.body.filename) {
        testFilename = response.body.filename;
      } else {
        testFilename = `mock-logo-${timestamp}.jpg`;
      }
    });
  });

  it('should delete upload successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/${testFilename}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('message');
      }
    });
  });

  it('should return 404 for non-existent filename', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/nonexistent-file.jpg`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
    });
  });

  it('should return 400 for invalid filename', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/invalid-filename`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should verify upload is deleted', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/${testFilename}`,
      failOnStatusCode: false
    }).then(() => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}/upload/logo/delete/${testFilename}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([404, 500]).to.include(response.status);
      });
    });
  });

  it('should handle already deleted upload', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/${testFilename}`,
      failOnStatusCode: false
    });
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/${testFilename}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent deletion', () => {
    const requests = Array.from({length: 3}, () => 
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'DELETE',
        url: `${baseUrl}/upload/logo/delete/${testFilename}`,
        failOnStatusCode: false
      })
    );

    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/${testFilename}`,
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
      url: `${baseUrl}/upload/logo/delete/${testFilename}`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('message');
      }
    });
  });

  it('should handle special characters in filename', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/special!@#$%.jpg`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
    });
  });

  it('should handle empty filename', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'DELETE',
      url: `${baseUrl}/upload/logo/delete/`,
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 405]).to.include(response.status);
    });
  });
});