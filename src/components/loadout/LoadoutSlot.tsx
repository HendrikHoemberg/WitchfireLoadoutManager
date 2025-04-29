"use client";

import Image from 'next/image';
import { BaseItem } from '@/types';

interface LoadoutSlotProps {
  item: BaseItem | null;
  category: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const LoadoutSlot = ({ item, category, isSelected = false, onClick }: LoadoutSlotProps) => {
  // Determine the display name for the category
  const getCategoryDisplayName = (category: string, slotIndex?: number) => {
    switch (category) {
      case 'Weapons': 
        return slotIndex === 0 ? 'Primary Weapon' : 'Secondary Weapon';
      case 'DemonicWeapons': return 'Demonic Weapon';
      case 'LightSpells': return 'Light Spell';
      case 'HeavySpells': return 'Heavy Spell';
      default: return category;
    }
  };
  
  // Determine which slot index this is for weapons
  const slotIndex = category === 'Weapons' && onClick ? 
    onClick.toString().includes('primaryWeapon') ? 0 : 1 : undefined;

  return (
    <div 
      className={`
        relative flex flex-col items-center justify-center 
        w-24 h-24 sm:w-32 sm:h-32 rounded-lg 
        ${isSelected ? 'border-2 border-red-600' : 'border border-gray-700'} 
        ${item ? 'bg-[#4D4D4D]' : 'bg-[#303030]'} 
        transition-all duration-200 cursor-pointer hover:border-red-500
      `}
      onClick={onClick}
    >
      {item ? (
        <>
          <div className="relative w-16 h-16 sm:w-24 sm:h-24">
            {/* Placeholder for the actual image - in a real app you'd use the item.iconUrl */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-md">
              {/* This is a placeholder. In a real app, you'd use Image component with the actual image */}
              <span className="text-2xl">{item.name.charAt(0)}</span>
            </div>
          </div>
          <span className="mt-1 text-xs text-center text-gray-100 truncate w-full px-1">{item.name}</span>
          {item.element && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full" 
                 style={{ backgroundColor: getElementColor(item.element) }}>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gray-800 rounded-md opacity-30">
            <span className="text-3xl">+</span>
          </div>
          <span className="mt-1 text-xs text-gray-100">{getCategoryDisplayName(category, slotIndex)}</span>
        </>
      )}
    </div>
  );
};

// Helper function to get color for element
const getElementColor = (element: string): string => {
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Ice': return '#4da6ff';
    case 'Lightning': return '#ffcc00';
    case 'Decay': return '#66cc66';
    default: return '#cccccc';
  }
};

export default LoadoutSlot;
