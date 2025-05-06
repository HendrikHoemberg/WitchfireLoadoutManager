/* eslint-disable @next/next/no-img-element */
"use client";

import { BaseItem, isWeapon } from '@/types';
import { useState } from 'react';

interface ItemCardProps {
  item: BaseItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [expandedLevels, setExpandedLevels] = useState<number[]>([]);

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleAllLevels = () => {
    setExpandedLevels(prev => 
      prev.length === 3 ? [] : [1, 2, 3]
    );
  };

  return (
    <div className="bg-[#1A1A1A] relative rounded-lg overflow-hidden border border-[#818181] hover:border-[#ddaf7aa6] transition-colors flex flex-col">
      <img
        src="/images/texture-transparent.PNG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />
      {/* Item Header */}
      <div className="p-2 sm:p-4 bg-[#5c5b5bb9] flex items-center gap-2 sm:gap-4 sm:min-h-[8rem]">
        <div className="w-12 h-12 sm:w-18 sm:h-18 bg-black rounded-md flex items-center justify-center">
          {item.iconUrl ? (
            <img 
              src={item.iconUrl} 
              alt={item.name} 
              className="w-full h-full object-contain rounded-md"
            />
          ) : null}
          <span className={`text-black text-2xl ${item.iconUrl ? 'hidden' : ''}`}>{item.name.charAt(0)}</span>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-base sm:text-2xl font-bold text-white">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400">{getCategoryDisplayName(item.category)}</span>
            {item.element && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getElementColor(item.element) }}
                />
                <span className="text-sm" style={{ color: getElementColor(item.element) }}>
                  {item.element}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Weapon Stats (if applicable) */}
      {isWeapon(item) && (
        <div className="p-2 sm:p-4 border-t border-[#818181] grid grid-cols-2 gap-x-2 sm:gap-x-6 gap-y-1 sm:gap-y-2">
          <WeaponStat label="Damage" value={item.damage.toString()} />
          <WeaponStat label="Stun Power" value={item.stunPower} />
          <WeaponStat label="Hipfire Range" value={`${item.hipfireRange}m`} />
          <WeaponStat label="ADS Range" value={`${item.adsRange}m`} />
          <WeaponStat label="Stability" value={item.stability} />
          <WeaponStat label="Rate of Fire" value={item.rateOfFire.toString()} />
          <WeaponStat label="Mobility" value={item.mobility} />
          <WeaponStat label="Clip Size" value={item.clipSize.toString()} />
          <WeaponStat label="Ammo Reserves" value={item.ammoReserves.toString()} />
        </div>
      )}
      
      {/* Description */}
      {item.description && (
        <div className="p-2 sm:p-4 border-t border-[#818181] flex-grow">
          <h4 className="text-base sm:text-lg text-white font-semibold mb-2">Description</h4>
          <p className="text-sm sm:text-base text-gray-300">{item.description}</p>
        </div>
      )}
      
      {/* Mysterium Levels - Collapsible */}
      <div className="p-2 sm:p-4 border-t border-[#818181]">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h4 className="text-base sm:text-lg text-white font-semibold">Mysterium Levels</h4>
          <button
            onClick={toggleAllLevels}
            className="text-xs sm:text-sm px-2 py-1 bg-[#ddaf7aa6] hover:bg-[#ddaf7a] text-white rounded transition-colors"
          >
            {expandedLevels.length === 3 ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
        
        <MysteriumLevel 
          level={1} 
          mysterium={item.mysterium1} 
          isWeapon={isWeapon(item)}
          isExpanded={expandedLevels.includes(1)}
          onToggle={() => toggleLevel(1)}
        />
        
        <MysteriumLevel 
          level={2} 
          mysterium={item.mysterium2} 
          isWeapon={isWeapon(item)}
          isExpanded={expandedLevels.includes(2)}
          onToggle={() => toggleLevel(2)}
        />
        
        <MysteriumLevel 
          level={3} 
          mysterium={item.mysterium3} 
          isWeapon={isWeapon(item)}
          isExpanded={expandedLevels.includes(3)}
          onToggle={() => toggleLevel(3)}
        />
      </div>
    </div>
  );
};

interface WeaponStatProps {
  label: string;
  value: string;
}

const WeaponStat = ({ label, value }: WeaponStatProps) => (
  <div>
    <span className="text-sm text-gray-400">{label}:</span>
    <span className="ml-2 text-sm text-white">{value}</span>
  </div>
);

interface MysteriumLevelProps {
  level: number;
  mysterium: {
    charismata: string[] | null;
    effect?: string;
    requirements: string[];
  };
  isWeapon: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const MysteriumLevel = ({ level, mysterium, isWeapon, isExpanded, onToggle }: MysteriumLevelProps) => (
  <div className="mb-2 sm:mb-3 last:mb-0">
    <div 
      className="p-1 sm:p-2 bg-[#ddaf7aa6] rounded-md flex items-center justify-between cursor-pointer hover:bg-[#ddaf7a] transition-colors"
      onClick={onToggle}
    >
      <span className="text-sm sm:text-base font-medium text-white">Mysterium {level}</span>
      <span className="text-white text-lg">{isExpanded ? '−' : '+'}</span>
    </div>
    
    {isExpanded && (
      <div className="mt-1 sm:mt-2 pl-2 sm:pl-4 border-l-2 border-[#818181]">
        {isWeapon && mysterium.effect ? (
          <div className="mb-2">
            <span className="text-xs font-bold sm:text-sm text-[#ddaf7aa6]">Effect:</span>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">{mysterium.effect}</p>
          </div>
        ) : mysterium.charismata && (
          <div className="mb-2">
            <span className="text-xs sm:text-sm font-bold text-[#ddaf7aa6]">Charismata:</span>
            <ul className="list-disc list-inside mt-1">
              {mysterium.charismata.map((effect, index) => (
                <li key={index} className="text-xs sm:text-sm text-gray-300">{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <span className="text-xs font-bold sm:text-sm text-[#ddaf7aa6]">Requirements:</span>
          <ul className="list-disc list-inside mt-1">
            {mysterium.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);

// Helper function to get display name for category
function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'LightSpells': return 'Light Spell';
    case 'HeavySpells': return 'Heavy Spell';
    case 'Weapons': return 'Weapon';
    case 'DemonicWeapons': return 'Demonic Weapon';
    default: return category.slice(0, -1); // Remove trailing 's'
  }
}

// Helper function to get color for element
function getElementColor(element: string | null): string {
  if (!element) return '#cccccc';
  
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Water': return '#4da6ff';
    case 'Air': return '#ffcc00';
    case 'Earth': return '#66cc66';
    default: return '#cccccc';
  }
}

export default ItemCard;