import React from 'react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-bg text-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-textMain font-semibold tracking-widest text-sm mb-4 md:mb-0">
          VECTORFORGE
        </div>
        <div className="flex gap-6 text-sm text-textMuted">
          <a href="#" className="hover:text-textMain transition-colors">GitHub</a>
          <a href="#" className="hover:text-textMain transition-colors">Documentation</a>
          <a href="#architecture" className="hover:text-textMain transition-colors">Architecture</a>
          <a href="#" className="hover:text-textMain transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
