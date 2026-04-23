import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bg/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-textMain font-medium tracking-widest text-sm">
          VECTORFORGE
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-textMuted">
          <a href="#dashboard" className="hover:text-textMain transition-colors">Dashboard</a>
          <a href="#architecture" className="hover:text-textMain transition-colors">Architecture</a>
          <a href="#" className="hover:text-textMain transition-colors">Docs</a>
        </div>
        
        <div className="flex items-center">
          {/* No Auth */}
        </div>
      </div>
    </nav>
  );
}
