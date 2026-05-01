# Admin - Delete Tag API - Test Cases

**Endpoint:** `DELETE /api/admin/tags/delete/:id`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin

## Description
Permanently deletes a tag from the `tags` collection by its MongoDB `_id`.

## Example Request
```
DELETE /api/admin/tags/delete/664a1b2c3d4e5f6a7b8c9d0e
```

## Example Response (200)
```json
{
  "message": "Tag deleted successfully"
}
```

## How Changes Reflect
1. **Admin Tags page** (`/admin/tags`) — tag disappears from the table immediately after deletion
2. **Admin Coupons page** (`/admin/coupons`) — the deleted tag no longer appears in the Tags dropdown when creating/editing coupons
3. **Public API** — `GET /api/public/tags/list` no longer returns the deleted tag
4. **Important:** Existing coupons that already have this tag in their `tags` string array will **still keep it**. The tag string remains on those coupons even after the tag is deleted from the `tags` collection. To clean up, manually edit those coupons and remove the tag.

## Error Responses
| Status | Condition | Response |
|--------|-----------|----------|
| 404 | Tag not found | `{ "error": "Tag not found" }` |
| 500 | Server error | `{ "error": "<error message>" }` |

## Test Cases

| # | Test Case | Request | Expected Result |
|---|-----------|---------|-----------------|
| 1 | Delete existing tag | `DELETE /api/admin/tags/delete/<validId>` | 200 - Success message |
| 2 | Non-existent ID | `DELETE /api/admin/tags/delete/000000000000000000000000` | 404 - Tag not found |
| 3 | Invalid ObjectId | `DELETE /api/admin/tags/delete/invalid-id` | 400 or 500 |
| 4 | Tag not in list after delete | Delete then GET /list | 200 - Deleted tag not in list |
| 5 | Delete same tag twice | Delete twice | First: 200, Second: 404 |
| 6 | Response has message | Valid delete | 200 - Has message field |
| 7 | Empty ID | `DELETE /api/admin/tags/delete/` | 404 - Route not matched |
| 8 | Content-Type is JSON | Valid delete | content-type: application/json |
| 9 | Response time under 3 seconds | Valid delete | 200 within 3000ms |
| 10 | Dynamic ID from list | Fetch ID from /admin/tags/list then delete | 200 - Deleted successfully |
| 11 | No request body needed | DELETE with no body | 200 - Works without body |
| 12 | Response is object | Valid delete | 200 - body is object |
| 13 | Concurrent deletes | 3 simultaneous deletes on different tags | All return 200 |
| 14 | GET method not allowed | `GET /api/admin/tags/delete/<id>` | 404 |
| 15 | Tag removed from coupon dropdown | Delete tag, reload coupon form | Tag no longer in dropdown |
