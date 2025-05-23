import {
  AboutSection,
  ContactSection,
  LandingSection,
  ProjectShowcaseSection,
  ServicesSection
} from '@/components/sections';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KodeNextDoor | Home',
  description: 'Tech consultancy specializing in web development, mobile apps, cloud solutions, and more.',
  keywords: ['tech consultancy', 'web development', 'mobile apps', 'cloud solutions'],
  openGraph: {
    title: 'KodeNextDoor | Tech Consultancy',
    description: 'We are a team of tech experts who build innovative software solutions that help businesses thrive in the digital age.',
    url: 'https://kodenextdoor.com',
    siteName: 'KodeNextDoor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KodeNextDoor | Tech Consultancy',
    description: 'We are a team of tech experts who build innovative software solutions that help businesses thrive in the digital age.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero section with full height */}
      <section className="min-h-screen">
        <LandingSection />
      </section>

      {/* Project showcase with light background */}
      <section className="bg-gray-950">
        <ProjectShowcaseSection />
      </section>

      {/* Services section with white background */}
      <section>
        <ServicesSection />
      </section>

      {/* About section with light background */}
      <section className="bg-gray-900">
        <AboutSection />
      </section>

      {/* Contact section */}
      <section className="bg-gray-900">
        <ContactSection />
      </section>
    </main>
  );
}
