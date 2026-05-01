# Coupons Script - All POST API Request Bodies

Base URL: `http://localhost:5000`  
Content-Type: `application/json` (required for all POST/PUT requests)

---

## 1. Create Store
**POST** `/api/admin/stores/create`
```json
{
  "storeName": "Meesho",
  "slug": "meesho",
  "logo": "https://logo.clearbit.com/meesho.com",
  "websiteUrl": "https://www.meesho.com",
  "description": "Affordable products with reseller model",
  "category": "Shopping"
}
```

---

## 2. Create Coupon
**POST** `/api/admin/coupons/create`

> Note: Replace `<storeId>` with a real `_id` from `GET /api/admin/stores/list`

```json
{
  "title": "Flat 30% Off on Electronics",
  "code": "ELEC30",
  "description": "Get 30% off on all electronics products",
  "discount": "30%",
  "store": "<storeId>",
  "category": "Electronics",
  "tags": ["electronics", "discount", "sale"],
  "expiryDate": "2027-12-31",
  "isActive": true,
  "isFeatured": false
}
```

---

## 3. Create Category
**POST** `/api/admin/categories/create`
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "color": "#007bff",
  "icon": "laptop",
  "description": "Electronic gadgets and devices",
  "hasNavLink": true,
  "navLocation": "navbar",
  "dropdownSection": "categories"
}
```

---

## 4. Create Popular Store
**POST** `/api/admin/popular-stores/create`
```json
{
  "name": "Amazon",
  "slug": "amazon",
  "logo": "https://logo.clearbit.com/amazon.com",
  "color": "#ff9900",
  "description": "Global e-commerce platform",
  "website": "https://www.amazon.com",
  "hasNavLink": true,
  "navLocation": "navbar",
  "dropdownSection": "popular",
  "priority": 1,
  "featured": true,
  "isPopular": true
}
```

---

## 5. Create Featured Coupon
**POST** `/api/admin/featured-coupons/create`
```json
{
  "title": "Exclusive 25% Off Electronics",
  "href": "/deals/electronics",
  "theme": "white",
  "logo": "https://logo.clearbit.com/amazon.com",
  "logoWidth": 40,
  "logoHeight": 40,
  "logoAlt": "Amazon",
  "cta": "Shop Now",
  "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=160&h=170&fit=crop",
  "isActive": true,
  "order": 1
}
```

---

## 6. Create Banner
**POST** `/api/admin/banner/create`
```json
{
  "title": "Up to 70% Off Summer Sale",
  "subtitle": "Limited Time Offer - Shop Now",
  "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  "buttonText": "Shop Now",
  "buttonLink": "/deals/summer",
  "isActive": true
}
```

---

## 7. Create Footer Link
**POST** `/api/admin/footer/links/create`
```json
{
  "label": "About Us",
  "href": "/about",
  "section": "main",
  "order": 1,
  "isActive": true
}
```

---

## 8. Reveal Coupon Code (Public)
**POST** `/api/public/coupons/reveal/<couponId>`

> No request body needed. Replace `<couponId>` with real ID from `GET /api/public/coupons/list`

```
No body required
```

---

## 9. Track Coupon Click (Public)
**POST** `/api/public/coupons/track-click/<couponId>`

> No request body needed. Replace `<couponId>` with real ID from `GET /api/public/coupons/list`

```
No body required
```

---

## 10. Bulk Import Coupons
**POST** `/api/admin/data/bulk-import/coupons`

> Replace `<storeId>` with real store `_id`

```json
[
  {
    "title": "10% Off Groceries",
    "code": "GROCERY10",
    "description": "Save 10% on all grocery items",
    "discount": "10%",
    "store": "<storeId>",
    "category": "Groceries",
    "tags": ["grocery", "food"],
    "expiryDate": "2027-06-30"
  },
  {
    "title": "Free Delivery on Orders Above 500",
    "code": "FREEDEL500",
    "description": "Free delivery on orders above ₹500",
    "discount": "Free Delivery",
    "store": "<storeId>",
    "category": "Shopping",
    "tags": ["delivery", "free"],
    "expiryDate": "2027-12-31"
  }
]
```

---

## 11. Bulk Import Stores
**POST** `/api/admin/data/bulk-import/stores`
```json
[
  {
    "name": "Nykaa",
    "slug": "nykaa",
    "logo": "https://logo.clearbit.com/nykaa.com",
    "description": "Beauty and wellness products"
  },
  {
    "name": "Ajio",
    "slug": "ajio",
    "logo": "https://logo.clearbit.com/ajio.com",
    "description": "Fashion and lifestyle store"
  }
]
```

---

## 12. Cleanup Expired Coupons
**POST** `/api/admin/system/cleanup/expired-coupons`
```
No body required
```

---

## 13. Optimize Database
**POST** `/api/admin/system/optimize/database`
```
No body required
```

---

## 14. Clear All Cache
**POST** `/api/admin/cache/clear/all`
```
No body required
```

---

## 15. Clear Coupon Cache
**POST** `/api/admin/cache/clear/coupons`
```
No body required
```

---

## 16. Clear Store Cache
**POST** `/api/admin/cache/clear/stores`
```
No body required
```

---

## Quick Reference - All POST Endpoints

| # | Endpoint | Body Required |
|---|----------|---------------|
| 1 | `POST /api/admin/stores/create` | Yes |
| 2 | `POST /api/admin/coupons/create` | Yes |
| 3 | `POST /api/admin/categories/create` | Yes |
| 4 | `POST /api/admin/popular-stores/create` | Yes |
| 5 | `POST /api/admin/featured-coupons/create` | Yes |
| 6 | `POST /api/admin/banner/create` | Yes |
| 7 | `POST /api/admin/footer/links/create` | Yes |
| 8 | `POST /api/public/coupons/reveal/:id` | No |
| 9 | `POST /api/public/coupons/track-click/:id` | No |
| 10 | `POST /api/admin/data/bulk-import/coupons` | Yes (array) |
| 11 | `POST /api/admin/data/bulk-import/stores` | Yes (array) |
| 12 | `POST /api/admin/system/cleanup/expired-coupons` | No |
| 13 | `POST /api/admin/system/optimize/database` | No |
| 14 | `POST /api/admin/cache/clear/all` | No |
| 15 | `POST /api/admin/cache/clear/coupons` | No |
| 16 | `POST /api/admin/cache/clear/stores` | No |
