# Get Site Config API - Test Cases

**Endpoint:** `GET /api/public/site/config`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Response Format
Plain site config object.
```json
{ "siteName": "Coupons Script", "seo": {}, "theme": {}, "socialMedia": {} }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get site config | `GET /api/public/site/config` | 200 - Config object |
| 2 | Response has siteName | `GET /api/public/site/config` | 200 - Has siteName |
| 3 | Response has seo object | `GET /api/public/site/config` | 200 - Has seo |
| 4 | seo has metaTitle | `GET /api/public/site/config` | 200 - Has seo.metaTitle |
| 5 | seo has metaDescription | `GET /api/public/site/config` | 200 - Has seo.metaDescription |
| 6 | Response has theme object | `GET /api/public/site/config` | 200 - Has theme |
| 7 | theme has primaryColor | `GET /api/public/site/config` | 200 - Has theme.primaryColor |
| 8 | Response has socialMedia | `GET /api/public/site/config` | 200 - Has socialMedia |
| 9 | Response is object | `GET /api/public/site/config` | 200 - body is object |
| 10 | Content-Type is JSON | `GET /api/public/site/config` | content-type: application/json |
| 11 | Response time under 2 seconds | `GET /api/public/site/config` | 200 within 2000ms |
| 12 | Concurrent requests (5x) | 5x `GET /api/public/site/config` | All return 200 |
| 13 | Consistent data across requests | Two sequential requests | Same siteName both times |
| 14 | No sensitive fields | `GET /api/public/site/config` | No passwords, secrets |
| 15 | Returns 200 even if minimal config | `GET /api/public/site/config` | 200 - Not 404 |
