# Reveal Coupon Code API - Test Cases

**Endpoint:** `POST /api/public/coupons/reveal/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of coupon |

## Response Format
```json
{ "code": "SAVE20", "clickCount": 5, "title": "20% Off" }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Reveal valid coupon code | `POST /api/public/coupons/reveal/<validId>` | 200 - `{ code, clickCount, title }` |
| 2 | Non-existent coupon ID | `POST /api/public/coupons/reveal/000000000000000000000000` | 404 - `{ error: "Coupon not found" }` |
| 3 | Invalid ObjectId format | `POST /api/public/coupons/reveal/invalid-id` | 400 or 500 |
| 4 | Response has code field | `POST /api/public/coupons/reveal/<validId>` | 200 - Has code |
| 5 | Response has clickCount field | `POST /api/public/coupons/reveal/<validId>` | 200 - Has clickCount |
| 6 | Response has title field | `POST /api/public/coupons/reveal/<validId>` | 200 - Has title |
| 7 | clickCount increments on reveal | Two sequential reveals | Second clickCount > first |
| 8 | Content-Type is JSON | `POST /api/public/coupons/reveal/<validId>` | content-type: application/json |
| 9 | Response time under 2 seconds | `POST /api/public/coupons/reveal/<validId>` | 200 within 2000ms |
| 10 | Concurrent reveals (5x) | 5x same reveal | All return 200 |
| 11 | Empty ID | `POST /api/public/coupons/reveal/` | 404 - Route not matched |
| 12 | No request body needed | `POST /api/public/coupons/reveal/<validId>` (no body) | 200 - Works without body |
| 13 | code is a string | `POST /api/public/coupons/reveal/<validId>` | 200 - code is typeof string |
| 14 | clickCount is a number | `POST /api/public/coupons/reveal/<validId>` | 200 - clickCount is typeof number |
| 15 | Dynamic ID from list | Fetch ID from /coupons/list then reveal | 200 - Valid code returned |
