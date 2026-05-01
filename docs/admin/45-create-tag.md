# Admin - Create Tag API - Test Cases

**Endpoint:** `POST /api/admin/tags/create`  
**Base URL:** `http://localhost:5000`  
**Access:** Admin  
**Content-Type:** `application/json`

## Description
Creates a new tag in the `tags` collection. The slug is auto-generated from the name if not provided. Once created, the tag immediately appears in the coupon form's tag multi-select dropdown on the Admin Coupons page (`/admin/coupons`).

## Request Body
| Field | Type   | Required | Description                                    |
|-------|--------|----------|------------------------------------------------|
| name  | String | Yes      | Tag display name (e.g., "Flash Sale")          |
| slug  | String | No       | URL-friendly slug. Auto-generated from name if omitted |

## Example Request
```json
POST /api/admin/tags/create
{
  "name": "Flash Sale"
}
```

## Example Response (201)
```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "name": "Flash Sale",
  "slug": "flash-sale",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## How Changes Reflect
1. **Admin Tags page** (`/admin/tags`) — new tag appears in the table immediately after creation
2. **Admin Coupons page** (`/admin/coupons`) — when creating/editing a coupon, the Tags dropdown fetches `/api/public/tags/list` on load, so the new tag appears as a selectable option
3. **Public API** — `GET /api/public/tags/list` returns the updated list including the new tag
4. **Coupon filtering** — once a coupon is tagged with this new tag, `GET /api/public/coupons/list?tag=flash-sale` will return matching coupons

## Error Responses
| Status | Condition | Response |
|--------|-----------|----------|
| 400 | Missing name | `{ "error": "Tag validation failed: name: Path `name` is required." }` |
| 409 | Duplicate slug | `{ "error": "Tag slug already exists" }` |
| 500 | Server error | `{ "error": "<error message>" }` |

## Test Cases

| # | Test Case | Request Body | Expected Result |
|---|-----------|--------------|-----------------|
| 1 | Valid tag creation | `{ "name": "Flash Sale" }` | 201 - Created tag with auto-slug "flash-sale" |
| 2 | Valid with custom slug | `{ "name": "New User", "slug": "new-user-offer" }` | 201 - Created with custom slug |
| 3 | Missing name | `{}` | 400 - Validation error |
| 4 | Null name | `{ "name": null }` | 400 - Validation error |
| 5 | Empty name | `{ "name": "" }` | 400 - Validation error |
| 6 | Duplicate slug | Create same tag twice | First: 201, Second: 409 |
| 7 | Name with special chars | `{ "name": "50% Off & More!" }` | 201 - Slug auto-cleaned to "50-off-more" |
| 8 | Name with spaces | `{ "name": "Weekend Deal" }` | 201 - Slug: "weekend-deal" |
| 9 | Response has _id | Valid creation | 201 - body has _id |
| 10 | Response has createdAt | Valid creation | 201 - body has createdAt |
| 11 | Tag appears in list after create | Create then GET /list | 200 - New tag in list |
| 12 | Tag appears in coupon form | Create tag, then load coupon form | Tag visible in dropdown |
| 13 | Content-Type is JSON | Valid creation | content-type: application/json |
| 14 | Response time under 3 seconds | Valid creation | 201 within 3000ms |
| 15 | Wrong Content-Type | Send as text/plain | 400 or 500 |
