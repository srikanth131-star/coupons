# Admin - User Behavior Analytics API - Test Cases

**Endpoint:** `GET /api/admin/analytics/user-behavior`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "message": "...", "data": { "pageViews": [], "userSessions": [], "bounceRate": 0, "averageSessionDuration": 0 }, "timestamp": "" }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get user behavior | `GET /api/admin/analytics/user-behavior` | 200 - Analytics object |
| 2 | Response has message | `GET /api/admin/analytics/user-behavior` | 200 - Has message |
| 3 | Response has data object | `GET /api/admin/analytics/user-behavior` | 200 - Has data |
| 4 | data has pageViews | `GET /api/admin/analytics/user-behavior` | 200 - Has data.pageViews |
| 5 | data has userSessions | `GET /api/admin/analytics/user-behavior` | 200 - Has data.userSessions |
| 6 | data has bounceRate | `GET /api/admin/analytics/user-behavior` | 200 - Has data.bounceRate |
| 7 | data has averageSessionDuration | `GET /api/admin/analytics/user-behavior` | 200 - Has data.averageSessionDuration |
| 8 | Response has timestamp | `GET /api/admin/analytics/user-behavior` | 200 - Has timestamp |
| 9 | Content-Type is JSON | `GET /api/admin/analytics/user-behavior` | content-type: application/json |
| 10 | Response time under 2 seconds | `GET /api/admin/analytics/user-behavior` | 200 within 2000ms |
| 11 | Concurrent requests (5x) | 5x same request | All return 200 |
| 12 | bounceRate is a number | `GET /api/admin/analytics/user-behavior` | 200 - typeof number |
| 13 | pageViews is array | `GET /api/admin/analytics/user-behavior` | 200 - array type |
| 14 | userSessions is array | `GET /api/admin/analytics/user-behavior` | 200 - array type |
| 15 | No query params needed | `GET /api/admin/analytics/user-behavior` | 200 - Works without params |
