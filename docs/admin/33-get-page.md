# Admin - Get Page API - Test Cases

**Endpoint:** `GET /api/admin/pages/:pageName`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## URL Parameters
| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| pageName  | String | Yes      | Page name (e.g. home)    |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get home page | `GET /api/admin/pages/home` | 200 - Page object |
| 2 | Non-existent page | `GET /api/admin/pages/nonexistentpage` | 404 - `{ error: "Page not found" }` |
| 3 | Response has page field | `GET /api/admin/pages/home` | 200 - Has page field |
| 4 | Response has title field | `GET /api/admin/pages/home` | 200 - Has title field |
| 5 | Response has slug field | `GET /api/admin/pages/home` | 200 - Has slug field |
| 6 | Response has sections array | `GET /api/admin/pages/home` | 200 - Has sections array |
| 7 | Response is object | `GET /api/admin/pages/home` | 200 - body is object |
| 8 | Content-Type is JSON | `GET /api/admin/pages/home` | content-type: application/json |
| 9 | Response time under 2 seconds | `GET /api/admin/pages/home` | 200 within 2000ms |
| 10 | Concurrent requests (5x) | 5x `GET /api/admin/pages/home` | All return 200 |
| 11 | Consistent data across requests | Two sequential requests | Same title both times |
| 12 | Numeric pageName | `GET /api/admin/pages/12345` | 404 - Page not found |
| 13 | Special chars in pageName | `GET /api/admin/pages/home@test` | 404 or 400 |
| 14 | Empty pageName | `GET /api/admin/pages/` | Redirects to list or 404 |
| 15 | sections have id and type | `GET /api/admin/pages/home` | 200 - Each section has id, type |
