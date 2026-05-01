# Admin - List Featured Coupons API - Test Cases

**Endpoint:** `GET /api/admin/featured-coupons/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "success": true, "data": [], "total": 0 }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all featured coupons | `GET /api/admin/featured-coupons/list` | 200 - `{ success, data, total }` |
| 2 | Response has success field | `GET /api/admin/featured-coupons/list` | 200 - success is true |
| 3 | Response has data array | `GET /api/admin/featured-coupons/list` | 200 - data is array |
| 4 | Response has total field | `GET /api/admin/featured-coupons/list` | 200 - total is number |
| 5 | Each item has title | `GET /api/admin/featured-coupons/list` | 200 - All items have title |
| 6 | Each item has theme | `GET /api/admin/featured-coupons/list` | 200 - theme is white or purple |
| 7 | Each item has order | `GET /api/admin/featured-coupons/list` | 200 - All items have order |
| 8 | total matches data length | `GET /api/admin/featured-coupons/list` | 200 - total === data.length |
| 9 | Response time under 2 seconds | `GET /api/admin/featured-coupons/list` | 200 within 2000ms |
| 10 | Concurrent requests (5x) | 5x `GET /api/admin/featured-coupons/list` | All return 200 |
| 11 | Consistent data across requests | Two sequential requests | Same total both times |
| 12 | Content-Type is JSON | `GET /api/admin/featured-coupons/list` | content-type: application/json |
| 13 | Empty list when no featured coupons | `GET /api/admin/featured-coupons/list` | 200 - data is empty array |
| 14 | Each item has isActive | `GET /api/admin/featured-coupons/list` | 200 - All items have isActive |
| 15 | No query params needed | `GET /api/admin/featured-coupons/list` | 200 - Works without params |
