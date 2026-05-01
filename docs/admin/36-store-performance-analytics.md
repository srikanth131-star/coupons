# Admin - Store Performance Analytics API - Test Cases

**Endpoint:** `GET /api/admin/analytics/store-performance`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "message": "...", "data": { "topPerformingStores": [], "storeEngagement": [], "popularCategories": [] }, "timestamp": "" }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get store performance | `GET /api/admin/analytics/store-performance` | 200 - Analytics object |
| 2 | Response has message | `GET /api/admin/analytics/store-performance` | 200 - Has message |
| 3 | Response has data object | `GET /api/admin/analytics/store-performance` | 200 - Has data |
| 4 | data has topPerformingStores | `GET /api/admin/analytics/store-performance` | 200 - Has data.topPerformingStores |
| 5 | data has storeEngagement | `GET /api/admin/analytics/store-performance` | 200 - Has data.storeEngagement |
| 6 | data has popularCategories | `GET /api/admin/analytics/store-performance` | 200 - Has data.popularCategories |
| 7 | Response has timestamp | `GET /api/admin/analytics/store-performance` | 200 - Has timestamp |
| 8 | Response is object | `GET /api/admin/analytics/store-performance` | 200 - body is object |
| 9 | Content-Type is JSON | `GET /api/admin/analytics/store-performance` | content-type: application/json |
| 10 | Response time under 2 seconds | `GET /api/admin/analytics/store-performance` | 200 within 2000ms |
| 11 | Concurrent requests (5x) | 5x same request | All return 200 |
| 12 | topPerformingStores is array | `GET /api/admin/analytics/store-performance` | 200 - array type |
| 13 | storeEngagement is array | `GET /api/admin/analytics/store-performance` | 200 - array type |
| 14 | popularCategories is array | `GET /api/admin/analytics/store-performance` | 200 - array type |
| 15 | No query params needed | `GET /api/admin/analytics/store-performance` | 200 - Works without params |
