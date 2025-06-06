"use client";

import { Element, Loadout } from '@/types';
import LoadoutSlot from './LoadoutSlot';

interface LoadoutDisplayProps {
  loadout: Loadout;
  onSlotClick?: (slot: keyof Loadout) => void;
  selectedSlot?: keyof Loadout | null;
  isGenerating?: boolean;
}

const LoadoutDisplay = ({ loadout, onSlotClick, selectedSlot, isGenerating = false }: LoadoutDisplayProps) => {
  // Get all active elements in the loadout
  const getActiveElements = (): Element[] => {
    const elements = Object.values(loadout)
      .filter(item => item !== null && item.element !== null)
      .map(item => item!.element as Exclude<Element, null>);
    
    return Array.from(new Set(elements));
  };

  const activeElements = getActiveElements();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <LoadoutSlot 
          item={loadout.primaryWeapon} 
          category="Weapons" 
          isSelected={selectedSlot === 'primaryWeapon'}
          onClick={() => onSlotClick && onSlotClick('primaryWeapon')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.secondaryWeapon} 
          category="Weapons" 
          isSelected={selectedSlot === 'secondaryWeapon'}
          onClick={() => onSlotClick && onSlotClick('secondaryWeapon')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.demonicWeapon} 
          category="DemonicWeapons" 
          isSelected={selectedSlot === 'demonicWeapon'}
          onClick={() => onSlotClick && onSlotClick('demonicWeapon')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.relic} 
          category="Relics" 
          isSelected={selectedSlot === 'relic'}
          onClick={() => onSlotClick && onSlotClick('relic')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.fetish} 
          category="Fetishes" 
          isSelected={selectedSlot === 'fetish'}
          onClick={() => onSlotClick && onSlotClick('fetish')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.ring} 
          category="Rings" 
          isSelected={selectedSlot === 'ring'}
          onClick={() => onSlotClick && onSlotClick('ring')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.lightSpell} 
          category="LightSpells" 
          isSelected={selectedSlot === 'lightSpell'}
          onClick={() => onSlotClick && onSlotClick('lightSpell')}
          isGenerating={isGenerating}
        />
        <LoadoutSlot 
          item={loadout.heavySpell} 
          category="HeavySpells" 
          isSelected={selectedSlot === 'heavySpell'}
          onClick={() => onSlotClick && onSlotClick('heavySpell')}
          isGenerating={isGenerating}
        />
      </div>

      {/* Element indicators */}
      <div className="flex justify-center gap-3 mb-4">
        {['Fire', 'Water', 'Air', 'Earth'].map((element) => {
          const isActive = activeElements.includes(element as Exclude<Element, null>);
          return (
            <div 
              key={element}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${isActive ? 'bg-[#646464]' : 'bg-[#30303071] opacity-50'}`}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getElementColor(element) }}
              />
              <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {element}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to get color for element
const getElementColor = (element: string): string => {
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Water': return '#4da6ff';
    case 'Air': return '#ffcc00';
    case 'Earth': return '#66cc66';
    default: return '#cccccc';
  }
};

export default LoadoutDisplay;
