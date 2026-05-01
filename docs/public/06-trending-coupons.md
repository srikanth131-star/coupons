# Trending Coupons API - Test Cases

**Endpoint:** `GET /api/public/coupons/trending`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Response Format
Plain array of coupon objects sorted by clickCount descending.

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get trending coupons | `GET /api/public/coupons/trending` | 200 - Array of coupons |
| 2 | Response is array | `GET /api/public/coupons/trending` | 200 - body is array |
| 3 | Sorted by clickCount desc | `GET /api/public/coupons/trending` | 200 - Higher clickCount first |
| 4 | Each item has title | `GET /api/public/coupons/trending` | 200 - All items have title |
| 5 | Each item has code | `GET /api/public/coupons/trending` | 200 - All items have code |
| 6 | Each item has clickCount | `GET /api/public/coupons/trending` | 200 - All items have clickCount |
| 7 | Empty list when no coupons | `GET /api/public/coupons/trending` | 200 - Empty array |
| 8 | Content-Type is JSON | `GET /api/public/coupons/trending` | content-type: application/json |
| 9 | Response time under 2 seconds | `GET /api/public/coupons/trending` | 200 within 2000ms |
| 10 | Concurrent requests (5x) | 5x `GET /api/public/coupons/trending` | All return 200 |
| 11 | Consistent data across requests | Two sequential requests | Same length both times |
| 12 | No sensitive fields | `GET /api/public/coupons/trending` | No adminNotes, internalId |
| 13 | Limit parameter (if supported) | `GET /api/public/coupons/trending?limit=5` | 200 - At most 5 items |
| 14 | Response structure valid | `GET /api/public/coupons/trending` | 200 - Each item has _id |
| 15 | clickCount is a number | `GET /api/public/coupons/trending` | 200 - clickCount is typeof number |
