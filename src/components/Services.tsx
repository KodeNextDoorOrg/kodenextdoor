'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  CodeBracketIcon, 
  DevicePhoneMobileIcon,
  CubeIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  details: string[];
}

const services: Service[] = [
  {
    icon: <CodeBracketIcon className="w-7 h-7" />,
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies for optimal performance and scalability.',
    color: 'from-indigo-500 to-blue-500',
    details: [
      'React, Angular & Vue.js expertise',
      'Progressive Web Applications',
      'Custom API development',
      'Headless CMS integration'
    ]
  },
  {
    icon: <DevicePhoneMobileIcon className="w-7 h-7" />,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile apps that deliver exceptional user experiences across all devices.',
    color: 'from-green-500 to-teal-500',
    details: [
      'iOS & Android development',
      'React Native & Flutter expertise',
      'App Store optimization',
      'Offline capabilities'
    ]
  },
  {
    icon: <CubeIcon className="w-7 h-7" />,
    title: 'UI/UX Design',
    description: 'User-centered design that balances beautiful aesthetics with intuitive functionality.',
    color: 'from-purple-500 to-indigo-500',
    details: [
      'User research & testing',
      'Wireframing & prototyping',
      'Responsive design',
      'Design systems development'
    ]
  },
  {
    icon: <CloudArrowUpIcon className="w-7 h-7" />,
    title: 'Cloud Solutions',
    description: 'Secure, scalable cloud infrastructure and deployment strategies for your applications.',
    color: 'from-blue-500 to-cyan-500',
    details: [
      'AWS, Azure & GCP solutions',
      'Serverless architecture',
      'DevOps & CI/CD pipelines',
      'Cloud cost optimization'
    ]
  },
  {
    icon: <ShieldCheckIcon className="w-7 h-7" />,
    title: 'Cybersecurity',
    description: 'Comprehensive security assessments and strategies to protect your digital assets.',
    color: 'from-red-500 to-orange-500',
    details: [
      'Security audits & testing',
      'GDPR & compliance consulting',
      'Authentication systems',
      'Data encryption strategies'
    ]
  },
  {
    icon: <LightBulbIcon className="w-7 h-7" />,
    title: 'Digital Strategy',
    description: 'Strategic consulting to help you leverage technology for business growth and innovation.',
    color: 'from-amber-500 to-yellow-500',
    details: [
      'Technology roadmapping',
      'Digital transformation',
      'Market & competitor analysis',
      'Business process automation'
    ]
  },
];

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
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
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 border border-white/20 dark:border-gray-700/30 p-6 transform-gpu shadow-lg backdrop-blur-sm"
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
        >
          {service.icon}
        </motion.div>
      </motion.div>
      
      {/* Service content with animation */}
      <div className="space-y-2">
        <motion.h3 
          className="text-xl font-bold text-gray-800 dark:text-white transition-colors"
          animate={{ color: isHovered ? '#6366f1' : '' }}
        >
          {service.title}
        </motion.h3>
        <motion.p className="text-gray-600 dark:text-gray-300">
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
                {service.details.map((detail, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300"
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

const Services = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  return (
    <motion.section 
      id="services" 
      className="py-20 relative overflow-hidden"
      ref={ref}
      style={{ opacity, scale }}
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
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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
          
          <h2 className="text-4xl font-bold mb-6 overflow-hidden">
            <span className="inline-block mr-3 text-gray-800 dark:text-white">Expert Solutions for</span>
            <motion.span 
              className="text-gradient relative inline-block"
              initial={{ backgroundSize: "100%" }}
              animate={{ 
                backgroundSize: ["100%", "200%", "100%"],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              Digital Success
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            We offer a comprehensive range of tech services designed to help businesses innovate, grow, and succeed in today&apos;s digital landscape.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 relative overflow-hidden shadow-lg"
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
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <motion.h3 
                className="text-2xl font-bold mb-2 text-gray-800 dark:text-white"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Ready to transform your business?
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-300"
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
              <a 
                href="#contact" 
                className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden inline-block shadow-md"
              >
                <motion.span 
                  className="absolute inset-0 bg-primary-dark"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Get in Touch</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Services; 