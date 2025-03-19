'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Footer = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const footerLinks = [
    {
      title: 'Services',
      links: [
        { name: 'Web Development', href: '#services' },
        { name: 'Mobile Development', href: '#services' },
        { name: 'UI/UX Design', href: '#services' },
        { name: 'Cloud Solutions', href: '#services' },
        { name: 'Cybersecurity', href: '#services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
        { name: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Cookie Policy', href: '#cookies' },
      ],
    },
  ];

  return (
    <footer className="pt-20 pb-10 relative overflow-hidden">
      <div className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -left-64 top-0" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <motion.div 
            className="lg:col-span-2"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold">
                <span className="text-gradient">Kode</span>
                <span>NextDoor</span>
              </span>
            </Link>
            <p className="text-text-light max-w-md mb-6">
              We combine creativity, technical expertise, and strategic thinking to deliver exceptional digital solutions for businesses of all sizes.
            </p>
            <div className="flex gap-4">
              {['twitter', 'linkedin', 'github', 'instagram'].map((platform, i) => (
                <motion.a
                  key={platform}
                  href={`https://${platform}.com`}
                  className="w-10 h-10 rounded-full bg-gray-light dark:bg-gray-dark flex items-center justify-center text-text-light hover:bg-primary hover:text-white transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-5 h-5">{/* Icon placeholder */}</div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {footerLinks.map((section, idx) => (
            <motion.div 
              key={section.title}
              custom={idx + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-lg font-bold mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-text-light hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-text-light">
                © {new Date().getFullYear()} KodeNextDoor. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link 
                  href="#terms"
                  className="text-text-light hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
                <Link 
                  href="#privacy"
                  className="text-text-light hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="#cookies"
                  className="text-text-light hover:text-primary transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 