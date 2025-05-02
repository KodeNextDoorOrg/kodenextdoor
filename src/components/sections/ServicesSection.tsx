'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Section, Container, Heading, Text, Button } from '@/components/ui';
import { getAllServices } from '@/lib/firebase/api/services';
import { isValidSvg, normalizeSvgForReact } from '@/lib/utils/svgUtils';

// Local interface for component-specific props
interface ServiceDisplayProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceDisplayProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const ref = useRef<HTMLDivElement>(null);
  
  // Track client-side rendering and fetch services
  useEffect(() => {
    fetchServices();
  }, []);
  
  // Fetch services from Firebase
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      
      // First try with activeOnly filter
      let fetchedServices = await getAllServices(true); 
      
      // If no services are found, try fetching all services
      if (fetchedServices.length === 0) {
        fetchedServices = await getAllServices(false);
        
        // Filter for active services in the component (as a fallback)
        fetchedServices = fetchedServices.filter(service => {
          // Now service.isActive is guaranteed to be boolean by getAllServices
          return service.isActive === true;
        });
      }
      
      // Map the services to our display format with default colors if not specified
      const colorOptions = [
        'from-indigo-500 to-blue-500',
        'from-green-500 to-teal-500',
        'from-purple-500 to-indigo-500',
        'from-blue-500 to-cyan-500',
        'from-red-500 to-orange-500',
        'from-amber-500 to-yellow-500'
      ];
      
      const displayServices = fetchedServices.map((service, index) => ({
        icon: service.icon,
        title: service.title,
        description: service.description,
        features: service.features || [],
        color: service.color || colorOptions[index % colorOptions.length]
      }));
      
      setServices(displayServices);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services');
      
      // Fallback to empty array
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  return (
    <Section 
      id="services" 
      className="relative overflow-hidden py-20"
      ref={ref}
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl -left-64 top-1/4"
        style={{ y: y1 }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -z-10 w-[400px] h-[400px] rounded-full bg-primary/5 blur-2xl right-[10%] bottom-[10%]"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          style={{ opacity, scale }}
        >
          <motion.span 
            className="px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4 inline-block"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            OUR SERVICES
          </motion.span>
          
          <Heading
            level="h2" 
            className="mb-6 text-4xl md:text-5xl font-bold"
            withGradient
            withAnimation
          >
            Expert Solutions for{' '}
            <span className="text-gradient">Digital Success</span>
          </Heading>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Text
              variant="light" 
              className="max-w-2xl mx-auto text-lg"
            >
              We offer a comprehensive range of tech services designed to help businesses innovate, grow, and succeed in today&apos;s digital landscape.
            </Text>
          </motion.div>
        </motion.div>
        
        {isLoading ? (
          // Show loading placeholders
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/30 p-6 h-64 animate-pulse"
              >
                <div className="w-16 h-16 rounded-2xl mb-6 bg-gray-700"></div>
                <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Show error message
          <div className="text-center p-10 bg-red-900/20 rounded-xl">
            <div className="text-red-400 mb-4 text-2xl">⚠️</div>
            <h3 className="text-lg font-medium text-red-300 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-400">
              {error}. Please try refreshing the page.
            </p>
          </div>
        ) : (
          // Show services
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={`${service.title}-${index}`} service={service} index={index} />
            ))}
          </div>
        )}
        
        <motion.div 
          className="mt-20 p-10 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-gray-700/30 relative overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
        >
          {/* Animated background pattern */}
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ 
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 40%)',
              backgroundSize: '200% 200%'
            }}
          />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <motion.h3 
                className="text-2xl md:text-3xl font-bold mb-3 text-white"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Ready to transform your business?
              </motion.h3>
              <motion.p 
                className="text-gray-300 text-lg"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                Let&apos;s discuss how our services can help you achieve your goals.
              </motion.p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button variant="primary" href="#contact" size="lg" className="px-8 py-3 text-lg hover:bg-lime-600 hover:after:none border border-white">
                Get in Touch
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

const ServiceCard = ({ service, index }: { service: ServiceDisplayProps; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Staggered animation for service details
  const detailsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: {
          duration: 0.4
        },
        opacity: {
          delay: 0.1,
          duration: 0.3
        }
      }
    }
  };
  
  // Stagger animation for detail items
  const detailItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.3
      }
    })
  };
  
  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/70 border border-gray-700/30 p-6 transform-gpu shadow-lg backdrop-blur-sm h-full"
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          type: 'spring', 
          stiffness: 200, 
          damping: 20, 
          delay: index * 0.1 
        }
      } : { opacity: 0, y: 30, rotateX: -10 }}
      whileHover={{ 
        y: -10, 
        boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated service icon with gradient */}
      <motion.div 
        className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white bg-gradient-to-tr ${service.color} relative overflow-hidden`}
        animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {/* Animated pattern for the icon background */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 40%)',
            backgroundSize: '200% 200%'
          }}
        />
        <motion.div 
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center w-8 h-8 text-white"
        >
          {isValidSvg(service.icon) ? (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: normalizeSvgForReact(service.icon)
              }}
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </motion.div>
      </motion.div>
      
      {/* Service content with animation */}
      <div className="space-y-2">
        <motion.h3 
          className="text-xl font-bold text-white transition-colors"
          animate={{ color: isHovered ? '#6366f1' : '' }}
        >
          {service.title}
        </motion.h3>
        <motion.p className="text-gray-300">
          {service.description}
        </motion.p>
        
        {/* Interactive details toggle */}
        <motion.button
          className="text-primary text-sm font-medium flex items-center mt-4"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          <motion.span 
            className="ml-1"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ↓
          </motion.span>
        </motion.button>
        
        {/* Expandable details section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="overflow-hidden"
              variants={detailsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ul className="mt-4 space-y-2">
                {service.features.map((detail, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center text-sm text-gray-300"
                    custom={i}
                    variants={detailItemVariants}
                  >
                    <motion.span 
                      className="w-1.5 h-1.5 rounded-full bg-primary mr-2 inline-block"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: i * 0.3 }}
                    />
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};