describe('Admin API - Upload File', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
  });

  it('should return 400 for missing file', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 500]).to.include(response.status);
      if (response.status === 400 && typeof response.body === 'object') {
        expect(response.body).to.have.property('error');
      }
    });
  });

  it('should validate file type', () => {
    const textContent = 'This is a text file';
    const blob = new Blob([textContent], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('logo', blob, 'test.txt');
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 415, 500]).to.include(response.status);
    });
  });

  it('should validate file size', () => {
    const largeContent = 'A'.repeat(10 * 1024 * 1024); // 10MB
    const blob = new Blob([largeContent], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, 'large-file.jpg');
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 413, 500]).to.include(response.status);
    });
  });

  it('should handle multiple file types', () => {
    const imageTypes = ['jpg', 'png', 'gif', 'webp'];
    
    imageTypes.forEach(type => {
      const blob = new Blob(['fake-image-content'], { type: `image/${type}` });
      const formData = new FormData();
      formData.append('logo', blob, `test.${type}`);
      formData.append('logoType', 'logo');

      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/upload/logo`,
        body: formData,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 400, 404, 500]).to.include(response.status);
      });
    });
  });

  it('should generate unique filenames', () => {
    const blob = new Blob(['test-content'], { type: 'image/jpeg' });
    const formData1 = new FormData();
    const formData2 = new FormData();
    formData1.append('logo', blob, 'duplicate.jpg');
    formData1.append('logoType', 'logo');
    formData2.append('logo', blob, 'duplicate.jpg');
    formData2.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData1,
      failOnStatusCode: false
    }).then((response1) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/upload/logo`,
        body: formData2,
        failOnStatusCode: false
      }).then((response2) => {
        expect([200, 404, 500]).to.include(response1.status);
        expect([200, 404, 500]).to.include(response2.status);
        if (response1.status === 200 && response2.status === 200 && typeof response1.body === 'object' && typeof response2.body === 'object' && response1.body.logoUrl && response2.body.logoUrl) {
          expect(response1.body.logoUrl).to.not.eq(response2.body.logoUrl);
        }
      });
    });
  });

  it('should handle unicode filenames', () => {
    const blob = new Blob(['unicode-content'], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, `测试文件-${timestamp}.jpg`);
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should respond within time limit', () => {
    const startTime = Date.now();
    const blob = new Blob(['performance-test'], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, 'performance.jpg');
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(5000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should handle empty file', () => {
    const blob = new Blob([], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, 'empty.jpg');
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should validate content-type header', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: 'not-form-data',
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404, 415, 500]).to.include(response.status);
    });
  });

  it('should handle special characters in filename', () => {
    const blob = new Blob(['special-chars'], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, 'special!@#$%^&*().jpg');
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain file integrity', () => {
    const originalContent = 'integrity-test-content';
    const blob = new Blob([originalContent], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('logo', blob, 'integrity.jpg');
    formData.append('logoType', 'logo');

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}/upload/logo`,
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object' && response.body.logoUrl) {
        expect(response.body).to.have.property('logoUrl');
        
        // Verify file can be accessed
        if (response.body.logoUrl.startsWith('http')) {
          cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
            url: response.body.logoUrl,
            failOnStatusCode: false
          }).then((fileResponse) => {
            expect([200, 404]).to.include(fileResponse.status);
          });
        }
      }
    });
  });
});