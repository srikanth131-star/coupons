// Seed script — run with: node server/seed-data.mjs
// Make sure server is running on http://localhost:5000 first

const API = 'http://localhost:5000/api';

async function post(url, data) {
  const res = await fetch(`${API}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
async function put(url, data) {
  const res = await fetch(`${API}${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
async function get(url) {
  const res = await fetch(`${API}${url}`);
  return res.json();
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  // 1. Get existing stores
  const storesRes = await get('/public/stores/list');
  const stores = storesRes.data || storesRes || [];
  if (stores.length === 0) { console.log('❌ No stores found. Create stores first.'); return; }
  console.log(`✅ Found ${stores.length} stores`);

  const storeMap = {};
  stores.forEach(s => { storeMap[s.storeName?.toLowerCase()] = s; });
  const storeIds = stores.map(s => s._id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 2. Update categories with icons
  const catRes = await get('/public/categories/list');
  const cats = catRes.data || catRes || [];
  const catIcons = {
    'beauty': '💄', 'electronics': '📱', 'fashion': '👗', 'food & dining': '🍕', 'food': '🍕',
    'groceries': '🛒', 'home & garden': '🏡', 'sports': '⚽', 'travel': '✈️',
    'shopping': '🛍️', 'health': '💊', 'entertainment': '🎬', 'education': '📚',
    'automotive': '🚗', 'finance': '💰', 'kids': '🧸', 'pets': '🐾', 'books': '📖',
  };
  for (const cat of cats) {
    const icon = catIcons[cat.name?.toLowerCase()] || catIcons[cat.slug?.toLowerCase()] || '🏷️';
    if (!cat.icon || cat.icon === '🏷️') {
      await put(`/admin/categories/update/${cat._id}`, { icon });
      console.log(`  🏷️ ${cat.name} → ${icon}`);
    }
  }
  console.log(`✅ Updated ${cats.length} category icons\n`);

  // 3. Create 20 coupons (spread across stores)
  const couponData = [
    { title: 'Extra 20% Off Sitewide', discount: '20%', code: 'EXTRA20', type: 'code' },
    { title: 'Flat ₹500 Off on Orders Above ₹2999', discount: '₹500', code: 'FLAT500', type: 'code' },
    { title: 'Buy 2 Get 1 Free on All Items', discount: 'B2G1', code: 'BUY2GET1', type: 'code' },
    { title: 'Free Shipping on All Orders', discount: 'Free Ship', type: 'freeshipping' },
    { title: '30% Off First Order', discount: '30%', code: 'FIRST30', type: 'code' },
    { title: 'Up to 50% Off Summer Collection', discount: '50%', type: 'sale' },
    { title: '₹200 Cashback on ₹999+ Orders', discount: '₹200', type: 'cashback' },
    { title: '15% Off with Student Discount', discount: '15%', code: 'STUDENT15', type: 'code' },
    { title: 'Flash Sale — Extra 40% Off Clearance', discount: '40%', type: 'sale' },
    { title: '₹100 Off on App Orders', discount: '₹100', code: 'APP100', type: 'code' },
    { title: 'Weekend Special — 25% Off Everything', discount: '25%', code: 'WEEKEND25', type: 'code' },
    { title: 'Free Gift on Orders Above ₹1499', discount: 'Free Gift', code: 'GIFT1499', type: 'code' },
    { title: '10% Cashback with Credit Card', discount: '10%', type: 'cashback' },
    { title: 'Mega Sale — Up to 70% Off', discount: '70%', type: 'sale' },
    { title: '₹300 Off on New Arrivals', discount: '₹300', code: 'NEW300', type: 'code' },
    { title: 'Refer & Earn ₹500', discount: '₹500', code: 'REFER500', type: 'cashback' },
    { title: 'Flat 35% Off on Premium Range', discount: '35%', code: 'PREMIUM35', type: 'code' },
    { title: 'Free Express Delivery This Week', discount: 'Free Express', type: 'freeshipping' },
    { title: 'Exclusive Member — 45% Off', discount: '45%', code: 'MEMBER45', type: 'code' },
    { title: 'End of Season Sale — Up to 60% Off', discount: '60%', type: 'sale' },
  ];

  const createdCoupons = [];
  for (let i = 0; i < couponData.length; i++) {
    const store = stores[i % stores.length];
    const c = couponData[i];
    const expiry = new Date(); expiry.setDate(expiry.getDate() + 30 + Math.floor(Math.random() * 60));
    const res = await post('/admin/coupons/create', {
      title: c.title, discount: c.discount, code: c.code || '', type: c.type,
      store: store._id, isActive: true, isFeatured: i < 6,
      expiryDate: expiry.toISOString(),
      interestedUsers: Math.floor(Math.random() * 2000) + 100,
      limitedTime: Math.random() > 0.6, exclusive: Math.random() > 0.7,
      details: `Save big with this ${c.discount} offer from ${store.storeName}. Limited time only!`,
    });
    createdCoupons.push(res.data || res);
    console.log(`  🎟️ Coupon: ${c.title} → ${store.storeName}`);
  }
  console.log(`✅ Created ${couponData.length} coupons\n`);

  // 4. Create deals for each homepage section
  const sectionDeals = [
    // Popular Offers of the Day
    { title: 'iPhone 15 Pro — Lowest Price Ever', discount: '₹15000 Off', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop', section: 'popular_offers' },
    { title: 'Samsung Galaxy S24 Ultra Deal', discount: '₹12000 Off', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop', section: 'popular_offers' },
    { title: 'Nike Air Max 90 — Limited Edition', discount: '40% Off', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', section: 'popular_offers' },
    { title: 'Sony WH-1000XM5 Headphones', discount: '30% Off', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', section: 'popular_offers' },
    // Deals Of The Day
    { title: 'MacBook Air M3 — Student Offer', discount: '₹10000 Off', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', section: 'deals_of_day' },
    { title: 'Adidas Ultraboost — Flash Sale', discount: '50% Off', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop', section: 'deals_of_day' },
    { title: 'Home Decor Essentials Bundle', discount: '35% Off', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', section: 'deals_of_day' },
    { title: 'Kitchen Appliances Mega Sale', discount: 'Up to 60% Off', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', section: 'deals_of_day' },
    // Collections
    { title: 'Fitness Tracker — Best Price', discount: '₹2000 Off', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop', section: 'collections' },
    { title: 'Designer Sunglasses Collection', discount: '45% Off', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', section: 'collections' },
    { title: 'Gaming Console Bundle Deal', discount: '₹8000 Off', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop', section: 'collections' },
    { title: 'Organic Skincare Set', discount: '25% Off', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop', section: 'collections' },
    // Trending Deals
    { title: 'Smart Watch — Premium Edition', discount: '₹5000 Off', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', section: 'trending_deals' },
    { title: 'Travel Luggage Set — Durable', discount: '30% Off', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', section: 'trending_deals' },
    { title: 'Wireless Earbuds — Top Rated', discount: '₹1500 Off', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop', section: 'trending_deals' },
    { title: 'Running Shoes — All Terrain', discount: '40% Off', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop', section: 'trending_deals' },
    // General deals (no section)
    { title: 'Coffee Machine — Barista Quality', discount: '₹3000 Off', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', section: '' },
    { title: 'Backpack Collection — Trendy', discount: '20% Off', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', section: '' },
    { title: 'Tablet — Best for Students', discount: '₹7000 Off', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', section: '' },
    { title: 'Premium Perfume Gift Set', discount: '35% Off', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop', section: '' },
  ];

  for (let i = 0; i < sectionDeals.length; i++) {
    const store = stores[i % stores.length];
    const d = sectionDeals[i];
    await post('/admin/deals/create', {
      title: d.title, discount: d.discount, image: d.image, section: d.section,
      store: store._id, isActive: true, isFeatured: i < 5,
      type: i % 3 === 0 ? 'deal' : i % 3 === 1 ? 'offer' : 'flash',
      link: store.websiteUrl || `https://${store.slug}.com`,
      description: `Amazing deal on ${d.title} from ${store.storeName}!`,
    });
    console.log(`  🔥 Deal: ${d.title} → ${store.storeName} [${d.section || 'general'}]`);
  }
  console.log(`✅ Created ${sectionDeals.length} deals\n`);

  // 5. Create 20 blog articles
  const blogData = [
    { title: 'Top 10 Money-Saving Tips for 2026', category: 'SAVINGS', subtitle: 'Smart Shopping Guide', description: 'Learn the best strategies to save money while shopping online in 2026.' },
    { title: 'Best Black Friday Deals to Watch', category: 'DEALS', subtitle: 'Annual Sale Guide', description: 'Our curated list of the best Black Friday deals across all categories.' },
    { title: 'How to Stack Coupons Like a Pro', category: 'TIPS', subtitle: 'Expert Couponing', description: 'Master the art of coupon stacking to maximize your savings.' },
    { title: 'Summer Fashion Trends on a Budget', category: 'FASHION', subtitle: 'Style for Less', description: 'Stay trendy without breaking the bank with these budget fashion tips.' },
    { title: 'Best Tech Deals This Month', category: 'TECH', subtitle: 'Gadget Savings', description: 'The hottest tech deals and discounts available right now.' },
    { title: 'Grocery Shopping Hacks', category: 'GROCERIES', subtitle: 'Save on Food', description: 'Cut your grocery bill in half with these proven strategies.' },
    { title: 'Travel on a Budget — Complete Guide', category: 'TRAVEL', subtitle: 'Cheap Travel Tips', description: 'How to travel the world without emptying your wallet.' },
    { title: 'Best Cashback Apps in India', category: 'CASHBACK', subtitle: 'Earn While You Shop', description: 'Top cashback apps that actually pay you back.' },
    { title: 'Home Decor Ideas Under ₹5000', category: 'HOME', subtitle: 'Budget Decor', description: 'Transform your space with these affordable decor ideas.' },
    { title: 'Fitness Gear Deals & Discounts', category: 'FITNESS', subtitle: 'Workout Savings', description: 'Get fit for less with these amazing fitness gear deals.' },
    { title: 'Back to School Savings Guide', category: 'EDUCATION', subtitle: 'Student Deals', description: 'Everything students need at the best prices.' },
    { title: 'Best Food Delivery Coupons', category: 'FOOD', subtitle: 'Order & Save', description: 'Never pay full price for food delivery again.' },
    { title: 'Skincare Products Worth the Splurge', category: 'BEAUTY', subtitle: 'Beauty Picks', description: 'Premium skincare that is worth every penny.' },
    { title: 'Gaming Deals — Console & PC', category: 'GAMING', subtitle: 'Gamer Savings', description: 'Level up your setup without leveling up your spending.' },
    { title: 'Wedding Season Shopping Guide', category: 'LIFESTYLE', subtitle: 'Celebration Savings', description: 'Shop smart for the wedding season with these deals.' },
    { title: 'Best Credit Card Offers 2026', category: 'FINANCE', subtitle: 'Card Benefits', description: 'Maximize rewards with the right credit card offers.' },
    { title: 'Sustainable Shopping on a Budget', category: 'ECO', subtitle: 'Green & Affordable', description: 'Shop sustainably without spending more.' },
    { title: 'Pet Supplies — Best Deals', category: 'PETS', subtitle: 'Pamper Your Pet', description: 'Top deals on pet food, toys, and accessories.' },
    { title: 'Monsoon Sale Preview 2026', category: 'SEASONAL', subtitle: 'Rain of Deals', description: 'What to expect from this year monsoon mega sales.' },
    { title: 'DIY Gift Ideas That Save Money', category: 'GIFTS', subtitle: 'Thoughtful & Cheap', description: 'Heartfelt gift ideas that won not break the bank.' },
  ];

  const blogImages = [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=400&fit=crop',
  ];

  for (let i = 0; i < blogData.length; i++) {
    const b = blogData[i];
    const slug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    await post('/admin/blog/create', {
      title: b.title, category: b.category, subtitle: b.subtitle,
      description: b.description, slug,
      image: blogImages[i],
      content: [b.description, `Check out the latest ${b.category.toLowerCase()} deals and offers on Coupons Script. We update our deals daily to bring you the best savings.`, `Don't miss out — bookmark this page and check back regularly for new ${b.category.toLowerCase()} deals!`],
      isFeatured: i < 3, isActive: true,
    });
    console.log(`  📝 Blog: ${b.title}`);
  }
  console.log(`✅ Created ${blogData.length} blog articles\n`);

  console.log('🎉 Seed complete! Refresh your site to see the data.');
}

seed().catch(console.error);
