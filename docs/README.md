# Coupons Script API Test Cases Documentation

**Base URL:** `http://localhost:5000`  
**Total APIs:** 58 documented endpoints (15 Public + 43 Admin)

---

## Public APIs (15 endpoints)

| # | File | Endpoint | Method | Description |
|---|------|----------|--------|-------------|
| 1 | [01-list-stores.md](./public/01-list-stores.md) | `/api/public/stores/list` | GET | List all stores |
| 2 | [02-get-store-details.md](./public/02-get-store-details.md) | `/api/public/stores/details/:slug` | GET | Get store by slug |
| 3 | [03-list-coupons.md](./public/03-list-coupons.md) | `/api/public/coupons/list` | GET | List all coupons |
| 4 | [04-get-coupon-details.md](./public/04-get-coupon-details.md) | `/api/public/coupons/details/:id` | GET | Get coupon by ID |
| 5 | [05-search-coupons.md](./public/05-search-coupons.md) | `/api/public/coupons/search?query=` | GET | Search coupons |
| 6 | [06-trending-coupons.md](./public/06-trending-coupons.md) | `/api/public/coupons/trending` | GET | Get trending coupons |
| 7 | [07-reveal-coupon.md](./public/07-reveal-coupon.md) | `/api/public/coupons/reveal/:id` | POST | Reveal coupon code |
| 8 | [08-track-click.md](./public/08-track-click.md) | `/api/public/coupons/track-click/:id` | POST | Track coupon click |
| 9 | [09-list-categories.md](./public/09-list-categories.md) | `/api/public/categories/list` | GET | List all categories |
| 10 | [10-list-popular-stores.md](./public/10-list-popular-stores.md) | `/api/public/popular-stores/list` | GET | List popular stores |
| 11 | [11-list-featured-coupons.md](./public/11-list-featured-coupons.md) | `/api/public/featured-coupons/list` | GET | List featured coupons |
| 12 | [12-list-banners.md](./public/12-list-banners.md) | `/api/public/site/banners` | GET | List banners |
| 13 | [13-get-navigation.md](./public/13-get-navigation.md) | `/api/public/navbar/navigation` | GET | Get navigation |
| 14 | [14-get-footer-links.md](./public/14-get-footer-links.md) | `/api/public/footer/links` | GET | Get footer links |
| 15 | [15-get-site-config.md](./public/15-get-site-config.md) | `/api/public/site/config` | GET | Get site config |

---

## Admin APIs (34 endpoints)

