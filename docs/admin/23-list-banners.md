# Admin - List Banners API - Test Cases

**Endpoint:** `GET /api/admin/banner/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "success": true, "data": [], "total": 0 }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all banners | `GET /api/admin/banner/list` | 200 - `{ success, data, total }` |
| 2 | Response has success field | `GET /api/admin/banner/list` | 200 - success is true |
| 3 | Response has data array | `GET /api/admin/banner/list` | 200 - data is array |
| 4 | Response has total field | `GET /api/admin/banner/list` | 200 - total is number |
| 5 | Each banner has title | `GET /api/admin/banner/list` | 200 - All items have title |
| 6 | Each banner has isActive | `GET /api/admin/banner/list` | 200 - All items have isActive |
| 7 | Each banner has _id | `GET /api/admin/banner/list` | 200 - All items have _id |
| 8 | total matches data length | `GET /api/admin/banner/list` | 200 - total === data.length |
| 9 | Response time under 2 seconds | `GET /api/admin/banner/list` | 200 within 2000ms |
| 10 | Concurrent requests (5x) | 5x `GET /api/admin/banner/list` | All return 200 |
| 11 | Consistent data across requests | Two sequential requests | Same total both times |
| 12 | Content-Type is JSON | `GET /api/admin/banner/list` | content-type: application/json |
| 13 | Empty list when no banners | `GET /api/admin/banner/list` | 200 - data is empty array |
| 14 | Each banner has createdAt | `GET /api/admin/banner/list` | 200 - All items have createdAt |
| 15 | No query params needed | `GET /api/admin/banner/list` | 200 - Works without params |
