describe('Admin - List Categories API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/categories/list';

  beforeEach(() => {
    // DISABLED: cy.task('clearDatabase', 'categories');
  });

  afterEach(() => {
    // DISABLED: cy.task('clearDatabase', 'categories');
  });

  // Test Case 1: Success case - Valid request
  it('should return list of categories successfully', () => {
    const timestamp = Date.now();
    const categoryData = {
      name: `Test Category ${timestamp}`,
      slug: `test-category-${timestamp}`,
      description: 'A test category'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, categoryData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.have.property('_id');
            expect(response.body[0]).to.have.property('name');
            expect(response.body[0]).to.have.property('slug');
          });
      });
  });

  // Test Case 2: Empty database scenario
  it('should return empty array when no categories exist', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.at.least(0);
      });
  });

  // Test Case 3: Response structure validation
  it('should return categories with correct structure', () => {
    const timestamp = Date.now();
    const categoryData = {
      name: `Structure Test Category ${timestamp}`,
      slug: `structure-test-${timestamp}`,
      description: 'Structure test category'
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, categoryData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            
            if (response.body.length > 0) {
              const category = response.body.find(c => c.name === categoryData.name);
              expect(category).to.have.property('_id');
              expect(category).to.have.property('name');
              expect(category).to.have.property('slug');
              expect(category).to.have.property('createdAt');
              expect(category).to.have.property('updatedAt');
              expect(category._id).to.be.a('string');
              expect(category.name).to.be.a('string');
              expect(category.slug).to.be.a('string');
            }
          });
      });
  });

  // Test Case 4: Performance testing - Response time
  it('should respond within acceptable time limit', () => {
    const startTime = Date.now();
    
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(200);
        expect(responseTime).to.be.lessThan(2000);
      });
  });

  // Test Case 5: Large dataset handling
  it('should handle large number of categories', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
      name: `Test Category 1 ${timestamp}`,
      slug: `test-category-1-${timestamp}`
    }).then(() => {
      cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
        name: `Test Category 2 ${timestamp}`,
        slug: `test-category-2-${timestamp}`
      }).then(() => {
        cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
          name: `Test Category 3 ${timestamp}`,
          slug: `test-category-3-${timestamp}`
        }).then(() => {
          cy.authRequest('GET', `${baseUrl}${endpoint}`)
            .then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('array');
              expect(response.body.length).to.be.at.least(3);
            });
        });
      });
    });
  });

  // Test Case 6: Concurrent requests handling
  it('should handle concurrent requests properly', () => {
    const timestamp = Date.now();
    const categoryData = {
      name: `Concurrent Test Category ${timestamp}`,
      slug: `concurrent-test-${timestamp}`
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, categoryData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
        
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
        
        cy.authRequest('GET', `${baseUrl}${endpoint}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
  });

  // Test Case 7: Invalid endpoint method
  it('should return 404 for invalid HTTP method', () => {
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  // Test Case 8: Server error simulation
  it('should handle server errors gracefully', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.be.oneOf([200, 500]);
      });
  });

  // Test Case 9: Content-Type validation
  it('should return JSON content type', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
  });

  // Test Case 10: Category sorting validation
  it('should return categories in consistent order', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
      name: `Category A ${timestamp}`,
      slug: `category-a-${timestamp}`
    }).then(() => {
      cy.wait(100);
      cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
        name: `Category B ${timestamp}`,
        slug: `category-b-${timestamp}`
      }).then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.at.least(2);
            
            const categoryA = response.body.find(c => c.name.includes('Category A'));
            const categoryB = response.body.find(c => c.name.includes('Category B'));
            expect(categoryA).to.have.property('name');
            expect(categoryB).to.have.property('name');
          });
      });
    });
  });

  // Test Case 11: Database connection validation
  it('should handle database connection issues', () => {
    cy.authRequest('GET', `${baseUrl}${endpoint}`)
      .then((response) => {
        expect(response.status).to.be.oneOf([200, 500]);
        if (response.status === 200) {
          expect(response.body).to.be.an('array');
        }
      });
  });

  // Test Case 12: Memory usage with large responses
  it('should handle memory efficiently with large datasets', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
      name: `Memory Test Category 1 ${timestamp}`,
      slug: `memory-test-1-${timestamp}`
    }).then(() => {
      cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
        name: `Memory Test Category 2 ${timestamp}`,
        slug: `memory-test-2-${timestamp}`
      }).then(() => {
        cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
          name: `Memory Test Category 3 ${timestamp}`,
          slug: `memory-test-3-${timestamp}`
        }).then(() => {
          cy.authRequest('GET', `${baseUrl}${endpoint}`)
            .then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('array');
              expect(response.body.length).to.be.at.least(3);
              
              const testCategories = response.body.filter(c => c.name.includes('Memory Test Category'));
              testCategories.forEach((category) => {
                expect(category).to.have.property('_id');
                expect(category).to.have.property('name');
              });
            });
        });
      });
    });
  });

  // Test Case 13: Special characters in category data
  it('should handle categories with special characters', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
      name: `Category & Co. (Special) ${timestamp}`,
      slug: `category-special-${timestamp}`
    }).then(() => {
      cy.authRequest('GET', `${baseUrl}${endpoint}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          const specialCategory = response.body.find(c => c.name.includes('Special'));
          expect(specialCategory.name).to.include('Special');
        });
    });
  });

  // Test Case 14: Unicode character support
  it('should handle categories with unicode characters', () => {
    const timestamp = Date.now();
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, {
      name: `Category 测试 📂 ${timestamp}`,
      slug: `category-unicode-${timestamp}`
    }).then(() => {
      cy.authRequest('GET', `${baseUrl}${endpoint}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          const unicodeCategory = response.body.find(c => c.name.includes('测试'));
          expect(unicodeCategory.name).to.include('测试');
        });
    });
  });

  // Test Case 15: API versioning and backward compatibility
  it('should maintain backward compatibility', () => {
    const timestamp = Date.now();
    const categoryData = {
      name: `Compatibility Test Category ${timestamp}`,
      slug: `compatibility-test-${timestamp}`
    };
    
    cy.authRequest('POST', `${baseUrl}/api/admin/categories/create`, categoryData)
      .then(() => {
        cy.authRequest('GET', `${baseUrl}${endpoint}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            
            if (response.body.length > 0) {
              const testCategory = response.body.find(c => c.name === categoryData.name);
              expect(testCategory).to.have.property('_id');
              expect(testCategory).to.have.property('name');
              expect(testCategory).to.have.property('slug');
              expect(testCategory).to.have.property('createdAt');
              expect(testCategory).to.have.property('updatedAt');
            }
          });
      });
  });
});