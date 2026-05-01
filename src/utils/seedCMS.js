import mongoose from "mongoose";
import { SiteConfig } from "../models/SiteConfig.js";
import { Navigation } from "../models/Navigation.js";
import { Banner } from "../models/Banner.js";
import { Page } from "../models/Page.js";
import FeaturedCoupon from "../models/FeaturedCoupon.js";
import FooterLink from "../models/FooterLink.js";

export const seedCMSData = async () => {
  try {
    // Seed Site Config
    const existingConfig = await SiteConfig.findOne();
    if (!existingConfig) {
      await SiteConfig.create({
        siteName: "Coupons Script",
        
        seo: {
          metaTitle: "Coupons Script - Best Deals & Coupons",
          metaDescription: "Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with Coupons Script.",
          metaKeywords: ["coupons", "deals", "discounts", "savings", "promo codes"],
          favicon: "/favicon.ico",
          ogTitle: "Coupons Script - Best Deals & Coupons",
          ogDescription: "Find the best deals, coupons, and discounts from top brands.",
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
        
        fonts: {
          heading: "Inter",
          body: "Roboto",
          mono: "Fira Code"
        },
        
        logos: {
          navbar: "/uploads/navbar-logo.png",
          footer: "/uploads/footer-logo.png",
          favicon: "/uploads/favicon.ico",
          ogImage: "/uploads/og-image.jpg"
        },
        
        socialMedia: {
          facebook: {
            label: "Facebook",
            url: "https://facebook.com/couponsscript",
            icon: "facebook",
            enabled: true
          },
          twitter: {
            label: "Twitter",
            url: "https://twitter.com/couponsscript",
            icon: "twitter",
            enabled: true
          },
          instagram: {
            label: "Instagram",
            url: "https://instagram.com/couponsscript",
            icon: "instagram",
            enabled: true
          },
          linkedin: {
            label: "LinkedIn",
            url: "https://linkedin.com/company/couponsscript",
            icon: "linkedin",
            enabled: false
          },
          youtube: {
            label: "YouTube",
            url: "https://youtube.com/couponsscript",
            icon: "youtube",
            enabled: false
          },
          tiktok: {
            label: "TikTok",
            url: "https://tiktok.com/@couponsscript",
            icon: "tiktok",
            enabled: false
          }
        },
        
        footer: {
          copyright: "© Coupons Script 2026",
          email: "support@couponsscript.com",
          phone: "+1 (555) 123-4567",
          address: "123 Coupon Street, Deal City, DC 12345",
          showSocialMedia: true,
          showNewsletter: true
        }
      });
      console.log("Site config seeded");
    }

    // Seed Navigation
    const existingNav = await Navigation.findOne();
    if (!existingNav) {
      await Navigation.create({
        menu: [
          { name: "Home", url: "/" },
          { name: "Stores", url: "/stores" },
          { name: "Categories", url: "/categories" },
          { name: "Trending", url: "/trending" }
        ],
        theme: {
          backgroundColor: "#7c3aed",
          textColor: "#ffffff"
        }
      });
      console.log("Navigation seeded");
    }

    // Seed Banners
    const existingBanners = await Banner.find();
    if (existingBanners.length === 0) {
      await Banner.insertMany([
        {
          title: "Up to 70% Off Spring Sale",
          subtitle: "Limited Time Offer",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
          buttonText: "Shop Now",
          buttonLink: "/deals/spring",
          isActive: true
        },
        {
          title: "Exclusive Cash Back Deals",
          subtitle: "Earn up to 20% back",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
          buttonText: "Get Cashback",
          buttonLink: "/cashback",
          isActive: true
        },
        {
          title: "New Member Special",
          subtitle: "Extra 15% off your first order",
          image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop",
          buttonText: "Sign Up",
          buttonLink: "/signup",
          isActive: true
        }
      ]);
      console.log("Banners seeded");
    }

    // Seed Homepage
    const existingPage = await Page.findOne({ page: "home" });
    if (!existingPage) {
      await Page.create({
        page: "home",
        title: "Home",
        slug: "home",
        sections: [
          { id: "section-1", order: 1, type: "heroBanner", title: "Best Coupons Today", image: "/uploads/hero.jpg" },
          { id: "section-2", order: 2, type: "featuredCoupons", title: "Featured Deals" },
          { id: "section-3", order: 3, type: "popularOffers", title: "Popular Offers of the Day", limit: 4 },
          { id: "section-4", order: 4, type: "popularStores", title: "Popular Stores", limit: 12 },
          { id: "section-5", order: 5, type: "topCoupons", title: "Today's Top Coupons & Offers", limit: 6 },
          { id: "section-6", order: 6, type: "dealsOfDay", title: "Deals Of The Day", limit: 4 },
          { id: "section-7", order: 7, type: "collections", title: "Coupons Script Collections", limit: 4 },
          { id: "section-8", order: 8, type: "trendingCoupons", title: "Trending Coupons", limit: 8 },
          { id: "section-9", order: 9, type: "topStores", title: "Top Stores", limit: 6 },
          { id: "section-10", order: 10, type: "latestCoupons", title: "Latest Coupons", limit: 10 },
          { id: "section-11", order: 11, type: "categories", title: "Shop by Category" }
        ]
      });
      console.log("Homepage seeded");
    }

    // Seed Featured Coupons
    const existingFeatured = await FeaturedCoupon.find();
    if (existingFeatured.length === 0) {
      await FeaturedCoupon.insertMany([
        {
          title: "Exclusive 25% Off Electronics",
          href: "/deals/electronics",
          theme: "white",
          logo: "https://via.placeholder.com/40x40/6366f1/ffffff?text=E",
          logoWidth: 40,
          logoHeight: 40,
          logoAlt: "Electronics",
          cta: "Shop Now",
          image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=160&h=170&fit=crop",
          isActive: true,
          order: 1
        },
        {
          title: "Fashion Sale - Up to 50% Off",
          href: "/deals/fashion",
          theme: "white",
          logo: "https://via.placeholder.com/40x40/ec4899/ffffff?text=F",
          logoWidth: 40,
          logoHeight: 40,
          logoAlt: "Fashion",
          cta: "Reveal Code",
          image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=160&h=170&fit=crop",
          isActive: true,
          order: 2
        },
        {
          title: "Guaranteed Cash Back from 4,000+ Brands",
          href: "/cashback",
          theme: "purple",
          logo: "",
          logoWidth: 32,
          logoHeight: 40,
          logoAlt: "Coupons Script",
          cta: "Shop Coupons Script",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=160&h=170&fit=crop",
          isActive: true,
          order: 3
        }
      ]);
      console.log("Featured coupons seeded");
    }

    // Seed Footer Links
    const existingFooterLinks = await FooterLink.find();
    if (existingFooterLinks.length === 0) {
      await FooterLink.insertMany([
        // Main section links
        { label: 'CASH BACK', href: '/cashback', section: 'main', order: 1 },
        { label: 'BROWSE STORES', href: '/stores', section: 'main', order: 2 },
        { label: 'BROWSE CATEGORIES', href: '/categories', section: 'main', order: 3 },
        { label: 'THE REAL DEAL BLOG', href: '/blog', section: 'main', order: 4 },
        { label: 'BROWSER EXTENSION', href: '/extension', section: 'main', order: 5 },
        { label: 'CAREERS', href: '/careers', section: 'main', order: 6 },
        
        // My RMN section links
        { label: 'My Account + Rewards', href: '/account', section: 'myRmn', order: 1 },
        { label: 'RMN Community', href: '/community', section: 'myRmn', order: 2 },
        { label: 'Submit a Coupon', href: '/submit', section: 'myRmn', order: 3 },
        { label: 'Get Help', href: '/help', section: 'myRmn', order: 4 },
        
        // Bottom section links
        { label: 'CouponFeast Canada', href: '/ca', section: 'bottom', order: 1 },
        { label: 'AdChoices', href: '/adchoices', section: 'bottom', order: 2 },
        { label: 'Terms of Service', href: '/terms', section: 'bottom', order: 3 },
        { label: 'Privacy Policy', href: '/privacy', section: 'bottom', order: 4 },
        { label: 'Do Not Sell My Personal Information', href: '/privacy/do-not-sell', section: 'bottom', order: 5 },
        { label: 'Accessibility', href: '/accessibility', section: 'bottom', order: 6 },
        { label: 'Sitemap', href: '/sitemap', section: 'bottom', order: 7 }
      ]);
      console.log("Footer links seeded");
    }

    console.log("CMS data seeding completed!");
  } catch (error) {
    console.error("Error seeding CMS data:", error);
  }
};