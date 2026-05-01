# Admin - Create Category API - Test Cases

**Endpoint:** `POST /api/admin/categories/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field           | Type    | Required | Description                          |
|-----------------|---------|----------|--------------------------------------|
| name            | String  | Yes      | Category name (max 100 chars)        |
| slug            | String  | Yes      | Unique slug (lowercase, a-z, 0-9, -) |
| color           | String  | No       | Hex color (default #007bff)          |
| icon            | String  | No       | Icon name                            |
| description     | String  | No       | Category description                 |
| hasNavLink      | Boolean | No       | Default false                        |
| navLocation     | String  | No       | navbar/footer/both/no                |
| dropdownSection | String  | No       | categories/popular                   |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid category creation | `{ name: "Electronics", slug: "electronics" }` | 201 - Created category |
| 2 | Missing name | `{ slug: "test" }` | 400 - Validation error |
| 3 | Missing slug | `{ name: "Test" }` | 400 - Validation error |
| 4 | Duplicate slug | Same slug twice | First: 201, Second: 400 |
| 5 | Slug with uppercase | `{ slug: "Electronics" }` | 201 - Slug auto-lowercased |
| 6 | Slug with special chars | `{ slug: "test@#$" }` | 400 - Invalid slug format |
| 7 | Slug with spaces | `{ slug: "my category" }` | 400 - Invalid slug format |
| 8 | Valid slug with hyphens | `{ slug: "my-category" }` | 201 - Created successfully |
| 9 | name exceeds 100 chars | name with 101 chars | 400 - maxlength error |
| 10 | Invalid navLocation enum | `{ navLocation: "sidebar" }` | 400 - Enum validation error |
| 11 | Valid navLocation | `{ navLocation: "navbar" }` | 201 - Created successfully |
| 12 | All fields provided | Full object | 201 - Created with all fields |
| 13 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 14 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
| 15 | Null name | `{ name: null, slug: "test2" }` | 400 - Validation error |
