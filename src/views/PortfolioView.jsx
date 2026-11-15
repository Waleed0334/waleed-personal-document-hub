import React from 'react';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { CertificatesSection } from '../components/portfolio/CertificatesSection';
import { ContactSection } from '../components/portfolio/ContactSection';

export function PortfolioView() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header with Profile and CV download */}
      <HeroSection />

      {/* About & Education History */}
      <AboutSection />

      {/* Skills Matrix */}
      <SkillsSection />

      {/* Projects Showcase */}
      <ProjectsSection />

      {/* Honors & Certificates */}
      <CertificatesSection />

      {/* Contact Channels */}
      <ContactSection />
    </div>
  );
}
