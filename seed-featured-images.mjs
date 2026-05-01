// Run: node server/seed-featured-images.mjs
// Server must be running on http://localhost:5000

const API = 'http://localhost:5000/api';
const get = (url) => fetch(`${API}${url}`).then(r => r.json());
const put = (url, data) => fetch(`${API}${url}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

const featuredImages = [
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
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=160&h=170&fit=crop',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=160&h=170&fit=crop',
];

async function seed() {
  console.log('🌱 Adding featured images to coupons...\n');

  const couponsRes = await get('/public/coupons/list');
  const coupons = couponsRes.data || couponsRes || [];
  console.log(`Found ${coupons.length} coupons`);

  let updated = 0;
  for (let i = 0; i < coupons.length; i++) {
    const c = coupons[i];
    const img = featuredImages[i % featuredImages.length];
    await put(`/admin/coupons/update/${c._id}`, {
      featuredImage: img,
      isFeatured: i < 6,
      isActive: true,
    });
    updated++;
    if (i < 6) console.log(`  ⭐ Featured: ${c.title}`);
  }
  console.log(`\n✅ Updated ${updated} coupons with images (first 6 marked featured)\n`);

  // Also update deals with images
  const dealsRes = await get('/public/deals/list');
  const deals = dealsRes.data || dealsRes || [];
  console.log(`Found ${deals.length} deals`);

  const dealImages = [
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
  ];

  for (let i = 0; i < deals.length; i++) {
    const d = deals[i];
    if (!d.image) {
      await put(`/admin/deals/update/${d._id}`, {
        image: dealImages[i % dealImages.length],
      });
      console.log(`  🔥 Deal image: ${d.title}`);
    }
  }

  console.log('\n🎉 Done! Refresh your site.');
}

seed().catch(console.error);
