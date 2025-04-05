"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './styles/template.css'; // We'll create this next

// Placeholder Product Data
const featuredProducts = [
  {
    id: '1',
    name: 'Kinetic Sculpture Lamp',
    price: '$350',
    imageUrl: '/images/ecommerce/product-1-placeholder.jpg', // << UPDATE PLACEHOLDER
    category: 'Lighting',
  },
  {
    id: '2',
    name: 'Modular Bookshelf System',
    price: '$890',
    imageUrl: '/images/ecommerce/product-2-placeholder.jpg', // << UPDATE PLACEHOLDER
    category: 'Furniture',
  },
  {
    id: '3',
    name: 'Ceramic Planter Set (3)',
    price: '$120',
    imageUrl: '/images/ecommerce/product-3-placeholder.jpg', // << UPDATE PLACEHOLDER
    category: 'Home Decor',
  },
  {
    id: '4',
    name: 'Minimalist Wall Clock',
    price: '$180',
    imageUrl: '/images/ecommerce/product-4-placeholder.jpg', // << UPDATE PLACEHOLDER
    category: 'Accessories',
  },
];

const EcommerceTemplatePage = () => {
  return (
    <div className="et-root">
      {/* --- Header (Placeholder - Assume a sleek, minimal header) --- */}
      <header className="et-header">
        <div className="et-container mx-auto px-4 flex justify-between items-center h-20">
          <div className="et-logo font-bold text-2xl">AURA</div>
          <nav className="et-nav space-x-6 hidden md:flex">
            <Link href="#" className="hover:text-[--et-accent]">Shop</Link>
            <Link href="#" className="hover:text-[--et-accent]">Collections</Link>
            <Link href="#" className="hover:text-[--et-accent]">Journal</Link>
            <Link href="#" className="hover:text-[--et-accent]">About</Link>
          </nav>
          <div className="et-actions flex items-center space-x-5">
            {/* Icons for Search, Account, Cart - Replace spans with SVGs */}
            <button className="hover:text-[--et-accent] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            <Link href="#" className="hover:text-[--et-accent] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-[--et-accent] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="et-main">
        {/* --- Hero Section --- */}
        <section className="et-hero">
          {/* Background (Image/Video/Gradient) */}
          <div className="et-hero-background">
             <Image
              src="/images/ecommerce/hero-placeholder.jpg" // << UPDATE PLACEHOLDER
              alt="Abstract artistic background image"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="et-hero-overlay"></div>
          </div>
          
          {/* Hero Content - Centered with Emphasis */}
          <div className="et-hero-content et-container mx-auto px-4 text-center">
            <h1 className="et-hero-title">
              Design for <span className="et-highlight">Conscious</span> Living
            </h1>
            <p className="et-hero-subtitle">
              Curated objects that blend form, function, and artistry.
            </p>
            <Link href="#shop" className="et-btn et-btn-primary mt-8">
              Explore the Collection
            </Link>
          </div>
        </section>

        {/* --- Featured Products Section --- */}
        <section id="shop" className="et-section et-featured-products">
          <div className="et-container mx-auto px-4">
            <h2 className="et-section-title">Featured This Week</h2>
            <div className="et-product-grid">
              {featuredProducts.map((product, index) => (
                <Link href={`/product/${product.id}`} key={product.id} className="et-product-card" style={{ animationDelay: `${index * 0.1}s` }}>
                   <div className="et-product-image-wrapper">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill // Use fill for responsive images within the wrapper
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="et-product-info">
                    <h3 className="et-product-name">{product.name}</h3>
                    <p className="et-product-category">{product.category}</p>
                    <p className="et-product-price">{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- Category Highlights (Placeholder) --- */}
        <section className="et-section et-category-highlights">
          <div className="et-container mx-auto px-4">
            <h2 className="et-section-title">Shop by Category</h2>
            {/* Placeholder for category links/images */}
             <div className="et-category-grid">
               {/* Example Category Item */}
               <div className="et-category-item">
                 <Image src="/images/ecommerce/cat-1-placeholder.jpg" alt="Lighting Category" width={400} height={500} className="object-cover"/>
                 <h3 className="et-category-name">Lighting</h3>
               </div>
               <div className="et-category-item">
                 <Image src="/images/ecommerce/cat-2-placeholder.jpg" alt="Furniture Category" width={400} height={500} className="object-cover"/>
                 <h3 className="et-category-name">Furniture</h3>
               </div>
               <div className="et-category-item">
                 <Image src="/images/ecommerce/cat-3-placeholder.jpg" alt="Decor Category" width={400} height={500} className="object-cover"/>
                 <h3 className="et-category-name">Decor</h3>
               </div>
             </div>
          </div>
        </section>
        
        {/* --- Lookbook/Journal Teaser (Placeholder) --- */}
        <section className="et-section et-journal-teaser">
          <div className="et-container mx-auto px-4 text-center">
            <h2 className="et-section-title">From the Journal</h2>
            <p className="max-w-2xl mx-auto mb-8">Inspiration for modern living and thoughtful design.</p>
            {/* Placeholder for journal post links/images */}
            <Link href="#" className="et-btn et-btn-secondary">
              Read More Stories
            </Link>
          </div>
        </section>

      </main>

      {/* --- Footer (Placeholder) --- */}
      <footer className="et-footer">
        <div className="et-container mx-auto px-4">
          {/* Footer content: Links, Newsletter Signup, Socials, Copyright */}
          <div className="text-center py-10">
             <p>&copy; {new Date().getFullYear()} AURA Collective. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceTemplatePage; 