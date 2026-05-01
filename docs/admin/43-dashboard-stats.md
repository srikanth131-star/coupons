# Admin - Dashboard Stats API - Test Cases

**Endpoint:** `GET /api/admin/dashboard/stats`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Query Parameters
| Parameter | Type   | Description                    |
|-----------|--------|--------------------------------|
| startDate | String | Filter from date (ISO format)  |
| endDate   | String | Filter to date (ISO format)    |
| metrics   | String | Specific metrics to return     |

## Response Format
```json
{ "success": true, "data": { "totalStores": 0, "totalCoupons": 0, "totalCategories": 0, ... }, "timestamp": "" }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get dashboard stats | `GET /api/admin/dashboard/stats` | 200 - `{ success, data, timestamp }` |
| 2 | Response has success true | `GET /api/admin/dashboard/stats` | 200 - success is true |
| 3 | Response has data object | `GET /api/admin/dashboard/stats` | 200 - Has data |
| 4 | data has totalStores | `GET /api/admin/dashboard/stats` | 200 - Has data.totalStores |
| 5 | data has totalCoupons | `GET /api/admin/dashboard/stats` | 200 - Has data.totalCoupons |
| 6 | data has totalCategories | `GET /api/admin/dashboard/stats` | 200 - Has data.totalCategories |
| 7 | data has topStores | `GET /api/admin/dashboard/stats` | 200 - Has data.topStores array |
| 8 | data has topCoupons | `GET /api/admin/dashboard/stats` | 200 - Has data.topCoupons array |
| 9 | Filter by startDate | `GET /api/admin/dashboard/stats?startDate=2026-01-01` | 200 - Filtered stats |
| 10 | Filter by date range | `GET /api/admin/dashboard/stats?startDate=2026-01-01&endDate=2026-12-31` | 200 - Filtered stats |
| 11 | Invalid startDate format | `GET /api/admin/dashboard/stats?startDate=invalid` | 400 - Invalid date format |
| 12 | Invalid endDate format | `GET /api/admin/dashboard/stats?endDate=invalid` | 400 - Invalid date format |
| 13 | Content-Type is JSON | `GET /api/admin/dashboard/stats` | content-type: application/json |
| 14 | Response time under 3 seconds | `GET /api/admin/dashboard/stats` | 200 within 3000ms |
| 15 | totalStores is a number | `GET /api/admin/dashboard/stats` | 200 - typeof number |
