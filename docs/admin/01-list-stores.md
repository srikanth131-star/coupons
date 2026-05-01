# Admin - List Stores API - Test Cases

**Endpoint:** `GET /api/admin/stores/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all stores | `GET /api/admin/stores/list` | 200 - Array of stores |
| 2 | Response is array | `GET /api/admin/stores/list` | 200 - body is array |
| 3 | Each store has storeName | `GET /api/admin/stores/list` | 200 - All items have storeName |
| 4 | Each store has slug | `GET /api/admin/stores/list` | 200 - All items have slug |
| 5 | Each store has _id | `GET /api/admin/stores/list` | 200 - All items have _id |
| 6 | Response time under 2 seconds | `GET /api/admin/stores/list` | 200 within 2000ms |
| 7 | Concurrent requests (5x) | 5x `GET /api/admin/stores/list` | All return 200 |
| 8 | Consistent data across requests | Two sequential requests | Same length both times |
| 9 | Content-Type is JSON | `GET /api/admin/stores/list` | content-type: application/json |
| 10 | Returns all stores including inactive | `GET /api/admin/stores/list` | 200 - All stores regardless of status |
| 11 | Each store has createdAt | `GET /api/admin/stores/list` | 200 - All items have createdAt |
| 12 | Each store has updatedAt | `GET /api/admin/stores/list` | 200 - All items have updatedAt |
| 13 | Empty list when no stores | `GET /api/admin/stores/list` | 200 - Empty array |
| 14 | logo field present | `GET /api/admin/stores/list` | 200 - Has logo property |
| 15 | No query params needed | `GET /api/admin/stores/list` | 200 - Works without params |
