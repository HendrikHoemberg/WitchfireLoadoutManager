/* eslint-disable @next/next/no-img-element */
"use client";

import ItemSelector from '@/components/loadout/ItemSelector';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import BeadSlot from '@/components/loadout/BeadSlot';
import { useLoadout } from '@/context/LoadoutContext';
import { Element, ItemCategory, BeadLoadout, BeadUserStats, Bead } from '@/types';
import { getBeads } from '@/data/items';
import { useEffect, useState } from 'react';

export default function RandomizerPage() {
  const { 
    loadout, 
    generateRandomLoadout, 
    randomizerSettings, 
    setPreferredElements, 
    toggleExcludedItem, 
    clearExcludedItems,
    clearLoadout,
    isGenerating,
    toggleEmptySlotMode
  } = useLoadout();
  
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('Weapons');
  
  // Beads state
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBeadSettings, setShowBeadSettings] = useState(false);
  
  // Hide tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showTooltip) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);
  const [beadLoadout, setBeadLoadout] = useState<BeadLoadout>({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null,
  });
  const [userStats, setUserStats] = useState<BeadUserStats>({
    flesh: 100,
    blood: 100,
    mind: 100,
    witchery: 100,
    arsenal: 100,
    faith: 100,
    gnosis: 6,
  });
  


  // Clear loadout when the page loads
  useEffect(() => {
    clearLoadout();
  }, [clearLoadout]);
  
  // Load user stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('beadUserStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setUserStats(parsed);
      } catch (error) {
        console.error('Failed to parse saved bead user stats:', error);
      }
    }
  }, []);
  
  // Save user stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('beadUserStats', JSON.stringify(userStats));
  }, [userStats]);
  

  
  // Helper function to get available bead slots based on gnosis level
  const getAvailableBeadSlots = (): number => {
    // Gnosis 1-5 gives 1-5 slots respectively, Gnosis 6 still gives 5 slots (max)
    return Math.min(userStats.gnosis, 5);
  };
  
  // Helper function to clear bead loadout
  const clearBeadLoadout = () => {
    setBeadLoadout({
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
      slot5: null,
    });
  };
  
  // Helper function to check if user meets bead requirements
  const meetsBeadRequirements = (bead: Bead): boolean => {
    return bead.requirements.every(req => {
      const userStatValue = userStats[req.stat.toLowerCase() as keyof BeadUserStats] || 0;
      const requiredValue = parseInt(req.value);
      return userStatValue >= requiredValue;
    });
  };
  
  // Helper function to get available beads based on user stats and exclusions
  const getAvailableBeads = (): Bead[] => {
    const allBeads = getBeads();
    
    return allBeads.filter((bead: Bead) => 
      !randomizerSettings.excludedItems.includes(bead.id) && 
      meetsBeadRequirements(bead)
    );
  };
  
  // Helper function to generate random bead loadout
  const generateRandomBeadLoadout = () => {
    // Delay bead loadout update by 800ms to match main loadout timing
    // This ensures beads don't refresh until the glow animation is over
    setTimeout(() => {
      const availableBeads = getAvailableBeads();
      const availableSlots = getAvailableBeadSlots();
      const newBeadLoadout: BeadLoadout = {
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        slot5: null,
      };
      
      const usedBeads: string[] = [];
      
      for (let i = 1; i <= availableSlots; i++) {
        const slotKey = `slot${i}` as keyof BeadLoadout;
        
        // Check empty slot mode (same 35% chance as main loadout)
        if (randomizerSettings.emptySlotMode && Math.random() < 0.35) {
          newBeadLoadout[slotKey] = null;
          continue;
        }
        
        // Get available beads not already used
        const unusedBeads = availableBeads.filter(bead => !usedBeads.includes(bead.id));
        
        if (unusedBeads.length > 0) {
          const randomBead = unusedBeads[Math.floor(Math.random() * unusedBeads.length)];
          newBeadLoadout[slotKey] = randomBead;
          usedBeads.push(randomBead.id);
        }
      }
      
      setBeadLoadout(newBeadLoadout);
    }, 800); // 800ms delay to match main loadout timing
  };

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
    'Weapons', 'DemonicWeapons', 'LightSpells', 'HeavySpells', 'Relics', 'Fetishes', 'Rings', 'Beads'
  ];

  return (
    <div className="flex flex-col gap-8">
      
      
      {/* Loadout Display */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.PNG"
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
          isGenerating={isGenerating}
        />
      </div>
      
      {/* Beads Section */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.PNG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
        <div className="flex w-full justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl text-white font-semibold">Beads</h2>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-[#646464] hover:bg-blue-600 text-sm text-white rounded-md transition-colors"
              onClick={() => setShowBeadSettings(true)}
            >
              Settings
            </button>
            <button
              className="px-3 py-1 bg-[#646464] hover:bg-red-600 text-sm text-white rounded-md transition-colors"
              onClick={clearBeadLoadout}
            >
              Clear All
            </button>
          </div>
        </div>
        
        {(
          <div className="w-full">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {Array.from({ length: getAvailableBeadSlots() }, (_, index) => {
                const bead = beadLoadout[`slot${index + 1}` as keyof typeof beadLoadout];
                
                return (
                  <BeadSlot
                    key={index}
                    bead={bead}
                    slotIndex={index}
                    isGenerating={isGenerating}
                  />
                );
              })}
            </div>
            
            {getAvailableBeadSlots() === 0 && (
              <div className="text-gray-400 text-sm">
                Set your Gnosis level in Settings to unlock bead slots
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Randomize Button */}
      <div className="flex justify-center">
        <button
          className="px-6 py-3 cursor-pointer hover:bg-[#ddaf7ada] bg-[#ddaf7aa6] text-white font-bold rounded-md transition-colors"
          onClick={() => {
            generateRandomLoadout();
            generateRandomBeadLoadout();
          }}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate New Loadout'}
        </button>
      </div>
      
      {/* Element Preferences */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="/images/texture-transparent.PNG"
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
          {['Fire', 'Water', 'Air', 'Earth'].map((element) => {
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
          Select elements that you want in your loadout. Every slot will try to use an item with your selected elements.
          All selected elements are guaranteed to be included at least once.
        </p>
        
        {/* Empty Slot Mode Toggle */}
        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center gap-2 mb-1">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={randomizerSettings.emptySlotMode}
                  onChange={toggleEmptySlotMode}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors flex items-center ${
                  randomizerSettings.emptySlotMode ? 'bg-[#ddaf7aa6]' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    randomizerSettings.emptySlotMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </label>
            <span className="text-gray-100 text-sm font-medium">Empty Slot Mode</span>
            <div className="relative group">
              <span 
                className="text-gray-400 hover:text-gray-200 cursor-help text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
              >
                ?
              </span>
              <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg transition-opacity z-50 w-48 max-w-xs text-center ${
                showTooltip ? 'opacity-100' : 'opacity-0 md:absolute md:bottom-full md:top-auto md:left-1/2 md:mb-2 md:z-10 md:group-hover:opacity-100 pointer-events-none'
              }`}>
                Activating this mode will lead to slots being randomly empty (Primary Weapon is guaranteed)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Item Exclusion Section */}
      <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] overflow-hidden">
        <img
          src="/images/texture-transparent.PNG"
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
      
      {/* Beads Settings Modal */}
      {showBeadSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg p-6 w-full max-w-md mx-4 border border-[#818181]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Bead Settings</h3>
              <button
                className="text-gray-400 hover:text-white text-2xl leading-none"
                onClick={() => setShowBeadSettings(false)}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-300 mb-4">
                Enter your character stats to determine available beads and slot count.
              </div>
              
              {/* Stat Input Fields */}
              {[
                { key: 'flesh', label: 'Flesh', min: 0, max: 100 },
                { key: 'blood', label: 'Blood', min: 0, max: 100 },
                { key: 'mind', label: 'Mind', min: 0, max: 100 },
                { key: 'witchery', label: 'Witchery', min: 0, max: 100 },
                { key: 'arsenal', label: 'Arsenal', min: 0, max: 100 },
                { key: 'faith', label: 'Faith', min: 0, max: 100 },
                { key: 'gnosis', label: 'Gnosis', min: 1, max: 6 }
              ].map(({ key, label, min, max }) => (
                <div key={key} className="flex justify-between items-center">
                  <label className="text-gray-200 font-medium">{label}:</label>
                  <input
                    type="number"
                    min={min || 0}
                    max={max}
                    value={userStats[key as keyof BeadUserStats]}
                    onChange={(e) => {
                      const value = Math.max(min || 0, parseInt(e.target.value) || 0);
                      const finalValue = max ? Math.min(max, value) : value;
                      setUserStats(prev => ({
                        ...prev,
                        [key]: finalValue
                      }));
                    }}
                    className="w-20 px-2 py-1 bg-[#404040] text-white rounded border border-[#606060] focus:border-[#ddaf7aa6] focus:outline-none text-center"
                  />
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-[#606060]">
                <div className="text-sm text-gray-300">
                  Available Bead Slots: <span className="text-[#ddaf7aa6] font-semibold">{getAvailableBeadSlots()}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#606060] hover:bg-[#707070] text-white rounded transition-colors"
                  onClick={() => setShowBeadSettings(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#ddaf7aa6] hover:bg-[#ddaf7ada] text-white rounded transition-colors"
                  onClick={() => setShowBeadSettings(false)}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
    case 'Water': return '#4da6ff';
    case 'Air': return '#ffcc00';
    case 'Earth': return '#66cc66';
    default: return '#cccccc';
  }
}
