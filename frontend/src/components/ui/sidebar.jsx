import React from 'react';
import { cn } from '@/lib/utils';

const Sidebar = ({ children, className }) => {
  return (
    <div className={cn(
      "flex flex-col w-64 bg-white shadow-lg border-r border-gray-100 min-h-screen",
      className
    )}>
      {children}
    </div>
  );
};

const SidebarHeader = ({ children, className }) => {
  return (
    <div className={cn("p-6 border-b border-gray-100", className)}>
      {children}
    </div>
  );
};

const SidebarContent = ({ children, className }) => {
  return (
    <div className={cn("flex-1 p-4", className)}>
      {children}
    </div>
  );
};

const SidebarItem = ({ 
  icon: Icon, 
  children, 
  active = false, 
  onClick, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-4 py-3 mb-2 text-left rounded-xl transition-all duration-200",
        active 
          ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        className
      )}
    >
      {Icon && (
        <Icon className={cn(
          "w-5 h-5 mr-3",
          active ? "text-blue-600" : "text-gray-400"
        )} />
      )}
      <span className="font-medium">{children}</span>
    </button>
  );
};

export { Sidebar, SidebarHeader, SidebarContent, SidebarItem };