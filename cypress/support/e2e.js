import './commands'

// Auto-inject auth token into all cy.request calls when Authorization header is missing
Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  const token = Cypress.env('authToken');
  if (!token) return originalFn(...args);

  // cy.request(options) - single object argument
  if (args.length === 1 && typeof args[0] === 'object') {
    const opts = args[0];
    if (!opts.headers) opts.headers = {};
    if (!opts.headers.Authorization && !opts.headers.authorization) {
      opts.headers.Authorization = `Bearer ${token}`;
    }
    return originalFn(opts);
  }

  // cy.request(url), cy.request(method, url), cy.request(method, url, body) - convert to options object
  let opts = {};
  if (args.length === 1 && typeof args[0] === 'string') {
    opts = { url: args[0] };
  } else if (args.length === 2) {
    opts = { method: args[0], url: args[1] };
  } else if (args.length === 3) {
    opts = { method: args[0], url: args[1], body: args[2] };
  } else {
    return originalFn(...args);
  }

  opts.headers = { Authorization: `Bearer ${token}` };
  return originalFn(opts);
});
