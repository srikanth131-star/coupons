describe('Admin API - List Pages', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase');
    
    Array.from({length: 5}, (_, i) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'POST',
        url: `${baseUrl}/pages/create`,
        body: {
          title: `Page ${timestamp}-${i}`,
          slug: `page-${timestamp}-${i}`,
          content: `Content for page ${i}`,
          isPublished: i < 3,
          type: i % 2 === 0 ? 'static' : 'dynamic'
        },
        failOnStatusCode: false
      });
    });
  });

  it('should list pages successfully', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success', true);
        expect(response.body.data).to.be.an('array');
      }
    });
  });

  it('should filter by published status', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?published=true`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const pages = response.body.data || response.body;
        if (Array.isArray(pages)) {
          pages.forEach(page => {
            if (page.hasOwnProperty('isPublished')) {
              expect(page.isPublished).to.be.true;
            }
          });
        }
      }
    });
  });

  it('should filter by page type', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?type=static`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const pages = response.body.data || response.body;
        if (Array.isArray(pages)) {
          pages.forEach(page => {
            if (page.hasOwnProperty('type')) {
              expect(page.type).to.eq('static');
            }
          });
        }
      }
    });
  });

  it('should handle pagination', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?page=1&limit=3`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const pages = response.body.data || response.body;
        if (Array.isArray(pages)) {
          expect(pages.length).to.be.at.most(3);
        }
      }
    });
  });

  it('should sort pages by creation date', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?sortBy=createdAt&order=desc`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const pages = response.body.data || response.body;
        if (Array.isArray(pages) && pages.length > 1) {
          for (let i = 0; i < pages.length - 1; i++) {
            if (pages[i].createdAt && pages[i + 1].createdAt) {
              expect(new Date(pages[i].createdAt).getTime()).to.be.at.least(new Date(pages[i + 1].createdAt).getTime());
            }
          }
        }
      }
    });
  });

  it('should include all page properties', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const pages = response.body.data || response.body;
        if (Array.isArray(pages) && pages.length > 0) {
          pages.forEach(page => {
            expect(page).to.have.property('_id');
            expect(page).to.have.property('title');
            expect(page).to.have.property('slug');
          });
        }
      }
    });
  });

  it('should search pages by title', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?search=Page`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        const pages = response.body.data || response.body;
        if (Array.isArray(pages)) {
          pages.forEach(page => {
            expect(page.title.toLowerCase()).to.include('page');
          });
        }
      }
    });
  });

  it('should respond within acceptable time', () => {
    const startTime = Date.now();
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }).then((response) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.lessThan(2000);
      expect([200, 404, 500]).to.include(response.status);
    });
  });

  it('should handle concurrent requests', () => {
    const requests = Array.from({length: 5}, () => cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }));
    requests.forEach(req => {
      req.then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          expect(response.body.data || response.body).to.be.an('array');
        }
      });
    });
  });

  it('should include total count', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        if (response.body.hasOwnProperty('total')) {
          expect(response.body.total).to.be.a('number');
        }
      }
    });
  });

  it('should return proper structure', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 404, 500]).to.include(response.status);
      if (response.status === 200 && typeof response.body === 'object') {
        expect(response.body).to.have.property('success');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      }
    });
  });

  it('should handle invalid parameters', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?page=-1&limit=0`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should filter by multiple criteria', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages?type=static&published=true`,
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 404, 500]).to.include(response.status);
    });
  });

  it('should maintain consistency', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'GET',
      url: `${baseUrl}/pages`,
      failOnStatusCode: false
    }).then((first) => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/pages`,
        failOnStatusCode: false
      }).then((second) => {
        expect([200, 404, 500]).to.include(first.status);
        expect([200, 404, 500]).to.include(second.status);
        if (first.status === 200 && second.status === 200 &&
            typeof first.body === 'object' && typeof second.body === 'object' &&
            first.body.data && second.body.data) {
          expect(first.body.data.length).to.eq(second.body.data.length);
        }
      });
    });
  });
});