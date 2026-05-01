# Admin - Create Featured Coupon API - Test Cases

**Endpoint:** `POST /api/admin/featured-coupons/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field      | Type    | Required | Description                  |
|------------|---------|----------|------------------------------|
| title      | String  | No       | Featured coupon title        |
| href       | String  | No       | Link URL                     |
| theme      | String  | No       | white or purple (default white) |
| logo       | String  | No       | Logo URL                     |
| cta        | String  | No       | Call to action text          |
| image      | String  | No       | Image URL                    |
| isActive   | Boolean | No       | Default true                 |
| order      | Number  | No       | Display order (default 0)    |
| couponId   | ObjectId| No       | Reference to Coupon          |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid creation with all fields | Full object | 201 - Created featured coupon |
| 2 | Minimal creation (no required fields) | `{}` | 201 - Created with defaults |
| 3 | Valid theme white | `{ theme: "white" }` | 201 - Created successfully |
| 4 | Valid theme purple | `{ theme: "purple" }` | 201 - Created successfully |
| 5 | Invalid theme enum | `{ theme: "blue" }` | 400 - Enum validation error |
| 6 | Valid couponId reference | `{ couponId: "<validCouponId>" }` | 201 - Created with reference |
| 7 | Invalid couponId | `{ couponId: "invalid-id" }` | 400 or 500 - Cast error |
| 8 | Null couponId | `{ couponId: null }` | 201 - Accepted (not required) |
| 9 | Negative order | `{ order: -1 }` | 201 or 400 |
| 10 | String order | `{ order: "first" }` | 400 or 201 - Type coercion |
| 11 | isActive false | `{ isActive: false }` | 201 - Created as inactive |
| 12 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 13 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
| 14 | Response has _id | Valid creation | 201 - body has _id |
| 15 | Concurrent creation (3x) | 3 simultaneous creates | All return 201 |
