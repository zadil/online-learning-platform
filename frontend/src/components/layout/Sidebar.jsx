import React from 'react';
import { cn } from '@/lib/utils';

const Sidebar = ({ children, className = '' }) => {
  return (
    <div className={cn(
      'w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col',
      className
    )}>
      {children}
    </div>
  );
};

const SidebarHeader = ({ children, className = '' }) => (
  <div className={cn('mb-8', className)}>
    {children}
  </div>
);

const SidebarNav = ({ children, className = '' }) => (
  <nav className={cn('flex-1', className)}>
    {children}
  </nav>
);

const SidebarNavItem = ({ 
  children, 
  active = false, 
  icon, 
  onClick,
  className = '' 
}) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mb-2',
      active 
        ? 'bg-primary-50 text-primary-600 font-medium' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      className
    )}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

export { Sidebar, SidebarHeader, SidebarNav, SidebarNavItem };