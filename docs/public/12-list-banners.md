# List Banners API - Test Cases

**Endpoint:** `GET /api/public/site/banners`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Response Format
```json
{ "success": true, "data": [], "total": 0 }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all banners | `GET /api/public/site/banners` | 200 - `{ success, data, total }` |
| 2 | Response has success field | `GET /api/public/site/banners` | 200 - success is true |
| 3 | Response has data array | `GET /api/public/site/banners` | 200 - data is array |
| 4 | Response has total field | `GET /api/public/site/banners` | 200 - total is number |
| 5 | Each banner has title | `GET /api/public/site/banners` | 200 - All items have title |
| 6 | Each banner has image | `GET /api/public/site/banners` | 200 - All items have image |
| 7 | Each banner has isActive | `GET /api/public/site/banners` | 200 - All items have isActive |
| 8 | total matches data length | `GET /api/public/site/banners` | 200 - total === data.length |
| 9 | Empty list when no banners | `GET /api/public/site/banners` | 200 - data is empty array |
| 10 | Content-Type is JSON | `GET /api/public/site/banners` | content-type: application/json |
| 11 | Response time under 2 seconds | `GET /api/public/site/banners` | 200 within 2000ms |
| 12 | Concurrent requests (5x) | 5x `GET /api/public/site/banners` | All return 200 |
| 13 | Consistent data across requests | Two sequential requests | Same total both times |
| 14 | buttonText field present | `GET /api/public/site/banners` | 200 - Has buttonText |
| 15 | buttonLink field present | `GET /api/public/site/banners` | 200 - Has buttonLink |
