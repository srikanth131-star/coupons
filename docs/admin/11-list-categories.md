# Admin - List Categories API - Test Cases

**Endpoint:** `GET /api/admin/categories/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all categories | `GET /api/admin/categories/list` | 200 - Array of categories |
| 2 | Response is array | `GET /api/admin/categories/list` | 200 - body is array |
| 3 | Each category has name | `GET /api/admin/categories/list` | 200 - All items have name |
| 4 | Each category has slug | `GET /api/admin/categories/list` | 200 - All items have slug |
| 5 | Each category has _id | `GET /api/admin/categories/list` | 200 - All items have _id |
| 6 | slug is lowercase | `GET /api/admin/categories/list` | 200 - All slugs lowercase |
| 7 | Each category has color | `GET /api/admin/categories/list` | 200 - All items have color |
| 8 | Response time under 2 seconds | `GET /api/admin/categories/list` | 200 within 2000ms |
| 9 | Concurrent requests (5x) | 5x `GET /api/admin/categories/list` | All return 200 |
| 10 | Consistent data across requests | Two sequential requests | Same length both times |
| 11 | Content-Type is JSON | `GET /api/admin/categories/list` | content-type: application/json |
| 12 | Empty list when no categories | `GET /api/admin/categories/list` | 200 - Empty array |
| 13 | Each category has createdAt | `GET /api/admin/categories/list` | 200 - All items have createdAt |
| 14 | navLocation is valid enum | `GET /api/admin/categories/list` | 200 - navbar/footer/both/no |
| 15 | No query params needed | `GET /api/admin/categories/list` | 200 - Works without params |
