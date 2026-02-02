'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, LayoutDashboard as LayoutBoard, ListTodo, Settings, Users, BarChart3, Menu, X } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { icon: LayoutBoard, label: 'Boards', href: '/boards' },
    { icon: ListTodo, label: 'Backlog', href: '/backlog' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Users, label: 'Team', href: '/team' },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-border lg:hidden hover:bg-muted transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 z-30 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              TM
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">Tambo</h1>
              <p className="text-xs text-muted-foreground">Project Management</p>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="px-6 py-4 border-b border-sidebar-border">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Workspace
          </p>
          <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            <span className="text-sm font-medium">Startup Co</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors group"
            >
              <item.icon size={20} className="text-muted-foreground group-hover:text-sidebar-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Projects */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Projects
          </p>
          <div className="space-y-2">
            <Link
              href="/projects/dev"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
            >
              <span>💻</span>
              <span className="font-medium">Development</span>
            </Link>
            <Link
              href="/projects/design"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
            >
              <span>🎨</span>
              <span className="font-medium">Design</span>
            </Link>
            <Link
              href="/projects/ops"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
            >
              <span>⚙️</span>
              <span className="font-medium">Operations</span>
            </Link>
          </div>
        </div>

        {/* Bottom Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
