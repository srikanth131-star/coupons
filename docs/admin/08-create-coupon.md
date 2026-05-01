# Admin - Create Coupon API - Test Cases

**Endpoint:** `POST /api/admin/coupons/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field       | Type     | Required | Description                    |
|-------------|----------|----------|--------------------------------|
| title       | String   | Yes      | Coupon title                   |
| code        | String   | Yes      | Unique coupon code             |
| store       | ObjectId | Yes      | Store ID reference             |
| category    | String   | Yes      | Coupon category                |
| description | String   | No       | Coupon description             |
| discount    | String   | No       | Discount value (e.g. "20%")    |
| expiryDate  | Date     | No       | Expiry date                    |
| tags        | Array    | No       | Array of tag strings           |
| isActive    | Boolean  | No       | Default true                   |
| isFeatured  | Boolean  | No       | Default false                  |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid coupon creation with all required fields | `{ title, code, store, category }` | 201 - Coupon created |
| 2 | Missing title | `{ code, store, category }` | 400 - Validation error |
| 3 | Missing code | `{ title, store, category }` | 400 - Validation error |
| 4 | Missing store | `{ title, code, category }` | 400 - Validation error |
| 5 | Missing category | `{ title, code, store }` | 400 - Validation error |
| 6 | Duplicate coupon code | Same code twice | First: 201, Second: 400/409 |
| 7 | Invalid store ObjectId | `{ store: "invalid-id" }` | 400 or 500 - Cast error |
| 8 | Minimum required fields only | `{ title, code, store, category }` | 201 - Created successfully |
| 9 | All fields provided | Full object with all fields | 201 - Created with all fields |
| 10 | Special characters in code | `{ code: "SAVE@#$20" }` | 201 - Characters preserved |
| 11 | Unicode in title | `{ title: "20% छूट" }` | 201 - Unicode preserved |
| 12 | Invalid discount format | `{ discount: "abc" }` | 201 (accepted) or 400 |
| 13 | Null values for optional fields | `{ description: null }` | 201 or 400 |
| 14 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 15 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
