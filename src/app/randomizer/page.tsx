/* eslint-disable @next/next/no-img-element */
"use client";

import ItemSelector from '@/components/loadout/ItemSelector';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import { useLoadout } from '@/context/LoadoutContext';
import { Element, ItemCategory } from '@/types';
import { useEffect, useState } from 'react';

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
        />
      </div>
      
      
      {/* Element Preferences */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
        <div className="flex w-full justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Element Preferences</h2>
          <button
            className="px-3 py-1 bg-[#646464] hover:bg-red-600 text-sm text-white rounded-md transition-colors"
            onClick={() => setPreferredElements([])}
          >
            Clear All Preferences
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {['Fire', 'Ice', 'Lightning', 'Decay'].map((element) => {
            const isSelected = randomizerSettings.preferredElements.includes(element as Exclude<Element, null>);
            return (
              <button
                key={element}
                className={` cursor-pointer
                  px-4 py-2 rounded-md transition-colors border
                  ${isSelected 
                    ? 'bg-[#646464] border-[#ddaf7aa6]' 
                    : 'bg-[#30303071] border-gray-700 hover:bg-[#646464] hover:border-[#ddaf7aa6]'
                  }
                `}
                onClick={() => toggleElementPreference(element as Exclude<Element, null>)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full transition-colors"
                    style={{ 
                      backgroundColor: isSelected ? getElementColor(element as Element) : '#808080'
                    }}
                  />
                  <span 
                    className={`
                      transition-colors
                      ${isSelected ? 'text-gray-100' : 'text-gray-500'}
                    `}
                  >
                    {element}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        <p className="text-sm text-gray-100 mt-2">
          Select elements to prioritize in your loadout. Items with selected elements will be preferred.
        </p>
      </div>
      
      {/* Randomize Button */}
      <div className="flex justify-center">
        <button
          className="px-6 py-3 cursor-pointer hover:bg-[#ddaf7ada] bg-[#ddaf7aa6] text-white font-bold rounded-md transition-colors"
          onClick={generateRandomLoadout}
        >
          Generate New Loadout
        </button>
      </div>
      
      {/* Item Exclusion Section */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] overflow-hidden">
        <img
          src="/images/texture-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-100 font-semibold">Exclude Items</h2>
          <button
            className="px-3 py-1 bg-[#646464] cursor-pointer hover:bg-red-600 text-sm text-white rounded-md transition-colors"
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
                px-4 py-2 whitespace-nowrap cursor-pointer
                ${selectedCategory === category ? 'text-gray-100 border-b-2 border-[#ddaf7aa6] font-medium' : 'text-gray-300'}
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
