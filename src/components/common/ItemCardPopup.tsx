/* eslint-disable @next/next/no-img-element */
"use client";

import { BaseItem, isWeapon } from '@/types';

interface ItemCardPopupProps {
  item: BaseItem;
}

const ItemCardPopup = ({ item }: ItemCardPopupProps) => {
  return (
    <div className="item-card-popup absolute z-50 w-72 bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#818181] shadow-lg">
      <img
        src="/images/texture-transparent.PNG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />
      {/* Item Header */}
      <div className="p-2 bg-[#5c5b5bb9] flex items-center gap-2">
        <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center">
          {item.iconUrl ? (
            <img 
              src={item.iconUrl} 
              alt={item.name} 
              className="w-full h-full object-contain rounded-md"
            />
          ) : null}
          <span className={`text-black text-xl ${item.iconUrl ? 'hidden' : ''}`}>{item.name.charAt(0)}</span>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-base font-bold text-left text-white">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{getCategoryDisplayName(item.category)}</span>
            {item.element && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getElementColor(item.element) }}
                />
                <span className="text-xs" style={{ color: getElementColor(item.element) }}>
                  {item.element}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Weapon Stats (if applicable) */}
      {isWeapon(item) && (
        <div className="p-2 border-t border-[#818181] grid grid-cols-2 gap-x-2 gap-y-1 text-left">
          <WeaponStat label="Damage" value={item.damage.toString()} />
          <WeaponStat label="Stun Power" value={item.stunPower} />
          <WeaponStat label="Hipfire Range" value={`${item.hipfireRange}m`} />
          <WeaponStat label="ADS Range" value={`${item.adsRange}m`} />
          <WeaponStat label="Stability" value={item.stability} />
          <WeaponStat label="Rate of Fire" value={item.rateOfFire.toString()} />
          <WeaponStat label="Mobility" value={item.mobility} />
          <WeaponStat label="Clip Size" value={item.clipSize.toString()} />
        </div>
      )}
      
      {/* Mysterium Levels - All expanded by default */}
      <div className="p-2 border-t border-[#818181]">
        <h4 className="text-sm text-white text-center font-semibold mb-2">Mysterium Levels</h4>
        
        <MysteriumLevel 
          level={1} 
          mysterium={item.mysterium1} 
          isWeapon={isWeapon(item)}
        />
        
        <MysteriumLevel 
          level={2} 
          mysterium={item.mysterium2} 
          isWeapon={isWeapon(item)}
        />
        
        <MysteriumLevel 
          level={3} 
          mysterium={item.mysterium3} 
          isWeapon={isWeapon(item)}
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
  <div className="text-left">
    <span className="text-xs text-gray-400">{label}:</span>
    <span className="ml-1 text-xs text-white">{value}</span>
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
}

const MysteriumLevel = ({ level, mysterium, isWeapon }: MysteriumLevelProps) => (
  <div className="mb-2 last:mb-0">
    <div className="p-1 bg-[#ddaf7aa6] rounded-md">
      <span className="text-xs font-medium text-center text-white">Mysterium {level}</span>
    </div>
    
    <div className="mt-1 pl-2 border-l-2 border-[#818181]">
      {isWeapon && mysterium.effect ? (
        <div className="mb-1 text-left">
          <span className="text-xs font-bold text-[#ddaf7aa6]">Effect:</span>
          <p className="text-xs text-gray-300 mt-0.5">{mysterium.effect}</p>
        </div>
      ) : mysterium.charismata && (
        <div className="mb-1 text-left">
          <span className="text-xs font-bold text-[#ddaf7aa6]">Charismata:</span>
          <ul className="list-disc list-inside mt-0.5">
            {mysterium.charismata.map((effect, index) => (
              <li key={index} className="text-xs text-gray-300">{effect}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="text-left">
        <span className="text-xs font-bold text-[#ddaf7aa6]">Requirements:</span>
        <ul className="list-disc list-inside mt-0.5">
          {mysterium.requirements.map((req, index) => (
            <li key={index} className="text-xs text-gray-300">{req}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// Helper function to get display name for category
function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'Weapons': return 'Weapon';
    case 'DemonicWeapons': return 'Demonic Weapon';
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
    case 'Water': return '#4da6ff';
    case 'Air': return '#ffcc00';
    case 'Earth': return '#66cc66';
    default: return '#cccccc';
  }
}

export default ItemCardPopup;
