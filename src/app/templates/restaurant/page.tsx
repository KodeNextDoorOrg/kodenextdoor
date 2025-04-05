"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const RestaurantPage = () => {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Header Scroll & Parallax Effect
    const handleScroll = () => {
      // Prevent scroll checks if mobile menu is open
      if (isMobileMenuOpen) return;

      const scrollY = window.scrollY;
      setIsHeaderScrolled(scrollY > 50);
      if (heroImageRef.current) {
        heroImageRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true }); // Improve scroll performance

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('rt-animate-in');
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const elementsToAnimate = document.querySelectorAll('.rt-welcome-content, .rt-location-card, .rt-reservation-button-wrapper');
    elementsToAnimate.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
        window.removeEventListener('scroll', handleScroll);
        elementsToAnimate.forEach(el => observer.unobserve(el));
    };
    // Rerun effect if mobile menu state changes to re-attach/detach scroll listener
  }, [isMobileMenuOpen]);

  // --- Mobile Menu Toggle --- 
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Toggle body scroll lock
    document.body.classList.toggle('rt-body-no-scroll', !isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
      if (isMobileMenuOpen) {
          toggleMobileMenu();
      }
  }

  return (
    // Add class to root when mobile menu is open
    <div className={`rt-root min-h-screen ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Custom Header */}
      <header className={`rt-header fixed w-full z-50 ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <div className="rt-container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <a href="#home" className="rt-logo" onClick={handleMobileLinkClick}>
              Savory
            </a>
            {/* Desktop Menu */} 
            <div className="hidden md:flex space-x-8">
              <a href="#welcome">Welcome</a>
              <a href="#menu">Menu</a>
              <a href="#locations">Locations</a>
              <a href="#reservations">Reservations</a>
            </div>
            {/* Mobile Menu Button */}
            <button className="rt-mobile-menu-btn md:hidden" onClick={toggleMobileMenu} aria-label="Toggle Menu">
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Burger Icon
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

       {/* Mobile Menu Overlay */} 
       <div className="rt-mobile-menu-overlay">
            <nav>
                <a href="#welcome" onClick={handleMobileLinkClick}>Welcome</a>
                <a href="#menu" onClick={handleMobileLinkClick}>Menu</a>
                <a href="#locations" onClick={handleMobileLinkClick}>Locations</a>
                <a href="#reservations" onClick={handleMobileLinkClick}>Reservations</a>
            </nav>
        </div>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home" className="rt-hero rt-section">
          <div ref={heroImageRef} className="rt-hero-image-wrapper">
            <Image
              src="/images/welcome-bg.jpg" // << UPDATE IMAGE
              alt="Warmly lit restaurant interior with plants"
              fill
              className="object-cover"
              priority
              quality={85}
            />
          </div>
          <div className="rt-hero-content">
            {/* Removed wrapper for heading background */}
            <h1>Savory</h1>
            <p>Middle Eastern Cuisine inspired by childhood memories.</p>
            <a href="/templates/restaurant/reservations" className="rt-btn rt-btn-primary mr-4">Reservations</a>
            <a href="/templates/restaurant/menu" className="rt-btn rt-btn-secondary">View Menu</a>
          </div>
        </section>

        {/* Welcome Section */} 
        {/* Added decorative border class */}
        <section id="welcome" className="rt-section rt-welcome-section rt-decorative-border-top">
            <div className="rt-container mx-auto px-4">
                {/* Removed heading wrapper div */}
                <div className="rt-welcome-content">
                    <h2>Welcome to Savory</h2>
                    <p>
                        Savory, meaning &apos;heart, beloved&apos; in Farsi, is a Middle Eastern Restaurant and bar that aims
                        to bring the flavors of Persia, Turkey, Lebanon & Israel to the heart of the city.
                        Join us for an unforgettable culinary journey.
                    </p>
                </div>
            </div>
        </section>

        {/* Menu Teaser Section - Revamped with Image */}
        <section id="menu" className="rt-section rt-menu-teaser">
          <div className="rt-container mx-auto px-4">
            {/* Grid layout for image and text */}
            <div className="rt-menu-teaser-grid">
              <div className="rt-menu-teaser-image rep-fade-in">
                <Image
                  src="/images/steak-tartare.jpg" // <<< USE THIS IMAGE NAME
                  alt="Hand-cut Steak Tartare with egg yolk and crostini"
                  width={600} // Specify appropriate dimensions
                  height={450}
                  className="object-cover rounded-md shadow-lg"
                  quality={85}
                />
              </div>
              <div className="rt-menu-teaser-content rep-fade-in" style={{ animationDelay: '0.15s' }}>
                <h2>Taste the Tradition</h2>
                <h3 className="text-[--rt-secondary-accent] font-medium text-2xl mb-4 -mt-4">Chef&apos;s Signature Steak Tartare</h3>
                <p>
                  Experience our exquisite hand-cut prime beef tartare, classically prepared with capers, cornichons,
                  shallots, and topped with a farm-fresh egg yolk. Served with perfectly toasted crostini.
                </p>
                <p className="text-sm text-[--rt-text-secondary]">
                  A timeless classic, reimagined with the finest ingredients.
                </p>
                <a href="/templates/restaurant/menu" className="rt-btn rt-btn-secondary mt-4">Explore Full Menu</a>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}  
        <section id="locations" className="rt-section rt-location-section">
            <div className="rt-container mx-auto px-4">
                <h2 className="mb-12">Visit Us</h2>
                <div className="rt-location-grid">
                    {/* Location 1 Card */} 
                    <div className="rt-location-card">
                        <h3>Savory Downtown</h3>
                        <p>123 Restaurant St,<br />Metropolis, ST 12345</p>
                        <p><strong>Hours:</strong></p>
                        <p>Mon-Thurs: 5pm - 10pm</p>
                        <p>Fri-Sat: 5pm - 11pm</p>
                        <p>Sun: 4pm - 9pm</p>
                        <a href="tel:5551234567">(555) 123-4567</a>
                    </div>
                    {/* Location 2 Card (Example) */} 
                    <div className="rt-location-card" style={{ transitionDelay: '150ms'}}>
                        <h3>Savory Uptown</h3>
                        <p>456 Eatery Ave,<br />Metropolis, ST 67890</p>
                        <p><strong>Hours:</strong></p>
                        <p>Mon-Fri: 11am - 10pm</p>
                        <p>Sat-Sun: 10am - 11pm</p>
                        <br />
                        <a href="tel:5559876543">(555) 987-6543</a>
                    </div>
                </div>
            </div>
        </section>

        {/* Reservation Section */} 
        <section id="reservations" className="rt-section rt-reservation-section">
          <div className="rt-container mx-auto px-4">
            <h2>Reserve Your Table</h2>
            <p>
              Book your experience at Savory. We recommend making reservations, especially for weekends and larger parties.
            </p>
            <div className="rt-reservation-button-wrapper mt-8">
              <a href="#" className="rt-btn rt-btn-primary">Find a Table</a>
            </div>
          </div>
        </section>

      </main>

      {/* Custom Footer */} 
      <footer id="contact" className="rt-footer">
        <div className="rt-container mx-auto px-4">
          {/* Footer grid container - Corrected structure */} 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {/* Column 1: Logo/Brand */} 
                <div>
                    <h4 className="font-serif text-xl mb-4">Savory</h4>
                    <p>Heartfelt Middle Eastern Cuisine.</p>
                </div>

                {/* Column 2: Locations Nav */} 
                 <div>
                    <h4>Locations</h4>
                    <ul>
                        <li><a href="#locations">Downtown</a></li>
                        <li><a href="#locations">Uptown</a></li>
                    </ul>
                </div>

                {/* Column 3: Quick Links */} 
                <div>
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="#menu">Menu</a></li>
                        <li><a href="#reservations">Reservations</a></li>
                        <li><a href="#">Gift Cards</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                 {/* Column 4: Contact Info */} 
                <div>
                    <h4>Contact Us</h4>
                    <p>info@savoryrestaurant.com</p>
                    <p>Press: press@savoryrestaurant.com</p>
                </div>
          </div>
          <div className="rt-footer-bottom mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Savory Restaurant Group. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantPage; 