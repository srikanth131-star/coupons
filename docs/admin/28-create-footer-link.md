# Admin - Create Footer Link API - Test Cases

**Endpoint:** `POST /api/admin/footer/links/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field    | Type    | Required | Description                    |
|----------|---------|----------|--------------------------------|
| label    | String  | Yes      | Link display text              |
| href     | String  | Yes      | Link URL                       |
| section  | String  | Yes      | main / myRmn / bottom          |
| order    | Number  | No       | Display order (default 0)      |
| isActive | Boolean | No       | Default true                   |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid creation | `{ label: "Home", href: "/", section: "main" }` | 201 - Created link |
| 2 | Missing label | `{ href: "/", section: "main" }` | 400 - Validation error |
| 3 | Missing href | `{ label: "Home", section: "main" }` | 400 - Validation error |
| 4 | Missing section | `{ label: "Home", href: "/" }` | 400 - Validation error |
| 5 | Invalid section enum | `{ label: "Home", href: "/", section: "sidebar" }` | 400 - Enum error |
| 6 | Valid section main | `{ section: "main" }` | 201 - Created successfully |
| 7 | Valid section myRmn | `{ section: "myRmn" }` | 201 - Created successfully |
| 8 | Valid section bottom | `{ section: "bottom" }` | 201 - Created successfully |
| 9 | All fields provided | Full object | 201 - Created with all fields |
| 10 | isActive false | `{ ..., isActive: false }` | 201 - Created as inactive |
| 11 | Empty label | `{ label: "", href: "/", section: "main" }` | 400 - Validation error |
| 12 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 13 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
| 14 | Response has _id | Valid creation | 201 - body has _id |
| 15 | Concurrent creation (3x) | 3 simultaneous creates | All return 201 |
