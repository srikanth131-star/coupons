# Admin - Update Coupon API - Test Cases

**Endpoint:** `PUT /api/admin/coupons/update/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update title | `PUT /update/<id>` `{ title: "New Title" }` | 200 - Updated coupon |
| 2 | Update code | `PUT /update/<id>` `{ code: "NEWCODE" }` | 200 - Updated coupon |
| 3 | Update discount | `PUT /update/<id>` `{ discount: "30%" }` | 200 - Updated coupon |
| 4 | Update isActive to false | `PUT /update/<id>` `{ isActive: false }` | 200 - Coupon deactivated |
| 5 | Update isFeatured to true | `PUT /update/<id>` `{ isFeatured: true }` | 200 - Coupon featured |
| 6 | Update expiryDate | `PUT /update/<id>` `{ expiryDate: "2027-01-01" }` | 200 - Date updated |
| 7 | Non-existent ID | `PUT /update/000000000000000000000000` | 404 - Not found |
| 8 | Invalid ObjectId | `PUT /update/invalid-id` | 400 or 500 |
| 9 | Empty body | `PUT /update/<id>` `{}` | 200 - No changes |
| 10 | Duplicate code | Update to existing code of another coupon | 400 - Duplicate key |
| 11 | Update all fields | Full object | 200 - All fields updated |
| 12 | Response returns updated coupon | Valid update | 200 - body has new values |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Content-Type is JSON | Valid update | content-type: application/json |
| 15 | Dynamic ID from list | Fetch ID from /admin/coupons/list then update | 200 - Updated successfully |
