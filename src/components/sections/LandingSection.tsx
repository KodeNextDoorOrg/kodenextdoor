'use client';

import { Button, Container, Heading, Section, Text } from '@/components/ui';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function LandingSection() {
  const ref = useRef(null);
  // Store particles in state
  const [particles, setParticles] = useState([]);
  // Track if component is mounted
  const [isClient, setIsClient] = useState(false);
  // Track if initial load animation should play
  const [shouldAnimate, setShouldAnimate] = useState(true);

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
    const newParticles = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 1
    }));

    setParticles(newParticles);
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
            <div className="w-full flex mb-8">
              <motion.span
                className="text-gradient inline-block text-2xl"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                *Knock* ... *Knock*
              </motion.span>
            </div>

            <motion.div
              className="text-7xl text-accent font-semibold mb-4 inline-block"
              variants={fadeUpItem}
            >
              <motion.span
                className="inline-block"
                animate={{
                  color: ['#f97316', '#6366f1', '#10b981', '#f97316'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                Kode Next Door
              </motion.span>
            </motion.div>

            <Heading level="h1" className="mb-6" withAnimation>
              Your Future Awaits
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
                <Button variant="outline" href="#services" size="lg" >
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
          </motion.div>
        </div>
      </Container>
    </Section>
  );
} 