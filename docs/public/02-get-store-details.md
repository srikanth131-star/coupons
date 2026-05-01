# Get Store Details API - Test Cases

**Endpoint:** `GET /api/public/stores/details/:slug`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## URL Parameters
| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| slug      | String | Yes      | Store slug (e.g. amazon) |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Get store by valid slug | `GET /api/public/stores/details/amazon` | 200 - Store object with slug, storeName |
| 2 | Non-existent slug | `GET /api/public/stores/details/non-existent-xyz` | 404 - `{ error: "Store not found" }` |
| 3 | Uppercase slug | `GET /api/public/stores/details/AMAZON` | 404 - Case sensitive match fails |
| 4 | Store has all public fields | `GET /api/public/stores/details/amazon` | 200 - Has _id, slug, storeName, logo |
| 5 | No sensitive fields exposed | `GET /api/public/stores/details/amazon` | 200 - No adminNotes, internalId |
| 6 | Response is an object | `GET /api/public/stores/details/amazon` | 200 - body is object |
| 7 | Content-Type is JSON | `GET /api/public/stores/details/amazon` | 200 - content-type: application/json |
| 8 | Logo field present | `GET /api/public/stores/details/amazon` | 200 - Has logo property |
| 9 | Response time under 2 seconds | `GET /api/public/stores/details/amazon` | 200 within 2000ms |
| 10 | Concurrent requests (5x) | 5x `GET /api/public/stores/details/amazon` | All return 200 with same slug |
| 11 | Data consistency across requests | Two sequential requests | Both return same storeName, slug |
| 12 | Slug with hyphen | `GET /api/public/stores/details/my-store` | 200 or 404 depending on DB |
| 13 | Empty slug | `GET /api/public/stores/details/` | 404 - Route not matched |
| 14 | Numeric slug | `GET /api/public/stores/details/12345` | 404 - Store not found |
| 15 | Dynamic slug from list | Fetch slug from /stores/list then use it | 200 - Matching store returned |
