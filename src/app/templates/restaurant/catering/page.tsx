"use client";

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

const CateringPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('medalina-body-no-scroll');
  };

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
              <Link href="/templates/restaurant" className="nav-link">HOME</Link>
              <Link href="/templates/restaurant/menu" className="nav-link">MENUS</Link>
              <Link href="/templates/restaurant/catering" className="nav-link">CATERING</Link>
              <a href="#" className="nav-link">BBQ BOX</a>
              <a href="#" className="nav-link">SUPPER CLUB</a>
              <a href="#" className="nav-link">GIFT CARDS</a>
            </nav>
            <a href="/templates/restaurant/menu" className="medalina-btn medalina-btn-header whitespace-nowrap">ORDER ONLINE</a>
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
            <Link href="/templates/restaurant" className="mobile-link">HOME</Link>
            <Link href="/templates/restaurant/menu" className="mobile-link">MENUS</Link>
            <Link href="/templates/restaurant/catering" className="mobile-link">CATERING</Link>
            <a href="#" className="mobile-link">BBQ BOX</a>
            <a href="#" className="mobile-link">SUPPER CLUB</a>
            <a href="#" className="mobile-link">GIFT CARDS</a>
            <a href="/templates/restaurant/menu" className="mobile-order-button">ORDER ONLINE</a>
          </div>
        </div>
      )}

      <main>
        {/* Catering Hero Section - Yellow Background with Sandwiches Image */}
        <section className="medalina-catering-hero">
          <div className="medalina-catering-hero-bg">
            <Image 
              src="/images/restaurant-2.jpg"
              alt="BBQ restaurant atmosphere"
              fill
              className="medalina-catering-hero-img"
              priority
            />
          </div>
          <div className="medalina-catering-overlay"></div>
          <div className="medalina-catering-content">
            <h1>CATERING</h1>
            <div className="medalina-catering-text">
              <p>
                The old-school BBQ you remember. The new-school flavors you won't forget. Let our team bring the Federalist Pig experience to your office, home, or special event. From office lunches or workplace gatherings, and birthday parties to weddings and galas, we cater events of every size and style. Get ready to share our BBQ with your loved ones.
              </p>
              <p>
                Our meats are smoked for 12-24 hours, so for any special requests or off-site celebrations (such as weddings or large parties), we'd prefer at least 48 hours' notice, but can usually accommodate parties of 75 or less with 24 hours' notice. All Event Catering is available for Takeout & Delivery.
              </p>
              <div className="medalina-catering-cta">
                <Link href="https://www.example.com/catering-order" className="medalina-btn medalina-btn-primary">
                  ORDER CATERING NOW
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Inquire About Event Catering Section */}
        <section className="medalina-event-catering">
          <div className="medalina-event-catering-container">
            <div className="medalina-event-catering-content">
              <div className="medalina-event-catering-image">
                <Image 
                  src="/images/restaurant-3.jpg" 
                  alt="Private event catering"
                  width={600}
                  height={600}
                  className="medalina-event-img"
                />
              </div>
              <div className="medalina-event-catering-text">
                <h2>INQUIRE ABOUT EVENT CATERING</h2>
                <p>
                  Got a celebration coming up and need a hand—or maybe just a whole platter of ribs? No matter the size or style, we got you! Planning your big bash has never been this easy (or mouth-watering). Our catering crew isn't just slingin' BBQ; we're out here crafting legendary moments. From our slow-smoked, scratch-made eats to handpicked ingredients, we'll build a feast as bold as your guest list and as flexible as your budget. Have our team (or our catering truck) at your next event!
                </p>
                <p>
                  For groups smaller than 40-50 people it's typically easier to place the order yourself through our catering online ordering page. That way you can add or subtract from your cart based on your desired budget and menu requirements and easily set up your delivery or pick up order. We are always here for you if you have any questions!
                </p>
                <div className="medalina-event-catering-buttons">
                  <Link href="https://www.example.com/catering-order" className="medalina-btn medalina-event-btn">
                    START YOUR ORDER
                  </Link>
                  <Link href="https://www.example.com/catering-delivery" className="medalina-btn medalina-event-btn">
                    CATERING DELIVERY INQUIRY
                  </Link>
                  <Link href="https://www.example.com/catering-takeout" className="medalina-btn medalina-event-btn">
                    CATERING TAKEOUT INQUIRY
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="medalina-footer">
        <div className="medalina-footer-main">
          {/* Social Media Icons */}
          <div className="medalina-footer-socials">
            <a href="https://www.facebook.com/example" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02c5.5 0 10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM13.6 18.6h-3.2v-6.8H9v-2.4h1.4v-1.8c0-1.4.9-2.7 2.7-2.7h2.1v2.4h-1.3c-.4 0-.5.2-.5.5v1.6h2.1L15 11.8h-1.4v6.8z"/></svg>
            </a>
            <a href="https://www.instagram.com/example" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.6.01 4.8.07c1.2.06 2 .27 2.7.58c.7.3 1.3.75 1.9 1.35c.6.6 1.05 1.2 1.35 1.9c.3.7.52 1.5.58 2.7c.06 1.2.07 1.6.07 4.8s-.01 3.6-.07 4.8c-.06 1.2-.27 2-.58 2.7c-.3.7-.75 1.3-1.35 1.9c-.6.6-1.2 1.05-1.9 1.35c-.7.3-1.5.52-2.7.58c-1.2.06-1.6.07-4.8.07s-3.6-.01-4.8-.07c-1.2-.06-2-.27-2.7-.58c-.7-.3-1.3-.75-1.9-1.35c-.6-.6-1.05-1.2-1.35-1.9c-.3-.7-.52-1.5-.58-2.7c-.06-1.2-.07-1.6-.07-4.8s.01-3.6.07-4.8c.06-1.2.27-2 .58-2.7c.3-.7.75-1.3 1.35-1.9c.6-.6 1.2-1.05 1.9-1.35c.7-.3 1.5-.52 2.7-.58c1.2-.06 1.6-.07 4.8-.07zm0-2.16C8.72 0 8.27.01 7.05.07c-1.24.06-2.4.29-3.4.69c-1 .4-1.88.96-2.7 1.78s-1.38 1.7-1.78 2.7c-.4 1-.63 2.16-.69 3.4C.01 8.27 0 8.72 0 12s.01 3.73.07 4.95c.06 1.24.29 2.4.69 3.4c.4 1 .96 1.88 1.78 2.7s1.7 1.38 2.7 1.78c1 .4 2.16.63 3.4.69c1.22.06 1.67.07 4.95.07s3.73-.01 4.95-.07c1.24-.06 2.4-.29 3.4-.69c1-.4 1.88-.96 2.7-1.78s1.38-1.7 1.78-2.7c.4-1 .63-2.16.69-3.4c.06-1.22.07-1.67.07-4.95s-.01-3.73-.07-4.95c-.06-1.24-.29-2.4-.69-3.4c-.4-1-.96-1.88-1.78-2.7s-1.7-1.38-2.7-1.78c-1-.4-2.16-.63-3.4-.69C15.73.01 15.28 0 12 0zm0 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16s6.16-2.76 6.16-6.16S15.4 5.84 12 5.84zm0 10.32c-2.3 0-4.16-1.86-4.16-4.16s1.86-4.16 4.16-4.16s4.16 1.86 4.16 4.16s-1.86 4.16-4.16 4.16zm6.4-10.8c-.74 0-1.34-.6-1.34-1.34s.6-1.34 1.34-1.34s1.34.6 1.34 1.34s-.6 1.34-1.34 1.34z"/></svg>
            </a>
          </div>
          
          {/* Navigation Links */}
          <div className="medalina-footer-nav">
            <Link href="/templates/restaurant/about">ABOUT</Link>
            <Link href="/templates/restaurant/contact">CONTACT</Link>
            <Link href="/templates/restaurant/location">LOCATION</Link>
            <Link href="/templates/restaurant/awards">AWARDS</Link>
            <Link href="/templates/restaurant/careers">CAREERS</Link>
            <Link href="/templates/restaurant/terms">TERMS</Link>
            <Link href="/templates/restaurant/privacy">PRIVACY</Link>
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

export default CateringPage; 