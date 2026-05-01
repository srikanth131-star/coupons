const API = 'http://localhost:5000/api';
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

async function run() {
  const res = await fetch(`${API}/public/coupons/list?limit=200`);
  const data = await res.json();
  const coupons = data.data || data || [];
  const missing = coupons.filter(c => !c.featuredImage);
  console.log(`Total: ${coupons.length}, Missing image: ${missing.length}`);
  
  for (let i = 0; i < missing.length; i++) {
    await fetch(`${API}/admin/coupons/update/${missing[i]._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featuredImage: imgs[i % imgs.length] }),
    });
  }
  console.log(`✅ Updated ${missing.length} coupons with images`);
}
run();
