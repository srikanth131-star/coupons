# 🎟️ Coupons Script — Backend API

Express.js REST API server for the Coupons Script coupons & deals marketplace. Handles stores, coupons, deals, blog, CMS pages, admin authentication, image uploads, and GA4 analytics.

![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Cypress](https://img.shields.io/badge/Cypress-15-17202C?logo=cypress)

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env     # Fill in your values
npm run dev              # Start with nodemon (localhost:5000)
```

## ⚙️ Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|----------|
| MONGODB_URI | MongoDB connection string | ✅ | - |
| MONGODB_LOCAL_URI | Local MongoDB connection | ❌ | mongodb://localhost:27017/couponsscript |
| PORT | Server port | ❌ | 5000 |
| JWT_SECRET | JWT signing secret | ✅ | - |
| GA4_MEASUREMENT_ID | Google Analytics 4 Measurement ID | ❌ | - |
| GA4_API_SECRET | Google Analytics 4 API Secret | ❌ | - |
| CORS_ORIGINS | Allowed CORS origins (comma-separated) | ❌ | http://localhost:3000,http://127.0.0.1:3000 |
| ADMIN_EMAIL | Default admin email for seeding | ❌ | admin@couponsfeast.com |
| ADMIN_PASSWORD | Default admin password for seeding | ❌ | admin123 |
| ADMIN_NAME | Default admin name for seeding | ❌ | Admin |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | ✅ | - |
| CLOUDINARY_API_KEY | Cloudinary API key | ✅ | - |
| CLOUDINARY_API_SECRET | Cloudinary API secret | ✅ | - |

## 📁 Project Structure

```
src/
├── config/           # Database & app configuration
├── controllers/      # Route handlers
├── middleware/        # Auth (JWT), GA4 analytics
├── models/           # Mongoose schemas (20 models)
├── routes/
│   ├── admin/        # Protected admin endpoints
│   └── public/       # Public API endpoints
└── utils/            # Helpers, GA4 analytics, seeders
```

## 📡 API Endpoints

See the [frontend README](../coupons-script-frontend/README.md) for the full API reference.

## 🧪 Testing

```bash
npm run test          # Run all Cypress API tests
npm run test:open     # Open Cypress UI
npm run test:admin    # Admin API tests
npm run test:stores   # Store API tests
npm run test:coupons  # Coupon API tests
```

## 🌱 Seeding

```bash
node seed-data.mjs          # Seed stores, coupons, categories
node seed-full.mjs           # Full seed with all data
node seed-banners-coupons.mjs # Seed banners and coupons
```

## 📄 License

**PROPRIETARY SOFTWARE** - CouponsScript Proprietary License

See [LICENSE](LICENSE) file for complete terms and conditions.

📖 **License Documentation:** [LICENSE.md](LICENSE.md) - Detailed proprietary license information

📋 **Additional License Files:**
- [COPYRIGHT.md](COPYRIGHT.md) - Copyright notice and project scope
- [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md) - Third-party dependency licenses
- [LICENSE-COMPLIANCE.md](LICENSE-COMPLIANCE.md) - License compliance checklist

⚠️ **Important:** This is proprietary commercial software owned by BrewCode. Unauthorized use, distribution, or modification is prohibited.
