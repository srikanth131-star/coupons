# Admin - Coupon Performance Analytics API - Test Cases

**Endpoint:** `GET /api/admin/analytics/coupon-performance`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "message": "...", "data": { "topPerformingCoupons": [], "clickTrends": [], "conversionRates": [] }, "timestamp": "" }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get coupon performance | `GET /api/admin/analytics/coupon-performance` | 200 - Analytics object |
| 2 | Response has message | `GET /api/admin/analytics/coupon-performance` | 200 - Has message |
| 3 | Response has data object | `GET /api/admin/analytics/coupon-performance` | 200 - Has data |
| 4 | data has topPerformingCoupons | `GET /api/admin/analytics/coupon-performance` | 200 - Has data.topPerformingCoupons |
| 5 | data has clickTrends | `GET /api/admin/analytics/coupon-performance` | 200 - Has data.clickTrends |
| 6 | data has conversionRates | `GET /api/admin/analytics/coupon-performance` | 200 - Has data.conversionRates |
| 7 | Response has timestamp | `GET /api/admin/analytics/coupon-performance` | 200 - Has timestamp |
| 8 | Response is object | `GET /api/admin/analytics/coupon-performance` | 200 - body is object |
| 9 | Content-Type is JSON | `GET /api/admin/analytics/coupon-performance` | content-type: application/json |
| 10 | Response time under 2 seconds | `GET /api/admin/analytics/coupon-performance` | 200 within 2000ms |
| 11 | Concurrent requests (5x) | 5x same request | All return 200 |
| 12 | topPerformingCoupons is array | `GET /api/admin/analytics/coupon-performance` | 200 - array type |
| 13 | clickTrends is array | `GET /api/admin/analytics/coupon-performance` | 200 - array type |
| 14 | conversionRates is array | `GET /api/admin/analytics/coupon-performance` | 200 - array type |
| 15 | No query params needed | `GET /api/admin/analytics/coupon-performance` | 200 - Works without params |
