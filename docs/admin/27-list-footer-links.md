# Admin - List Footer Links API - Test Cases

**Endpoint:** `GET /api/admin/footer/links/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "success": true, "data": { "main": [], "myRmn": [], "bottom": [] }, "allLinks": [] }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all footer links | `GET /api/admin/footer/links/list` | 200 - `{ success, data, allLinks }` |
| 2 | Response has success field | `GET /api/admin/footer/links/list` | 200 - success is true |
| 3 | Response has data object | `GET /api/admin/footer/links/list` | 200 - data is object |
| 4 | data has main array | `GET /api/admin/footer/links/list` | 200 - data.main is array |
| 5 | data has myRmn array | `GET /api/admin/footer/links/list` | 200 - data.myRmn is array |
| 6 | data has bottom array | `GET /api/admin/footer/links/list` | 200 - data.bottom is array |
| 7 | Response has allLinks array | `GET /api/admin/footer/links/list` | 200 - allLinks is array |
| 8 | Each link has label | `GET /api/admin/footer/links/list` | 200 - All links have label |
| 9 | Each link has href | `GET /api/admin/footer/links/list` | 200 - All links have href |
| 10 | Each link has section | `GET /api/admin/footer/links/list` | 200 - section is main/myRmn/bottom |
| 11 | Content-Type is JSON | `GET /api/admin/footer/links/list` | content-type: application/json |
| 12 | Response time under 2 seconds | `GET /api/admin/footer/links/list` | 200 within 2000ms |
| 13 | Concurrent requests (5x) | 5x `GET /api/admin/footer/links/list` | All return 200 |
| 14 | Consistent data across requests | Two sequential requests | Same allLinks length |
| 15 | Each link has _id | `GET /api/admin/footer/links/list` | 200 - All links have _id |
