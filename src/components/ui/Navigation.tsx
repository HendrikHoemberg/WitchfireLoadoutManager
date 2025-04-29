"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Loadout Manager', path: '/manager' },
    { name: 'Loadout Randomizer', path: '/randomizer' },
    { name: 'Item Wiki', path: '/wiki' },
  ];

  return (
    <nav className="bg-[#1a1a1abb] text-white py-4 px-6 shadow-md">
      <div className="container mx-au4to flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-gray-100 hover:text-red-600 transition-colors">
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
                    ? 'bg-[#4D4D4D] text-white' 
                    : 'text-gray-100 hover:text-white hover:bg-[#3D3D3D]'}`}
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
