'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Parallax effect on scroll
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Mouse position calculation
  const getMouseXPercentage = () => {
    if (typeof window === 'undefined') return 0;
    return (mousePosition.x / window.innerWidth) * 100;
  };
  
  const getMouseYPercentage = () => {
    if (typeof window === 'undefined') return 0;
    return (mousePosition.y / window.innerHeight) * 100;
  };
  
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

  const textReveal = {
    hidden: { 
      opacity: 0, 
      clipPath: 'inset(0 100% 0 0)' 
    },
    visible: {
      opacity: 1, 
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        delay: 0.4
      }
    }
  };
  
  // Enhanced animated background gradient pattern with more complex animation
  const gradientVariants = {
    animate: {
      background: [
        "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 80% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 10% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
      ],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "linear"
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
  
  // Interactive card with 3D tilt effect
  const cardVariants = {
    rest: { 
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0,0,0,0.2)" 
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Generate particle positions
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }));

  return (
    <motion.section 
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ opacity }}
    >
      {/* Advanced animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-10 overflow-hidden"
        variants={gradientVariants}
        animate="animate"
      >
        {/* Enhanced floating blobs with interactive movement */}
        <motion.div
          className="absolute top-0 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0]
          }}
          style={{ 
            y: yBlob1,
            x: getMouseXPercentage() 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-secondary/20 to-secondary/5 blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0] 
          }}
          style={{ 
            y: yBlob2,
            x: getMouseXPercentage() 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          initial={{ y: 20 }}
        />
        
        {/* New morphing blob */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
          animate={{ 
            borderRadius: ['60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%', '60% 40% 30% 70%/60% 30% 70% 40%'],
            rotate: [0, 10, 0],
            scale: [0.8, 1, 0.8],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Advanced 3D grid pattern with perspective and mouse-based movement */}
        <motion.div 
          className="absolute inset-0 perspective-[1000px]"
          style={{
            transform: `rotateX(${getMouseYPercentage() * 2}deg) rotateY(${getMouseXPercentage() * 2}deg)`
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:clamp(20px,5vw,4rem)_clamp(20px,5vw,4rem)]"
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
          
          {/* Secondary grid with different angle and speed */}
          <motion.div 
            className="absolute inset-0 rotate-[30deg] scale-[2] opacity-30 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:clamp(40px,8vw,6rem)_clamp(40px,8vw,6rem)]"
            animate={{
              backgroundPosition: ['0px 0px', '-100px -100px'],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
        
        {/* Animated noise texture overlay */}
        <motion.div 
          className="absolute inset-0 opacity-10 bg-noise mix-blend-overlay"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px'
          }}
          animate={{
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles */}
        {particles.map((particle) => (
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
              y: [0, -30, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Light beams */}
        <motion.div
          className="absolute inset-0 overflow-hidden opacity-20"
        >
          <motion.div
            className="absolute top-[-10%] left-[45%] w-[10px] h-[120%] bg-gradient-to-b from-primary/0 via-primary/70 to-primary/0 rotate-[30deg] blur-md"
            animate={{
              left: ['45%', '55%', '45%'],
              rotate: [30, 35, 30],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 5
            }}
          />
          <motion.div
            className="absolute top-[-10%] left-[25%] w-[5px] h-[120%] bg-gradient-to-b from-secondary/0 via-secondary/70 to-secondary/0 rotate-[-20deg] blur-md"
            animate={{
              left: ['25%', '20%', '25%'],
              rotate: [-20, -25, -20],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 7,
              delay: 2
            }}
          />
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-6 z-10 pt-20">
        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          <motion.div className="flex-1" style={{ y: yText }}>
            <motion.h2 
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
            </motion.h2>
            
            <motion.h1 
              variants={textReveal}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              Transforming Ideas into 
              <motion.span 
                className="text-gradient ml-2 inline-block" 
                animate={{ 
                  backgroundSize: ['100% 100%', '200% 100%', '100% 100%'],
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                Digital Reality
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUpItem}
              className="text-text-light text-lg mb-8 max-w-xl"
            >
              We are a team of tech experts who build innovative software solutions that help businesses thrive in the digital age. From concept to deployment, we bring your ideas to life.
            </motion.p>
            
            <div className="flex flex-wrap gap-4">
              <motion.div
                variants={fadeUpItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#services" 
                  className="group relative px-8 py-3 bg-primary text-white rounded-full font-medium overflow-hidden"
                >
                  <motion.span 
                    className="absolute inset-0 bg-primary-dark w-0"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Explore Services</span>
                </Link>
              </motion.div>
              
              <motion.div
                variants={fadeUpItem}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#contact" 
                  className="px-8 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all"
                >
                  <motion.span className="inline-block">Contact Us</motion.span>
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-12 flex items-center gap-6"
              variants={fadeUpItem}
            >
              <motion.div 
                className="flex -space-x-2"
                initial="hidden"
                animate="visible"
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
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >200+</motion.span> clients worldwide
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div 
              className="relative w-full h-[500px]"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate={{ 
                rotateX: [0, 2, 0, -2, 0],
                rotateY: [0, -2, 0, 2, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/30 to-secondary/30 blur-2xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-full h-full rounded-2xl bg-gray-light dark:bg-gray-dark p-6 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                {/* Interactive code visualization */}
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
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Code-like interface elements with typing animation */}
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
                        width: ['30%', '60%', '45%', '60%'],
                      }}
                      transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -top-10 -right-10 p-5 rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm shadow-xl z-10 max-w-[200px] border border-white/20 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex items-center mb-2">
                <motion.div 
                  className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >+135%</motion.div>
                <motion.div
                  className="ml-2 w-4 h-4"
                  animate={{
                    y: [-2, 2, -2]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
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
              className="absolute -bottom-5 -left-5 p-5 rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm shadow-xl z-10 border border-white/20 dark:border-gray-700/30"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div 
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
      </div>
    </motion.section>
  );
};

export default Hero; 