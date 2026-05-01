# Admin - Get Store Details API - Test Cases

**Endpoint:** `GET /api/admin/stores/details/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of store |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get store by valid ID | `GET /api/admin/stores/details/<validId>` | 200 - Store object |
| 2 | Non-existent ID | `GET /api/admin/stores/details/000000000000000000000000` | 404 - `{ error: "Store not found" }` |
| 3 | Invalid ObjectId format | `GET /api/admin/stores/details/invalid-id` | 400 or 500 |
| 4 | Response has storeName | `GET /api/admin/stores/details/<validId>` | 200 - Has storeName |
| 5 | Response has slug | `GET /api/admin/stores/details/<validId>` | 200 - Has slug |
| 6 | Response has _id | `GET /api/admin/stores/details/<validId>` | 200 - Has _id |
| 7 | Response has logo | `GET /api/admin/stores/details/<validId>` | 200 - Has logo |
| 8 | Response has createdAt | `GET /api/admin/stores/details/<validId>` | 200 - Has createdAt |
| 9 | Response is object | `GET /api/admin/stores/details/<validId>` | 200 - body is object |
| 10 | Content-Type is JSON | `GET /api/admin/stores/details/<validId>` | content-type: application/json |
| 11 | Response time under 2 seconds | `GET /api/admin/stores/details/<validId>` | 200 within 2000ms |
| 12 | Dynamic ID from list | Fetch ID from /admin/stores/list then use it | 200 - Matching store |
| 13 | Empty ID | `GET /api/admin/stores/details/` | 404 - Route not matched |
| 14 | Data consistency | Two sequential requests | Same storeName, slug |
| 15 | Concurrent requests (5x) | 5x same request | All return 200 |
