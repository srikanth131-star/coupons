# List Featured Coupons API - Test Cases

**Endpoint:** `GET /api/public/featured-coupons/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Response Format
```json
{ "success": true, "data": [], "total": 0 }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all featured coupons | `GET /api/public/featured-coupons/list` | 200 - `{ success, data, total }` |
| 2 | Response has success field | `GET /api/public/featured-coupons/list` | 200 - success is true |
| 3 | Response has data array | `GET /api/public/featured-coupons/list` | 200 - data is array |
| 4 | Response has total field | `GET /api/public/featured-coupons/list` | 200 - total is number |
| 5 | Each item has title | `GET /api/public/featured-coupons/list` | 200 - All items have title |
| 6 | Each item has href | `GET /api/public/featured-coupons/list` | 200 - All items have href |
| 7 | Each item has theme | `GET /api/public/featured-coupons/list` | 200 - theme is white or purple |
| 8 | Each item has cta | `GET /api/public/featured-coupons/list` | 200 - All items have cta |
| 9 | total matches data length | `GET /api/public/featured-coupons/list` | 200 - total === data.length |
| 10 | Empty list when no featured coupons | `GET /api/public/featured-coupons/list` | 200 - data is empty array |
| 11 | Content-Type is JSON | `GET /api/public/featured-coupons/list` | content-type: application/json |
| 12 | Response time under 2 seconds | `GET /api/public/featured-coupons/list` | 200 within 2000ms |
| 13 | Concurrent requests (5x) | 5x `GET /api/public/featured-coupons/list` | All return 200 |
| 14 | Consistent data across requests | Two sequential requests | Same total both times |
| 15 | isActive items only | `GET /api/public/featured-coupons/list` | 200 - isActive true on items |
