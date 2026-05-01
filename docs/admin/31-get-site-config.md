# Admin - Get Site Config API - Test Cases

**Endpoint:** `GET /api/admin/pages/site-config`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get site config | `GET /api/admin/pages/site-config` | 200 - Config object |
| 2 | Response has siteName | `GET /api/admin/pages/site-config` | 200 - Has siteName |
| 3 | Response has seo object | `GET /api/admin/pages/site-config` | 200 - Has seo |
| 4 | seo has metaTitle | `GET /api/admin/pages/site-config` | 200 - Has seo.metaTitle |
| 5 | Response has theme object | `GET /api/admin/pages/site-config` | 200 - Has theme |
| 6 | theme has primaryColor | `GET /api/admin/pages/site-config` | 200 - Has theme.primaryColor |
| 7 | Response has socialMedia | `GET /api/admin/pages/site-config` | 200 - Has socialMedia |
| 8 | Response has logos | `GET /api/admin/pages/site-config` | 200 - Has logos |
| 9 | Response has footer config | `GET /api/admin/pages/site-config` | 200 - Has footer |
| 10 | Response is object | `GET /api/admin/pages/site-config` | 200 - body is object |
| 11 | Content-Type is JSON | `GET /api/admin/pages/site-config` | content-type: application/json |
| 12 | Response time under 2 seconds | `GET /api/admin/pages/site-config` | 200 within 2000ms |
| 13 | Concurrent requests (5x) | 5x `GET /api/admin/pages/site-config` | All return 200 |
| 14 | Consistent data across requests | Two sequential requests | Same siteName both times |
| 15 | Returns 200 even if minimal config | `GET /api/admin/pages/site-config` | 200 - Not 404 |
