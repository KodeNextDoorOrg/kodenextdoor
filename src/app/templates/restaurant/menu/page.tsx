"use client"; // May need client features later for filtering, etc.

import React from 'react';
import Image from 'next/image';

// Placeholder data - replace with actual menu data
const menuData = {
  mezze: [
    { name: 'Hummus', description: 'Classic chickpea tahini puree, olive oil, sumac', price: '10' },
    { name: 'Babaganoush', description: 'Smoked eggplant, tahini, garlic, lemon juice', price: '11' },
    { name: 'Tabbouleh', description: 'Parsley, mint, bulgur, tomato, onion, lemon vinaigrette', price: '12' },
    { name: 'Muhammara', description: 'Roasted red pepper, walnut, pomegranate molasses', price: '12' },
  ],
  mains: [
    { name: 'Lamb Shank', description: 'Slow-braised lamb shank, saffron rice, dried lime', price: '32' },
    { name: 'Chicken Kebab', description: 'Marinated chicken skewers, grilled vegetables, garlic yogurt', price: '26' },
    { name: 'Beef Kofta', description: 'Spiced ground beef patties, tomato stew, couscous', price: '28' },
    { name: 'Sea Bass Tagine', description: 'Pan-seared sea bass, chermoula, olives, preserved lemon', price: '30' },
  ],
  desserts: [
    { name: 'Baklava', description: 'Layers of phyllo dough, nuts, honey syrup', price: '9' },
    { name: 'Knafeh', description: 'Shredded phyllo, sweet cheese, orange blossom syrup, pistachio', price: '11' },
    { name: 'Saffron Rice Pudding', description: 'Creamy rice pudding infused with saffron and cardamom', price: '10' },
  ],
};

const MenuPage = () => {
  return (
    <div className="rt-root min-h-screen">
      {/* --- Header Placeholder (Assuming Layout provides Header) --- */}
      {/* If not using a shared layout, add Header component here */}
      
      <main className="rt-menu-page">
        {/* Menu Hero/Title Section */}
        <section className="rt-menu-hero rt-section">
          <div className="rt-hero-image-wrapper" style={{ height: '50vh', position: 'absolute' }}>
             <Image
              src="/images/menu-hero-placeholder.jpg" // << UPDATE PLACEHOLDER IMAGE
              alt="Close up of beautifully plated Middle Eastern dish"
              fill
              className="object-cover"
              priority
              quality={80}
            />
             <div className="rt-hero-overlay"></div> {/* Overlay for text readability */}
          </div>
          <div className="rt-container rt-hero-content" style={{ position: 'relative', zIndex: 2 }}>
            <h1>Our Menu</h1>
            <p className="text-lg">A journey through the heart of Middle Eastern flavors.</p>
          </div>
        </section>

        {/* Menu Categories Section */}
        <section className="rt-menu-items-section rt-section">
          <div className="rt-container mx-auto px-4">
            
            {/* Mezze Category */}
            <div className="rt-menu-category">
              <h2>Mezze (Starters)</h2>
              <div className="rt-menu-category-items">
                {menuData.mezze.map((item, index) => (
                  <div key={index} className="rt-menu-item">
                    <div className="rt-menu-item-header">
                      <h3>{item.name}</h3>
                      <span className="rt-menu-item-price">${item.price}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mains Category */}
            <div className="rt-menu-category">
              <h2>Mains</h2>
              <div className="rt-menu-category-items">
                {menuData.mains.map((item, index) => (
                  <div key={index} className="rt-menu-item">
                    <div className="rt-menu-item-header">
                      <h3>{item.name}</h3>
                      <span className="rt-menu-item-price">${item.price}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desserts Category */}
            <div className="rt-menu-category">
              <h2>Desserts</h2>
              <div className="rt-menu-category-items">
                {menuData.desserts.map((item, index) => (
                  <div key={index} className="rt-menu-item">
                    <div className="rt-menu-item-header">
                      <h3>{item.name}</h3>
                      <span className="rt-menu-item-price">${item.price}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add more categories as needed (Sides, Drinks, etc.) */}

          </div>
        </section>
      </main>

      {/* --- Footer Placeholder (Assuming Layout provides Footer) --- */}
      {/* If not using a shared layout, add Footer component here */}
    </div>
  );
};

export default MenuPage; 