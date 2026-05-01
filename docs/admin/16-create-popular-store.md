# Admin - Create Popular Store API - Test Cases

**Endpoint:** `POST /api/admin/popular-stores/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field           | Type    | Required | Description                    |
|-----------------|---------|----------|--------------------------------|
| name            | String  | Yes      | Store name                     |
| slug            | String  | Yes      | Unique slug (lowercase, a-z, 0-9, -) |
| logo            | String  | Yes      | Logo URL                       |
| color           | String  | No       | Hex color (default #007bff)    |
| description     | String  | No       | Description                    |
| website         | String  | No       | Website URL                    |
| priority        | Number  | No       | Display priority (default 1)   |
| featured        | Boolean | No       | Default false                  |
| isPopular       | Boolean | No       | Default true                   |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid creation with required fields | `{ name, slug, logo }` | 201 - Created store |
| 2 | Missing name | `{ slug, logo }` | 400 - Validation error |
| 3 | Missing slug | `{ name, logo }` | 400 - Validation error |
| 4 | Missing logo | `{ name, slug }` | 400 - Validation error |
| 5 | Duplicate slug | Same slug twice | First: 201, Second: 400 |
| 6 | Slug with uppercase | `{ slug: "MyStore" }` | 201 - Slug auto-lowercased |
| 7 | Slug with special chars | `{ slug: "my@store" }` | 400 - Invalid slug format |
| 8 | All fields provided | Full object | 201 - Created with all fields |
| 9 | Invalid priority type | `{ priority: "high" }` | 400 or 201 - Type coercion |
| 10 | Negative priority | `{ priority: -1 }` | 201 or 400 |
| 11 | Invalid navLocation enum | `{ navLocation: "sidebar" }` | 400 - Enum error |
| 12 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 13 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
| 14 | Null name | `{ name: null, slug: "test", logo: "url" }` | 400 - Validation error |
| 15 | Concurrent creation (3x) | 3 simultaneous creates | All return 201 |
