"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import Carousel, { CarouselSlide } from "../../components/Carousel";
import Link from 'next/link';

// Replace the MedalinaLogo component with a text-based logo
const MedalinaLogo = () => (
  <div className="logo-text">
    <div className="logo-top">MEDALINA</div>
    <div className="logo-bottom">BBQ</div>
  </div>
);

const MedalinaPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('medalina-body-no-scroll');
  };

  const toggleEmailForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEmailFormVisible(!isEmailFormVisible);
    if (!isEmailFormVisible) {
      document.body.classList.add('medalina-body-no-scroll');
    } else {
      document.body.classList.remove('medalina-body-no-scroll');
    }
  };

  const closeEmailForm = () => {
    setIsEmailFormVisible(false);
    document.body.classList.remove('medalina-body-no-scroll');
  };

  // Hero slide data
  const heroSlides: CarouselSlide[] = [
    {
      image: "/images/restaurant-1.jpg",
      title: "Exquisite Dining",
      description: "Experience the finest culinary traditions with a modern twist",
      cta: "Reserve Now",
      link: "#reservation"
    },
    {
      image: "/images/restaurant-2.jpg",
      title: "Fresh Ingredients",
      description: "Locally-sourced produce and premium quality ingredients",
      cta: "Our Menu",
      link: "#menu"
    },
    {
      image: "/images/restaurant-3.jpg",
      title: "Private Events",
      description: "Host your special occasions in our elegant dining space",
      cta: "Learn More",
      link: "#catering"
    }
  ];

  // Handle email form changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle email form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation (in a real app, use a library like zod)
    if (email.includes('@')) {
      setIsSubmitted(true);
      // TODO: Add actual form submission logic here
      console.log('Email submitted:', email);
      
      // Reset form and close after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        closeEmailForm();
        setEmail('');
      }, 3000);
    } else {
      alert('Please fill in all required fields with valid information.');
    }
  };

  return (
    <div className={`medalina-root ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* ===== HEADER ===== */}
      <header className="medalina-header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo">
            <a href="#">
              <MedalinaLogo />
            </a>
          </div>
          
          {/* Right Side Navigation & Button */}
          <div className="header-right">
            <nav className="nav-links">
              <Link href="/templates/restaurant/menu" className="nav-link">MENUS</Link>
              <a href="/templates/restaurant/catering" className="nav-link">CATERING</a>
              <a href="#" className="nav-link">BBQ BOX</a>
              <a href="#" className="nav-link">SUPPER CLUB</a>
              <a href="#" className="nav-link">GIFT CARDS</a>
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
            <a href="/templates/restaurant/catering" className="mobile-link">CATERING</a>
            <a href="#" className="mobile-link">BBQ BOX</a>
            <a href="#" className="mobile-link">SUPPER CLUB</a>
            <a href="#" className="mobile-link">GIFT CARDS</a>
            <Link href="/templates/restaurant/menu" className="mobile-order-button">ORDER ONLINE</Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="home">
        {/* Hero Section */}
        <section className="medalina-hero">
          <Carousel slides={heroSlides} autoplaySpeed={7000} />
        </section>

        {/* Specials & Supper Club Section */}
        <section className="section-dual">
          <div className="section-container">
            {/* Specials Column */}
            <div className="section-column">
              <div className="section-image">
                <Image 
                  src="/images/restaurant-2.jpg"
                  alt="Specialty sandwiches"
                  width={600}
                  height={400}
                  className="dual-img"
                />
              </div>
              <h2 className="section-title">SPECIALS</h2>
              <p className="section-text">
                Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef&apos;s Special that will leave you craving for more!
              </p>
              <a href="#" className="section-btn">SEE THE SPECIALS</a>
            </div>
            
            {/* Supper Club Column */}
            <div className="section-column">
              <div className="section-image">
                <Image 
                  src="/images/restaurant-3.jpg"
                  alt="Supper Club meal"
                  width={600}
                  height={400}
                  className="dual-img"
                />
              </div>
              <h2 className="section-title">SUPPER CLUB</h2>
              <p className="section-text">
                Once a month, Chef & Pitmaster Rob Sonderman presents a new 4-course dine-in experience that goes beyond our regular offerings and puts a smoky spin on gourmet cuisine.
              </p>
              <a href="#" className="section-btn">GET YOUR TICKETS</a>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="section-menu">
          <div className="section-container">
            {/* Left Text Column */}
            <div className="section-column section-text-col">
              <h2 className="section-title">MENU</h2>
              <p className="section-text">
                We&apos;re craft American BBQ made in-house (always). Get traditions and favorites from all over the world — all on one plate. Medalina is a two-time Michelin Bib Gourmand winner serving up DC&apos;s best blend of the classic BBQ traditions you&apos;d find at the most elite cookout and the elevated flavors you&apos;d find at a true fine dining spot.
              </p>
              <p className="section-text">
                Everything we serve is house-made and prepared by a staff that cares. You could spend a lifetime sampling every flavor combination at Medalina, and we hope you do.
              </p>
              <Link href="/templates/restaurant/menu" className="section-btn">PEEP THE MENU</Link>
            </div>
            
            {/* Right Image Column */}
            <div className="section-column section-img-col">
              <div className="section-image full-img">
                <Image 
                  src="/images/steak-tartare.jpg"
                  alt="BBQ meat selection"
                  width={800}
                  height={600}
                  className="img-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Catering Section */}
        <section className="section-catering">
          <div className="section-container">
            {/* Left Image Column */}
            <div className="section-column section-img-col">
              <div className="section-image full-img">
                <Image 
                  src="/images/restaurant-1.jpg"
                  alt="Catering spread"
                  width={800}
                  height={600}
                  className="img-cover"
                />
              </div>
            </div>
            
            {/* Right Text Column */}
            <div className="section-column section-text-col">
              <h2 className="section-title">CATERING</h2>
              <p className="section-text">
                We&apos;ll bring the &apos;que to you! From backyard BBQs, holiday celebrations or hundred-person events, our Barbecrew and catering truck can do it all. Serving thoughtfully crafted sides, vegan and vegetarian options, to the BBQ classics from all the regions of America, and all the corners of the globe — it&apos;s all here.
              </p>
              <a href="/templates/restaurant/catering" className="section-btn">EXPLORE CATERING</a>
            </div>
          </div>
        </section>

        {/* Social Feed Section */}
        <section className="social-feed">
          <div className="section-container">
            <h2 className="social-title">FOLLOW US @MEDALINARESTAURANT</h2>
            <div className="social-grid">
              <a href="#" className="social-item">
                <Image 
                  src="/images/social-1.jpg"
                  alt="Social media post"
                  width={400}
                  height={400}
                  className="social-img"
                />
              </a>
              <a href="#" className="social-item">
                <Image 
                  src="/images/social-2.jpg"
                  alt="Social media post"
                  width={400}
                  height={400}
                  className="social-img"
                />
              </a>
              <a href="#" className="social-item">
                <Image 
                  src="/images/social-3.jpg"
                  alt="Social media post"
                  width={400}
                  height={400}
                  className="social-img"
                />
              </a>
              <a href="#" className="social-item">
                <Image 
                  src="/images/social-4.jpg"
                  alt="Social media post"
                  width={400}
                  height={400}
                  className="social-img"
                />
              </a>
              <a href="#" className="social-item">
                <Image 
                  src="/images/social-5.jpg"
                  alt="Social media post"
                  width={400}
                  height={400}
                  className="social-img"
                />
              </a>
              <a href="#" className="social-item">
                <Image 
                  src="/images/social-6.jpg"
                  alt="Social media post"
                  width={400}
                  height={400}
                  className="social-img"
                />
              </a>
            </div>
          </div>
        </section>

        {/* Logo Ticker Strip */}
        <section className="logo-ticker">
          <div className="ticker-title">
            <h3>AS FEATURED IN</h3>
          </div>
          <div className="ticker-container">
            <div className="ticker-wrapper">
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 100 40" width="100" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">MICHELIN GUIDE</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 120 40" width="120" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">WASHINGTONIAN</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 90 40" width="90" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">EATER DC</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 140 40" width="140" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">WASHINGTON POST</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 80 40" width="80" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">ZAGAT</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 110 40" width="110" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">FOOD & WINE</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 100 40" width="100" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">DC REFINED</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 90 40" width="90" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">THRILLIST</text>
                </svg>
              </div>
              {/* Duplicate items for seamless loop */}
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 100 40" width="100" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">MICHELIN GUIDE</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 120 40" width="120" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">WASHINGTONIAN</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 90 40" width="90" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">EATER DC</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 140 40" width="140" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">WASHINGTON POST</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 80 40" width="80" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">ZAGAT</text>
                </svg>
              </div>
              <div className="ticker-item">
                <svg className="ticker-logo" viewBox="0 0 110 40" width="110" height="40">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor">FOOD & WINE</text>
                </svg>
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
            <a href="#email-signup" className="medalina-btn-footer" onClick={toggleEmailForm}>EMAIL SIGNUP</a>
          </div>
        </div>
        
        <div className="medalina-footer-bottom">
          <p>POWERED BY BENTOBOX</p>
        </div>

        {/* Hidden Email Signup Form - will be shown when clicked */}
        {isEmailFormVisible && (
          <div id="email-signup" className="medalina-footer-signup">
            <div className="max-w-md mx-auto">
              <button 
                onClick={closeEmailForm} 
                className="absolute top-2 right-2 text-white hover:text-yellow-400"
                aria-label="Close form"
              >
                <XIcon className="h-6 w-6" />
              </button>
              <h3 className="text-center mb-4">Email Signup</h3>
              {!isSubmitted ? (
                <form onSubmit={handleEmailSubmit}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="sr-only">Email</label>
                      <input type="email" id="email" name="email" placeholder="Email - Required" required
                             value={email} onChange={handleEmailChange} className="medalina-input"/>
                    </div>
                  </div>
                  <button type="submit" className="medalina-btn w-full">SUBMIT</button>
                </form>
              ) : (
                <div className="medalina-signup-success text-center">
                   <p>Thank you for signing up for email updates!</p>
                   {/* Simple close button for demo */}
                   <button onClick={closeEmailForm} className="text-sm underline mt-2">Close</button>
                </div>
              )}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default MedalinaPage; 