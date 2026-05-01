# Admin - Create Store API - Test Cases

**Endpoint:** `POST /api/admin/stores/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field       | Type   | Required | Description              |
|-------------|--------|----------|--------------------------|
| storeName   | String | Yes      | Name of the store        |
| slug        | String | Yes      | Unique URL slug          |
| logo        | String | No       | Logo URL                 |
| websiteUrl  | String | No       | Store website URL        |
| description | String | No       | Store description        |
| category    | String | No       | Store category           |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid store creation | `{ storeName, slug, logo, description }` | 201 - Created store object |
| 2 | Missing storeName | `{ slug: "test" }` | 400 - Validation error |
| 3 | Missing slug | `{ storeName: "Test" }` | 400 - Validation error |
| 4 | Duplicate slug | Same slug twice | First: 201, Second: 400 - Duplicate key |
| 5 | Minimum required fields only | `{ storeName: "X", slug: "x" }` | 201 - Created successfully |
| 6 | All fields provided | Full object with all fields | 201 - Created with all fields |
| 7 | Empty storeName | `{ storeName: "", slug: "test2" }` | 400 - Validation error |
| 8 | Empty slug | `{ storeName: "Test", slug: "" }` | 400 - Validation error |
| 9 | Special characters in storeName | `{ storeName: "Test@#$", slug: "test3" }` | 201 - Characters preserved |
| 10 | Very long storeName (500 chars) | storeName with 500 chars | 201 or 400 based on limits |
| 11 | Numeric storeName | `{ storeName: 12345, slug: "test4" }` | 201 or 400 - Type coercion |
| 12 | Null values | `{ storeName: null, slug: "test5" }` | 400 - Validation error |
| 13 | Wrong Content-Type (text/plain) | Same body as text | 400 or 500 - Parse error |
| 14 | Response time under 3 seconds | Valid creation request | 201 within 3000ms |
| 15 | Concurrent creation (3x different slugs) | 3 simultaneous creates | All return 201 |
