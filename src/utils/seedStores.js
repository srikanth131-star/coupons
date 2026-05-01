import Store from "../models/Store.js";

export const seedStores = async () => {
  try {
    const count = await Store.countDocuments();
    if (count > 0) return;

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

    console.log("Stores seeded successfully (12 stores)");
  } catch (error) {
    console.error("Error seeding stores:", error.message);
  }
};