| # | File | Endpoint | Method | Description |
|---|------|----------|--------|-------------|
| 1 | [01-list-stores.md](./admin/01-list-stores.md) | `/api/admin/stores/list` | GET | List all stores |
| 2 | [02-get-store-details.md](./admin/02-get-store-details.md) | `/api/admin/stores/details/:id` | GET | Get store by ID |
| 3 | [03-create-store.md](./admin/03-create-store.md) | `/api/admin/stores/create` | POST | Create store |
| 4 | [04-update-store.md](./admin/04-update-store.md) | `/api/admin/stores/update/:id` | PUT | Update store |
| 5 | [05-delete-store.md](./admin/05-delete-store.md) | `/api/admin/stores/delete/:id` | DELETE | Delete store |
| 6 | [06-list-coupons.md](./admin/06-list-coupons.md) | `/api/admin/coupons/list` | GET | List all coupons |
| 7 | [07-get-coupon-details.md](./admin/07-get-coupon-details.md) | `/api/admin/coupons/details/:id` | GET | Get coupon by ID |
| 8 | [08-create-coupon.md](./admin/08-create-coupon.md) | `/api/admin/coupons/create` | POST | Create coupon |
| 9 | [09-update-coupon.md](./admin/09-update-coupon.md) | `/api/admin/coupons/update/:id` | PUT | Update coupon |
| 10 | [10-delete-coupon.md](./admin/10-delete-coupon.md) | `/api/admin/coupons/delete/:id` | DELETE | Delete coupon |
| 11 | [11-list-categories.md](./admin/11-list-categories.md) | `/api/admin/categories/list` | GET | List categories |
| 12 | [12-create-category.md](./admin/12-create-category.md) | `/api/admin/categories/create` | POST | Create category |
| 13 | [13-update-category.md](./admin/13-update-category.md) | `/api/admin/categories/update/:id` | PUT | Update category |
| 14 | [14-delete-category.md](./admin/14-delete-category.md) | `/api/admin/categories/delete/:id` | DELETE | Delete category |
| 15 | [15-list-popular-stores.md](./admin/15-list-popular-stores.md) | `/api/admin/popular-stores/list` | GET | List popular stores |
| 16 | [16-create-popular-store.md](./admin/16-create-popular-store.md) | `/api/admin/popular-stores/create` | POST | Create popular store |
| 17 | [17-update-popular-store.md](./admin/17-update-popular-store.md) | `/api/admin/popular-stores/:id` | PUT | Update popular store |
| 18 | [18-delete-popular-store.md](./admin/18-delete-popular-store.md) | `/api/admin/popular-stores/:id` | DELETE | Delete popular store |
| 19 | [19-list-featured-coupons.md](./admin/19-list-featured-coupons.md) | `/api/admin/featured-coupons/list` | GET | List featured coupons |
| 20 | [20-create-featured-coupon.md](./admin/20-create-featured-coupon.md) | `/api/admin/featured-coupons/create` | POST | Create featured coupon |
| 21 | [21-update-featured-coupon.md](./admin/21-update-featured-coupon.md) | `/api/admin/featured-coupons/:id` | PUT | Update featured coupon |
| 22 | [22-delete-featured-coupon.md](./admin/22-delete-featured-coupon.md) | `/api/admin/featured-coupons/:id` | DELETE | Delete featured coupon |
| 23 | [23-list-banners.md](./admin/23-list-banners.md) | `/api/admin/banner/list` | GET | List banners |
| 24 | [24-create-banner.md](./admin/24-create-banner.md) | `/api/admin/banner/create` | POST | Create banner |
| 25 | [25-get-navigation.md](./admin/25-get-navigation.md) | `/api/admin/navbar/navigation` | GET | Get navigation |
| 26 | [26-update-navigation.md](./admin/26-update-navigation.md) | `/api/admin/navbar/navigation/update` | PUT | Update navigation |
| 27 | [27-list-footer-links.md](./admin/27-list-footer-links.md) | `/api/admin/footer/links/list` | GET | List footer links |
| 28 | [28-create-footer-link.md](./admin/28-create-footer-link.md) | `/api/admin/footer/links/create` | POST | Create footer link |
| 29 | [29-update-footer-link.md](./admin/29-update-footer-link.md) | `/api/admin/footer/links/update/:id` | PUT | Update footer link |
| 30 | [30-delete-footer-link.md](./admin/30-delete-footer-link.md) | `/api/admin/footer/links/delete/:id` | DELETE | Delete footer link |
| 31 | [31-get-site-config.md](./admin/31-get-site-config.md) | `/api/admin/pages/site-config` | GET | Get site config |
| 32 | [32-update-site-config.md](./admin/32-update-site-config.md) | `/api/admin/pages/site-config/update` | PUT | Update site config |
| 33 | [33-get-page.md](./admin/33-get-page.md) | `/api/admin/pages/:pageName` | GET | Get page by name |
| 34 | [34-update-page.md](./admin/34-update-page.md) | `/api/admin/pages/:pageName/update` | PUT | Update page |
| 35 | [35-coupon-performance-analytics.md](./admin/35-coupon-performance-analytics.md) | `/api/admin/analytics/coupon-performance` | GET | Coupon performance analytics |
| 36 | [36-store-performance-analytics.md](./admin/36-store-performance-analytics.md) | `/api/admin/analytics/store-performance` | GET | Store performance analytics |
| 37 | [37-user-behavior-analytics.md](./admin/37-user-behavior-analytics.md) | `/api/admin/analytics/user-behavior` | GET | User behavior analytics |
| 38 | [38-bulk-import-coupons.md](./admin/38-bulk-import-coupons.md) | `/api/admin/data/bulk-import/coupons` | POST | Bulk import coupons |
| 39 | [39-bulk-import-stores.md](./admin/39-bulk-import-stores.md) | `/api/admin/data/bulk-import/stores` | POST | Bulk import stores |
| 40 | [40-export-coupons.md](./admin/40-export-coupons.md) | `/api/admin/data/export/coupons` | GET | Export coupons |
| 41 | [41-export-stores.md](./admin/41-export-stores.md) | `/api/admin/data/export/stores` | GET | Export stores |
| 42 | [42-health-check.md](./admin/42-health-check.md) | `/api/admin/health` | GET | Health check |
| 43 | [43-dashboard-stats.md](./admin/43-dashboard-stats.md) | `/api/admin/dashboard/stats` | GET | Dashboard stats |

---

## Response Format Reference

| API Group | Response Format |
|-----------|----------------|
| Stores (public/admin) | Plain array or object |
| Coupons (public/admin) | Plain array or object |
| Categories | Plain array |
| Popular Stores | `{ success, data, total }` |
| Featured Coupons | `{ success, data, total }` |
| Banners | `{ success, data, total }` |
| Navigation | Plain object with `menu[]` |
| Footer Links | `{ success, data: { main, myRmn, bottom }, allLinks }` |
| Site Config | Plain config object |
| Pages | Plain page object or `{ error }` on 404 |
| Search Coupons | `{ coupons: [] }` |
