# Admin - Update Site Config API - Test Cases

**Endpoint:** `PUT /api/admin/pages/site-config/update`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Update siteName | `{ siteName: "NewSite" }` | 200 - Updated config |
| 2 | Update seo metaTitle | `{ seo: { metaTitle: "New Title" } }` | 200 - Updated config |
| 3 | Update theme primaryColor | `{ theme: { primaryColor: "#ff0000" } }` | 200 - Updated config |
| 4 | Update socialMedia | `{ socialMedia: { facebook: { url: "https://fb.com/new" } } }` | 200 - Updated config |
| 5 | Update logos | `{ logos: { navbar: "/new-logo.png" } }` | 200 - Updated config |
| 6 | Update footer config | `{ footer: { copyright: "© 2027" } }` | 200 - Updated config |
| 7 | Empty body | `{}` | 200 - No changes |
| 8 | Null siteName | `{ siteName: null }` | 200 or 400 |
| 9 | Very long siteName | siteName with 500 chars | 200 or 400 |
| 10 | Invalid color format | `{ theme: { primaryColor: "notacolor" } }` | 200 (no validation) or 400 |
| 11 | Update all fields | Full config object | 200 - All fields updated |
| 12 | Response returns updated config | Valid update | 200 - body has new values |
| 13 | Wrong Content-Type | Send as text/plain | 400 or 500 |
| 14 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 15 | Content-Type is JSON | Valid update | content-type: application/json |
