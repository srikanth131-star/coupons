# Admin - Update Popular Store API - Test Cases

**Endpoint:** `PUT /api/admin/popular-stores/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update name | `PUT /popular-stores/<id>` `{ name: "New Name" }` | 200 - Updated store |
| 2 | Update logo | `PUT /popular-stores/<id>` `{ logo: "https://new.png" }` | 200 - Updated store |
| 3 | Update priority | `PUT /popular-stores/<id>` `{ priority: 5 }` | 200 - Updated store |
| 4 | Update featured | `PUT /popular-stores/<id>` `{ featured: true }` | 200 - Updated store |
| 5 | Update color | `PUT /popular-stores/<id>` `{ color: "#ff0000" }` | 200 - Updated store |
| 6 | Non-existent ID | `PUT /popular-stores/000000000000000000000000` | 404 - Not found |
| 7 | Invalid ObjectId | `PUT /popular-stores/invalid-id` | 400 or 500 |
| 8 | Empty body | `PUT /popular-stores/<id>` `{}` | 200 - No changes |
| 9 | Duplicate slug | Update to existing slug | 400 - Duplicate key |
| 10 | Invalid navLocation enum | `{ navLocation: "sidebar" }` | 400 - Enum error |
| 11 | Update all fields | Full object | 200 - All fields updated |
| 12 | Response returns updated store | Valid update | 200 - body has new values |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Content-Type is JSON | Valid update | content-type: application/json |
| 15 | Dynamic ID from list | Fetch ID from /admin/popular-stores/list then update | 200 - Updated successfully |
