# Get Coupon Details API - Test Cases

**Endpoint:** `GET /api/public/coupons/details/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of coupon |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get coupon by valid ID | `GET /api/public/coupons/details/<validId>` | 200 - Coupon object |
| 2 | Non-existent ID | `GET /api/public/coupons/details/000000000000000000000000` | 404 - `{ error: "Coupon not found" }` |
| 3 | Invalid ObjectId format | `GET /api/public/coupons/details/invalid-id` | 400 or 500 - Cast error |
| 4 | Coupon has title field | `GET /api/public/coupons/details/<validId>` | 200 - Has title |
| 5 | Coupon has code field | `GET /api/public/coupons/details/<validId>` | 200 - Has code |
| 6 | Coupon has store reference | `GET /api/public/coupons/details/<validId>` | 200 - Has store |
| 7 | Coupon has category field | `GET /api/public/coupons/details/<validId>` | 200 - Has category |
| 8 | Response is object | `GET /api/public/coupons/details/<validId>` | 200 - body is object |
| 9 | Content-Type is JSON | `GET /api/public/coupons/details/<validId>` | content-type: application/json |
| 10 | Response time under 2 seconds | `GET /api/public/coupons/details/<validId>` | 200 within 2000ms |
| 11 | Dynamic ID from list | Fetch ID from /coupons/list then use it | 200 - Matching coupon |
| 12 | Empty ID | `GET /api/public/coupons/details/` | 404 - Route not matched |
| 13 | Concurrent requests (5x) | 5x same request | All return 200 |
| 14 | Data consistency | Two sequential requests | Same title, code both times |
| 15 | No sensitive fields | `GET /api/public/coupons/details/<validId>` | No adminNotes, internalId |
