# Admin - Health Check API - Test Cases

**Endpoint:** `GET /api/admin/health`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "success": true, "data": { "status": "healthy", "database": {}, "uptime": 0 } }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Basic health check | `GET /api/admin/health` | 200 - `{ success, data }` |
| 2 | Response has success true | `GET /api/admin/health` | 200 - success is true |
| 3 | Response has data object | `GET /api/admin/health` | 200 - Has data |
| 4 | data has status | `GET /api/admin/health` | 200 - data.status is healthy |
| 5 | data has database | `GET /api/admin/health` | 200 - Has data.database |
| 6 | database has status | `GET /api/admin/health` | 200 - data.database.status is healthy |
| 7 | data has uptime | `GET /api/admin/health` | 200 - Has data.uptime |
| 8 | data has timestamp | `GET /api/admin/health` | 200 - Has data.timestamp |
| 9 | Detailed health check | `GET /api/admin/health?detailed=true` | 200 - Has memory, cpu, load |
| 10 | Detailed has memory | `GET /api/admin/health?detailed=true` | 200 - Has data.memory |
| 11 | Detailed health check endpoint | `GET /api/admin/health/detailed` | 200 - Full health data |
| 12 | Content-Type is JSON | `GET /api/admin/health` | content-type: application/json |
| 13 | Response time under 2 seconds | `GET /api/admin/health` | 200 within 2000ms |
| 14 | Concurrent requests (5x) | 5x same request | All return 200 |
| 15 | uptime is a number | `GET /api/admin/health` | 200 - typeof number |
