'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Section, Container, Heading, Text, Button } from '@/components/ui';
import * as FirebaseAPI from '@/lib/firebase/api/projects';
import { Project } from '@/lib/firebase';

// Handle project images properly
const ProjectImage = ({ src, alt }: { src: string; alt: string }) => {
  if (!src) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">{alt}</span>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }}>
      <div className="w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-md">{alt}</span>
      </div>
    </div>
  );
};

export default function ProjectShowcaseSection() {
  // State for projects data
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for UI
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['All']);
  
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Fetch projects from Firebase on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await FirebaseAPI.getAllProjects();
        
        if (result.success && result.projects && result.projects.length > 0) {
          setProjects(result.projects);
          
          // Extract unique categories from projects
          const uniqueCategories = [...new Set(result.projects.map(project => project.category))];
          setCategories(['All', ...uniqueCategories]);
        } else {
          // Try direct Firestore query as a fallback
          try {
            const { collection, getDocs } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            
            // Simple query without conditions to get ALL projects
            const querySnapshot = await getDocs(collection(db, 'projects'));
            
            if (querySnapshot.empty) {
              // Create a test project as a fallback only if nothing else works
              const testProject = {
                id: 'test-project',
                title: 'Test Project',
                description: 'This is a test project. Create real projects in the admin panel.',
                category: 'Web Development',
                technologies: ['React', 'Next.js', 'Firebase'],
                features: ['Feature 1', 'Feature 2', 'Feature 3'],
                imageUrl: '/images/test-project.jpg',
                image: '/images/test-project.jpg',
                isActive: true,
                link: '#'
              };
              
              setProjects([testProject]);
              setCategories(['All', 'Web Development']);
              return;
            }
            
            // Process the raw data
            const directProjects = querySnapshot.docs.map(doc => {
              const data = doc.data();
              
              // Ensure technologies and features are arrays
              let technologies = [];
              if (Array.isArray(data.technologies)) {
                technologies = data.technologies;
              } else if (typeof data.technologies === 'string') {
                technologies = data.technologies.split(',').map((t: string) => t.trim());
              }
              
              let features = [];
              if (Array.isArray(data.features)) {
                features = data.features;
              } else if (typeof data.features === 'string') {
                features = data.features.split(',').map((f: string) => f.trim());
              } else {
                features = ['No features specified'];
              }
              
              return {
                id: doc.id,
                title: data.title || 'Untitled Project',
                description: data.description || 'No description available',
                category: data.category || 'Web Development',
                technologies: technologies.length > 0 ? technologies : ['Not specified'],
                features: features,
                imageUrl: data.imageUrl || '',
                image: data.imageUrl || '',
                isActive: true,
                link: data.liveUrl || data.caseStudyUrl || '#'
              };
            });
            
            if (directProjects.length > 0) {
              setProjects(directProjects);
              
              // Extract unique categories from projects
              const uniqueCategories = [...new Set(directProjects.map(project => project.category))];
              setCategories(['All', ...uniqueCategories]);
            } else {
              setError('No projects found in database');
            }
          } catch (directErr) {
            console.error('Error in direct Firestore query:', directErr);
            setError('Failed to load projects: ' + String(directErr));
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('An unexpected error occurred: ' + String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
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
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <motion.div 
              className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 inline-block mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Failed to load projects</h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <div className="space-y-2">
                <Button 
                  variant="secondary" 
                  onClick={() => window.location.reload()}
                  className="mr-2"
                >
                  Reload Page
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setIsLoading(true);
                    setError(null);
                    const fetchProjects = async () => {
                      try {
                        const result = await FirebaseAPI.getAllProjects();
                        if (result.success && result.projects) {
                          setProjects(result.projects);
                        } else {
                          setError('Failed to load projects: ' + (result.error || 'Unknown error'));
                        }
                      } catch (err) {
                        console.error('Error fetching projects:', err);
                        setError('An unexpected error occurred: ' + String(err));
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    fetchProjects();
                  }}
                >
                  Retry
                </Button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Projects grid - shown when not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* No projects message */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 inline-block mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No projects found for {activeCategory}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try selecting a different category or check back later.
                  </p>
                  <Button 
                    variant="secondary"
                    onClick={() => setActiveCategory('All')}
                  >
                    View All Projects
                  </Button>
                </motion.div>
              </div>
            )}
            
            {/* Projects grid */}
            {filteredProjects.length > 0 && (
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mb-16"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <motion.div 
                      key={project.id}
                      variants={projectVariants}
                      className="group relative h-full"
                      whileHover={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-lg h-full flex flex-col">
                        {/* Project image */}
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <div className="absolute inset-0 transition duration-500 transform group-hover:scale-110">
                            <ProjectImage src={project.imageUrl || project.image} alt={project.title} />
                          </div>
                          
                          {/* Category badge */}
                          <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white rounded-full text-xs backdrop-blur-sm">
                            {project.category}
                          </div>
                        </div>
                        
                        {/* Static info - always visible */}
                        <div className="p-5 bg-white dark:bg-gray-800 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                          
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span 
                                key={tech} 
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-xs">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => openProjectModal(project)}
                            className="mt-auto self-start"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* See more projects button - only show if at least one project exists */}
            {projects.length > 0 && (
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
                  href="/projects"
                  className="px-8 py-3 text-lg"
                >
                  See More Projects
                </Button>
              </motion.div>
            )}
          </>
        )}
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