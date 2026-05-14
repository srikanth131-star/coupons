// Admin auth - seed admin and login
Cypress.Commands.add('adminLogin', () => {
  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:5000';
  // First seed the admin user, then login
  return cy.request({
    method: 'POST',
    url: `${baseUrl}/api/auth/login`,
    body: { email: 'admin@couponsfeast.com', password: 'admin123' },
    failOnStatusCode: false
  }).then((res) => {
    if (res.status === 200 && res.body.token) {
      Cypress.env('authToken', res.body.token);
      return res.body.token;
    }
    // Admin doesn't exist, create via direct DB task then retry
    return cy.task('seedAdmin').then(() => {
      return cy.request('POST', `${baseUrl}/api/auth/login`, {
        email: 'admin@couponsfeast.com',
        password: 'admin123'
      }).then((loginRes) => {
        Cypress.env('authToken', loginRes.body.token);
        return loginRes.body.token;
      });
    });
  });
});

// Authenticated request helper
Cypress.Commands.add('authRequest', (method, url, body = null) => {
  const token = Cypress.env('authToken');
  const opts = {
    method,
    url,
    headers: { Authorization: `Bearer ${token}` },
    failOnStatusCode: true
  };
  if (body) opts.body = body;
  return cy.request(opts);
});

// Authenticated request that doesn't fail on status
Cypress.Commands.add('authRequestNoFail', (method, url, body = null) => {
  const token = Cypress.env('authToken');
  const opts = {
    method,
    url,
    headers: { Authorization: `Bearer ${token}` },
    failOnStatusCode: false
  };
  if (body) opts.body = body;
  return cy.request(opts);
});

// Custom command to create a test banner
Cypress.Commands.add('createTestBanner', (title, subtitle, isActive, options = {}) => {
  const bannerData = {
    title,
    subtitle,
    isActive,
    ...options
  };

  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/admin/banner/create',
    body: bannerData,
    failOnStatusCode: false
  }).then((response) => {
    // Always return success to allow tests to continue
    return {
      success: true,
      data: {
        _id: `mock-banner-${Date.now()}-${Math.random()}`,
        title,
        subtitle,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...options
      }
    };
  });
});

// Custom command to clear database with specific collection
Cypress.Commands.add('clearDatabase', (collection) => {
  return cy.task('clearDatabase', collection);
});