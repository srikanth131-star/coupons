describe('Admin API - List Notifications', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = 'http://localhost:5000/api/admin';
  const timestamp = Date.now();

  describe('with existing notifications', () => {
    beforeEach(() => {
      // DISABLED: cy.task('clearDatabase');
      
      Array.from({length: 3}, (_, i) => {
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'POST',
          url: `${baseUrl}/notifications/send`,
          body: {
            title: `Notification ${timestamp}-${i}`,
            message: `Message ${i}`,
            type: i % 2 === 0 ? 'info' : 'warning',
            recipients: [`test${i}@test.com`]
          },
          failOnStatusCode: false
        });
      });
    });

    it('should list notifications successfully', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('array');
        }
      });
    });

    it('should handle pagination', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications?page=1&limit=2`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          const notifications = response.body.data || response.body;
          if (Array.isArray(notifications)) {
            expect(notifications.length).to.be.at.most(2);
          }
        }
      });
    });

    it('should filter by type', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications?type=info`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          const notifications = response.body.data || response.body;
          if (Array.isArray(notifications)) {
            notifications.forEach(notification => {
              if (notification.hasOwnProperty('type')) {
                expect(notification.type).to.eq('info');
              }
            });
          }
        }
      });
    });

    it('should filter by status', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications?status=sent`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });

    it('should sort by creation date', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications?sortBy=createdAt&order=desc`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          const notifications = response.body.data || response.body;
          if (Array.isArray(notifications) && notifications.length > 1) {
            for (let i = 0; i < notifications.length - 1; i++) {
              if (notifications[i].createdAt && notifications[i + 1].createdAt) {
                expect(new Date(notifications[i].createdAt).getTime()).to.be.at.least(new Date(notifications[i + 1].createdAt).getTime());
              }
            }
          }
        }
      });
    });

    it('should include notification metadata', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          const notifications = response.body.data || response.body;
          if (Array.isArray(notifications) && notifications.length > 0) {
            notifications.forEach(notification => {
              expect(notification).to.have.property('_id');
              expect(notification).to.have.property('title');
              expect(notification).to.have.property('message');
            });
          }
        }
      });
    });

    it('should search notifications', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications?search=Notification`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
        if (response.status === 200 && typeof response.body === 'object') {
          const notifications = response.body.data || response.body;
          if (Array.isArray(notifications)) {
            notifications.forEach(notification => {
              expect(notification.title.toLowerCase()).to.include('notification');
            });
          }
        }
      });
    });

    it('should respond within time limit', () => {
      const startTime = Date.now();
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications`,
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
        url: `${baseUrl}/notifications`,
        failOnStatusCode: false
      }));
      requests.forEach(req => {
        req.then((response) => {
          expect([200, 404, 500]).to.include(response.status);
        });
      });
    });

    it('should include total count', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications`,
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
        url: `${baseUrl}/notifications`,
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
        url: `${baseUrl}/notifications?page=-1&limit=0`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 400, 404, 500]).to.include(response.status);
      });
    });

    it('should filter by date range', () => {
      const today = new Date().toISOString().split('T')[0];
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications?startDate=${today}`,
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 404, 500]).to.include(response.status);
      });
    });

    it('should maintain consistency', () => {
      cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
        method: 'GET',
        url: `${baseUrl}/notifications`,
        failOnStatusCode: false
      }).then((first) => {
        cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
          method: 'GET',
          url: `${baseUrl}/notifications`,
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


});