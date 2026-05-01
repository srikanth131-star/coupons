# Admin - Export Coupons API - Test Cases

**Endpoint:** `GET /api/admin/data/export/coupons`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Response Format
```json
{ "message": "...", "exportUrl": "/downloads/coupons_export_<timestamp>.csv", "timestamp": "" }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Export coupons | `GET /api/admin/data/export/coupons` | 200 - Export response |
| 2 | Response has message | `GET /api/admin/data/export/coupons` | 200 - Has message |
| 3 | Response has exportUrl | `GET /api/admin/data/export/coupons` | 200 - Has exportUrl |
| 4 | Response has timestamp | `GET /api/admin/data/export/coupons` | 200 - Has timestamp |
| 5 | exportUrl contains .csv | `GET /api/admin/data/export/coupons` | 200 - exportUrl ends with .csv |
| 6 | Response is object | `GET /api/admin/data/export/coupons` | 200 - body is object |
| 7 | Content-Type is JSON | `GET /api/admin/data/export/coupons` | content-type: application/json |
| 8 | Response time under 2 seconds | `GET /api/admin/data/export/coupons` | 200 within 2000ms |
| 9 | Concurrent requests (3x) | 3x same request | All return 200 |
| 10 | Each export has unique URL | Two sequential requests | Different exportUrl timestamps |
| 11 | exportUrl is a string | `GET /api/admin/data/export/coupons` | 200 - typeof string |
| 12 | No query params needed | `GET /api/admin/data/export/coupons` | 200 - Works without params |
| 13 | POST method not allowed | `POST /api/admin/data/export/coupons` | 404 - Method not found |
| 14 | Consistent response structure | Two sequential requests | Same keys both times |
| 15 | timestamp is valid ISO string | `GET /api/admin/data/export/coupons` | 200 - Valid date string |
