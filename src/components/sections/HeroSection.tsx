'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section, Container, Heading, Text, Button } from '@/components/ui';

export default function HeroSection() {
  const ref = useRef(null);
  // Store particles in state
  const [particles, setParticles] = useState([]);
  // Store any random delay values
  const [randomDelays, setRandomDelays] = useState({
    particleDelays: []
  });
  // Track if component is mounted
  const [isClient, setIsClient] = useState(false);
  // Track if initial load animation should play
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect on scroll
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Generate particles and any random values on client-side only to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Generate particle positions
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10
    }));
    
    // Generate random delay values for animations
    const newParticleDelays = Array.from({ length: 20 }, () => Math.random() * 5);
    
    setParticles(newParticles);
    setRandomDelays({
      particleDelays: newParticleDelays
    });
    
    // Force animations to start with a small delay
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // More dynamic fade in animation with staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };
  
  const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9],
      }
    }
  };

  // List of gray colors for the avatars
  const grayColors = [
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600"
  ];

  return (
    <Section 
      ref={ref}
      className="min-h-screen flex items-center justify-center pt-16 pb-20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 10% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating blobs with interactive movement */}
        <motion.div
          className="absolute top-0 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl"
          animate={{ 
            y: [0, -30],
            scale: [1, 1.1],
            rotate: [0, 5]
          }}
          style={{ y: yBlob1 }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-secondary/20 to-secondary/5 blur-3xl"
          animate={{ 
            y: [0, -30],
            scale: [1, 1.1],
            rotate: [0, -5]
          }}
          style={{ y: yBlob2 }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1
          }}
          initial={{ y: 20 }}
        />
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px)]"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          style={{
            backgroundSize: 'clamp(20px, 5vw, 4rem) clamp(20px, 5vw, 4rem)'
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating particles - Only render when particles array is populated */}
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-70"
            style={{ 
              left: `${particle.x}%`, 
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30],
              opacity: [0, 0.7],
              scale: [0, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: randomDelays.particleDelays[index] || 0,
            }}
          />
        ))}
      </div>

      <Container>
        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          <motion.div 
            className="flex-1" 
            style={{ y: yText, opacity }}
            variants={containerVariants}
            initial="hidden"
            animate={isClient ? "visible" : "hidden"}
          >
            <motion.div 
              className="text-lg text-accent font-semibold mb-4 inline-block"
              variants={fadeUpItem}
            >
              <motion.span
                className="inline-block"
                animate={{ 
                  color: ['#f97316', '#6366f1', '#10b981', '#f97316'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                TECH CONSULTANCY
              </motion.span>
            </motion.div>
            
            <Heading level="h1" className="mb-6" withAnimation>
              Transforming Ideas into{' '}
              <motion.span 
                className="text-gradient inline-block" 
                animate={{ 
                  backgroundSize: ['100% 100%', '200% 100%'],
                  backgroundPosition: ['0% 50%', '100% 50%']
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut" 
                }}
              >
                Digital Reality
              </motion.span>
            </Heading>
            
            <motion.div variants={fadeUpItem}>
              <Text size="lg" variant="light" className="mb-8 max-w-xl">
                We are a team of tech experts who build innovative software solutions that help businesses thrive in the digital age. From concept to deployment, we bring your ideas to life.
              </Text>
            </motion.div>
            
            <div className="flex flex-wrap gap-4">
              <motion.div
                variants={fadeUpItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="primary" href="#services" size="lg">
                  Explore Services
                </Button>
              </motion.div>
              
              <motion.div
                variants={fadeUpItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" href="#contact" size="lg">
                  Contact Us
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-12 flex items-center gap-6"
              variants={fadeUpItem}
            >
              <motion.div 
                className="flex -space-x-2"
                initial="hidden"
                animate={isClient ? "visible" : "hidden"}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.6
                    }
                  }
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ y: -5, zIndex: 10 }}
                  >
                    <div className={`w-full h-full ${grayColors[i]}`}></div>
                  </motion.div>
                ))}
              </motion.div>
              <div>
                <motion.p 
                  className="font-medium"
                  variants={fadeUpItem}
                >
                  Trusted by <motion.span 
                    className="text-primary"
                    animate={{ 
                      scale: [1, 1.1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >200+</motion.span> clients worldwide
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative w-full max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isClient ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div 
              className="relative w-full h-[500px]"
              whileHover={{ scale: 1.03 }}
              animate={{ 
                rotateX: [0, 2],
                rotateY: [0, -2]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "mirror", 
                ease: "easeInOut" 
              }}
            >
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/30 to-secondary/30 blur-2xl"
                animate={{ 
                  scale: [1, 1.05],
                  rotate: [0, 1]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut" 
                }}
              />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 p-6 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-md aspect-[4/3] relative">
                  <motion.div 
                    className="absolute inset-0 bg-primary/40 rounded-xl"
                    animate={{ 
                      boxShadow: ['0 0 0 rgba(99,102,241,0.4)', '0 0 25px rgba(99,102,241,0.6)', '0 0 0 rgba(99,102,241,0.4)'] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="p-2 rounded-xl backdrop-blur-sm bg-white/10 absolute top-0 right-0 mt-2 mr-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-green-400"
                      animate={{ 
                        scale: [1, 1.2],
                        opacity: [0.7, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>
                  
                  {/* Code-like interface elements */}
                  <div className="absolute top-0 left-0 mt-3 ml-3 w-[90%]">
                    <motion.div 
                      className="h-5 w-[70%] bg-white/20 rounded-full"
                      animate={{ width: ['40%', '70%'] }}
                      transition={{ duration: 1, delay: 1.5 }}
                    />
                    <motion.div 
                      className="h-5 w-[50%] bg-white/20 rounded-full mt-3"
                      initial={{ width: '0%' }}
                      animate={{ width: '50%' }}
                      transition={{ duration: 0.8, delay: 1.8 }}
                    />
                    <motion.div 
                      className="h-5 w-[80%] bg-white/20 rounded-full mt-3"
                      initial={{ width: '0%' }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 1.2, delay: 2.1 }}
                    />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/20 backdrop-blur-sm rounded-b-xl p-4">
                    <div className="h-3 w-[80%] bg-white/20 rounded-full mb-2"></div>
                    <motion.div 
                      className="h-3 w-[60%] bg-white/20 rounded-full"
                      animate={{ 
                        width: ['30%', '60%']
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        repeatType: 'reverse' 
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -top-10 -right-10 p-5 rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm shadow-xl z-10 border border-white/20 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-2">
                <motion.div 
                  className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.1] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >+135%</motion.div>
                <motion.div
                  className="ml-2 w-4 h-4"
                  animate={{ y: [-2, 2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-500">
                    <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Increase in client revenue</div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-5 -left-5 p-5 rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm shadow-xl z-10 border border-white/20 dark:border-gray-700/30"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div 
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary"
                  animate={{ 
                    scale: [1, 1.2],
                    rotate: [0, 5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    ease: "easeInOut" 
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.084l9.618-13.1A11.955 11.955 0 0112 2.944z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">Security First</div>
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-11">Enterprise-grade protection</div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
} 