# Search Coupons API - Test Cases

**Endpoint:** `GET /api/public/coupons/search`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Query Parameters
| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| query     | String | Yes      | Search keyword     |

## Response Format
```json
{ "coupons": [] }
```

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Search with valid keyword | `GET /api/public/coupons/search?query=amazon` | 200 - `{ coupons: [...] }` |
| 2 | Search with no results | `GET /api/public/coupons/search?query=xyznotfound` | 200 - `{ coupons: [] }` |
| 3 | Missing query param | `GET /api/public/coupons/search` | 200 or 400 |
| 4 | Empty query string | `GET /api/public/coupons/search?query=` | 200 or 400 |
| 5 | Response has coupons array | `GET /api/public/coupons/search?query=amazon` | 200 - body.coupons is array |
| 6 | Search is case-insensitive | `GET /api/public/coupons/search?query=AMAZON` | 200 - Same results as lowercase |
| 7 | Partial keyword match | `GET /api/public/coupons/search?query=ama` | 200 - Partial matches returned |
| 8 | Special characters in query | `GET /api/public/coupons/search?query=@#$%` | 200 - Empty or sanitized results |
| 9 | Numeric query | `GET /api/public/coupons/search?query=123` | 200 - `{ coupons: [] }` or matches |
| 10 | Very long query string | `GET /api/public/coupons/search?query=aaaa...` (500 chars) | 200 or 400 |
| 11 | Unicode characters | `GET /api/public/coupons/search?query=अमेज़न` | 200 - Results or empty |
| 12 | Content-Type is JSON | `GET /api/public/coupons/search?query=test` | content-type: application/json |
| 13 | Response time under 2 seconds | `GET /api/public/coupons/search?query=test` | 200 within 2000ms |
| 14 | Note: uses `query` not `q` | `GET /api/public/coupons/search?q=amazon` | 200 - Empty (wrong param) |
| 15 | Concurrent searches | 5x `GET /api/public/coupons/search?query=amazon` | All return 200 |
