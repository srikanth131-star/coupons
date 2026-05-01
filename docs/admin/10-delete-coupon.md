# Admin - Delete Coupon API - Test Cases

**Endpoint:** `DELETE /api/admin/coupons/delete/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Delete existing coupon | `DELETE /api/admin/coupons/delete/<validId>` | 200 - Success message |
| 2 | Non-existent ID | `DELETE /api/admin/coupons/delete/000000000000000000000000` | 404 - Not found |
| 3 | Invalid ObjectId | `DELETE /api/admin/coupons/delete/invalid-id` | 400 or 500 |
| 4 | Coupon not in list after delete | Delete then GET /list | 200 - Deleted coupon not in list |
| 5 | Delete same coupon twice | Delete twice | First: 200, Second: 404 |
| 6 | Response has message | Valid delete | 200 - Has message field |
| 7 | Empty ID | `DELETE /api/admin/coupons/delete/` | 404 - Route not matched |
| 8 | Content-Type is JSON | Valid delete | content-type: application/json |
| 9 | Response time under 3 seconds | Valid delete | 200 within 3000ms |
| 10 | Dynamic ID from list | Fetch ID from /admin/coupons/list then delete | 200 - Deleted successfully |
| 11 | No request body needed | DELETE with no body | 200 - Works without body |
| 12 | Response is object | Valid delete | 200 - body is object |
| 13 | GET method not allowed | `GET /api/admin/coupons/delete/<id>` | 404 |
| 14 | Concurrent deletes on different coupons | 3 simultaneous deletes | All return 200 |
| 15 | Response time under 3 seconds | Valid delete | 200 within 3000ms |
