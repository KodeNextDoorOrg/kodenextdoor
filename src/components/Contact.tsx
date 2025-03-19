'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { saveContactSubmission } from '@/lib/firestore';

const Contact = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Save form data to Firebase
      const result = await saveContactSubmission(formState);
      
      if (result.success) {
        setIsSubmitted(true);
        setFormState({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
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

  const contactInfo = [
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      title: 'Email',
      details: 'hello@kodenextdoor.com',
      link: 'mailto:hello@kodenextdoor.com',
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <MapPinIcon className="w-6 h-6" />,
      title: 'Office',
      details: '123 Tech Avenue, San Francisco, CA',
      link: 'https://maps.google.com',
    },
  ];

  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  const formItems = [
    { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Your first name', required: true },
    { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Your last name', required: true },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'Your email address', required: true },
    { id: 'subject', label: 'Subject', type: 'text', placeholder: 'What is this regarding?', required: true },
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -right-64 bottom-0" />
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 inline-block">
            GET IN TOUCH
          </span>
          <h2 className="text-4xl font-bold mb-6">Let's Bring Your Ideas to <span className="text-gradient">Life</span></h2>
          <p className="text-text-light">Ready to start your project or have a question? Reach out to us and let's discuss how we can help you achieve your technology goals.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 backdrop-blur-sm shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">{info.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{info.details}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-10">
                <h4 className="font-medium mb-4 text-gray-800 dark:text-white">Connect with us</h4>
                <div className="flex gap-4">
                  {['twitter', 'linkedin', 'github', 'instagram'].map((platform, i) => (
                    <motion.a
                      key={platform}
                      href={`https://${platform}.com`}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200/80 to-white/50 dark:from-gray-700/80 dark:to-gray-800/50 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors shadow-sm"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <span className="sr-only">{platform}</span>
                      <div className="w-5 h-5">{/* Icon placeholder */}</div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="lg:col-span-3 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Send Us a Message</h3>
            
            {isSubmitted ? (
              <motion.div
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 p-4 rounded-lg text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg font-medium">Thank you for your message!</p>
                <p className="mt-2">We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 p-4 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formItems.map((item, i) => (
                    <motion.div 
                      key={item.id} 
                      className={item.id === 'subject' ? 'md:col-span-2' : ''}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={formFieldVariants}
                    >
                      <label htmlFor={item.id} className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                        {item.label}
                      </label>
                      <input
                        type={item.type}
                        id={item.id}
                        name={item.id}
                        value={formState[item.id as keyof typeof formState]}
                        onChange={handleChange}
                        placeholder={item.placeholder}
                        required={item.required}
                        className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                      />
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  custom={3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={formFieldVariants}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-800 dark:text-white mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                  ></textarea>
                </motion.div>
                
                <motion.div
                  custom={4}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={formFieldVariants}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-medium hover:opacity-90 transition-all shadow-md ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 