/* eslint-disable @next/next/no-img-element */
"use client";

import ItemSelector from '@/components/loadout/ItemSelector';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import { useLoadout } from '@/context/LoadoutContext';
import { ItemCategory, Loadout } from '@/types';
import { useEffect, useState } from 'react';

export default function ManagerPage() {
  const { loadout, setItemInLoadout, clearLoadout } = useLoadout();
  
  // Clear loadout when the page loads
  useEffect(() => {
    clearLoadout();
  }, [clearLoadout]);
  
  const [selectedSlot, setSelectedSlot] = useState<keyof Loadout | null>(null);
  
  // Map loadout slot to item category
  const slotToCategory: Record<keyof Loadout, ItemCategory> = {
    primaryWeapon: 'Weapons',
    secondaryWeapon: 'Weapons',
    demonicWeapon: 'DemonicWeapons',
    lightSpell: 'LightSpells',
    heavySpell: 'HeavySpells',
    relic: 'Relics',
    fetish: 'Fetishes',
    ring: 'Rings'
  };
  
  // Handle slot selection
  const handleSlotClick = (slot: keyof Loadout) => {
    setSelectedSlot(slot);
  };
  
  // Handle item selection
  const handleItemSelect = (item: any) => {
    if (selectedSlot) {
      setItemInLoadout(selectedSlot, item);
    }
  };
  
  // Get the current category based on selected slot
  const currentCategory = selectedSlot ? slotToCategory[selectedSlot] : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Loadout Display */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
        <div className="flex w-full justify-between items-center mb-4">
          <h2 className="text-xl text-white font-semibold">Current Loadout</h2>
          <button
            className="px-3 py-1 bg-[#646464] hover:bg-red-600 text-sm text-white rounded-md transition-colors"
            onClick={clearLoadout}
          >
            Clear All
          </button>
        </div>
        
        <LoadoutDisplay 
          loadout={loadout} 
          onSlotClick={handleSlotClick} 
          selectedSlot={selectedSlot} 
        />
        
        {selectedSlot && (
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>Select an item below to equip in the {getSlotDisplayName(selectedSlot)} slot</p>
          </div>
        )}
      </div>
      
      {/* Item Selection */}
      {currentCategory && (
        <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] overflow-hidden">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
          <h2 className="text-xl text-white font-semibold mb-4">{getCategoryDisplayName(currentCategory)}</h2>
          
          <ItemSelector
            category={currentCategory}
            onItemSelect={handleItemSelect}
          />
        </div>
      )}
      
      {!currentCategory && (
        <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
          <p className="text-white">Click on a loadout slot above to select an item for that slot.</p>
        </div>
      )}
    </div>
  );
}

// Helper function to get display name for slot
function getSlotDisplayName(slot: keyof Loadout): string {
  switch (slot) {
    case 'lightSpell': return 'Light Spell';
    case 'heavySpell': return 'Heavy Spell';
    default: return slot.charAt(0).toUpperCase() + slot.slice(1);
  }
}

// Helper function to get display name for category
function getCategoryDisplayName(category: ItemCategory): string {
  switch (category) {
    case 'LightSpells': return 'Light Spells';
    case 'HeavySpells': return 'Heavy Spells';
    default: return category;
  }
}
