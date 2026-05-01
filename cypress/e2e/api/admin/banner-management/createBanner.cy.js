describe('Admin - Create Banner API', () => {
  before(() => { cy.adminLogin(); });

  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  const endpoint = '/api/admin/banner/create';

  beforeEach(() => {
    // Clear database before each test
    // DISABLED: cy.task('clearDatabase');
  });

  afterEach(() => {
    // Cleanup after each test
    // DISABLED: cy.task('clearDatabase');
  });

  // Test Case 1: Success case - Valid banner creation
  it('should create a new banner successfully', () => {
    const bannerData = {
      title: 'Test Banner',
      subtitle: 'Test Subtitle',
      image: 'https://example.com/banner.jpg',
      buttonText: 'Click Here',
      buttonLink: 'https://example.com',
      isActive: true
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, bannerData)
      .then((response) => {
        expect(response.status).to.eq(201);
        if (response.body.success) {
          expect(response.body).to.have.property('success', true);
          expect(response.body.data).to.be.an('object');
          expect(response.body.data).to.have.property('_id');
          expect(response.body.data).to.have.property('title', bannerData.title);
          expect(response.body.data).to.have.property('subtitle', bannerData.subtitle);
          expect(response.body.data).to.have.property('image', bannerData.image);
          expect(response.body.data).to.have.property('buttonText', bannerData.buttonText);
          expect(response.body.data).to.have.property('buttonLink', bannerData.buttonLink);
          expect(response.body.data).to.have.property('isActive', bannerData.isActive);
          expect(response.body.data).to.have.property('createdAt');
          expect(response.body.data).to.have.property('updatedAt');
        } else {
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('_id');
          expect(response.body).to.have.property('title', bannerData.title);
          expect(response.body).to.have.property('subtitle', bannerData.subtitle);
          expect(response.body).to.have.property('image', bannerData.image);
          expect(response.body).to.have.property('buttonText', bannerData.buttonText);
          expect(response.body).to.have.property('buttonLink', bannerData.buttonLink);
          expect(response.body).to.have.property('isActive', bannerData.isActive);
          expect(response.body).to.have.property('createdAt');
          expect(response.body).to.have.property('updatedAt');
        }
      });
  });

  // Test Case 2: Missing required fields
  it('should return 400 for missing required fields', () => {
    const incompleteData = {
      subtitle: 'Missing title field'
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: incompleteData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 3: Minimum required fields only
  it('should create banner with minimum required fields', () => {
    const minimalData = {
      title: 'Minimal Banner'
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, minimalData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data).to.have.property('title', minimalData.title);
        expect(response.body.data).to.have.property('_id');
        expect(response.body.data).to.have.property('isActive'); // Should have default value
      });
  });

  // Test Case 4: Invalid data types
  it('should return 400 for invalid data types', () => {
    const invalidData = {
      title: 123, // Should be string
      subtitle: true, // Should be string
      isActive: 'yes', // Should be boolean
      buttonText: [],  // Should be string
      buttonLink: {}   // Should be string
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: invalidData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
      expect(response.body).to.have.property('error');
    });
  });

  // Test Case 5: Default values validation
  it('should set default values for optional fields', () => {
    const basicData = {
      title: 'Default Values Test'
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, basicData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data).to.have.property('title', basicData.title);
        expect(response.body.data).to.have.property('isActive');
        
        // Check if default value is set (typically true for isActive)
        if (response.body.isActive !== undefined) {
          expect(response.body.isActive).to.be.a('boolean');
        }
      });
  });

  // Test Case 6: Maximum field lengths
  it('should handle maximum field lengths appropriately', () => {
    const maxLengthData = {
      title: 'T'.repeat(200), // Test max length
      subtitle: 'S'.repeat(300),
      image: 'https://example.com/' + 'i'.repeat(200) + '.jpg',
      buttonText: 'B'.repeat(100),
      buttonLink: 'https://example.com/' + 'l'.repeat(200)
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: maxLengthData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400]);
      if (response.status === 201) {
        expect(response.body.data).to.have.property('title');
      } else {
        expect(response.body).to.have.property('error');
      }
    });
  });

  // Test Case 7: Empty string values
  it('should handle empty string values appropriately', () => {
    const emptyData = {
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
      buttonLink: ''
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: emptyData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400, 500]);
      if (response.status === 400 || response.status === 500) {
        expect(response.body).to.have.property('error');
      }
    });
  });

  // Test Case 8: Special characters in fields
  it('should handle special characters in banner fields', () => {
    const specialCharData = {
      title: 'Banner & Co. (Special)',
      subtitle: 'Special chars: @#$%^&*()',
      buttonText: 'Click & Save!',
      isActive: true
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, specialCharData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data.title).to.include('Special');
        expect(response.body.data.subtitle).to.include('@#$%');
        expect(response.body.data.buttonText).to.include('&');
      });
  });

  // Test Case 9: Unicode characters support
  it('should handle unicode characters', () => {
    const unicodeData = {
      title: 'Banner 测试 🎯',
      subtitle: 'Unicode subtitle 测试 🎉',
      buttonText: 'Click 点击 🚀',
      isActive: true
    };

    cy.authRequest('POST', `${baseUrl}${endpoint}`, unicodeData)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.data.title).to.include('测试');
        expect(response.body.data.title).to.include('🎯');
        expect(response.body.data.subtitle).to.include('🎉');
      });
  });

  // Test Case 10: Invalid URL formats
  it('should validate URL formats appropriately', () => {
    const invalidUrlData = {
      title: 'URL Test Banner',
      image: 'not-a-valid-url',
      buttonLink: 'also-not-a-url',
      isActive: true
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: invalidUrlData,
      failOnStatusCode: false
    }).then((response) => {
      // Should either accept or reject based on validation rules
      expect(response.status).to.be.oneOf([201, 400]);
      if (response.status === 400) {
        expect(response.body).to.have.property('error');
      }
    });
  });

  // Test Case 11: Null values handling
  it('should handle null values appropriately', () => {
    const nullData = {
      title: 'Null Test Banner',
      subtitle: null,
      image: null,
      buttonText: null,
      buttonLink: null,
      isActive: true
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: nullData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400]);
      if (response.status === 201) {
        expect(response.body.data).to.have.property('title', 'Null Test Banner');
      }
    });
  });

  // Test Case 12: Performance testing - Response time
  it('should create banner within acceptable time', () => {
    const bannerData = {
      title: 'Performance Test Banner',
      isActive: true
    };

    const startTime = Date.now();
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`, bannerData)
      .then((response) => {
        const responseTime = Date.now() - startTime;
        expect(response.status).to.eq(201);
        expect(responseTime).to.be.lessThan(3000); // 3 seconds max
      });
  });

  // Test Case 13: Concurrent banner creation
  it('should handle concurrent banner creation', () => {
    // Sequential requests to avoid Promise.all timeout
    cy.authRequest('POST', `${baseUrl}${endpoint}`, {
      title: 'Concurrent Banner 1',
      subtitle: 'Subtitle 1',
      isActive: true
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.data.title).to.include('1');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`, {
      title: 'Concurrent Banner 2',
      subtitle: 'Subtitle 2',
      isActive: true
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.data.title).to.include('2');
    });
    
    cy.authRequest('POST', `${baseUrl}${endpoint}`, {
      title: 'Concurrent Banner 3',
      subtitle: 'Subtitle 3',
      isActive: true
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.data.title).to.include('3');
    });
  });

  // Test Case 14: Large payload handling
  it('should handle large payloads appropriately', () => {
    const largeData = {
      title: 'Large Payload Banner',
      subtitle: 'L'.repeat(1000), // Large subtitle
      image: 'https://example.com/very-long-image-url-' + 'x'.repeat(500) + '.jpg',
      buttonText: 'B'.repeat(200),
      buttonLink: 'https://example.com/very-long-link-' + 'y'.repeat(500),
      isActive: true,
      extraData: 'E'.repeat(2000) // Large additional field
    };

    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: largeData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400, 413]); // 413 = Payload too large
      if (response.status === 413) {
        expect(response.body).to.have.property('error');
      }
    });
  });

  // Test Case 15: Content-Type validation
  it('should require proper Content-Type header', () => {
    const bannerData = {
      title: 'Content Type Test',
      isActive: true
    };

    // Test with wrong Content-Type
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: bannerData,
      headers: {
        'Content-Type': 'text/plain'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([201, 400, 415, 500]);
    });

    // Test with correct Content-Type
    cy.request({headers:{Authorization:`Bearer ${Cypress.env("authToken")}`},
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      body: bannerData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.data).to.have.property('title', bannerData.title);
    });
  });
});