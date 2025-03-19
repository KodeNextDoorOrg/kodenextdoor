'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Section, Container, Heading, Text, Button, Grid } from '@/components/ui';

// Temporarily fix image imports by adding fallback content
const ProjectImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
    <span className="text-gray-500 dark:text-gray-400">{alt}</span>
  </div>
);

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
  features: string[];
  link: string;
}

// Sample project data
const projects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A scalable e-commerce solution with advanced product filtering, cart management, and secure checkout process.',
    category: 'Web Development',
    image: '/images/project-ecommerce.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    features: ['Product search & filtering', 'User accounts', 'Secure payments', 'Order tracking'],
    link: '#'
  },
  {
    id: 2,
    title: 'Finance Management App',
    description: 'Mobile application that helps users track expenses, set budgets, and visualize spending patterns with detailed analytics.',
    category: 'Mobile App',
    image: '/images/project-finance.jpg',
    technologies: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
    features: ['Expense tracking', 'Budget planning', 'Data visualization', 'Financial insights'],
    link: '#'
  },
  {
    id: 3,
    title: 'Healthcare Dashboard',
    description: 'Comprehensive dashboard for healthcare providers to manage patient data, appointments, and medical records securely.',
    category: 'Web Application',
    image: '/images/project-healthcare.jpg',
    technologies: ['Angular', 'TypeScript', 'Express', 'PostgreSQL'],
    features: ['Patient management', 'Appointment scheduling', 'Medical records', 'Analytics'],
    link: '#'
  },
  {
    id: 4,
    title: 'Real Estate Platform',
    description: 'Property listing platform with advanced search, virtual tours, and agent-client communication tools.',
    category: 'Web Platform',
    image: '/images/project-realestate.jpg',
    technologies: ['Next.js', 'Tailwind CSS', 'Supabase', 'Mapbox'],
    features: ['Property search', 'Virtual tours', 'Agent dashboard', 'Favorites & alerts'],
    link: '#'
  },
  {
    id: 5,
    title: 'Learning Management System',
    description: 'Educational platform for course creation, student enrollment, progress tracking, and interactive learning.',
    category: 'Education',
    image: '/images/project-education.jpg',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'WebSockets'],
    features: ['Course management', 'Student progress', 'Interactive quizzes', 'Discussion forums'],
    link: '#'
  },
  {
    id: 6,
    title: 'Fitness Tracking App',
    description: 'Mobile application for tracking workouts, nutrition, and health metrics with personalized recommendations.',
    category: 'Mobile App',
    image: '/images/project-fitness.jpg',
    technologies: ['Flutter', 'Dart', 'Firebase', 'TensorFlow Lite'],
    features: ['Workout planning', 'Nutrition tracking', 'Progress analytics', 'AI recommendations'],
    link: '#'
  }
];

// Categories for filtering
const categories = [
  'All',
  'Web Development',
  'Mobile App',
  'Web Application',
  'Web Platform',
  'Education'
];

export default function ProjectShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Filter projects based on selected category
  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };
  
  // Open project detail modal
  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Close project detail modal
  const closeProjectModal = () => {
    setIsModalOpen(false);
    // Restore background scrolling
    document.body.style.overflow = 'auto';
  };
  
  return (
    <Section 
      id="projects" 
      className="relative overflow-hidden py-24" 
      ref={ref}
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-20 left-40 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
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
            className="px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4 inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            OUR WORK
          </motion.span>
          
          <Heading 
            level="h2" 
            className="mb-6 text-4xl md:text-5xl font-bold" 
            withGradient
            withAnimation
          >
            Explore Our <span className="text-gradient">Latest Projects</span>
          </Heading>
          
          <Text 
            variant="light" 
            className="max-w-2xl mx-auto mb-12 text-lg"
          >
            Browse through our portfolio of successful projects that demonstrate our expertise and ability to deliver exceptional digital solutions across various industries.
          </Text>
          
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm'
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: 0.3 + categories.indexOf(category) * 0.05
                }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id}
                variants={projectVariants}
                className="group relative"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  {/* Project image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 transition duration-500 transform group-hover:scale-110">
                      <ProjectImage src={project.image} alt={project.title} />
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white rounded-full text-xs backdrop-blur-sm">
                      {project.category}
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Project info */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2 py-1 bg-white/20 rounded-md text-white text-xs backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-white/20 rounded-md text-white text-xs backdrop-blur-sm">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => openProjectModal(project)}
                      className="mt-auto"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* See more projects button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            size="lg" 
            href="#"
            className="px-8 py-3 text-lg"
          >
            See More Projects
          </Button>
        </motion.div>
      </Container>
      
      {/* Project details modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
          >
            <motion.div 
              className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 500 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal close button */}
              <button 
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                onClick={closeProjectModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Project header image */}
              <div className="relative w-full h-60 md:h-80">
                <div className="absolute inset-0">
                  <ProjectImage src={selectedProject.image} alt={selectedProject.title} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              
              {/* Project content */}
              <div className="relative -mt-20 bg-white dark:bg-gray-900 rounded-t-3xl p-8">
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 inline-block">
                  {selectedProject.category}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {selectedProject.title}
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  {selectedProject.description}
                </p>
                
                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-800 dark:text-gray-200 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProject.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-700 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Action button */}
                <div className="flex justify-center">
                  <Button 
                    variant="primary" 
                    size="lg"
                    href={selectedProject.link}
                    className="px-8 py-3 text-lg"
                  >
                    Visit Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
} 