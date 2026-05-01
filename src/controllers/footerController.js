import Footer from '../models/Footer.js';

// Get footer configuration
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      // Create default footer structure
      footer = await Footer.create({
        sections: [
          {
            title: 'Quick Links',
            type: 'links',
            order: 1,
            links: [
              { label: 'Home', href: '/', order: 1 },
              { label: 'Stores', href: '/stores', order: 2 },
              { label: 'Categories', href: '/categories', order: 3 },
              { label: 'About Us', href: '/about', order: 4 }
            ]
          },
          {
            title: 'Support',
            type: 'links',
            order: 2,
            links: [
              { label: 'Help Center', href: '/help', order: 1 },
              { label: 'Contact Us', href: '/contact', order: 2 },
              { label: 'Privacy Policy', href: '/privacy', order: 3 },
              { label: 'Terms of Service', href: '/terms', order: 4 }
            ]
          },
          {
            title: 'Social Media',
            type: 'social',
            order: 3,
            links: [
              { label: 'Facebook', href: 'https://facebook.com', isExternal: true, order: 1 },
              { label: 'Twitter', href: 'https://twitter.com', isExternal: true, order: 2 },
              { label: 'Instagram', href: 'https://instagram.com', isExternal: true, order: 3 }
            ]
          }
        ],
        copyright: '© 2026 Coupons Script. All rights reserved.'
      });
    }
    res.json(footer);
  } catch (error) {
    console.error('Footer get error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update footer configuration
export const updateFooter = async (req, res) => {
  try {
    
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create(req.body);
    } else {
      footer = await Footer.findOneAndUpdate({}, req.body, { new: true });
    }
    
    res.json(footer);
  } catch (error) {
    console.error('Footer update error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add new section
export const addFooterSection = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) {
      return res.status(404).json({ error: 'Footer not found' });
    }
    
    footer.sections.push(req.body);
    await footer.save();
    
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update section
export const updateFooterSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const footer = await Footer.findOne();
    
    if (!footer) {
      return res.status(404).json({ error: 'Footer not found' });
    }
    
    const section = footer.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    Object.assign(section, req.body);
    await footer.save();
    
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete section
export const deleteFooterSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const footer = await Footer.findOne();
    
    if (!footer) {
      return res.status(404).json({ error: 'Footer not found' });
    }
    
    footer.sections.pull(sectionId);
    await footer.save();
    
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};