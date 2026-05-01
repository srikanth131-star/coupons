# Admin - Delete Store API - Test Cases

**Endpoint:** `DELETE /api/admin/stores/delete/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of store |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Delete existing store | `DELETE /api/admin/stores/delete/<validId>` | 200 - `{ message: "Store deleted" }` |
| 2 | Non-existent ID | `DELETE /api/admin/stores/delete/000000000000000000000000` | 404 - Store not found |
| 3 | Invalid ObjectId | `DELETE /api/admin/stores/delete/invalid-id` | 400 or 500 |
| 4 | Response has message | Valid delete | 200 - Has message field |
| 5 | Store no longer in list after delete | Delete then GET /list | 200 - Deleted store not in list |
| 6 | Delete same store twice | Delete twice | First: 200, Second: 404 |
| 7 | Empty ID | `DELETE /api/admin/stores/delete/` | 404 - Route not matched |
| 8 | Content-Type is JSON | Valid delete | content-type: application/json |
| 9 | Response time under 3 seconds | Valid delete | 200 within 3000ms |
| 10 | Dynamic ID from list | Fetch ID from /admin/stores/list then delete | 200 - Deleted successfully |
| 11 | GET method not allowed | `GET /api/admin/stores/delete/<id>` | 404 - Method not found |
| 12 | Response is object | Valid delete | 200 - body is object |
| 13 | Concurrent deletes on different stores | 3 simultaneous deletes | All return 200 |
| 14 | Delete store with associated coupons | Delete store that has coupons | 200 - Store deleted (coupons may remain) |
| 15 | No request body needed | DELETE with no body | 200 - Works without body |
