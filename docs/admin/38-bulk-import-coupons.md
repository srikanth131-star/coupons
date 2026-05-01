# Admin - Bulk Import Coupons API - Test Cases

**Endpoint:** `POST /api/admin/data/bulk-import/coupons`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
Array of coupon objects. Each must have `title`, `code`, `store`.

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid bulk import | `[{ title, code, store }, ...]` | 200 - jobId and status |
| 2 | Empty array | `[]` | 400 - Body cannot be empty |
| 3 | Missing title in one item | `[{ code, store }]` | 400 - Validation error |
| 4 | Missing code in one item | `[{ title, store }]` | 400 - Validation error |
| 5 | Missing store in one item | `[{ title, code }]` | 400 - Validation error |
| 6 | Not an array (object) | `{ title, code, store }` | 400 - Data must be array |
| 7 | Not an array (string) | `"invalid"` | 400 - Data must be array |
| 8 | Wrong Content-Type | Send as text/plain | 415 - Content-Type must be application/json |
| 9 | Single valid item | `[{ title, code, store }]` | 200 - Import initiated |
| 10 | Large batch (100 items) | Array of 100 coupons | 200 - Import initiated |
| 11 | Response has jobId | Valid import | 200 - Has jobId |
| 12 | Response has status | Valid import | 200 - status is processing |
| 13 | Response has message | Valid import | 200 - Has message |
| 14 | Response time under 3 seconds | Valid import | 200 within 3000ms |
| 15 | Null body | null | 400 - Validation error |
