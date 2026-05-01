# Track Coupon Click API - Test Cases

**Endpoint:** `POST /api/public/coupons/track-click/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of coupon |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Track click on valid coupon | `POST /api/public/coupons/track-click/<validId>` | 200 - Success response |
| 2 | Non-existent coupon ID | `POST /api/public/coupons/track-click/000000000000000000000000` | 404 - Not found |
| 3 | Invalid ObjectId format | `POST /api/public/coupons/track-click/invalid-id` | 400 or 500 |
| 4 | clickCount increments | Track click then check coupon details | clickCount increased by 1 |
| 5 | Multiple clicks increment count | 3x track-click on same coupon | clickCount increases by 3 |
| 6 | No request body needed | `POST /api/public/coupons/track-click/<validId>` (no body) | 200 - Works without body |
| 7 | Content-Type is JSON | `POST /api/public/coupons/track-click/<validId>` | content-type: application/json |
| 8 | Response time under 2 seconds | `POST /api/public/coupons/track-click/<validId>` | 200 within 2000ms |
| 9 | Concurrent clicks (5x) | 5x same track-click | All return 200 |
| 10 | Empty ID | `POST /api/public/coupons/track-click/` | 404 - Route not matched |
| 11 | Response has message or clickCount | `POST /api/public/coupons/track-click/<validId>` | 200 - Has message or clickCount |
| 12 | Dynamic ID from list | Fetch ID from /coupons/list then track | 200 - Click tracked |
| 13 | GET method not allowed | `GET /api/public/coupons/track-click/<validId>` | 404 - Method not found |
| 14 | Response is object | `POST /api/public/coupons/track-click/<validId>` | 200 - body is object |
| 15 | Idempotency check | Same click tracked twice | Both return 200 |
