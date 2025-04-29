"use client";

import { useState, useEffect } from 'react';
import { ItemCategory, Loadout } from '@/types';
import { useLoadout } from '@/context/LoadoutContext';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import ItemSelector from '@/components/loadout/ItemSelector';

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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Loadout Manager</h1>
        <p className="text-gray-100 max-w-2xl mx-auto">
          Create and customize your perfect loadout by selecting items for each slot.
        </p>
      </div>
      
      {/* Loadout Display */}
      <div className="bg-[#1A1A1A] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Loadout</h2>
          <button
            className="px-3 py-1 bg-[#4D4D4D] hover:bg-[#696969] text-sm rounded-md transition-colors"
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
        <div className="bg-[#1A1A1A] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{getCategoryDisplayName(currentCategory)} Selection</h2>
          
          <ItemSelector
            category={currentCategory}
            onItemSelect={handleItemSelect}
          />
        </div>
      )}
      
      {!currentCategory && (
        <div className="bg-[#1A1A1A] rounded-lg p-6 text-center">
          <p className="text-gray-400">Click on a loadout slot above to select an item for that slot.</p>
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
