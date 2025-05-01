"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when clicking outside or on route change
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar') && !target.closest('.burger-menu')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Loadout Manager', path: '/manager' },
    { name: 'Loadout Randomizer', path: '/randomizer' },
    { name: 'Item Wiki', path: '/wiki' },
  ];

  return (
    <>
      <nav className={`${isSidebarOpen ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1abb]'} text-white py-4 px-6 shadow-md fixed top-0 left-0 right-0 z-50 transition-colors duration-150`}>
        <div className="container mx-auto flex justify-start">
          {/* Burger Menu Button */}
          <button 
            className="burger-menu flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>
      
      {/* Sidebar */}
      <div 
        className={`sidebar fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-[-100%]'
        }`}
        style={{ 
          background: '#1a1a1a', 
          boxShadow: isSidebarOpen ? '4px 0 10px rgba(0,0,0,0.2)' : 'none'
        }}
      >
        <div className="pt-24 pb-8 px-6">
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`block py-2 px-3 rounded-md transition-colors ${isActive 
                      ? 'bg-[#ddaf7aa6] text-white' 
                      : 'text-gray-100 hover:text-white hover:bg-[#ddaf7aa6]'}`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      {/* Overlay with blur when sidebar is open */}
      <div 
        className={`fixed inset-0 transition-all duration-300 z-30 ${
          isSidebarOpen 
            ? 'bg-black/20 pointer-events-auto' 
            : 'bg-transparent pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default Navigation;
