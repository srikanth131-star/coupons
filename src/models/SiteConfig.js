import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
  siteName: { type: String, default: "Coupons Script" },
  siteDescription: { type: String, default: "Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with Coupons Script." },
  contactEmail: { type: String, default: "support@couponsscript.com" },
  themeName: { type: String, default: "purple" },
  
  // SEO & Meta Tags
  seo: {
    metaTitle: { type: String, default: "Coupons Script - Best Deals & Coupons" },
    metaDescription: { type: String, default: "Find the best deals, coupons, and discounts from top brands. Save money on your favorite products with Coupons Script." },
    metaKeywords: [{ type: String }],
    favicon: { type: String, default: "/favicon.ico" },
    ogTitle: { type: String, default: "Coupons Script - Best Deals & Coupons" },
    ogDescription: { type: String, default: "Find the best deals, coupons, and discounts from top brands." },
    ogImage: { type: String, default: "/og-image.jpg" },
    twitterCard: { type: String, default: "summary_large_image" },
    twitterSite: { type: String, default: "@couponsscript" }
  },
  
  // Theme & Colors
  theme: {
    primaryColor: { type: String, default: "#7c3aed" },
    secondaryColor: { type: String, default: "#9333ea" },
    backgroundColor: { type: String, default: "#ffffff" },
    textColor: { type: String, default: "#111827" },
    accentColor: { type: String, default: "#f59e0b" },
    successColor: { type: String, default: "#10b981" },
    errorColor: { type: String, default: "#ef4444" },
    warningColor: { type: String, default: "#f59e0b" }
  },
  
  // Typography - Predefined Font Combinations
  fonts: {
    combination: { 
      type: String, 
      default: "modern",
      enum: [
        "modern",      // Inter + Roboto + Fira Code
        "classic",     // Playfair Display + Source Sans Pro + Monaco
        "minimal",     // Poppins + Open Sans + Consolas
        "elegant",     // Crimson Text + Lato + Courier New
        "tech",        // JetBrains Mono + IBM Plex Sans + JetBrains Mono
        "friendly",    // Nunito + Nunito Sans + Source Code Pro
        "professional", // Merriweather + PT Sans + Menlo
        "creative",    // Montserrat + Raleway + SF Mono
        "clean",       // System UI + -apple-system + ui-monospace
        "bold"         // Oswald + Roboto Condensed + Roboto Mono
      ]
    }
  },
  
  // Logos
  logos: {
    navbar: { type: String, default: "/uploads/navbar-logo.png" },
    footer: { type: String, default: "/uploads/footer-logo.png" },
    favicon: { type: String, default: "/uploads/favicon.ico" },
    ogImage: { type: String, default: "/uploads/og-image.jpg" }
  },
  
  // Social Media
  socialMedia: {
    facebook: {
      label: { type: String, default: "Facebook" },
      url: { type: String, default: "https://facebook.com/couponsscript" },
      icon: { type: String, default: "facebook" },
      enabled: { type: Boolean, default: true }
    },
    twitter: {
      label: { type: String, default: "Twitter" },
      url: { type: String, default: "https://twitter.com/couponsscript" },
      icon: { type: String, default: "twitter" },
      enabled: { type: Boolean, default: true }
    },
    instagram: {
      label: { type: String, default: "Instagram" },
      url: { type: String, default: "https://instagram.com/couponsscript" },
      icon: { type: String, default: "instagram" },
      enabled: { type: Boolean, default: true }
    },
    linkedin: {
      label: { type: String, default: "LinkedIn" },
      url: { type: String, default: "https://linkedin.com/company/couponsscript" },
      icon: { type: String, default: "linkedin" },
      enabled: { type: Boolean, default: false }
    },
    youtube: {
      label: { type: String, default: "YouTube" },
      url: { type: String, default: "https://youtube.com/couponsscript" },
      icon: { type: String, default: "youtube" },
      enabled: { type: Boolean, default: false }
    },
    tiktok: {
      label: { type: String, default: "TikTok" },
      url: { type: String, default: "https://tiktok.com/@couponsscript" },
      icon: { type: String, default: "tiktok" },
      enabled: { type: Boolean, default: false }
    }
  },
  
  // Navbar Configuration
  navbar: {
    layout: { type: String, default: 'navbar2' },
    style: { type: String, default: 'solid' },
    bgColor: { type: String, default: '' },
    textColor: { type: String, default: '' },
    showSearch: { type: Boolean, default: true },
    showThemeToggle: { type: Boolean, default: true },
    sticky: { type: Boolean, default: true },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    bannerText: { type: String, default: '' },
    bannerHighlight: { type: String, default: '' },
    showBanner: { type: Boolean, default: true }
  },

  // Footer Configuration
  footer: {
    copyright: { type: String, default: "© Coupons Script 2026" },
    email: { type: String, default: "support@couponsscript.com" },
    phone: { type: String, default: "+1 (555) 123-4567" },
    address: { type: String, default: "123 Coupon Street, Deal City, DC 12345" },
    showSocialMedia: { type: Boolean, default: true },
    showNewsletter: { type: Boolean, default: true }
  },

  // Footer Config (style/customization)
  footerConfig: {
    layout: { type: String, default: 'footer1' },
    style: { type: String, default: 'standard' },
    bgColor: { type: String, default: '' },
    textColor: { type: String, default: '' },
    showAppDownload: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true }
  },

  // Footer Content (editable columns per layout)
  footerContent: {
    tagline: { type: String, default: 'Find the best deals, coupons, and discounts from top brands.' },
    columns: [{
      heading: { type: String },
      links: [{ label: { type: String }, href: { type: String } }]
    }]
  },

  // Footer Popular Categories (4-column grouped links)
  footerCategoriesHeading: { type: String, default: 'Popular Categories' },
  footerCategories: [{
    title: { type: String },
    groups: [{
      heading: { type: String },
      links: [{ label: { type: String }, href: { type: String } }]
    }]
  }],

  // Promo Card (homepage video/promo section)
  promoCard: {
    title: { type: String, default: 'Earn Up To $100 ExtraBucks At CVS' },
    description: { type: String, default: "Steal this influencer's top picks from her latest CVS beauty haul." },
    ctaText: { type: String, default: 'Click To Watch Video' },
    ctaLink: { type: String, default: '#' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop' },
    videoUrl: { type: String, default: '' },
    bgColor: { type: String, default: '#2563eb' },
    enabled: { type: Boolean, default: true }
  },

  // Global FAQs
  faqs: {
    heading: { type: String, default: 'Frequently Asked Questions' },
    showOn: { type: String, default: 'both', enum: ['home', 'store', 'both'] },
    items: { type: [{ question: String, answer: String }], default: [] }
  },

  // Blog Configuration
  blog: {
    socialSidebar: {
      enabled: { type: Boolean, default: true },
      showLikes: { type: Boolean, default: true },
      showShare: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: true },
      position: { type: String, default: 'left', enum: ['left', 'right'] }
    }
  },

  // Page-Specific OG Images
  pageOgImages: {
    type: Map,
    of: String,
    default: {}
  },

  // Page-Specific SEO
  pageSeo: {
    type: Map,
    of: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' }
    },
    default: {}
  },

  // About Us Page
  aboutPage: {
    intro: { type: String, default: '' },
    story: { type: String, default: '' },
    stats: [{ number: { type: String }, label: { type: String } }],
    features: [{ title: { type: String }, description: { type: String }, icon: { type: String } }],
    values: [{ title: { type: String }, description: { type: String } }],
  },

  // Contact Us Page
  contactPage: {
    description: { type: String, default: '' },
    email: { type: String, default: '' },
    emailNote: { type: String, default: "We'll respond within 24 hours" },
    phone: { type: String, default: '' },
    phoneNote: { type: String, default: 'Mon-Fri, 9AM-6PM EST' },
    address: { type: String, default: '' },
    faqs: [{ question: { type: String }, answer: { type: String } }],
  },

  // Analytics & Tracking
  analytics: {
    googleAnalytics: {
      enabled: { type: Boolean, default: false },
      trackingId: { type: String, default: process.env.GA4_MEASUREMENT_ID || "" }
    },
    clarity: {
      enabled: { type: Boolean, default: false },
      projectId: { type: String, default: process.env.CLARITY_PROJECT_ID || "" }
    },
    facebookPixel: {
      enabled: { type: Boolean, default: false },
      pixelId: { type: String, default: "" }
    },
    tiktokPixel: {
      enabled: { type: Boolean, default: false },
      pixelId: { type: String, default: "" }
    },
    customScripts: {
      headerScripts: { type: String, default: "" },
      footerScripts: { type: String, default: "" }
    }
  }
}, { timestamps: true });

export const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);