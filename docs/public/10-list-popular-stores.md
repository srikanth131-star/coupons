# List Popular Stores API - Test Cases

**Endpoint:** `GET /api/public/popular-stores/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Response Format
```json
{ "success": true, "data": [], "total": 0 }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all popular stores | `GET /api/public/popular-stores/list` | 200 - `{ success, data, total }` |
| 2 | Response has success field | `GET /api/public/popular-stores/list` | 200 - success is true |
| 3 | Response has data array | `GET /api/public/popular-stores/list` | 200 - data is array |
| 4 | Response has total field | `GET /api/public/popular-stores/list` | 200 - total is number |
| 5 | Each store has name | `GET /api/public/popular-stores/list` | 200 - All items have name |
| 6 | Each store has slug | `GET /api/public/popular-stores/list` | 200 - All items have slug |
| 7 | Each store has logo | `GET /api/public/popular-stores/list` | 200 - All items have logo |
| 8 | total matches data length | `GET /api/public/popular-stores/list` | 200 - total === data.length |
| 9 | Empty list when no stores | `GET /api/public/popular-stores/list` | 200 - data is empty array |
| 10 | Content-Type is JSON | `GET /api/public/popular-stores/list` | content-type: application/json |
| 11 | Response time under 2 seconds | `GET /api/public/popular-stores/list` | 200 within 2000ms |
| 12 | Concurrent requests (5x) | 5x `GET /api/public/popular-stores/list` | All return 200 |
| 13 | Consistent data across requests | Two sequential requests | Same total both times |
| 14 | No sensitive fields | `GET /api/public/popular-stores/list` | No adminNotes, internalId |
| 15 | isPopular field is true | `GET /api/public/popular-stores/list` | 200 - isPopular is true on items |
