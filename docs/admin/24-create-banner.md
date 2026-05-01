# Admin - Create Banner API - Test Cases

**Endpoint:** `POST /api/admin/banner/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field       | Type    | Required | Description              |
|-------------|---------|----------|--------------------------|
| title       | String  | Yes      | Banner title             |
| subtitle    | String  | No       | Banner subtitle          |
| image       | String  | No       | Image URL                |
| buttonText  | String  | No       | Button label             |
| buttonLink  | String  | No       | Button URL               |
| isActive    | Boolean | No       | Default true             |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid banner creation | `{ title: "Sale Banner" }` | 201 - Created banner |
| 2 | Missing title | `{ subtitle: "test" }` | 400 - Validation error |
| 3 | All fields provided | Full object | 201 - Created with all fields |
| 4 | isActive false | `{ title: "Test", isActive: false }` | 201 - Created as inactive |
| 5 | Empty title | `{ title: "" }` | 400 - Validation error |
| 6 | Null title | `{ title: null }` | 400 - Validation error |
| 7 | Very long title (500 chars) | title with 500 chars | 201 or 400 |
| 8 | Special characters in title | `{ title: "Sale @#$% Off!" }` | 201 - Characters preserved |
| 9 | Unicode in title | `{ title: "सेल बैनर" }` | 201 - Unicode preserved |
| 10 | Invalid image URL format | `{ title: "Test", image: "not-a-url" }` | 201 (no URL validation) or 400 |
| 11 | Numeric title | `{ title: 12345 }` | 201 or 400 - Type coercion |
| 12 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 13 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
| 14 | Response has _id | Valid creation | 201 - body has _id |
| 15 | Concurrent creation (3x) | 3 simultaneous creates | All return 201 |
