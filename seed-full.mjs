// Run: node server/seed-full.mjs
const API = 'http://localhost:5000/api';
const post = (url, data) => fetch(`${API}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
const get = (url) => fetch(`${API}${url}`).then(r => r.json());

const imgs = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=160&h=170&fit=crop',
];

const dealImgs = [
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
];

const bannerImgs = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=400&fit=crop',
];

const couponTemplates = [
  { t: '{s} — Extra 20% Off Sitewide', d: '20%', code: 'SAVE20', type: 'code' },
  { t: '{s} — Flat ₹300 Off on ₹1499+', d: '₹300', code: 'FLAT300', type: 'code' },
  { t: '{s} — Buy 1 Get 1 Free', d: 'BOGO', code: 'BOGO26', type: 'code' },
  { t: '{s} — Free Shipping All Orders', d: 'Free Ship', type: 'freeshipping' },
  { t: '{s} — 15% Cashback First Order', d: '15%', type: 'cashback' },
  { t: '{s} — Flash Sale Up to 50% Off', d: '50%', type: 'sale' },
  { t: '{s} — Student Discount 25% Off', d: '25%', code: 'STU25', type: 'code' },
  { t: '{s} — ₹500 Off App Orders', d: '₹500', code: 'APP500', type: 'code' },
  { t: '{s} — Weekend Special 30% Off', d: '30%', code: 'WKND30', type: 'code' },
  { t: '{s} — Clearance Up to 70% Off', d: '70%', type: 'sale' },
  { t: '{s} — New User ₹200 Off', d: '₹200', code: 'NEW200', type: 'code' },
  { t: '{s} — Refer & Earn ₹500', d: '₹500', type: 'cashback' },
  { t: '{s} — Premium Members 35% Off', d: '35%', code: 'VIP35', type: 'code' },
  { t: '{s} — Free Express Delivery', d: 'Free Express', type: 'freeshipping' },
  { t: '{s} — Exclusive 45% Off', d: '45%', code: 'EXC45', type: 'code' },
  { t: '{s} — End of Season 60% Off', d: '60%', type: 'sale' },
  { t: '{s} — ₹100 Off No Minimum', d: '₹100', code: 'MIN100', type: 'code' },
  { t: '{s} — 10% Cashback Credit Card', d: '10%', type: 'cashback' },
  { t: '{s} — Bundle Deal 40% Off', d: '40%', code: 'BUNDLE40', type: 'code' },
  { t: '{s} — Mega Sale Up to 80% Off', d: '80%', type: 'sale' },
];

const dealTemplates = [
  { t: '{s} — Top Rated Product Deal', d: '₹5000 Off', section: 'popular_offers' },
  { t: '{s} — Best Seller at Lowest Price', d: '40% Off', section: 'popular_offers' },
  { t: '{s} — Limited Edition Collection', d: '30% Off', section: 'popular_offers' },
  { t: '{s} — Premium Range Discount', d: '₹3000 Off', section: 'popular_offers' },
  { t: '{s} — Trending Now — Special Price', d: '50% Off', section: 'deals_of_day' },
  { t: '{s} — New Arrival Offer', d: '25% Off', section: 'deals_of_day' },
  { t: '{s} — Combo Pack Deal', d: '₹2000 Off', section: 'deals_of_day' },
  { t: '{s} — Seasonal Clearance', d: '60% Off', section: 'deals_of_day' },
  { t: '{s} — Flash Deal Today Only', d: '₹1500 Off', section: 'collections' },
  { t: '{s} — Exclusive Online Price', d: '35% Off', section: 'collections' },
  { t: '{s} — Festival Special Offer', d: '₹4000 Off', section: 'collections' },
  { t: '{s} — Member Only Deal', d: '45% Off', section: 'collections' },
  { t: '{s} — Bestseller Bundle', d: '₹2500 Off', section: 'trending_deals' },
  { t: '{s} — Weekend Flash Sale', d: '55% Off', section: 'trending_deals' },
  { t: '{s} — App Exclusive Deal', d: '₹1000 Off', section: 'trending_deals' },
  { t: '{s} — Early Bird Discount', d: '20% Off', section: 'trending_deals' },
  { t: '{s} — Loyalty Reward Deal', d: '₹3500 Off', section: '' },
  { t: '{s} — Summer Special Price', d: '70% Off', section: '' },
  { t: '{s} — Student Special Offer', d: '₹800 Off', section: '' },
  { t: '{s} — Mega Savings Deal', d: '₹6000 Off', section: '' },
];

const bannerTemplates = [
  { label: 'MEGA SAVINGS', t: 'Up to 70% Off on {s} — Shop Now', cta: 'SHOP THE DEALS' },
  { label: 'FLASH SALE', t: '{s} Flash Sale — Extra 50% Off Everything', cta: 'GRAB NOW' },
  { label: 'NEW ARRIVALS', t: '{s} New Collection — Flat 30% Off', cta: 'EXPLORE NOW' },
  { label: 'EXCLUSIVE OFFER', t: '{s} Exclusive — Buy 2 Get 1 Free', cta: 'CLAIM OFFER' },
  { label: 'WEEKEND DEAL', t: '{s} Weekend Special — Up to 60% Off', cta: 'SHOP WEEKEND' },
  { label: 'TRENDING NOW', t: 'Trending on {s} — Best Prices Guaranteed', cta: 'SEE TRENDING' },
  { label: 'LIMITED TIME', t: '{s} Limited Time — Extra ₹500 Off', cta: 'HURRY UP' },
  { label: 'SEASON SALE', t: '{s} End of Season — Up to 80% Off', cta: 'SHOP SALE' },
  { label: 'CASHBACK FEST', t: '{s} Cashback Fest — 20% Back on All Orders', cta: 'GET CASHBACK' },
  { label: 'TOP PICKS', t: '{s} Top Picks — Handpicked Deals for You', cta: 'VIEW PICKS' },
];

async function seed() {
  console.log('Starting full seed...\n');

  const storesRes = await get('/public/stores/list');
  const stores = storesRes.data || storesRes || [];
  if (!stores.length) { console.log('No stores found!'); return; }
  console.log(`Found ${stores.length} stores\n`);

  // 20 coupons per store
  let totalC = 0;
  for (const store of stores) {
    for (let i = 0; i < 20; i++) {
      const tpl = couponTemplates[i];
      const exp = new Date(); exp.setDate(exp.getDate() + 10 + Math.floor(Math.random() * 90));
      const suffix = store.storeName?.substring(0, 3).toUpperCase() || 'STR';
      await post('/admin/coupons/create', {
        title: tpl.t.replace('{s}', store.storeName),
        discount: tpl.d, code: tpl.code ? `${tpl.code}${suffix}` : '', type: tpl.type,
        store: store._id, isActive: true, isFeatured: i < 3,
        expiryDate: exp.toISOString(),
        featuredImage: imgs[i % imgs.length],
        interestedUsers: 100 + Math.floor(Math.random() * 3000),
        limitedTime: i === 5 || i === 9 || i === 15,
        exclusive: i === 0 || i === 6 || i === 14,
        expiringToday: i === 19,
        details: `Save ${tpl.d} at ${store.storeName}. Limited time offer!`,
      });
      totalC++;
    }
    console.log(`  ${store.storeName} — 20 coupons`);
  }
  console.log(`\nTotal coupons: ${totalC}\n`);

  // 20 deals per store
  let totalD = 0;
  for (const store of stores) {
    for (let i = 0; i < 20; i++) {
      const tpl = dealTemplates[i];
      await post('/admin/deals/create', {
        title: tpl.t.replace('{s}', store.storeName),
        discount: tpl.d, image: dealImgs[i % dealImgs.length],
        store: store._id, isActive: true, isFeatured: i < 3,
        type: i % 3 === 0 ? 'deal' : i % 3 === 1 ? 'offer' : 'flash',
        section: tpl.section || '',
        link: store.websiteUrl || `https://${store.slug}.com`,
        description: `Amazing ${tpl.d} deal from ${store.storeName}!`,
      });
      totalD++;
    }
    console.log(`  ${store.storeName} — 20 deals`);
  }
  console.log(`\nTotal deals: ${totalD}\n`);

  // 10 hero carousel banners (one per store, first 10)
  const bannerStores = stores.slice(0, 10);
  for (let i = 0; i < bannerStores.length; i++) {
    const store = bannerStores[i];
    const tpl = bannerTemplates[i];
    await post('/admin/banner/create', {
      title: tpl.t.replace('{s}', store.storeName),
      label: tpl.label, cta: tpl.cta,
      bgColor: '#ffffff', textPanelBg: '#ffffff',
      image: bannerImgs[i],
      buttonLink: store.websiteUrl || `https://${store.slug}.com`,
      storeUrl: store.websiteUrl || `https://${store.slug}.com`,
      store: store._id, isActive: true,
    });
    console.log(`  Banner: ${tpl.label} — ${store.storeName}`);
  }
  console.log(`\nTotal banners: ${bannerStores.length}\n`);

  console.log('Done! Refresh your site.');
}

seed().catch(console.error);
