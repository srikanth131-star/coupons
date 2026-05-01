# List Coupons API - Test Cases

**Endpoint:** `GET /api/public/coupons/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Query Parameters
| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| page      | Number | Page number              |
| limit     | Number | Items per page           |
| category  | String | Filter by category       |
| store     | String | Filter by store ID       |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all coupons | `GET /api/public/coupons/list` | 200 - Array of coupons |
| 2 | Response is array | `GET /api/public/coupons/list` | 200 - body is array |
| 3 | Each coupon has title and code | `GET /api/public/coupons/list` | 200 - All items have title, code |
| 4 | Pagination with limit | `GET /api/public/coupons/list?page=1&limit=3` | 200 - At most 3 items |
| 5 | Filter by category | `GET /api/public/coupons/list?category=Shopping` | 200 - Filtered results |
| 6 | Filter by store | `GET /api/public/coupons/list?store=<storeId>` | 200 - Filtered results |
| 7 | No sensitive fields exposed | `GET /api/public/coupons/list` | 200 - No adminNotes |
| 8 | Response time under 2 seconds | `GET /api/public/coupons/list` | 200 within 2000ms |
| 9 | Concurrent requests (5x) | 5x `GET /api/public/coupons/list` | All return 200 |
| 10 | Consistent data across requests | Two sequential requests | Same length both times |
| 11 | Content-Type is JSON | `GET /api/public/coupons/list` | content-type: application/json |
| 12 | Invalid page param | `GET /api/public/coupons/list?page=abc` | 200 or 400 |
| 13 | Empty category filter | `GET /api/public/coupons/list?category=` | 200 - All coupons |
| 14 | Large limit value | `GET /api/public/coupons/list?limit=1000` | 200 - All or capped results |
| 15 | isActive field check | `GET /api/public/coupons/list` | 200 - Active coupons only (if filtered) |
