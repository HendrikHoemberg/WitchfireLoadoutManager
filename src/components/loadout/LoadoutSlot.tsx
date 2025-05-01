"use client";

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
        relative flex flex-col items-center 
        w-24 h-24 sm:w-34 sm:h-34 rounded-lg 
        ${isSelected ? 'border-2 border-[#ddaf7aa6]' : 'border border-[#818181]'} 
        ${item ? 'bg-[#505050]' : 'bg-opacity-50 bg-[#30303025]'} 
        transition-all duration-200 cursor-pointer hover:border-[#ddaf7aa6]
      `}
      onClick={onClick}
    >
      {item ? (
        <>
          <div className="flex-grow flex items-center justify-center pt-2">
            <div className="relative w-16 h-16 sm:w-24 sm:h-24">
              {/* Placeholder for the actual image - in a real app you'd use the item.iconUrl */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                {/* This is a placeholder. In a real app, you'd use Image component with the actual image */}
                <span className="text-2xl text-black">{item.name.charAt(0)}</span>
              </div>
            </div>
          </div>
          <div className="mt-auto mb-1">
            <span className="text-xs text-center text-white truncate w-full px-1 block">{item.name}</span>
          </div>
          {item.element && (
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full" 
                 style={{ backgroundColor: getElementColor(item.element) }}>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex-grow flex items-center justify-center pt-2">
            <div className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-[#868686b9] rounded-md opacity-30">
              <span className="text-3xl text-white">+</span>
            </div>
          </div>
          <div className="mt-auto mb-1">
            <span className="text-xs text-center text-white block px-1">{getCategoryDisplayName(category, slotIndex)}</span>
          </div>
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
