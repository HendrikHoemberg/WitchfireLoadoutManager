"use client";

import { useState, useEffect } from 'react';
import { Element, ItemCategory } from '@/types';
import { useLoadout } from '@/context/LoadoutContext';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import ItemSelector from '@/components/loadout/ItemSelector';

export default function RandomizerPage() {
  const { 
    loadout, 
    generateRandomLoadout, 
    randomizerSettings, 
    setPreferredElements, 
    toggleExcludedItem, 
    clearExcludedItems,
    clearLoadout
  } = useLoadout();
  
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('Weapons');

  // Clear loadout when the page loads
  useEffect(() => {
    clearLoadout();
  }, [clearLoadout]);

  // Toggle element preference
  const toggleElementPreference = (element: Element) => {
    if (!element) return; // Skip null element
    
    const newPreferredElements = [...randomizerSettings.preferredElements];
    const index = newPreferredElements.indexOf(element);
    
    if (index >= 0) {
      newPreferredElements.splice(index, 1);
    } else {
      newPreferredElements.push(element);
    }
    
    setPreferredElements(newPreferredElements);
  };

  // Category tabs for item selection
  const categories: ItemCategory[] = [
    'Weapons', 'DemonicWeapons', 'LightSpells', 'HeavySpells', 'Relics', 'Fetishes', 'Rings'
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Loadout Randomizer</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Generate balanced loadouts with optional element preferences and item exclusions.
        </p>
      </div>
      
      {/* Loadout Display */}
      <div className="bg-[#1A1A1A] rounded-lg p-6">
        <LoadoutDisplay loadout={loadout} />
      </div>
      
      
      {/* Element Preferences */}
      <div className="bg-[#1A1A1A] rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Element Preferences</h2>
        <div className="flex flex-wrap gap-3">
          {['Fire', 'Ice', 'Lightning', 'Decay'].map((element) => {
            const isSelected = randomizerSettings.preferredElements.includes(element as Exclude<Element, null>);
            return (
              <button
                key={element}
                className={`
                  px-4 py-2 rounded-md transition-colors
                  ${isSelected ? 'bg-gray-700 border border-red-500' : 'bg-gray-800 border border-gray-700'}
                `}
                onClick={() => toggleElementPreference(element as Exclude<Element, null>)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getElementColor(element as Element) }}
                  />
                  <span>{element}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Select elements to prioritize in your loadout. Items with selected elements will be preferred.
        </p>
      </div>
      
      {/* Randomize Button */}
      <div className="flex justify-center">
        <button
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
          onClick={generateRandomLoadout}
        >
          Generate New Loadout
        </button>
      </div>
      
      {/* Item Exclusion Section */}
      <div className="bg-[#1A1A1A] rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Exclude Items</h2>
          <button
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-sm rounded-md transition-colors"
            onClick={clearExcludedItems}
          >
            Clear All Exclusions
          </button>
        </div>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              className={`
                px-4 py-2 whitespace-nowrap
                ${selectedCategory === category ? 'border-b-2 border-red-500 font-medium' : 'text-gray-400'}
              `}
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
        
        {/* Item Selector for Exclusion */}
        <ItemSelector
          category={selectedCategory}
          onItemSelect={() => {}} // No-op since we're just excluding
          excludedItems={randomizerSettings.excludedItems}
          onItemExcludeToggle={toggleExcludedItem}
        />
      </div>
    </div>
  );
}

// Helper function to get display name for category
function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'DemonicWeapons': return 'Demonic Weapons';
    case 'LightSpells': return 'Light Spells';
    case 'HeavySpells': return 'Heavy Spells';
    default: return category;
  }
}

// Helper function to get color for element
function getElementColor(element: Element): string {
  if (!element) return '#cccccc';
  
  switch (element) {
    case 'Fire': return '#ff4d4d';
    case 'Ice': return '#4da6ff';
    case 'Lightning': return '#ffcc00';
    case 'Decay': return '#66cc66';
    default: return '#cccccc';
  }
}
