"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Randomizer', path: '/randomizer' },
    { name: 'Loadout Manager', path: '/manager' },
    { name: 'Item Wiki', path: '/wiki' },
  ];

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
            Witchfire Loadout Manager
          </Link>
        </div>
        
        <ul className="flex space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`py-2 px-3 rounded-md transition-colors ${isActive 
                    ? 'bg-red-700 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
