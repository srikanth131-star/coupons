# Admin - Update Store API - Test Cases

**Endpoint:** `PUT /api/admin/stores/update/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## URL Parameters
| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| id        | String | Yes      | MongoDB ObjectId of store |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update storeName | `PUT /update/<id>` `{ storeName: "New Name" }` | 200 - Updated store |
| 2 | Update slug | `PUT /update/<id>` `{ slug: "new-slug" }` | 200 - Updated store |
| 3 | Update logo | `PUT /update/<id>` `{ logo: "https://new-logo.png" }` | 200 - Updated store |
| 4 | Update description | `PUT /update/<id>` `{ description: "New desc" }` | 200 - Updated store |
| 5 | Update all fields | Full object with all fields | 200 - All fields updated |
| 6 | Non-existent ID | `PUT /update/000000000000000000000000` | 404 - Store not found |
| 7 | Invalid ObjectId | `PUT /update/invalid-id` | 400 or 500 |
| 8 | Empty body | `PUT /update/<id>` `{}` | 200 - No changes made |
| 9 | Duplicate slug | Update to existing slug of another store | 400 - Duplicate key error |
| 10 | Null storeName | `{ storeName: null }` | 400 or 200 based on null handling |
| 11 | Very long description | description with 1000 chars | 200 or 400 |
| 12 | Response returns updated store | Valid update | 200 - body has new values |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Content-Type is JSON | Valid update | content-type: application/json |
| 15 | Dynamic ID from list | Fetch ID from /admin/stores/list then update | 200 - Updated successfully |
