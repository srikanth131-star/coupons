# Admin - List Tags API - Test Cases

**Endpoint:** `GET /api/admin/tags/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Description
Returns all tags sorted alphabetically by name. Tags are used to label coupons with keywords like "Flash Sale", "New User", "Weekend Deal" etc. When admin creates/updates/deletes tags here, the coupon form's tag dropdown reflects the changes immediately.

## Response Format
Plain array of tag objects.

```json
[
  {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "name": "Flash Sale",
    "slug": "flash-sale",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Where This Data Is Used
- **Admin → Coupons page** (`/admin/coupons`): Tags dropdown in the coupon create/edit form fetches from this API
- **Admin → Tags page** (`/admin/tags`): Tag management table
- **Public coupon filtering**: `GET /api/public/coupons/list?tag=flash-sale` filters coupons by tag name

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all tags | `GET /api/admin/tags/list` | 200 - Array of tags |
| 2 | Response is array | `GET /api/admin/tags/list` | 200 - body is array |
| 3 | Each tag has name | `GET /api/admin/tags/list` | 200 - All items have name |
| 4 | Each tag has slug | `GET /api/admin/tags/list` | 200 - All items have slug |
| 5 | Each tag has _id | `GET /api/admin/tags/list` | 200 - All items have _id |
| 6 | slug is lowercase | `GET /api/admin/tags/list` | 200 - All slugs lowercase |
| 7 | Each tag has createdAt | `GET /api/admin/tags/list` | 200 - All items have createdAt |
| 8 | Response time under 2 seconds | `GET /api/admin/tags/list` | 200 within 2000ms |
| 9 | Concurrent requests (5x) | 5x `GET /api/admin/tags/list` | All return 200 |
| 10 | Consistent data across requests | Two sequential requests | Same length both times |
| 11 | Content-Type is JSON | `GET /api/admin/tags/list` | content-type: application/json |
| 12 | Empty list when no tags | `GET /api/admin/tags/list` | 200 - Empty array |
| 13 | Sorted alphabetically by name | `GET /api/admin/tags/list` | 200 - Names in A-Z order |
| 14 | No query params needed | `GET /api/admin/tags/list` | 200 - Works without params |
| 15 | Newly created tag appears in list | Create tag then GET /list | 200 - New tag present |
