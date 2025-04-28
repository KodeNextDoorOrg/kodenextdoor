"use client"; // May need client features later for filtering, etc.

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

// MedalinaLogo component
const MedalinaLogo = () => (
  <div className="logo-text">
    <div className="logo-top">MEDALINA</div>
    <div className="logo-bottom">BBQ</div>
  </div>
);

// Menu data based on Federalist Pig
const menuData = {
  barbeque: [
    { name: 'Brisket', description: 'Chopped or sliced', price: 'sold by 1/2 lb' },
    { name: 'Pork Rib Tips', description: '', price: 'sold by 1/2 lb' },
    { name: 'Pork Spare Ribs', description: '', price: 'sold by 1/2 lb' },
    { name: 'Pulled Pork Shoulder', description: '', price: 'sold by 1/2 lb' },
    { name: 'Pork Belly', description: '', price: 'sold by 1/2 lb' },
    { name: 'Turkey Breast', description: '', price: 'sold by 1/2 lb' },
    { name: 'Chicken', description: '', price: 'sold by 1/2 lb' },
    { name: 'Chicken Wings', description: '', price: 'sold by 1/2 lb' },
    { name: 'Jalapeño Cheese Sausage', description: '', price: 'sold by 1/2 lb' },
  ],
  platters: [
    { name: 'Two Step', description: 'Pick any 2 meats & 2 small sides', price: '' },
    { name: 'Rib & Chicken', description: '1/2 lb. of ribs, 1/4 chicken & 2 small sides', price: '' },
    { name: 'Sampler Platter', description: 'Pick any 3 meats & 2 small sides', price: '' },
    { name: 'Pitmaster Special for 2', description: 'Pick any 4 meats & 3 small sides', price: '' },
    { name: 'Dino Beef Short Rib Combo for 2', description: 'Smoked beef short rib with two 6 oz sides of your choice, texas toast, and pickles', price: '' },
    { name: 'Feed the Fam', description: 'Pick any 4 meats & 4 large sides', price: '' },
  ],
  sides: [
    { name: 'Smoked Cheddar Mac & Cheese', description: 'Shell pasta baked with smoked cheddar and jack cheese', price: '' },
    { name: 'Seasoned French Fries', description: 'Skin-on fries seasoned with Fed Pig BBQ rub', price: '' },
    { name: 'Crispy Brussels Sprouts', description: 'Fried and seasoned with Fed Pig BBQ rub', price: '' },
    { name: 'Chipotle Garlic Green Beans', description: 'Stewed with roasted garlic and chipotle peppers', price: '' },
    { name: 'Red Bliss Potato Salad', description: 'Southern style potato salad with chopped pickles, celery, and hard boiled eggs', price: '' },
    { name: 'Classic Coleslaw', description: 'Carolina style shredded cabbage slaw', price: '' },
    { name: 'BBQ Beans', description: 'Smoky, savory, and a little sweet', price: '' },
    { name: 'Smoky Brisket Chili', description: '', price: '' },
    { name: 'Chili Mac', description: '', price: '' },
  ],
  shares: [
    { name: 'Loaded Fries', description: 'Seasoned fries topped with pulled pork, melted cheese, ranch, and BBQ sauce', price: '' },
    { name: 'House Made Chips + Smoky Queso', description: 'Add brisket chili to queso +$2', price: '' },
  ],
  signatureSandwiches: [
    { name: 'Carolina on My Mind', description: 'Pulled pork, crispy skin, coleslaw, spicy vinegar sauce, sesame bun', price: '' },
    { name: 'Music City', description: 'Spicy fried chicken breast, greens, pickles, buttermilk ranch, sesame bun', price: '' },
    { name: 'Big Cheese', description: 'Chopped pork or brisket, melted cheese, crispy onions, BBQ sauce, sesame bun', price: '' },
    { name: 'Club', description: 'Smoked turkey, crispy pork belly, avocado, tomato, garlic aioli, texas toast', price: '' },
    { name: 'Jive Turkey', description: 'Smoked turkey, melted cheese, grilled tomato, crispy onions, ranch, BBQ sauce, texas toast', price: '' },
    { name: 'Texas Ranger', description: 'Sliced brisket, crispy onions, house pickles, BBQ sauce, texas toast', price: '' },
    { name: 'Jimmy Muscles', description: 'Crispy chicken breast, pork belly, jalapeño relish, sticky garlic sauce, ranch, herbs, sesame bun', price: '' },
    { name: 'Texas Flood', description: 'Chopped brisket, jalapeño cheese sausage, spicy pickles, crispy onions, bbq sauce, sesame bun', price: '' },
    { name: 'Tofu Banh Mi', description: 'Crispy tofu burnt ends, pickled veggies, fresh herbs, crispy onions, sticky garlic, aioli, hoagie roll', price: '' },
  ],
  sandwichSpecials: [
    { name: 'Snap Crackle Pork', description: 'Jalapeño sausage, pulled pork, crispy skins, pickles, slaw, mustard bbq sauce, sesame bun', price: '' },
    { name: 'Apollo Cheese', description: 'Shaved ribeye, provolone, smoked tomato, pickled jalapeño, crispy onions, aioli, hoagie roll', price: '' },
    { name: 'Foghorn Leghorn', description: 'Crispy chicken breast, smoky pimento cheese, slaw, carolina BBQ sauce, ranch, sesame bun', price: '' },
    { name: 'Burly Texican', description: 'Chopped brisket and pork belly, melted cheddar-jack, smashed avocado, pickled onions, jalapeño relish, crispy skins, aioli, sesame bun', price: '' },
    { name: 'Meat-hemoth', description: 'Brisket, sausage, pork belly, crispy chicken breast, pickles, crispy onions, slaw, sticky garlic bbq, ranch, queso drip, sesame bun', price: '$35' },
  ],
  traditionalSandwiches: [
    { name: 'Brisket', description: 'Chopped or sliced', price: '' },
    { name: 'Sliced Smoked Turkey', description: '', price: '' },
    { name: 'Pulled Pork', description: '', price: '' },
    { name: 'Sliced Pork Belly', description: '', price: '' },
  ],
  salads: [
    { name: 'BYO BBQ Green Salad', description: 'Choice of meat, mixed greens, smoked tomato, pickles, crispy onions, apple cider vinaigrette', price: '' },
    { name: 'The Music City Salad', description: 'Crispy chicken breast, hot bbq sauce, spicy pickles, lettuce, crispy onions, ranch, mesclun greens', price: '' },
    { name: 'The Texas Flood Salad', description: 'Chopped brisket, jalapeño cheese sausage, crispy onions, spicy pickles, mesclun greens', price: '' },
    { name: 'Carolina On My Mind Salad', description: 'Pulled pork, coleslaw, spicy carolina vinegar sauce, crispy skin, mesclun greens', price: '' },
  ],
  desserts: [
    { name: 'Nana\'s Banana Nana Pudding', description: 'Fresh bananas layered with vanilla pudding and nilla wafers', price: '' },
    { name: 'Oreo Chocolate Pudding', description: 'Chocolate pudding layered with oreo cookie crumbles', price: '' },
  ]
};

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('medalina-body-no-scroll');
  };
  
  const menuTabs = [
    { id: 'menu', label: 'Menu' },
    { id: 'specials', label: 'Specials' },
    { id: 'happyHour', label: 'Happy Hour' },
    { id: 'lunchCombos', label: 'Lunch Combos' },
    { id: 'catering', label: 'Catering' }
  ];

  return (
    <div className={`medalina-root ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* ===== HEADER ===== */}
      <header className="medalina-header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo">
            <Link href="/templates/restaurant">
              <MedalinaLogo />
            </Link>
          </div>
          
          {/* Right Side Navigation & Button */}
          <div className="header-right">
            <nav className="nav-links">
              <Link href="/templates/restaurant/menu" className="nav-link">MENUS</Link>
              <Link href="#" className="nav-link">CATERING</Link>
              <Link href="#" className="nav-link">BBQ BOX</Link>
              <Link href="#" className="nav-link">SUPPER CLUB</Link>
              <Link href="#" className="nav-link">GIFT CARDS</Link>
            </nav>
            <Link href="/templates/restaurant/menu" className="order-button">ORDER ONLINE</Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="menu-button">
            <button onClick={toggleMobileMenu}>
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <button onClick={toggleMobileMenu}>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mobile-menu-links">
            <Link href="/templates/restaurant/menu" className="mobile-link">MENUS</Link>
            <Link href="#" className="mobile-link">CATERING</Link>
            <Link href="#" className="mobile-link">BBQ BOX</Link>
            <Link href="#" className="mobile-link">SUPPER CLUB</Link>
            <Link href="#" className="mobile-link">GIFT CARDS</Link>
            <Link href="/templates/restaurant/menu" className="mobile-order-button">ORDER ONLINE</Link>
          </div>
        </div>
      )}

      <main className="medalina-menu-page">
        {/* Menu Hero Section */}
        <section className="medalina-menu-hero">
          <div className="medalina-menu-hero-bg">
            <Image 
              src="/images/restaurant-1.jpg"
              alt="BBQ meat on wooden board"
              fill
              className="medalina-hero-img"
              priority
            />
            <div className="medalina-menu-hero-overlay"></div>
          </div>
          <div className="medalina-menu-container">
            <h1>Menus</h1>
            <p>A culinary tour of BBQ traditions from around this great nation and this beautiful planet. 1.8 million years ago, humans first began cooking meat with fire. For some reason, this hasn't led to world peace, but we're pretty sure if we fire up enough BBQ, it will.</p>
          </div>
        </section>

        {/* Menu Tabs */}
        <div className="medalina-menu-container">
          <div className="medalina-menu-tabs">
            {menuTabs.map(tab => (
              <button 
                key={tab.id}
                className={`medalina-menu-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <p className="text-center mb-8">
            Check out our menu on Toast and follow us on social media to hear about weekly specials and rotating "faux que" vegetarian offerings.
          </p>
          
          <div className="medalina-menu-cta">
            <Link href="#" className="medalina-btn">
              Order Now
            </Link>
          </div>

          {/* Menu Content - Only showing the "Menu" tab for now */}
          {activeTab === 'menu' && (
            <div className="medalina-menu-content">
              {/* Barbeque Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Barbeque</h2>
                <p className="medalina-menu-category-desc">
                  Smoked daily, all served with Texas toast & pickles. Sold by the 1/2 lb.
                </p>
                <div className="medalina-menu-items">
                  {menuData.barbeque.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Platters Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Platters and Combos</h2>
                <p className="medalina-menu-category-desc">
                  Creating the *perfect* palette of Federalist Pig flavors is an art. And we're artists. Served with Texas toast & pickles.
                </p>
                <div className="medalina-menu-items">
                  {menuData.platters.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sides Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Sides</h2>
                <p className="medalina-menu-category-desc">
                  A wise leader once said that unless both sides win, no agreement can be permanent. So — just agree to get more sides later.
                </p>
                <div className="medalina-menu-items">
                  {menuData.sides.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shares Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Shares</h2>
                <div className="medalina-menu-items">
                  {menuData.shares.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Sandwiches Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Signature Sandwiches</h2>
                <p className="medalina-menu-category-desc">
                  When bread meets what could go between bread, there's no end to the culinary possibilities.
                </p>
                <div className="medalina-menu-items">
                  {menuData.signatureSandwiches.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sandwich Specials Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Sandwich Specials</h2>
                <p className="medalina-menu-category-desc">
                  Get 'em while they're here!
                </p>
                <div className="medalina-menu-items">
                  {menuData.sandwichSpecials.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Traditional Sandwiches Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Traditional Sandwiches</h2>
                <p className="medalina-menu-category-desc">
                  1/3 lb. of any off-the-bone meat on a sesame bun with BBQ sauce. Ask not what BBQ can do for the sandwich — just get the sandwich. You can figure out the rest later.
                </p>
                <div className="medalina-menu-items">
                  {menuData.traditionalSandwiches.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Salads Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Salads</h2>
                <p className="medalina-menu-category-desc">
                  Crunch crunch, who's there? You, getting a tangy, acidic crunch of greens to really make your plate sing.
                </p>
                <div className="medalina-menu-items">
                  {menuData.salads.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dessert Section */}
              <div className="medalina-menu-category">
                <h2 className="medalina-menu-category-title">Dessert</h2>
                <p className="medalina-menu-category-desc">
                  The kind of blue-ribbon treats usually reserved for a State Fair judge, straight to you.
                </p>
                <div className="medalina-menu-items">
                  {menuData.desserts.map((item, index) => (
                    <div key={index} className="medalina-menu-item">
                      <div className="medalina-menu-item-header">
                        <h3 className="medalina-menu-item-title">{item.name}</h3>
                        {item.price && <span className="medalina-menu-item-price">{item.price}</span>}
                      </div>
                      {item.description && <p className="medalina-menu-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergen Info */}
              <div className="medalina-menu-allergen">
                <h3>Allergen Info</h3>
                <ul>
                  <li><strong>NO NUTS OR NUT OILS USED</strong></li>
                  <li><strong>Contains dairy:</strong> Crispy Chicken Breast, Mac & Cheese, Ranch Dressing, Blue Cheese Dressing, Crispy Onions, Texas Toast, Nana's Banana Nana Pudding, Oreo Chocolate Pudding</li>
                  <li><strong>Contains Gluten:</strong> Crispy Chicken Breast, Mac & Cheese, Crispy Onions, Texas Toast, Potato Bun</li>
                </ul>
                
                <p className="mt-4">
                  A 3% service charge is added to every dine-in and take-out guest check and will be used to cover our increasing operational costs as part of D.C.'s Initiative 82. This fee is not a tip. Tipping remains a vital part of compensation for our staff.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="medalina-footer">
        <div className="medalina-footer-main">
          {/* Social Media Icons */}
          <div className="medalina-footer-socials">
            <a href="#" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02c5.5 0 10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM13.6 18.6h-3.2v-6.8H9v-2.4h1.4v-1.8c0-1.4.9-2.7 2.7-2.7h2.1v2.4h-1.3c-.4 0-.5.2-.5.5v1.6h2.1L15 11.8h-1.4v6.8z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.6.01 4.8.07c1.2.06 2 .27 2.7.58c.7.3 1.3.75 1.9 1.35c.6.6 1.05 1.2 1.35 1.9c.3.7.52 1.5.58 2.7c.06 1.2.07 1.6.07 4.8s-.01 3.6-.07 4.8c-.06 1.2-.27 2-.58 2.7c-.3.7-.75 1.3-1.35 1.9c-.6.6-1.2 1.05-1.9 1.35c-.7.3-1.5.52-2.7.58c-1.2.06-1.6.07-4.8.07s-3.6-.01-4.8-.07c-1.2-.06-2-.27-2.7-.58c-.7-.3-1.3-.75-1.9-1.35c-.6-.6-1.05-1.2-1.35-1.9c-.3-.7-.52-1.5-.58-2.7c-.06-1.2-.07-1.6-.07-4.8s.01-3.6.07-4.8c.06-1.2.27-2 .58-2.7c.3-.7.75-1.3 1.35-1.9c.6-.6 1.2-1.05 1.9-1.35c.7-.3 1.5-.52 2.7-.58c1.2-.06 1.6-.07 4.8-.07zm0-2.16C8.72 0 8.27.01 7.05.07c-1.24.06-2.4.29-3.4.69c-1 .4-1.88.96-2.7 1.78s-1.38 1.7-1.78 2.7c-.4 1-.63 2.16-.69 3.4C.01 8.27 0 8.72 0 12s.01 3.73.07 4.95c.06 1.24.29 2.4.69 3.4c.4 1 .96 1.88 1.78 2.7s1.7 1.38 2.7 1.78c1 .4 2.16.63 3.4.69c1.22.06 1.67.07 4.95.07s3.73-.01 4.95-.07c1.24-.06 2.4-.29 3.4-.69c1-.4 1.88-.96 2.7-1.78s1.38-1.7 1.78-2.7c.4-1 .63-2.16.69-3.4c.06-1.22.07-1.67.07-4.95s-.01-3.73-.07-4.95c-.06-1.24-.29-2.4-.69-3.4c-.4-1-.96-1.88-1.78-2.7s-1.7-1.38-2.7-1.78c-1-.4-2.16-.63-3.4-.69C15.73.01 15.28 0 12 0zm0 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16s6.16-2.76 6.16-6.16S15.4 5.84 12 5.84zm0 10.32c-2.3 0-4.16-1.86-4.16-4.16s1.86-4.16 4.16-4.16s4.16 1.86 4.16 4.16s-1.86 4.16-4.16 4.16zm6.4-10.8c-.74 0-1.34-.6-1.34-1.34s.6-1.34 1.34-1.34s1.34.6 1.34 1.34s-.6 1.34-1.34 1.34z"/></svg>
            </a>
          </div>
          
          {/* Navigation Links */}
          <div className="medalina-footer-nav">
            <a href="#about">ABOUT</a>
            <a href="#contact">CONTACT</a>
            <a href="#location">LOCATION</a>
            <a href="#awards">AWARDS</a>
            <a href="#careers">CAREERS</a>
            <a href="#terms">TERMS</a>
            <a href="#privacy">PRIVACY</a>
          </div>
          
          {/* Email Signup Button */}
          <div className="medalina-footer-signup-btn">
            <a href="#email-signup" className="medalina-btn-footer">EMAIL SIGNUP</a>
          </div>
        </div>
        
        <div className="medalina-footer-bottom">
          <p>POWERED BY BENTOBOX</p>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage; 