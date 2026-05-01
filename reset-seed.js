// Run: node reset-seed.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/database.js";
import Store from "./src/models/Store.js";
import Coupon from "./src/models/Coupon.js";
import Category from "./src/models/Category.js";
import Deal from "./src/models/Deal.js";
import PopularStore from "./src/models/PopularStore.js";
import FeaturedCoupon from "./src/models/FeaturedCoupon.js";
import FooterLink from "./src/models/FooterLink.js";
import { Banner } from "./src/models/Banner.js";
import { Navigation } from "./src/models/Navigation.js";
import { Page } from "./src/models/Page.js";
import { SiteConfig } from "./src/models/SiteConfig.js";
import { NavbarItem } from "./src/models/NavbarItem.js";
import { seedAllData } from "./src/utils/seedData.js";

await connectDB();

console.log("🗑️  Clearing all collections...");
await Promise.all([
  Store.deleteMany({}),
  Coupon.deleteMany({}),
  Category.deleteMany({}),
  Deal.deleteMany({}),
  PopularStore.deleteMany({}),
  FeaturedCoupon.deleteMany({}),
  FooterLink.deleteMany({}),
  Banner.deleteMany({}),
  Navigation.deleteMany({}),
  Page.deleteMany({}),
  SiteConfig.deleteMany({}),
  NavbarItem.deleteMany({}),
]);
console.log("✅ All collections cleared");

await seedAllData();
process.exit(0);
