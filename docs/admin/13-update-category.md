# Admin - Update Category API - Test Cases

**Endpoint:** `PUT /api/admin/categories/update/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update name | `PUT /update/<id>` `{ name: "New Name" }` | 200 - Updated category |
| 2 | Update color | `PUT /update/<id>` `{ color: "#ff0000" }` | 200 - Updated category |
| 3 | Update description | `PUT /update/<id>` `{ description: "New desc" }` | 200 - Updated category |
| 4 | Update hasNavLink | `PUT /update/<id>` `{ hasNavLink: true }` | 200 - Updated category |
| 5 | Update navLocation | `PUT /update/<id>` `{ navLocation: "footer" }` | 200 - Updated category |
| 6 | Non-existent ID | `PUT /update/000000000000000000000000` | 404 - Not found |
| 7 | Invalid ObjectId | `PUT /update/invalid-id` | 400 or 500 |
| 8 | Empty body | `PUT /update/<id>` `{}` | 200 - No changes |
| 9 | Duplicate slug | Update to existing slug | 400 - Duplicate key |
| 10 | Invalid navLocation enum | `{ navLocation: "sidebar" }` | 400 - Enum error |
| 11 | Update all fields | Full object | 200 - All fields updated |
| 12 | Response returns updated category | Valid update | 200 - body has new values |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Content-Type is JSON | Valid update | content-type: application/json |
| 15 | Dynamic ID from list | Fetch ID from /admin/categories/list then update | 200 - Updated successfully |
