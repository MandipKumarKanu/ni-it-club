import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ni-black text-ni-white border-t-4 border-ni-neon py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-ni-neon uppercase tracking-tighter">NI IT Club</h2>
            <p className="text-ni-gray max-w-xs">
              Where innovation meets technology. Join the revolution of brutalist coding.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase border-b-2 border-ni-neon inline-block pb-1">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/events" className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4">Events</a></li>
              <li><a href="/gallery" className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4">Gallery</a></li>
              <li><a href="/showcase" className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4">Showcase</a></li>
              <li><a href="/contact" className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4">Contact</a></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase border-b-2 border-ni-neon inline-block pb-1">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-ni-white text-ni-black p-2 hover:bg-ni-neon hover:translate-y-[-4px] transition-all border-2 border-transparent hover:border-ni-white">
                <Github size={24} />
              </a>
              <a href="#" className="bg-ni-white text-ni-black p-2 hover:bg-ni-neon hover:translate-y-[-4px] transition-all border-2 border-transparent hover:border-ni-white">
                <Twitter size={24} />
              </a>
              <a href="#" className="bg-ni-white text-ni-black p-2 hover:bg-ni-neon hover:translate-y-[-4px] transition-all border-2 border-transparent hover:border-ni-white">
                <Linkedin size={24} />
              </a>
              <a href="#" className="bg-ni-white text-ni-black p-2 hover:bg-ni-neon hover:translate-y-[-4px] transition-all border-2 border-transparent hover:border-ni-white">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t-2 border-ni-gray/20 text-center text-ni-gray text-sm font-mono">
          &copy; {new Date().getFullYear()} NI IT Club. All rights reserved. Brutally designed.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
