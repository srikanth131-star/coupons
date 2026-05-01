import Store from "../models/Store.js";
import Coupon from "../models/Coupon.js";
import Category from "../models/Category.js";
import Deal from "../models/Deal.js";
import PopularStore from "../models/PopularStore.js";
import FeaturedCoupon from "../models/FeaturedCoupon.js";
import FooterLink from "../models/FooterLink.js";
import { Banner } from "../models/Banner.js";
import { Navigation } from "../models/Navigation.js";
import { Page } from "../models/Page.js";
import { SiteConfig } from "../models/SiteConfig.js";
import { NavbarItem } from "../models/NavbarItem.js";

export const seedAllData = async () => {
  try {
    console.log("🌱 Starting full data seed...");

    // ─── CATEGORIES ───────────────────────────────────────────────
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany([
        { name: "Fashion", slug: "fashion", color: "#ec4899", icon: "👗", description: "Clothing, shoes & accessories", hasNavLink: true, navLocation: "navbar", dropdownSection: "categories" },
        { name: "Electronics", slug: "electronics", color: "#3b82f6", icon: "💻", description: "Gadgets, phones & computers", hasNavLink: true, navLocation: "navbar", dropdownSection: "categories" },
        { name: "Food & Dining", slug: "food-dining", color: "#f97316", icon: "🍔", description: "Restaurants & food delivery", hasNavLink: true, navLocation: "navbar", dropdownSection: "categories" },
        { name: "Travel", slug: "travel", color: "#06b6d4", icon: "✈️", description: "Flights, hotels & holidays", hasNavLink: true, navLocation: "navbar", dropdownSection: "categories" },
        { name: "Beauty", slug: "beauty", color: "#a855f7", icon: "💄", description: "Skincare, makeup & wellness", hasNavLink: false, navLocation: "no", dropdownSection: "categories" },
        { name: "Home & Garden", slug: "home-garden", color: "#22c55e", icon: "🏡", description: "Furniture, decor & tools", hasNavLink: false, navLocation: "no", dropdownSection: "categories" },
        { name: "Sports", slug: "sports", color: "#ef4444", icon: "⚽", description: "Fitness, outdoor & sports gear", hasNavLink: false, navLocation: "no", dropdownSection: "categories" },
        { name: "Groceries", slug: "groceries", color: "#84cc16", icon: "🛒", description: "Supermarkets & online grocery", hasNavLink: false, navLocation: "no", dropdownSection: "categories" },
      ]);
      console.log("✅ Categories seeded (8)");
    }

    // ─── STORES ───────────────────────────────────────────────────
    const storeCount = await Store.countDocuments();
    if (storeCount === 0) {
      await Store.insertMany([
        { storeName: "Amazon", slug: "amazon", logo: "https://logo.clearbit.com/amazon.com", websiteUrl: "https://www.amazon.com", description: "World's largest online marketplace with millions of products", category: "Shopping" },
        { storeName: "Flipkart", slug: "flipkart", logo: "https://logo.clearbit.com/flipkart.com", websiteUrl: "https://www.flipkart.com", description: "India's leading e-commerce marketplace", category: "Shopping" },
        { storeName: "Myntra", slug: "myntra", logo: "https://logo.clearbit.com/myntra.com", websiteUrl: "https://www.myntra.com", description: "India's top fashion and lifestyle destination", category: "Fashion" },
        { storeName: "Swiggy", slug: "swiggy", logo: "https://logo.clearbit.com/swiggy.com", websiteUrl: "https://www.swiggy.com", description: "Fast food delivery from your favourite restaurants", category: "Food" },
        { storeName: "Zomato", slug: "zomato", logo: "https://logo.clearbit.com/zomato.com", websiteUrl: "https://www.zomato.com", description: "Restaurant discovery and food delivery service", category: "Food" },
        { storeName: "Nike", slug: "nike", logo: "https://logo.clearbit.com/nike.com", websiteUrl: "https://www.nike.com", description: "Premium sportswear, shoes and athletic gear", category: "Sports" },
        { storeName: "Adidas", slug: "adidas", logo: "https://logo.clearbit.com/adidas.com", websiteUrl: "https://www.adidas.com", description: "Sports clothing, shoes and accessories", category: "Sports" },
        { storeName: "H&M", slug: "hm", logo: "https://logo.clearbit.com/hm.com", websiteUrl: "https://www.hm.com", description: "Affordable fashion for everyone", category: "Fashion" },
        { storeName: "Nykaa", slug: "nykaa", logo: "https://logo.clearbit.com/nykaa.com", websiteUrl: "https://www.nykaa.com", description: "Beauty, wellness and fashion products", category: "Beauty" },
        { storeName: "MakeMyTrip", slug: "makemytrip", logo: "https://logo.clearbit.com/makemytrip.com", websiteUrl: "https://www.makemytrip.com", description: "Book flights, hotels and holiday packages", category: "Travel" },
        { storeName: "IKEA", slug: "ikea", logo: "https://logo.clearbit.com/ikea.com", websiteUrl: "https://www.ikea.com", description: "Affordable home furniture and decor", category: "Home" },
        { storeName: "Apple", slug: "apple", logo: "https://logo.clearbit.com/apple.com", websiteUrl: "https://www.apple.com", description: "iPhone, Mac, iPad and accessories", category: "Electronics" },
      ]);
      console.log("✅ Stores seeded (12)");
    }

    // ─── COUPONS ──────────────────────────────────────────────────
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const stores = await Store.find();
      const storeMap = {};
      stores.forEach(s => { storeMap[s.slug] = s._id; });

      await Coupon.insertMany([
        { title: "Flat 30% Off on Electronics", code: "ELEC30", description: "Get 30% off on all electronics including mobiles, laptops and accessories", discount: "30% OFF", store: storeMap["amazon"], category: "Electronics", tags: ["electronics", "sale"], expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), clickCount: 245, isActive: true, isFeatured: true },
        { title: "Buy 2 Get 1 Free on Fashion", code: "FASHION3", description: "Buy any 2 fashion items and get 1 absolutely free", discount: "Buy 2 Get 1", store: storeMap["myntra"], category: "Fashion", tags: ["fashion", "bogo"], expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), clickCount: 189, isActive: true, isFeatured: true },
        { title: "₹100 Off on First Food Order", code: "FOOD100", description: "New users get ₹100 off on their first food delivery order", discount: "₹100 OFF", store: storeMap["swiggy"], category: "Food & Dining", tags: ["food", "newuser"], expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), clickCount: 412, isActive: true, isFeatured: false },
        { title: "Flat 20% Off on Nike Shoes", code: "NIKE20", description: "Get 20% discount on all Nike footwear collection", discount: "20% OFF", store: storeMap["nike"], category: "Sports", tags: ["shoes", "nike", "sports"], expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), clickCount: 156, isActive: true, isFeatured: false },
        { title: "Up to 50% Off on Beauty Products", code: "BEAUTY50", description: "Massive sale on skincare, makeup and wellness products", discount: "Up to 50% OFF", store: storeMap["nykaa"], category: "Beauty", tags: ["beauty", "skincare", "sale"], expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), clickCount: 334, isActive: true, isFeatured: true },
        { title: "₹500 Off on Flight Bookings", code: "FLY500", description: "Save ₹500 on domestic and international flight bookings", discount: "₹500 OFF", store: storeMap["makemytrip"], category: "Travel", tags: ["travel", "flights"], expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), clickCount: 278, isActive: true, isFeatured: false },
        { title: "Extra 15% Off on Adidas", code: "ADIDAS15", description: "Additional 15% off on Adidas sportswear and footwear", discount: "15% OFF", store: storeMap["adidas"], category: "Sports", tags: ["adidas", "sports", "shoes"], expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), clickCount: 98, isActive: true, isFeatured: false },
        { title: "Flat ₹200 Off on Grocery Orders", code: "GROCERY200", description: "Get ₹200 off on grocery orders above ₹999", discount: "₹200 OFF", store: storeMap["amazon"], category: "Groceries", tags: ["grocery", "food"], expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), clickCount: 521, isActive: true, isFeatured: false },
        { title: "40% Off on H&M Summer Collection", code: "HM40", description: "Shop the summer collection at 40% off", discount: "40% OFF", store: storeMap["hm"], category: "Fashion", tags: ["fashion", "summer", "hm"], expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), clickCount: 203, isActive: true, isFeatured: true },
        { title: "Free Delivery on Zomato Orders", code: "ZOMFREE", description: "Get free delivery on all Zomato orders above ₹299", discount: "Free Delivery", store: storeMap["zomato"], category: "Food & Dining", tags: ["food", "delivery", "free"], expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), clickCount: 687, isActive: true, isFeatured: false },
        { title: "10% Off on Apple Products", code: "APPLE10", description: "Get 10% off on iPhone, MacBook and iPad", discount: "10% OFF", store: storeMap["apple"], category: "Electronics", tags: ["apple", "iphone", "mac"], expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), clickCount: 445, isActive: true, isFeatured: true },
        { title: "₹1000 Off on IKEA Furniture", code: "IKEA1000", description: "Save ₹1000 on furniture orders above ₹5000", discount: "₹1000 OFF", store: storeMap["ikea"], category: "Home & Garden", tags: ["furniture", "home", "ikea"], expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), clickCount: 134, isActive: true, isFeatured: false },
        { title: "Flipkart Big Billion Sale - 70% Off", code: "BBD70", description: "Biggest sale of the year with up to 70% off across all categories", discount: "Up to 70% OFF", store: storeMap["flipkart"], category: "Shopping", tags: ["sale", "bigbillion", "flipkart"], expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), clickCount: 1243, isActive: true, isFeatured: true },
        { title: "25% Off on Myntra Ethnic Wear", code: "ETHNIC25", description: "Celebrate festivals with 25% off on ethnic wear collection", discount: "25% OFF", store: storeMap["myntra"], category: "Fashion", tags: ["ethnic", "fashion", "festival"], expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), clickCount: 167, isActive: true, isFeatured: false },
        { title: "Hotel Booking - Flat 35% Off", code: "HOTEL35", description: "Book hotels at 35% off for weekend getaways", discount: "35% OFF", store: storeMap["makemytrip"], category: "Travel", tags: ["hotel", "travel", "weekend"], expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), clickCount: 312, isActive: true, isFeatured: false },
      ]);
      console.log("✅ Coupons seeded (15)");
    }

    // ─── DEALS (with section assignments) ─────────────────────────
    const dealCount = await Deal.countDocuments();
    if (dealCount === 0) {
      const allStores = await Store.find();
      const sMap = {};
      allStores.forEach(s => { sMap[s.slug] = s._id; });

      await Deal.insertMany([
        // Popular Offers of the Day
        { title: "iPhone 15 Pro — Lowest Price Ever", discount: "₹15000 Off", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop", store: sMap["amazon"], section: "popular_offers", isActive: true, isFeatured: true, type: "deal", link: "https://www.amazon.com", description: "Grab the iPhone 15 Pro at the lowest price this season!" },
        { title: "Samsung Galaxy S24 Ultra Deal", discount: "₹12000 Off", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop", store: sMap["flipkart"], section: "popular_offers", isActive: true, isFeatured: true, type: "deal", link: "https://www.flipkart.com", description: "Samsung Galaxy S24 Ultra at an unbeatable price!" },
        { title: "Nike Air Max 90 — Limited Edition", discount: "40% Off", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", store: sMap["nike"], section: "popular_offers", isActive: true, type: "offer", link: "https://www.nike.com", description: "Limited edition Nike Air Max 90 at 40% off!" },
        { title: "Sony WH-1000XM5 Headphones", discount: "30% Off", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", store: sMap["amazon"], section: "popular_offers", isActive: true, type: "deal", link: "https://www.amazon.com", description: "Premium noise-cancelling headphones at 30% off!" },
        // Deals Of The Day
        { title: "MacBook Air M3 — Student Offer", discount: "₹10000 Off", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop", store: sMap["apple"], section: "deals_of_day", isActive: true, isFeatured: true, type: "deal", link: "https://www.apple.com", description: "MacBook Air M3 with exclusive student discount!" },
        { title: "Adidas Ultraboost — Flash Sale", discount: "50% Off", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop", store: sMap["adidas"], section: "deals_of_day", isActive: true, type: "flash", link: "https://www.adidas.com", description: "Adidas Ultraboost at half price — today only!" },
        { title: "Home Decor Essentials Bundle", discount: "35% Off", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", store: sMap["ikea"], section: "deals_of_day", isActive: true, type: "deal", link: "https://www.ikea.com", description: "Transform your home with IKEA essentials at 35% off!" },
        { title: "Kitchen Appliances Mega Sale", discount: "Up to 60% Off", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", store: sMap["amazon"], section: "deals_of_day", isActive: true, type: "deal", link: "https://www.amazon.com", description: "Mega sale on kitchen appliances — up to 60% off!" },
        // Collections
        { title: "Fitness Tracker — Best Price", discount: "₹2000 Off", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop", store: sMap["amazon"], section: "collections", isActive: true, type: "deal", link: "https://www.amazon.com", description: "Top-rated fitness trackers at the best price!" },
        { title: "Designer Sunglasses Collection", discount: "45% Off", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop", store: sMap["myntra"], section: "collections", isActive: true, type: "offer", link: "https://www.myntra.com", description: "Premium designer sunglasses at 45% off!" },
        { title: "Gaming Console Bundle Deal", discount: "₹8000 Off", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop", store: sMap["flipkart"], section: "collections", isActive: true, type: "deal", link: "https://www.flipkart.com", description: "Gaming console bundles at massive discounts!" },
        { title: "Organic Skincare Set", discount: "25% Off", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop", store: sMap["nykaa"], section: "collections", isActive: true, type: "offer", link: "https://www.nykaa.com", description: "Organic skincare essentials at 25% off!" },
        // Trending Deals
        { title: "Smart Watch — Premium Edition", discount: "₹5000 Off", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", store: sMap["amazon"], section: "trending_deals", isActive: true, type: "deal", link: "https://www.amazon.com", description: "Premium smartwatch at ₹5000 off!" },
        { title: "Travel Luggage Set — Durable", discount: "30% Off", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", store: sMap["amazon"], section: "trending_deals", isActive: true, type: "offer", link: "https://www.amazon.com", description: "Durable travel luggage sets at 30% off!" },
        { title: "Wireless Earbuds — Top Rated", discount: "₹1500 Off", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop", store: sMap["flipkart"], section: "trending_deals", isActive: true, type: "deal", link: "https://www.flipkart.com", description: "Top-rated wireless earbuds at ₹1500 off!" },
        { title: "Running Shoes — All Terrain", discount: "40% Off", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop", store: sMap["nike"], section: "trending_deals", isActive: true, type: "offer", link: "https://www.nike.com", description: "All-terrain running shoes at 40% off!" },
      ]);
      console.log("✅ Deals seeded (16) — popular_offers, deals_of_day, collections, trending_deals");
    }

    // ─── POPULAR STORES ───────────────────────────────────────────
    const popCount = await PopularStore.countDocuments();
    if (popCount === 0) {
      await PopularStore.insertMany([
        { name: "Amazon", slug: "amazon", logo: "https://logo.clearbit.com/amazon.com", color: "#f97316", description: "World's largest online store", hasNavLink: true, navLocation: "navbar", dropdownSection: "popular", priority: 1, featured: true },
        { name: "Flipkart", slug: "flipkart", logo: "https://logo.clearbit.com/flipkart.com", color: "#2563eb", description: "India's top e-commerce platform", hasNavLink: true, navLocation: "navbar", dropdownSection: "popular", priority: 2, featured: true },
        { name: "Myntra", slug: "myntra", logo: "https://logo.clearbit.com/myntra.com", color: "#ec4899", description: "Fashion & lifestyle store", hasNavLink: true, navLocation: "navbar", dropdownSection: "popular", priority: 3, featured: true },
        { name: "Swiggy", slug: "swiggy", logo: "https://logo.clearbit.com/swiggy.com", color: "#f97316", description: "Food delivery platform", hasNavLink: false, navLocation: "no", dropdownSection: "popular", priority: 4, featured: false },
        { name: "Zomato", slug: "zomato", logo: "https://logo.clearbit.com/zomato.com", color: "#ef4444", description: "Restaurant & food delivery", hasNavLink: false, navLocation: "no", dropdownSection: "popular", priority: 5, featured: false },
        { name: "Nykaa", slug: "nykaa", logo: "https://logo.clearbit.com/nykaa.com", color: "#a855f7", description: "Beauty & wellness", hasNavLink: false, navLocation: "no", dropdownSection: "popular", priority: 6, featured: false },
      ]);
      console.log("✅ Popular stores seeded (6)");
    }

    // ─── FEATURED COUPONS ─────────────────────────────────────────
    const featCount = await FeaturedCoupon.countDocuments();
    if (featCount === 0) {
      await FeaturedCoupon.insertMany([
        { title: "Guaranteed Cash Back from 4,000+ Brands", href: "/cashback", theme: "purple", logo: "", logoWidth: 32, logoHeight: 40, logoAlt: "Coupons Script", cta: "Shop Coupons Script", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=160&h=170&fit=crop", isActive: true, order: 1 },
        { title: "Exclusive 30% Off on Electronics — Today Only", href: "/stores/amazon", theme: "white", logo: "https://logo.clearbit.com/amazon.com", logoWidth: 80, logoHeight: 30, logoAlt: "Amazon", cta: "Shop Now", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=160&h=170&fit=crop", isActive: true, order: 2 },
        { title: "Fashion Sale — Up to 50% Off on Top Brands", href: "/stores/myntra", theme: "white", logo: "https://logo.clearbit.com/myntra.com", logoWidth: 80, logoHeight: 30, logoAlt: "Myntra", cta: "Reveal Code", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=160&h=170&fit=crop", isActive: true, order: 3 },
        { title: "Free Delivery + ₹100 Off on First Food Order", href: "/stores/swiggy", theme: "white", logo: "https://logo.clearbit.com/swiggy.com", logoWidth: 80, logoHeight: 30, logoAlt: "Swiggy", cta: "Order Now", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=170&fit=crop", isActive: true, order: 4 },
      ]);
      console.log("✅ Featured coupons seeded (4)");
    }

    // ─── BANNERS ──────────────────────────────────────────────────
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.insertMany([
        // Left banners (hero_left)
        { title: "Up to 70% Off — Big Season Sale", subtitle: "Limited Time Offer", label: "Amazon", discount: "70% OFF", cta: "SHOP THE DEALS", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop", buttonText: "Shop Now", buttonLink: "/deals", bannerType: "hero_left", isActive: true },
        { title: "Earn Cash Back on Every Purchase", subtitle: "Join 10 million+ smart shoppers", label: "Coupons Script", discount: "5% BACK", cta: "GET CASH BACK", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop", buttonText: "Get Cash Back", buttonLink: "/cashback", bannerType: "hero_left", isActive: true },
        { title: "New Member Bonus — Extra 15% Off", subtitle: "Your first order discount is waiting", label: "Flipkart", discount: "15% OFF", cta: "SIGN UP FREE", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop", buttonText: "Sign Up Free", buttonLink: "/signup", bannerType: "hero_left", isActive: true },
        { title: "Travel Deals — Flights from ₹999", subtitle: "Book now, travel anytime", label: "MakeMyTrip", discount: "₹999", cta: "BOOK NOW", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=400&fit=crop", buttonText: "Book Now", buttonLink: "/stores/makemytrip", bannerType: "hero_left", isActive: true },
        // Right banners (hero_right)
        { title: "Nike Flash Sale — Extra 40% Off All Shoes", label: "Nike", discount: "40% OFF", cta: "GRAB NOW", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", buttonLink: "https://www.nike.com", storeUrl: "https://www.nike.com", couponCode: "NIKE40", bannerType: "hero_right", cardBgColor: "#1a1a2e", isActive: true },
        { title: "Nykaa Beauty Fest — Up to 50% Off Skincare", label: "Nykaa", discount: "50% OFF", cta: "SHOP BEAUTY", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop", buttonLink: "https://www.nykaa.com", storeUrl: "https://www.nykaa.com", couponCode: "BEAUTY50", bannerType: "hero_right", cardBgColor: "#4a1942", isActive: true },
        { title: "Swiggy — ₹100 Off First 3 Orders", label: "Swiggy", discount: "₹100 OFF", cta: "ORDER NOW", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", buttonLink: "https://www.swiggy.com", storeUrl: "https://www.swiggy.com", couponCode: "SWIGGY100", bannerType: "hero_right", cardBgColor: "#fc8019", isActive: true },
      ]);
      console.log("✅ Banners seeded (7)");
    }

    // ─── NAVIGATION ───────────────────────────────────────────────
    const navCount = await Navigation.countDocuments();
    if (navCount === 0) {
      await Navigation.create({
        menu: [
          { name: "Home", url: "/" },
          { name: "All Stores", url: "/stores" },
          { name: "Categories", url: "/categories" },
          { name: "Trending Deals", url: "/trending" },
          { name: "Cash Back", url: "/cashback" },
        ],
        theme: { backgroundColor: "#7c3aed", textColor: "#ffffff" }
      });
      console.log("✅ Navigation seeded");
    }

    // ─── NAVBAR ITEMS ─────────────────────────────────────────────
    const navItemCount = await NavbarItem.countDocuments();
    if (navItemCount === 0) {
      await NavbarItem.insertMany([
        { title: "Home", url: "/", order: 1, isActive: true },
        { title: "All Stores", url: "/stores", order: 2, isActive: true },
        { title: "Categories", url: "/categories", order: 3, isActive: true },
        { title: "Trending Deals", url: "/trending", order: 4, isActive: true },
        { title: "Cash Back", url: "/cashback", order: 5, isActive: true },
      ]);
      console.log("✅ Navbar items seeded (5)");
    }

    // ─── FOOTER LINKS ─────────────────────────────────────────────
    const footerCount = await FooterLink.countDocuments();
    if (footerCount === 0) {
      await FooterLink.insertMany([
        { label: "Cash Back", href: "/cashback", section: "main", order: 1 },
        { label: "Browse Stores", href: "/stores", section: "main", order: 2 },
        { label: "Browse Categories", href: "/categories", section: "main", order: 3 },
        { label: "Trending Deals", href: "/trending", section: "main", order: 4 },
        { label: "Blog", href: "/blog", section: "main", order: 5 },
        { label: "Browser Extension", href: "/extension", section: "main", order: 6 },
        { label: "My Account", href: "/account", section: "myRmn", order: 1 },
        { label: "Submit a Coupon", href: "/submit", section: "myRmn", order: 2 },
        { label: "Get Help", href: "/help", section: "myRmn", order: 3 },
        { label: "Community", href: "/community", section: "myRmn", order: 4 },
        { label: "Terms of Service", href: "/terms", section: "bottom", order: 1 },
        { label: "Privacy Policy", href: "/privacy", section: "bottom", order: 2 },
        { label: "Accessibility", href: "/accessibility", section: "bottom", order: 3 },
        { label: "Sitemap", href: "/sitemap", section: "bottom", order: 4 },
        { label: "Careers", href: "/careers", section: "bottom", order: 5 },
      ]);
      console.log("✅ Footer links seeded (15)");
    }

    // ─── SITE CONFIG ──────────────────────────────────────────────
    const configCount = await SiteConfig.countDocuments();
    if (configCount === 0) {
      await SiteConfig.create({
        siteName: "Coupons Script",
        siteDescription: "Find the best deals, coupons and discounts from top brands. Save money on every purchase.",
        contactEmail: "support@couponsscript.com",
        seo: {
          metaTitle: "Coupons Script — Best Coupons, Deals & Promo Codes",
          metaDescription: "Save money with the latest coupons, promo codes and cash back offers from 4,000+ top brands.",
          metaKeywords: ["coupons", "deals", "promo codes", "discounts", "cash back", "savings"],
          favicon: "/favicon.ico",
          ogTitle: "Coupons Script — Best Coupons & Deals",
          ogDescription: "Find the best deals and coupons from top brands.",
          ogImage: "/og-image.jpg",
          twitterCard: "summary_large_image",
          twitterSite: "@couponsscript"
        },
        theme: {
          primaryColor: "#7c3aed",
          secondaryColor: "#9333ea",
          backgroundColor: "#ffffff",
          textColor: "#111827",
          accentColor: "#f59e0b",
          successColor: "#10b981",
          errorColor: "#ef4444",
          warningColor: "#f59e0b"
        },
        fonts: { heading: "Inter", body: "Roboto", mono: "Fira Code" },
        logos: { navbar: "", footer: "", favicon: "/favicon.ico", ogImage: "/og-image.jpg" },
        socialMedia: {
          facebook: { label: "Facebook", url: "https://facebook.com/couponsscript", icon: "facebook", enabled: true },
          twitter: { label: "Twitter", url: "https://twitter.com/couponsscript", icon: "twitter", enabled: true },
          instagram: { label: "Instagram", url: "https://instagram.com/couponsscript", icon: "instagram", enabled: true },
          linkedin: { label: "LinkedIn", url: "https://linkedin.com/company/couponsscript", icon: "linkedin", enabled: false },
          youtube: { label: "YouTube", url: "https://youtube.com/couponsscript", icon: "youtube", enabled: false },
          tiktok: { label: "TikTok", url: "https://tiktok.com/@couponsscript", icon: "tiktok", enabled: false }
        },
        footer: {
          copyright: "© Coupons Script 2026. All rights reserved.",
          email: "support@couponsscript.com",
          phone: "+1 (555) 123-4567",
          address: "123 Coupon Street, Deal City, DC 12345",
          showSocialMedia: true,
          showNewsletter: true
        }
      });
      console.log("✅ Site config seeded");
    }

    // ─── HOME PAGE ────────────────────────────────────────────────
    const pageCount = await Page.countDocuments({ page: "home" });
    if (pageCount === 0) {
      await Page.create({
        page: "home",
        title: "Home",
        slug: "home",
        isPublished: true,
        sections: [
          { id: "s1", order: 1, type: "heroBanner", title: "Best Coupons & Deals Today" },
          { id: "s2", order: 2, type: "featuredCoupons", title: "The Best Coupons, Promo Codes & Cash Back Offers", limit: 4 },
          { id: "s3", order: 3, type: "popularOffers", title: "Popular Offers of the Day", limit: 4 },
          { id: "s4", order: 4, type: "popularStores", title: "Popular Stores", limit: 12 },
          { id: "s5", order: 5, type: "topCoupons", title: "Today's Top Coupons & Offers", limit: 6 },
          { id: "s6", order: 6, type: "dealsOfDay", title: "Deals Of The Day", limit: 4 },
          { id: "s7", order: 7, type: "collections", title: "Coupons Script Collections", limit: 4 },
          { id: "s8", order: 8, type: "trendingCoupons", title: "Trending Deals Right Now", limit: 8 },
          { id: "s9", order: 9, type: "topStores", title: "Shop at Top Stores", limit: 6 },
          { id: "s10", order: 10, type: "categories", title: "Browse by Category" },
          { id: "s11", order: 11, type: "latestCoupons", title: "Latest Coupons", limit: 10 },
        ]
      });
      console.log("✅ Home page seeded");
    }

    console.log("🎉 All sample data seeded successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  }
};
