'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Financial Dashboard',
    description: 'Real-time analytics dashboard for a fintech startup with interactive data visualization and secure authentication.',
    color: 'bg-indigo-500/20',
    gradientFrom: 'from-indigo-500/40',
    gradientTo: 'to-blue-500/40',
    tags: ['React', 'Node.js', 'D3.js', 'AWS'],
    link: '#',
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    description: 'Scalable e-commerce solution with inventory management, payment processing, and personalized recommendations.',
    color: 'bg-blue-500/20',
    gradientFrom: 'from-blue-500/40',
    gradientTo: 'to-teal-500/40',
    tags: ['Next.js', 'Typescript', 'Stripe', 'MongoDB'],
    link: '#',
  },
  {
    id: 3,
    title: 'Healthcare App',
    description: 'Mobile application for healthcare providers to manage patient data, appointments, and medical records securely.',
    color: 'bg-green-500/20',
    gradientFrom: 'from-green-500/40',
    gradientTo: 'to-teal-500/40',
    tags: ['React Native', 'Firebase', 'HIPAA Compliant'],
    link: '#',
  },
  {
    id: 4,
    title: 'AI Recommendation Engine',
    description: 'Machine learning-powered recommendation system for a streaming service to enhance user engagement.',
    color: 'bg-purple-500/20',
    gradientFrom: 'from-purple-500/40',
    gradientTo: 'to-pink-500/40',
    tags: ['Python', 'TensorFlow', 'AWS', 'Docker'],
    link: '#',
  },
];

