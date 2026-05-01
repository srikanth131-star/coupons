# Admin - Update Navigation API - Test Cases

**Endpoint:** `PUT /api/admin/navbar/navigation/update`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Request Body
| Field            | Type   | Description                        |
|------------------|--------|------------------------------------|
| menu             | Array  | Array of `{ name, url }` objects   |
| theme            | Object | `{ backgroundColor, textColor }`   |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Update menu items | `{ menu: [{ name: "Home", url: "/" }] }` | 200 - Updated navigation |
| 2 | Update theme colors | `{ theme: { backgroundColor: "#000", textColor: "#fff" } }` | 200 - Updated navigation |
| 3 | Add new menu item | Existing menu + new item | 200 - Menu has new item |
| 4 | Remove all menu items | `{ menu: [] }` | 200 - Empty menu |
| 5 | Menu item missing name | `{ menu: [{ url: "/" }] }` | 400 - Validation error |
| 6 | Menu item missing url | `{ menu: [{ name: "Home" }] }` | 400 - Validation error |
| 7 | Empty body | `{}` | 200 - No changes |
| 8 | Invalid menu format (not array) | `{ menu: "Home" }` | 400 or 500 |
| 9 | Very long menu (50 items) | menu with 50 items | 200 or 400 |
| 10 | Special characters in menu name | `{ menu: [{ name: "Home@#$", url: "/" }] }` | 200 - Characters preserved |
| 11 | Unicode in menu name | `{ menu: [{ name: "होम", url: "/" }] }` | 200 - Unicode preserved |
| 12 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Response returns updated navigation | Valid update | 200 - body has new menu |
| 15 | Content-Type is JSON | Valid update | content-type: application/json |
