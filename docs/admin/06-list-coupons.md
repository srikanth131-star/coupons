# Admin - List Coupons API - Test Cases

**Endpoint:** `GET /api/admin/coupons/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all coupons | `GET /api/admin/coupons/list` | 200 - Array of coupons |
| 2 | Response is array | `GET /api/admin/coupons/list` | 200 - body is array |
| 3 | Each coupon has title | `GET /api/admin/coupons/list` | 200 - All items have title |
| 4 | Each coupon has code | `GET /api/admin/coupons/list` | 200 - All items have code |
| 5 | Each coupon has store | `GET /api/admin/coupons/list` | 200 - All items have store |
| 6 | Each coupon has category | `GET /api/admin/coupons/list` | 200 - All items have category |
| 7 | Each coupon has _id | `GET /api/admin/coupons/list` | 200 - All items have _id |
| 8 | Each coupon has clickCount | `GET /api/admin/coupons/list` | 200 - All items have clickCount |
| 9 | Response time under 2 seconds | `GET /api/admin/coupons/list` | 200 within 2000ms |
| 10 | Concurrent requests (5x) | 5x `GET /api/admin/coupons/list` | All return 200 |
| 11 | Consistent data across requests | Two sequential requests | Same length both times |
| 12 | Content-Type is JSON | `GET /api/admin/coupons/list` | content-type: application/json |
| 13 | Empty list when no coupons | `GET /api/admin/coupons/list` | 200 - Empty array |
| 14 | Each coupon has isActive | `GET /api/admin/coupons/list` | 200 - All items have isActive |
| 15 | Each coupon has createdAt | `GET /api/admin/coupons/list` | 200 - All items have createdAt |
