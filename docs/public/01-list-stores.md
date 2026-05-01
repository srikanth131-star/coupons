# List Stores API - Test Cases

**Endpoint:** `GET /api/public/stores/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Query Parameters
| Parameter | Type   | Description                        |
|-----------|--------|------------------------------------|
| page      | Number | Page number (e.g. 1)               |
| limit     | Number | Items per page (e.g. 3)            |
| search    | String | Search by store name               |
| category  | String | Filter by category                 |
| sortBy    | String | Field to sort by (e.g. clickCount) |
| order     | String | asc or desc                        |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all stores successfully | `GET /api/public/stores/list` | 200 - Array of stores |
| 2 | Pagination - page 1 with limit 3 | `GET /api/public/stores/list?page=1&limit=3` | 200 - Array with at most 3 items |
| 3 | Pagination - page 2 with limit 2 | `GET /api/public/stores/list?page=2&limit=2` | 200 - Array with at most 2 items |
| 4 | Search by store name | `GET /api/public/stores/list?search=Amazon` | 200 - Filtered array |
| 5 | Filter by category | `GET /api/public/stores/list?category=Shopping` | 200 - Filtered array |
| 6 | Sort by clickCount descending | `GET /api/public/stores/list?sortBy=clickCount&order=desc` | 200 - Sorted array |
| 7 | Invalid pagination (page=-1, limit=0) | `GET /api/public/stores/list?page=-1&limit=0` | 200 or 400 |
| 8 | Search with no matching results | `GET /api/public/stores/list?search=nonexistentxyz` | 200 - Empty array |
| 9 | Each store has slug and storeName | `GET /api/public/stores/list` | 200 - All items have slug, storeName |
| 10 | No sensitive fields exposed | `GET /api/public/stores/list` | 200 - No adminNotes, internalId |
| 11 | Response is an array | `GET /api/public/stores/list` | 200 - body is array |
| 12 | Response time under 2 seconds | `GET /api/public/stores/list` | 200 within 2000ms |
| 13 | Concurrent requests (5x) | 5x `GET /api/public/stores/list` | All return 200 |
| 14 | Consistent data across requests | Two sequential requests | Both return same length |
| 15 | Empty search string | `GET /api/public/stores/list?search=` | 200 - All stores returned |
