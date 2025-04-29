"use client";

import { useState } from 'react';
import { BaseItem, Weapon, isWeapon } from '@/types';

interface ItemCardProps {
  item: BaseItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [expandedMysterium, setExpandedMysterium] = useState<number | null>(null);
  
  // Toggle mysterium expansion
  const toggleMysterium = (level: number) => {
    if (expandedMysterium === level) {
      setExpandedMysterium(null);
    } else {
      setExpandedMysterium(level);
    }
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-gray-700 hover:border-red-500 transition-colors">
      {/* Item Header */}
      <div className="p-4 bg-gray-800 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
          {/* Placeholder for the actual image - in a real app you'd use the item.iconUrl */}
          <span className="text-2xl">{item.name.charAt(0)}</span>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400">{getCategoryDisplayName(item.category)}</span>
            {item.element && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">•</span>
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
        <div className="p-4 border-t border-gray-700 grid grid-cols-2 gap-x-6 gap-y-2">
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
      
      {/* Mysterium Levels */}
      <div className="p-4 border-t border-gray-700">
        <h4 className="text-lg font-semibold mb-3">Mysterium Levels</h4>
        
        <MysteriumLevel 
          level={1} 
          mysterium={item.mysterium1} 
          isExpanded={expandedMysterium === 1}
          onToggle={() => toggleMysterium(1)}
          isWeapon={isWeapon(item)}
        />
        
        <MysteriumLevel 
          level={2} 
          mysterium={item.mysterium2} 
          isExpanded={expandedMysterium === 2}
          onToggle={() => toggleMysterium(2)}
          isWeapon={isWeapon(item)}
        />
        
        <MysteriumLevel 
          level={3} 
          mysterium={item.mysterium3} 
          isExpanded={expandedMysterium === 3}
          onToggle={() => toggleMysterium(3)}
          isWeapon={isWeapon(item)}
        />
      </div>
      
      {/* Metadata */}
      <div className="p-3 bg-gray-800 text-xs text-gray-500 flex justify-between">
        <span>Added: {formatDate(item.addedOn)}</span>
        <span>Updated: {formatDate(item.updatedOn)}</span>
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
  isExpanded: boolean;
  onToggle: () => void;
  isWeapon: boolean;
}

const MysteriumLevel = ({ level, mysterium, isExpanded, onToggle, isWeapon }: MysteriumLevelProps) => (
  <div className="mb-3 last:mb-0">
    <button 
      className="w-full flex items-center justify-between p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
      onClick={onToggle}
    >
      <span className="font-medium">Mysterium {level}</span>
      <span>{isExpanded ? '▼' : '▶'}</span>
    </button>
    
    {isExpanded && (
      <div className="mt-2 pl-4 border-l-2 border-gray-700">
        {isWeapon && mysterium.effect ? (
          <div className="mb-2">
            <span className="text-sm text-red-400">Effect:</span>
            <p className="text-sm text-gray-300 mt-1">{mysterium.effect}</p>
          </div>
        ) : mysterium.charismata && (
          <div className="mb-2">
            <span className="text-sm text-red-400">Charismata:</span>
            <ul className="list-disc list-inside mt-1">
              {mysterium.charismata.map((effect, index) => (
                <li key={index} className="text-sm text-gray-300">{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <span className="text-sm text-blue-400">Requirements:</span>
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
    default: return category.slice(0, -1); // Remove trailing 's'
  }
}

// Helper function to get color for element
function getElementColor(element: string | null): string {
  if (!element) return '#cccccc';
  
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Ice': return '#4da6ff';
    case 'Lightning': return '#ffcc00';
    case 'Decay': return '#66cc66';
    default: return '#cccccc';
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export default ItemCard;
