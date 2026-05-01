# Admin - Update Page API - Test Cases

**Endpoint:** `PUT /api/admin/pages/:pageName/update`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update page title | `PUT /pages/home/update` `{ title: "New Title" }` | 200 - Updated page |
| 2 | Update sections | `PUT /pages/home/update` `{ sections: [...] }` | 200 - Updated page |
| 3 | Add new section | Existing sections + new section | 200 - Page has new section |
| 4 | Remove all sections | `{ sections: [] }` | 200 - Empty sections |
| 5 | Non-existent page | `PUT /pages/nonexistent/update` | 404 - Page not found |
| 6 | Empty body | `PUT /pages/home/update` `{}` | 200 - No changes |
| 7 | Update slug | `{ slug: "new-home" }` | 200 - Slug updated |
| 8 | Section missing id | `{ sections: [{ type: "hero" }] }` | 400 - Validation error |
| 9 | Section missing type | `{ sections: [{ id: "s1", order: 1 }] }` | 400 - Validation error |
| 10 | Valid section with all fields | `{ sections: [{ id: "s1", order: 1, type: "hero" }] }` | 200 - Updated |
| 11 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 12 | Response returns updated page | Valid update | 200 - body has new values |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Content-Type is JSON | Valid update | content-type: application/json |
| 15 | Concurrent updates | 3 simultaneous updates | All return 200 |
