# Admin - Get Coupon Details API - Test Cases

**Endpoint:** `GET /api/admin/coupons/details/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of coupon |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get coupon by valid ID | `GET /api/admin/coupons/details/<validId>` | 200 - Coupon object |
| 2 | Non-existent ID | `GET /api/admin/coupons/details/000000000000000000000000` | 404 - Not found |
| 3 | Invalid ObjectId format | `GET /api/admin/coupons/details/invalid-id` | 400 or 500 |
| 4 | Response has title | `GET /api/admin/coupons/details/<validId>` | 200 - Has title |
| 5 | Response has code | `GET /api/admin/coupons/details/<validId>` | 200 - Has code |
| 6 | Response has store | `GET /api/admin/coupons/details/<validId>` | 200 - Has store |
| 7 | Response has category | `GET /api/admin/coupons/details/<validId>` | 200 - Has category |
| 8 | Response has clickCount | `GET /api/admin/coupons/details/<validId>` | 200 - Has clickCount |
| 9 | Response has isActive | `GET /api/admin/coupons/details/<validId>` | 200 - Has isActive |
| 10 | Response is object | `GET /api/admin/coupons/details/<validId>` | 200 - body is object |
| 11 | Content-Type is JSON | `GET /api/admin/coupons/details/<validId>` | content-type: application/json |
| 12 | Response time under 2 seconds | `GET /api/admin/coupons/details/<validId>` | 200 within 2000ms |
| 13 | Dynamic ID from list | Fetch ID from /admin/coupons/list then use it | 200 - Matching coupon |
| 14 | Data consistency | Two sequential requests | Same title, code both times |
| 15 | Concurrent requests (5x) | 5x same request | All return 200 |
