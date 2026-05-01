// Run: node server/seed-banners-coupons.mjs
// Server must be running on http://localhost:5000

const API = 'http://localhost:5000/api';
const post = (url, data) => fetch(`${API}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
const get = (url) => fetch(`${API}${url}`).then(r => r.json());

async function seed() {
  console.log('🌱 Seeding hero banners + 10 coupons per store...\n');

  const storesRes = await get('/public/stores/list');
  const stores = storesRes.data || storesRes || [];
  if (!stores.length) { console.log('❌ No stores. Create stores first.'); return; }
  console.log(`✅ Found ${stores.length} stores\n`);

  // Hero banners — one per major store, relevant to Coupons Script
  const bannerData = [
    { store: 'amazon', label: 'MEGA SAVINGS', title: 'Up to 70% Off on Electronics & More', cta: 'SHOP AMAZON DEALS', bgColor: '#232f3e', textPanelBg: '#ffffff', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=400&fit=crop', secondaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
    { store: 'flipkart', label: 'BIG BILLION DAYS', title: 'Flipkart Sale — Flat 50% Off Fashion', cta: 'GRAB THE DEALS', bgColor: '#2874f0', textPanelBg: '#ffffff', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=400&fit=crop', secondaryImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop' },
    { store: 'swiggy', label: 'FOOD FEST', title: 'Flat ₹150 Off on Orders Above ₹299', cta: 'ORDER NOW', bgColor: '#fc8019', textPanelBg: '#ffffff', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=400&fit=crop', secondaryImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
    { store: 'adidas', label: 'END OF SEASON', title: 'Adidas Sale — Extra 40% Off Everything', cta: 'SHOP ADIDAS', bgColor: '#000000', textPanelBg: '#ffffff', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=400&fit=crop', secondaryImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop' },
    { store: 'h&m', label: 'SUMMER COLLECTION', title: 'H&M — Buy 2 Get 1 Free on All Styles', cta: 'EXPLORE FASHION', bgColor: '#e50010', textPanelBg: '#ffffff', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&h=400&fit=crop', secondaryImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
    { store: 'walmart', label: 'ROLLBACK PRICES', title: 'Walmart — Save Big on Home Essentials', cta: 'SHOP WALMART', bgColor: '#0071dc', textPanelBg: '#ffffff', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=400&fit=crop', secondaryImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop' },
  ];

  for (const b of bannerData) {
    const store = stores.find(s => s.storeName?.toLowerCase().includes(b.store) || s.slug?.toLowerCase().includes(b.store));
    const storeUrl = store?.websiteUrl || `https://${b.store}.com`;
    await post('/admin/banner/create', {
      title: b.title, label: b.label, cta: b.cta,
      bgColor: b.bgColor, textPanelBg: b.textPanelBg,
      image: b.image, secondaryImage: b.secondaryImage,
      buttonLink: storeUrl, storeUrl,
      store: store?._id || '', isActive: true,
      imagePosition: 'center', textPanelMargin: 0,
    });
    console.log(`  🎠 Banner: ${b.title}`);
  }
  console.log(`✅ Created ${bannerData.length} hero banners\n`);

  // 10 coupons per store
  const couponTemplates = [
    { title: '{store} — Extra 20% Off Sitewide', discount: '20%', code: 'SAVE20', type: 'code' },
    { title: '{store} — Flat ₹300 Off on ₹1499+', discount: '₹300', code: 'FLAT300', type: 'code' },
    { title: '{store} — Buy 1 Get 1 Free', discount: 'BOGO', code: 'BOGO2026', type: 'code' },
    { title: '{store} — Free Shipping All Orders', discount: 'Free Ship', type: 'freeshipping' },
    { title: '{store} — 15% Cashback on First Order', discount: '15%', type: 'cashback' },
    { title: '{store} — Flash Sale Up to 50% Off', discount: '50%', type: 'sale' },
    { title: '{store} — Student Discount 25% Off', discount: '25%', code: 'STUDENT25', type: 'code' },
    { title: '{store} — ₹500 Off on App Orders', discount: '₹500', code: 'APP500', type: 'code' },
    { title: '{store} — Weekend Special 30% Off', discount: '30%', code: 'WKND30', type: 'code' },
    { title: '{store} — Clearance Sale Up to 70% Off', discount: '70%', type: 'sale' },
  ];

  let totalCoupons = 0;
  for (const store of stores) {
    for (let i = 0; i < couponTemplates.length; i++) {
      const t = couponTemplates[i];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 15 + Math.floor(Math.random() * 90));
      await post('/admin/coupons/create', {
        title: t.title.replace('{store}', store.storeName),
        discount: t.discount,
        code: t.code ? `${t.code}${store.storeName?.substring(0, 3).toUpperCase()}` : '',
        type: t.type,
        store: store._id,
        isActive: true,
        isFeatured: i < 2,
        expiryDate: expiry.toISOString(),
        interestedUsers: Math.floor(Math.random() * 3000) + 200,
        limitedTime: i === 5 || i === 9,
        exclusive: i === 0 || i === 6,
        expiringToday: i === 9,
        details: `Use this ${t.discount} offer at ${store.storeName}. Valid for a limited time. Terms apply.`,
      });
      totalCoupons++;
    }
    console.log(`  🎟️ ${store.storeName} — 10 coupons created`);
  }
  console.log(`\n✅ Created ${totalCoupons} coupons (10 per store)\n`);

  console.log('🎉 Done! Refresh your site.');
}

seed().catch(console.error);
