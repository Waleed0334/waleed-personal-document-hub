import React from 'react';
import { FolderGit2, ExternalLink, Code2 } from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function ProjectsSection() {
  const projects = [
    {
      title: 'Election System',
      description: 'Program written in C for handling electoral voting, tallies, candidate registration, and secure audit processing.',
      tech: ['C Programming', 'File I/O', 'Algorithms'],
      github: 'https://github.com/Waleed0334/Election-System.git',
      image: 'https://t4.ftcdn.net/jpg/07/55/20/95/360_F_755209501_KcznmUSRDSkV5QbvScnZZF4gQOXq0tgL.jpg',
    },
    {
      title: 'Portfolio Website',
      description: 'Personal web portfolio showcasing technical profile, projects, academic milestones, and interactive resume.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
      github: 'https://github.com/Waleed0334',
      live: 'https://waleedahmed-portfolio.netlify.app',
      image: '/assets/portfolio/waleed.png',
    },
    {
      title: 'Imtiaz Supermarket Website',
      description: 'Front-end web project for a retail e-commerce catalog featuring modern responsive layouts and dynamic shopping cart UI.',
      tech: ['HTML', 'CSS3', 'JavaScript'],
      github: 'https://github.com/Waleed0334/HTML-CSS_PROJECT.git',
      image: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/is_web_development_good_career.jpg',
    },
    {
      title: 'Car Marketplace System',
      description: 'Comprehensive C++ Object-Oriented Programming (OOP) system for vehicle inventory, buyer/seller transactions, and vehicle records.',
      tech: ['C++', 'OOP Architecture', 'Data Structures'],
      github: 'https://github.com/Waleed0334/CAR-MARKETPLACE-SYSTEM-OOPs.git',
      image: 'https://m.atcdn.co.uk/retailer/media/%7Bresize%7D/8a42e7929566c4e301956bfd19b6015c.jpg',
    },
    {
      title: 'Smart Traffic Simulator',
      description: 'Real-time 2D simulation built with C++ and SFML graphics featuring intelligent traffic intersection routing and state machines.',
      tech: ['C++', 'SFML Graphics', 'Traffic Logic'],
      github: 'https://github.com/Waleed0334/Smart-Traffic-Intersection-Simulator-C-SFML-.git',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR64bgE2o23geSjiXK5gBMtSbVdZo5YGGZM3VzJVjrASbh0maAzmpTCb4xc&s=10',
    },
    {
      title: 'Responsive Webpage',
      description: 'Front-end development internship project demonstrating mobile-first responsiveness, typography hierarchies, and component styling.',
      tech: ['HTML5', 'CSS Grid & Flexbox', 'JavaScript'],
      github: 'https://github.com/Waleed0334/1st-Internship-project.git',
      image: 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/responsivedesignlist_6.webp?width=700&height=394&name=responsivedesignlist_6.webp',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-vault-accent" />
          <h3 className="text-lg font-bold text-white">Featured Projects</h3>
        </div>
        <span className="text-xs text-slate-500">6 Projects Showcased</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="group bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="h-36 overflow-hidden bg-navy-950 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-white group-hover:text-vault-accent transition">
                  {project.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {project.tech.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-navy-950 text-slate-300 text-[10px] font-mono border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Code Repository</span>
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-vault-accent hover:underline flex items-center gap-1 font-medium ml-auto"
                >
                  <span>Live Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
