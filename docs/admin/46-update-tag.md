# Admin - Update Tag API - Test Cases

**Endpoint:** `PUT /api/admin/tags/update/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Description
Updates an existing tag by its MongoDB `_id`. If `name` is updated and `slug` is not provided, the slug is auto-regenerated from the new name.

## Request Body
| Field | Type   | Required | Description                                    |
|-------|--------|----------|------------------------------------------------|
| name  | String | No       | Updated tag name                               |
| slug  | String | No       | Updated slug. Auto-regenerated from name if name changes and slug is omitted |

## Example Request
```json
PUT /api/admin/tags/update/664a1b2c3d4e5f6a7b8c9d0e
{
  "name": "Limited Time Flash Sale"
}
```

## Example Response (200)
```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "name": "Limited Time Flash Sale",
  "slug": "limited-time-flash-sale",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

## How Changes Reflect
1. **Admin Tags page** (`/admin/tags`) — table shows updated name/slug immediately after save
2. **Admin Coupons page** (`/admin/coupons`) — the Tags dropdown fetches the latest tag list on page load, so the renamed tag appears with its new name
3. **Public API** — `GET /api/public/tags/list` returns the updated tag
4. **Important:** Existing coupons store tags as plain strings (e.g., `["Flash Sale"]`). If you rename a tag from "Flash Sale" to "Limited Time Flash Sale", coupons that already have "Flash Sale" in their `tags` array will **not** auto-update. You need to manually update those coupons via the coupon edit form or the update coupon API.

## Error Responses
| Status | Condition | Response |
|--------|-----------|----------|
| 404 | Tag not found | `{ "error": "Tag not found" }` |
| 409 | Duplicate slug | `{ "error": "Tag slug already exists" }` |
| 400 | Validation error | `{ "error": "<validation message>" }` |
| 500 | Server error | `{ "error": "<error message>" }` |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Update name | `PUT /update/<id>` `{ "name": "New Name" }` | 200 - Updated tag with new slug |
| 2 | Update slug only | `PUT /update/<id>` `{ "slug": "custom-slug" }` | 200 - Updated slug, name unchanged |
| 3 | Update both name and slug | `PUT /update/<id>` `{ "name": "New", "slug": "my-slug" }` | 200 - Both updated |
| 4 | Non-existent ID | `PUT /update/000000000000000000000000` | 404 - Tag not found |
| 5 | Invalid ObjectId | `PUT /update/invalid-id` | 400 or 500 |
| 6 | Empty body | `PUT /update/<id>` `{}` | 200 - No changes |
| 7 | Duplicate slug | Update to existing slug | 409 - Tag slug already exists |
| 8 | Slug auto-generated from name | `{ "name": "Weekend Deal" }` | 200 - slug becomes "weekend-deal" |
| 9 | Response returns updated tag | Valid update | 200 - body has new values |
| 10 | updatedAt changes | Valid update | 200 - updatedAt > createdAt |
| 11 | Updated tag in list | Update then GET /list | 200 - Updated tag in list |
| 12 | Content-Type is JSON | Valid update | content-type: application/json |
| 13 | Response time under 3 seconds | Valid update | 200 within 3000ms |
| 14 | Dynamic ID from list | Fetch ID from /admin/tags/list then update | 200 - Updated successfully |
| 15 | Name with special chars | `{ "name": "Buy 1 Get 1 Free!" }` | 200 - Slug: "buy-1-get-1-free" |