// Interactive animated project card with parallax effect
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState(false);
  
  // Card content variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateY: -5,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: index * 0.15,
      }
    },
  };
  
  // Text elements staggered animation
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: index * 0.15 + 0.3,
      }
    }
  };
  
  const textItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };
  
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.15 + 0.3 + i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };
  
  return (
    <motion.div
      ref={ref}
      className="card-hover relative group overflow-hidden rounded-2xl bg-gray-light dark:bg-gray-dark border border-white/10 flex flex-col transform-gpu"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}
    >
      <div className="aspect-video relative overflow-hidden">
        {/* Gradient overlay with animation */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${project.gradientFrom} ${project.gradientTo} z-10 opacity-60`}
          animate={{ 
            opacity: hovered ? 0.8 : 0.6,
            scale: hovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Animated background pattern */}
        <motion.div 
          className={`w-full h-full ${project.color} overflow-hidden`}
          animate={{ 
            scale: hovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.7 }}
        >
          {/* Dynamic pattern background */}
          <svg 
            className="w-full h-full opacity-30" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <motion.path 
              d="M0,0 L100,0 L100,100 L0,100 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              animate={{
                d: [
                  "M0,0 L100,0 L100,100 L0,100 Z",
                  "M0,10 L90,0 L100,90 L10,100 Z",
                  "M0,0 L100,0 L100,100 L0,100 Z"
                ]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle 
              cx="50" 
              cy="50" 
              r="30" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              animate={{ 
                r: [30, 40, 30],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>
      
      <motion.div 
        className="p-6 relative z-20 flex-grow flex flex-col"
        variants={textVariants}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {project.tags.map((tag, i) => (
              <motion.span 
                key={tag} 
                className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary inline-block"
                custom={i}
                variants={tagVariants}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "rgba(99, 102, 241, 0.3)"
                }}
              >
                {tag}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        
        <motion.h3 
          className="text-2xl font-bold mb-2"
          variants={textItemVariants}
        >
          {project.title}
        </motion.h3>
        
        <motion.p 
          className="text-text-light mb-4 flex-grow"
          variants={textItemVariants}
        >
          {project.description}
        </motion.p>
        
        <motion.div
          className="mt-auto"
          variants={textItemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href={project.link}
            className="group inline-flex items-center text-primary font-medium"
          >
            <span className="relative">
              View Case Study
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                animate={{ width: hovered ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </span>
            <motion.svg 
              className="ml-2 w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ 
                x: hovered ? 5 : 0,
                opacity: hovered ? 1 : 0.7 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ProjectShowcase = () => {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Enhanced parallax effects on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.8, 1, 1, 0.8]);
  
  // Mouse-based parallax for background elements
  const mouseXPercentage = typeof window !== 'undefined' 
    ? mousePosition.x / window.innerWidth 
    : 0;
  const mouseYPercentage = typeof window !== 'undefined' 
    ? mousePosition.y / window.innerHeight 
    : 0;
  
  const moveX = (mouseXPercentage - 0.5) * 50;
  const moveY = (mouseYPercentage - 0.5) * 50;
  
  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5
  }));
  
  // Title text reveal animation
  const titleVariants = {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const titleWordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: 80,
      transformOrigin: "bottom"
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200
      }
    }
  };
  
  // Title words split for animation
  const titleWords = "Featured Projects".split(" ");
  
  return (
    <motion.section 
      id="projects" 
      className="py-20 relative overflow-hidden" 
      ref={ref}
      style={{ opacity, scale }}
    >
      {/* Enhanced animated background elements with interactive effects */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden"
        style={{
          perspective: "1000px"
        }}
      >
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              `radial-gradient(circle at ${50 + moveX * 0.1}% ${50 + moveY * 0.1}%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)`,
              `radial-gradient(circle at ${30 - moveX * 0.05}% ${70 - moveY * 0.05}%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)`,
              `radial-gradient(circle at ${70 + moveX * 0.1}% ${30 + moveY * 0.1}%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)`,
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Primary orbiting blob */}
        <motion.div 
          className="absolute -z-10 w-[700px] h-[700px] rounded-full bg-primary/10 blur-3xl"
          style={{ 
            y,
            x: useTransform(scrollYProgress, [0, 1], [moveX, -moveX])
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 3, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Secondary morphing blob */}
        <motion.div
          className="absolute w-[500px] h-[500px] bg-gradient-to-r from-secondary/10 to-purple-500/10 blur-3xl -left-32 bottom-20 z-0"
          style={{
            x: useTransform(() => moveX * 0.5, [-25, 25]),
            y: useTransform(() => moveY * 0.5, [-25, 25]),
          }}
          animate={{
            borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '60% 40% 30% 70% / 60% 30% 70% 40%', '30% 70% 70% 30% / 30% 30% 70% 70%'],
            scale: [0.8, 1, 0.8],
            rotate: [0, 10, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated grid with depth */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(rgba(99,102,241,0.05) 1.5px, transparent 1.5px), 
                        linear-gradient(90deg, rgba(99,102,241,0.05) 1.5px, transparent 1.5px)`,
            backgroundSize: 'clamp(20px, 5vw, 60px) clamp(20px, 5vw, 60px)',
            transform: `perspective(1000px) rotateX(${moveY * 0.05}deg) rotateY(${moveX * -0.05}deg)`
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px']
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/40 mix-blend-screen"
            style={{ 
              left: `${particle.x}%`, 
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, particle.id % 2 === 0 ? 30 : -30, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Light beam animation */}
        <motion.div
          className="absolute h-full w-[3px] bg-gradient-to-b from-transparent via-primary/40 to-transparent blur-md left-[30%] opacity-0"
          animate={{
            opacity: [0, 0.4, 0],
            left: ['30%', '70%', '30%'],
            height: ['100%', '150%', '100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 10
          }}
        />
      </motion.div>

      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={titleVariants}
        >
          <motion.span 
            className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
          >
            OUR WORK
          </motion.span>
          
          <h2 className="text-4xl font-bold mb-6 overflow-hidden perspective">
            {titleWords.map((word, i) => (
              <motion.span 
                key={i} 
                className="inline-block mx-1"
                variants={titleWordVariants}
              >
                {word === "Projects" ? (
                  <span className="text-gradient">{word}</span>
                ) : word}
              </motion.span>
            ))}
          </h2>
          
          <motion.p 
            className="text-text-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Explore our portfolio of successful projects where we've helped businesses transform their digital presence and achieve remarkable results.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
        >
          <Link 
            href="#contact"
            className="group relative px-8 py-3 rounded-full border border-primary text-primary overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 bg-primary w-0 h-full"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="relative z-10 group-hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Start Your Project
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProjectShowcase; 