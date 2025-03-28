'use client';

import { getContactInfo } from '@/lib/firebase/api/contactInfo';
import { ContactInfo } from '@/lib/firebase/models/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Container, Text } from '../ui';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Development', href: '#services' },
      { label: 'Mobile Apps', href: '#services' },
      { label: 'UI/UX Design', href: '#services' },
    ],
  },
];

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contact information from the database
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('Footer: Fetching contact info...');
        const info = await getContactInfo();
        console.log('Footer: Contact info received:', info);
        setContactInfo(info);
      } catch (error) {
        console.error('Footer: Error fetching contact info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Update the socialLinks with values from database if available
  const socialLinks = [
    { label: 'X', href: contactInfo?.socialMedia?.twitter || 'https://x.com', icon: <FaXTwitter /> },
    { label: 'Instagram', href: contactInfo?.socialMedia?.github || 'https://instagram.com', icon: <FaInstagram /> },
    { label: 'LinkedIn', href: contactInfo?.socialMedia?.linkedin || 'https://linkedin.com', icon: <FaLinkedin /> },
  ];

  return (
    <footer className="bg-gray-light dark:bg-gray-dark pt-16 pb-8">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              className="text-2xl font-bold mb-4"
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-gradient">Kode Next Door</span>
            </motion.div>
            <Text variant="muted" className="mb-6 max-w-md">
              Follow us on social media to stay updated on our latest projects and news.
            </Text>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200/80 to-white/50 dark:from-gray-700/80 dark:to-gray-800/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors shadow-sm"
                  whileHover={{ y: -5 }}
                  aria-label={link.label}
                >
                  <span className="sr-only">{link.label}</span>
                  <div className="w-5 h-5">{link.icon}</div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info - Now loaded from database */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Us</h4>
            <a href={`mailto:${contactInfo?.email}`} className="text-primary hover:underline">
              {contactInfo?.email}
            </a>
          </div>
          <div className="text-center ">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Call Us</h4>
            <a href={`tel:${contactInfo?.phone}`} className="text-primary hover:underline ">
              {contactInfo?.phone}
            </a>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Located In</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {contactInfo?.address}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kode Next Door. All rights reserved. We&apos;re dedicated to your digital success.</p>
        </div>
      </Container>
    </footer>
  );
} 