'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Section, Container, Heading, Text, Button } from '@/components/ui';
import { getCompanyInfo, CompanyInfo } from '@/lib/firebase/api/companyInfo';

interface Stat {
  value: string;
  label: string;
  color: string;
}

export default function AboutSection() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Track if component is mounted (client-side) to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Fetch company info on component mount
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const info = await getCompanyInfo();
        setCompanyInfo(info);
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyInfo();
  }, []);
  
  // Generate stats array from company info
  const stats: Stat[] = [
    { 
      value: companyInfo?.yearsExperience ? `${companyInfo.yearsExperience}+` : '10+', 
      label: 'Years Experience', 
      color: 'from-indigo-500 to-purple-500' 
    },
    { 
      value: companyInfo?.projectsCompleted ? `${companyInfo.projectsCompleted}+` : '150+', 
      label: 'Projects Completed', 
      color: 'from-blue-500 to-teal-500' 
    },
    { 
      value: companyInfo?.clientSatisfaction ? `${companyInfo.clientSatisfaction}%` : '95%', 
      label: 'Client Satisfaction', 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      value: '24/7', 
      label: 'Support Available', 
      color: 'from-amber-500 to-orange-500' 
    },
  ];
  
  const ref = useRef(null);
  // Reduced threshold to detect earlier (0.01 instead of 0.1)
  const isInView = useInView(ref, { once: true, amount: 0.01 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Additional effect to force animations if not triggered by scroll
  useEffect(() => {
    if (isClient && !isLoading) {
      // Force scroll event to trigger animations
      window.dispatchEvent(new Event('scroll'));
    }
  }, [isClient, isLoading]);
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  // Display loading skeleton if data is still loading
  if (isLoading) {
    return (
      <Section id="about" className="relative overflow-hidden py-24">
        <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative h-[500px] p-4 order-2 lg:order-1 animate-pulse">
              <div className="absolute top-0 right-0 w-5/6 h-5/6 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700"></div>
              <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden bg-gray-300 dark:bg-gray-800"></div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-800 rounded w-40"></div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }
  
  return (
    <Section 
      id="about" 
      className="relative overflow-hidden py-24"
      ref={ref}
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-30"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" />
        
        <motion.div 
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          style={{ y: y1 }}
          animate={{ 
            scale: [1, 1.2],
            rotate: [0, 3],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl"
          style={{ y: y2 }}
          animate={{ 
            scale: [1, 1.3],
            rotate: [0, -3],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        />
        
        {/* Grid pattern for background texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{ 
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
      </motion.div>
      
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Images */}
          <motion.div 
            className="relative h-[500px] p-4 order-2 lg:order-1"
            style={{ opacity }}
            initial={{ opacity: 0, x: -50 }}
            animate={isClient ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Main image */}
            <motion.div 
              className="absolute top-0 right-0 w-5/6 h-5/6 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              animate={isClient ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{ scale: 1.03, rotateY: 5 }}
            >
              <div className="relative w-full h-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Team collaboration</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay" />
            </motion.div>
            
            {/* Secondary image */}
            <motion.div 
              className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl z-10"
              initial={{ opacity: 0, y: 50, rotateY: 10 }}
              animate={isClient ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
            >
              <div className="relative w-full h-full bg-gradient-to-bl from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Our workspace</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-bl from-secondary/40 to-transparent mix-blend-overlay" />
            </motion.div>
            
            {/* Floating badge */}
            <motion.div 
              className="absolute top-1/4 left-1/2 z-20 bg-white dark:bg-gray-800 shadow-xl rounded-full py-3 px-5 font-bold text-primary"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isClient ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              animate={{
                y: [0, -10],
                rotate: [0, 5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Since 2014
            </motion.div>
          </motion.div>
          
          {/* Right column - Content */}
          <motion.div 
            className="order-1 lg:order-2"
            variants={containerVariants}
            initial="hidden"
            animate={isClient ? "visible" : "hidden"}
          >
            <motion.span 
              className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block"
              variants={itemVariants}
            >
              ABOUT US
            </motion.span>
            
            <Heading 
              level="h2" 
              className="mb-6 text-4xl md:text-5xl font-bold" 
              withGradient
              withAnimation
            >
              Passionate About Crafting <span className="text-gradient">Digital Experiences</span>
            </Heading>
            
            <motion.div className="space-y-6 mb-10" variants={itemVariants}>
              <Text variant="light" className="text-lg">
                {companyInfo?.aboutUs || 'At Kode Next Door, we are a team of passionate developers, designers, and strategists dedicated to transforming ideas into exceptional digital solutions. Since 2014, we&apos;ve been at the forefront of technology innovation, helping businesses of all sizes achieve their digital goals.'}
              </Text>
              
              <Text variant="light" className="text-lg">
                {companyInfo?.mission || 'Our approach combines technical expertise with creative thinking to deliver solutions that not only meet your needs today but adapt to your challenges tomorrow. We believe in collaborative partnerships, transparent processes, and delivering results that exceed expectations.'}
              </Text>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-14">
              <Button 
                variant="secondary" 
                href="#contact"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                Let&apos;s Work Together
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-6"
              variants={itemVariants}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 blur-xl group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                    <h3 className={`text-3xl font-bold mb-1 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
} 