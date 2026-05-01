# Admin - Update Featured Coupon API - Test Cases

**Endpoint:** `PUT /api/admin/featured-coupons/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update title | `PUT /featured-coupons/<id>` `{ title: "New Title" }` | 200 - Updated |
| 2 | Update theme to purple | `PUT /featured-coupons/<id>` `{ theme: "purple" }` | 200 - Updated |
| 3 | Update isActive to false | `PUT /featured-coupons/<id>` `{ isActive: false }` | 200 - Deactivated |
| 4 | Update order | `PUT /featured-coupons/<id>` `{ order: 5 }` | 200 - Updated |
| 5 | Update cta | `PUT /featured-coupons/<id>` `{ cta: "Get Deal" }` | 200 - Updated |
| 6 | Non-existent ID | `PUT /featured-coupons/000000000000000000000000` | 404 - Not found |
| 7 | Invalid ObjectId | `PUT /featured-coupons/invalid-id` | 400 or 500 |
| 8 | Empty body | `PUT /featured-coupons/<id>` `{}` | 200 - No changes |
| 9 | Invalid theme enum | `{ theme: "blue" }` | 400 - Enum error |
| 10 | Update all fields | Full object | 200 - All fields updated |
| 11 | Response returns updated item | Valid update | 200 - body has new values |
| 12 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 13 | Content-Type is JSON | Valid update | content-type: application/json |
| 14 | Dynamic ID from list | Fetch ID from /admin/featured-coupons/list then update | 200 - Updated successfully |
| 15 | Concurrent updates | 3 simultaneous updates on different items | All return 200 |
