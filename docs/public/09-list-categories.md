# List Categories API - Test Cases

**Endpoint:** `GET /api/public/categories/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Response Format
Plain array of category objects.

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all categories | `GET /api/public/categories/list` | 200 - Array of categories |
| 2 | Response is array | `GET /api/public/categories/list` | 200 - body is array |
| 3 | Each category has name | `GET /api/public/categories/list` | 200 - All items have name |
| 4 | Each category has slug | `GET /api/public/categories/list` | 200 - All items have slug |
| 5 | Each category has _id | `GET /api/public/categories/list` | 200 - All items have _id |
| 6 | Empty list when no categories | `GET /api/public/categories/list` | 200 - Empty array |
| 7 | Content-Type is JSON | `GET /api/public/categories/list` | content-type: application/json |
| 8 | Response time under 2 seconds | `GET /api/public/categories/list` | 200 within 2000ms |
| 9 | Concurrent requests (5x) | 5x `GET /api/public/categories/list` | All return 200 |
| 10 | Consistent data across requests | Two sequential requests | Same length both times |
| 11 | No sensitive fields | `GET /api/public/categories/list` | No adminNotes, internalId |
| 12 | slug is lowercase | `GET /api/public/categories/list` | 200 - All slugs lowercase |
| 13 | color field present | `GET /api/public/categories/list` | 200 - Has color property |
| 14 | Response structure valid | `GET /api/public/categories/list` | 200 - Each item is object |
| 15 | No query params needed | `GET /api/public/categories/list` | 200 - Works without params |
