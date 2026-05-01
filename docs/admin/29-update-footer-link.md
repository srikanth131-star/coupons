# Admin - Update Footer Link API - Test Cases

**Endpoint:** `PUT /api/admin/footer/links/update/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update label | `PUT /update/<id>` `{ label: "New Label" }` | 200 - Updated link |
| 2 | Update href | `PUT /update/<id>` `{ href: "/new-path" }` | 200 - Updated link |
| 3 | Update section | `PUT /update/<id>` `{ section: "bottom" }` | 200 - Updated link |
| 4 | Update order | `PUT /update/<id>` `{ order: 5 }` | 200 - Updated link |
| 5 | Update isActive to false | `PUT /update/<id>` `{ isActive: false }` | 200 - Deactivated |
| 6 | Non-existent ID | `PUT /update/000000000000000000000000` | 404 - Not found |
| 7 | Invalid ObjectId | `PUT /update/invalid-id` | 400 or 500 |
| 8 | Empty body | `PUT /update/<id>` `{}` | 200 - No changes |
| 9 | Invalid section enum | `{ section: "sidebar" }` | 400 - Enum error |
| 10 | Update all fields | Full object | 200 - All fields updated |
| 11 | Response returns updated link | Valid update | 200 - body has new values |
| 12 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 13 | Content-Type is JSON | Valid update | content-type: application/json |
| 14 | Dynamic ID from list | Fetch ID from /admin/footer/links/list then update | 200 - Updated successfully |
| 15 | Concurrent updates | 3 simultaneous updates | All return 200 |
