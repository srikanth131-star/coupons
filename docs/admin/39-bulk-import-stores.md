# Admin - Bulk Import Stores API - Test Cases

**Endpoint:** `POST /api/admin/data/bulk-import/stores`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
Array of store objects. Each must have `name` and `slug`.

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid bulk import | `[{ name, slug }, ...]` | 200 - jobId and status |
| 2 | Empty array | `[]` | 400 - Body cannot be empty |
| 3 | Missing name in one item | `[{ slug: "test" }]` | 400 - Validation error |
| 4 | Missing slug in one item | `[{ name: "Test" }]` | 400 - Validation error |
| 5 | Not an array (object) | `{ name, slug }` | 400 - Data must be array |
| 6 | Not an array (string) | `"invalid"` | 400 - Data must be array |
| 7 | Wrong Content-Type | Send as text/plain | 415 - Content-Type must be application/json |
| 8 | Single valid item | `[{ name: "Test", slug: "test" }]` | 200 - Import initiated |
| 9 | Large batch (50 items) | Array of 50 stores | 200 - Import initiated |
| 10 | Response has jobId | Valid import | 200 - Has jobId |
| 11 | Response has status | Valid import | 200 - status is processing |
| 12 | Response has message | Valid import | 200 - Has message |
| 13 | Response time under 3 seconds | Valid import | 200 within 3000ms |
| 14 | Null body | null | 400 - Validation error |
| 15 | Mixed valid and invalid items | One valid, one missing slug | 400 - Validation error |
