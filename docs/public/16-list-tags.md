# Public - List Tags API - Test Cases

**Endpoint:** `GET /api/public/tags/list`  
**Base URL:** `http://localhost:5000`  
**Access:** Public

## Description
Returns all tags sorted alphabetically by name. This is the read-only public endpoint used by the frontend to populate the tag dropdown in the coupon form and for any public tag display.

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
- **Admin Coupons page** (`/admin/coupons`) — fetches this endpoint to populate the Tags multi-select dropdown in the coupon create/edit drawer
- **Any public page** that needs to display available tags

## How Admin Changes Reflect Here
- When admin **creates** a tag via `POST /api/admin/tags/create` → it appears in this list
- When admin **updates** a tag via `PUT /api/admin/tags/update/:id` → updated name/slug reflected here
- When admin **deletes** a tag via `DELETE /api/admin/tags/delete/:id` → it disappears from this list

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | List all tags | `GET /api/public/tags/list` | 200 - Array of tags |
| 2 | Response is array | `GET /api/public/tags/list` | 200 - body is array |
| 3 | Each tag has name | `GET /api/public/tags/list` | 200 - All items have name |
| 4 | Each tag has slug | `GET /api/public/tags/list` | 200 - All items have slug |
| 5 | Each tag has _id | `GET /api/public/tags/list` | 200 - All items have _id |
| 6 | Empty list when no tags | `GET /api/public/tags/list` | 200 - Empty array |
| 7 | Content-Type is JSON | `GET /api/public/tags/list` | content-type: application/json |
| 8 | Response time under 2 seconds | `GET /api/public/tags/list` | 200 within 2000ms |
| 9 | Concurrent requests (5x) | 5x `GET /api/public/tags/list` | All return 200 |
| 10 | Consistent data across requests | Two sequential requests | Same length both times |
| 11 | slug is lowercase | `GET /api/public/tags/list` | 200 - All slugs lowercase |
| 12 | Sorted alphabetically by name | `GET /api/public/tags/list` | 200 - Names in A-Z order |
| 13 | Reflects admin create | Create tag via admin, then GET this | 200 - New tag present |
| 14 | Reflects admin delete | Delete tag via admin, then GET this | 200 - Deleted tag gone |
| 15 | No query params needed | `GET /api/public/tags/list` | 200 - Works without params |
