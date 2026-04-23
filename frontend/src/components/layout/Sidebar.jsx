import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, UploadCloud, MessageSquare, Activity, BarChart3, Database } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/search', label: 'Semantic Search', icon: Search },
    { path: '/upload', label: 'Document Upload', icon: UploadCloud },
    { path: '/rag', label: 'Ask AI (RAG)', icon: MessageSquare },
    { path: '/benchmark', label: 'Benchmarks', icon: BarChart3 },
    { path: '/health', label: 'System Health', icon: Activity },
  ];

  return (
    <div className="w-64 border-r border-border bg-surface flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Database className="w-6 h-6 text-primary mr-2" />
        <span className="font-bold text-lg tracking-wide text-white">Vector<span className="text-primary">Forge</span></span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 px-3">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-textMuted hover:bg-border/50 hover:text-textMain'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="bg-background rounded-lg p-3 border border-border flex items-center">
          <div className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse"></div>
          <span className="text-xs text-textMuted font-medium">Engine Online (Local)</span>
        </div>
      </div>
    </div>
  );
}
