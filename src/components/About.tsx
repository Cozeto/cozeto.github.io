
import React from 'react';
import { Mail, Github, Twitter, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <section className="flex flex-col md:flex-row items-center gap-16 mb-24">
        <div className="w-64 h-64 rounded-[3rem] overflow-hidden card-shadow shrink-0 rotate-3 transition-transform hover:rotate-0 duration-500">
          <img 
            src="/images/kozetor.jpg" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-6xl font-extrabold tracking-tight mb-6">Hi, I'm Kozeto<span className="text-blue-500">.</span></h1>
          <p className="text-2xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-8">
            I'm a master's student at <span className="text-black dark:text-white font-bold underline decoration-blue-500 decoration-4 underline-offset-8">Nanjing University</span>, specializing in <span className="text-black dark:text-white font-bold">Computer Vision</span> and <span className="text-black dark:text-white font-bold">Graphics</span>. Also an OIer, I love algorithmic problem solving, coding, and exploring the intersection of technology and creativity.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold transition-all hover:scale-105">Get in touch</button>
            <div className="flex items-center gap-2">
              <a href="https://github.com/Cozeto/" className="p-3 bg-white dark:bg-gray-800 rounded-full card-shadow hover:text-blue-500 transition-colors"><Github size={20} /></a>
              </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] card-shadow border border-gray-100 dark:border-gray-800">
            <h3 className="flex items-center gap-3 text-xl font-bold mb-8">
              <Briefcase className="text-blue-500" />
              Experience
            </h3>
            <div className="space-y-8">
              <div className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Present</p>
                <h4 className="font-bold">Master's Student @ Nanjing University</h4>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/20">
            <h3 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400">Core Principles</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm font-medium text-blue-800/80 dark:text-blue-300/80">
                <span className="text-blue-500 font-bold">01.</span>
                Clarity over cleverness. Code should be read like prose.
              </li>
              <li className="flex gap-3 text-sm font-medium text-blue-800/80 dark:text-blue-300/80">
                <span className="text-blue-500 font-bold">02.</span>
                Performance is UX. Speed is a feature, not an optimization.
              </li>
              <li className="flex gap-3 text-sm font-medium text-blue-800/80 dark:text-blue-300/80">
                <span className="text-blue-500 font-bold">03.</span>
                Aesthetics serve function. Great design guides the user.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] card-shadow border border-gray-100 dark:border-gray-800">
            <h3 className="flex items-center gap-3 text-xl font-bold mb-8">
              <GraduationCap className="text-blue-500" />
              Research Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Computer Vision', 'Graphics', 'Deep Learning', '3D Reconstruction', 'Image Processing', 'Algorithm Design', 'Competitive Programming'].map(skill => (
                <span key={skill} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-bold border border-gray-100 dark:border-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] card-shadow border border-gray-100 dark:border-gray-800">
            <h3 className="flex items-center gap-3 text-xl font-bold mb-8">
              <MapPin className="text-blue-500" />
              Status
            </h3>
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-green-700 dark:text-green-400">Open to collaborations</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500 font-medium">Based in Nanjing, China. Always happy to connect with fellow researchers and developers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
