'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { Section, Container, Heading, Text, Button, Grid } from '@/components/ui';
import { Input, Textarea, FormLabel, FormControl } from '@/components/ui/Form';
import { saveContactSubmission } from '@/lib/firestore';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

// Contact information
const contactInfo = [
  {
    icon: <EnvelopeIcon className="w-6 h-6" />,
    title: 'Email Us',
    details: 'info@kodenextdoor.com',
    link: 'mailto:info@kodenextdoor.com'
  },
  {
    icon: <PhoneIcon className="w-6 h-6" />,
    title: 'Call Us',
    details: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  },
  {
    icon: <MapPinIcon className="w-6 h-6" />,
    title: 'Office',
    details: '123 Tech Street, SF',
    link: 'https://maps.google.com'
  }
];

// Business hours
const businessHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
];

export default function ContactSection() {
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Reset error
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Save form data to Firebase
      const result = await saveContactSubmission(formData);
      
      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Form field animation variants
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };
  
  // Form fields configuration
  const formItems = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true, half: true, index: 0 },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true, half: true, index: 1 },
    { name: 'email', label: 'Email Address', type: 'email', required: true, half: false, index: 2 },
    { name: 'subject', label: 'Subject', type: 'text', required: true, half: false, index: 3 },
    { name: 'message', label: 'Message', type: 'textarea', required: true, half: false, index: 4 }
  ];
  
  return (
    <Section 
      id="contact" 
      className="relative min-h-screen overflow-hidden py-24"
      ref={ref}
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-40"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-gray-800/20 dark:from-gray-900/40 dark:to-gray-950/30" />
        
        {/* Animated blobs */}
        <motion.div 
          className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </motion.div>
      
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
          >
            GET IN TOUCH
          </motion.span>
          
          <Heading 
            level="h2" 
            className="mb-6 text-4xl md:text-5xl font-bold" 
            withGradient
            withAnimation
          >
            Let&apos;s Start a <span className="text-gradient">Conversation</span>
          </Heading>
          
          <Text 
            variant="light" 
            className="max-w-2xl mx-auto mb-12 text-lg"
          >
            Have a project in mind or want to learn more about our services? We&apos;re here to help. Reach out and let&apos;s discuss how we can bring your vision to life.
          </Text>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact form */}
          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send us a message</h3>
            
            {isSubmitted ? (
              <motion.div 
                className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <svg 
                  className="w-16 h-16 text-green-500 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank you!</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Your message has been sent successfully. We&apos;ll get back to you as soon as possible.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formItems.map((item) => (
                    <motion.div 
                      key={item.name} 
                      className={item.half ? "" : "md:col-span-2"}
                      variants={formFieldVariants}
                      custom={item.index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {item.type === 'textarea' ? (
                        <FormControl>
                          <FormLabel htmlFor={item.name} required={item.required}>{item.label}</FormLabel>
                          <Textarea
                            id={item.name}
                            name={item.name}
                            required={item.required}
                            value={formData[item.name as keyof FormState]}
                            onChange={handleChange}
                            className="h-40"
                          />
                        </FormControl>
                      ) : (
                        <FormControl>
                          <FormLabel htmlFor={item.name} required={item.required}>{item.label}</FormLabel>
                          <Input
                            id={item.name}
                            name={item.name}
                            type={item.type}
                            required={item.required}
                            value={formData[item.name as keyof FormState]}
                            onChange={handleChange}
                          />
                        </FormControl>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {error && (
                  <motion.div 
                    className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p>{error}</p>
                  </motion.div>
                )}
                
                <motion.div
                  variants={formFieldVariants}
                  custom={5}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full py-3 px-8"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>
          
          {/* Contact information and map */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Contact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 flex flex-col items-center text-center shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1 min-h-[150px] justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <motion.div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {info.icon}
                  </motion.div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">{info.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm break-words w-full overflow-hidden">
                    {info.details}
                  </p>
                </motion.a>
              ))}
            </div>
            
            {/* Business hours */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Business Hours</h3>
              </div>
              
              <ul className="space-y-3">
                {businessHours.map((item, index) => (
                  <motion.li 
                    key={item.day}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  >
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.day}</span>
                    <span className={`${item.hours === 'Closed' ? 'text-red-500' : 'text-gray-900 dark:text-white'} font-semibold`}>
                      {item.hours}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Map placeholder (in a real app, embed an actual map here) */}
            <motion.div 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 aspect-video h-64 flex items-center justify-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center px-6">
                  <MapPinIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="text-gray-800 dark:text-gray-200 font-medium mb-4">
                    123 Tech Street, SF
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    href="https://maps.google.com"
                    target="_blank"
                    className="!text-sm"
                  >
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
} 