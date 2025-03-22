'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  LightBulbIcon, 
  UserGroupIcon, 
  SparklesIcon, 
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const values = [
    {
      icon: <LightBulbIcon className="w-6 h-6" />,
      title: 'Innovation',
      description: 'We push boundaries to create cutting-edge solutions that set new standards.',
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      title: 'Collaboration',
      description: 'We work closely with our clients as true partners in their success.',
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: 'Excellence',
      description: 'We are committed to delivering the highest quality in everything we do.',
    },
    {
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      title: 'Growth',
      description: 'We focus on scalable solutions that help our clients achieve their goals.',
    },
  ];
  
  const stats = [
    { value: '200+', label: 'Clients Worldwide' },
    { value: '500+', label: 'Projects Delivered' },
    { value: '15+', label: 'Years Experience' },
    { value: '98%', label: 'Client Satisfaction' },
  ];
  
  return (
    <section id="about" className="py-20 relative overflow-hidden" ref={ref}>
      <motion.div 
        className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl -left-64 top-1/3"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute -z-10 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl -right-64 top-0"
        style={{ y: y2 }}
      />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block">
                ABOUT US
              </span>
              <h2 className="text-4xl font-bold mb-6">We're a team of <span className="text-gradient">tech enthusiasts</span> driven by innovation</h2>
              <p className="text-text-light mb-8">
                Founded in 2010, KodeNextDoor has been at the forefront of digital transformation, helping businesses of all sizes harness the power of technology to drive growth and innovation. 
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                At Kode Next Door, we&apos;re passionate about creating innovative digital solutions that help businesses thrive.
              </p>
              <p className="text-text-light mb-8">
                Our team of experts combines deep technical knowledge with strategic thinking to deliver customized solutions that meet the unique needs of each client. We believe in building lasting partnerships and are committed to your success.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="p-5 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 rounded-xl shadow-md backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div 
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                  >{stat.value}</motion.div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-tr from-primary/20 to-secondary/20 p-1">
              <div className="w-full h-full rounded-xl bg-gray-light dark:bg-gray-dark p-6 grid grid-cols-2 grid-rows-2 gap-4">
                {values.map((value, index) => (
                  <motion.div 
                    key={value.title} 
                    className="bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-sm rounded-lg p-6 flex flex-col justify-center border border-white/20 dark:border-gray-700/30 shadow-sm"
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 1,
                      boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <motion.div 
                      className={`p-3 rounded-full mb-4 inline-block bg-gradient-to-r ${
                        index === 0 ? 'from-purple-500 to-indigo-500' :
                        index === 1 ? 'from-blue-500 to-cyan-500' :
                        index === 2 ? 'from-green-500 to-teal-500' :
                        'from-orange-500 to-amber-500'
                      }`}
                      whileHover={{ rotate: 15 }}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      {value.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              className="absolute -top-10 -left-10 p-6 rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm shadow-xl z-10 border border-white/20 dark:border-gray-700/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <UserGroupIcon className="w-6 h-6" />
                  </motion.div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800 dark:text-white mb-1">50+ Experts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Dedicated professionals</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 