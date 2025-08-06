/* eslint-disable @next/next/no-img-element */
"use client";

import ItemSelector from '@/components/loadout/ItemSelector';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import BeadSlot from '@/components/loadout/BeadSlot';
import { useLoadout } from '@/context/LoadoutContext';
import { ItemCategory, Loadout, BaseItem, BeadLoadout, BeadUserStats, Bead } from '@/types';
import { useEffect, useState } from 'react';

export default function ManagerPage() {
  const { loadout, setItemInLoadout, clearLoadout } = useLoadout();
  
  // State declarations first
  const [selectedSlot, setSelectedSlot] = useState<keyof Loadout | null>(null);
  const [selectedBeadSlot, setSelectedBeadSlot] = useState<keyof BeadLoadout | null>(null);
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
    slots: 5,
  });
  const [showBeadSettings, setShowBeadSettings] = useState(false);
  
  // Effect to prevent background scrolling when bead settings modal is open
  useEffect(() => {
    if (showBeadSettings) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling on the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showBeadSettings]);
  
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
  
  // Helper function to get available bead slots based on slots setting
  const getAvailableBeadSlots = (): number => {
    return userStats.slots;
  };
  
  // Helper function to calculate stat requirements for current bead loadout
  const calculateStatRequirements = () => {
    const statRequirements: { [key: string]: number } = {
      flesh: 0,
      blood: 0,
      mind: 0,
      witchery: 0,
      arsenal: 0,
      faith: 0
    };

    // Get all beads from current loadout
    const currentBeads = Object.values(beadLoadout).filter(bead => bead !== null) as Bead[];
    
    // Calculate maximum requirement for each stat across all beads
    currentBeads.forEach(bead => {
      bead.requirements.forEach(req => {
        const statName = req.stat.toLowerCase();
        const requiredValue = parseInt(req.value);
        if (statRequirements.hasOwnProperty(statName)) {
          statRequirements[statName] = Math.max(statRequirements[statName], requiredValue);
        }
      });
    });

    return statRequirements;
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
    setSelectedBeadSlot(null); // Clear bead selection when loadout slot is selected
  };
  
  // Handle bead slot selection
  const handleBeadSlotClick = (slot: keyof BeadLoadout) => {
    setSelectedBeadSlot(slot);
    setSelectedSlot(null); // Clear loadout selection when bead slot is selected
  };
  
  // Handle item selection (both BaseItem and Bead)
  const handleItemSelect = (item: BaseItem | Bead) => {
    if (selectedSlot && 'element' in item) {
      // This is a BaseItem for the main loadout
      setItemInLoadout(selectedSlot, item as BaseItem);
    } else if (selectedBeadSlot && 'requirements' in item) {
      // This is a Bead for the bead loadout
      setBeadLoadout(prev => ({
        ...prev,
        [selectedBeadSlot]: item as Bead
      }));
    }
  };
  
  // Get the current category based on selected slot (loadout or bead)
  const currentCategory = selectedSlot ? slotToCategory[selectedSlot] : 
                         selectedBeadSlot ? 'Beads' as ItemCategory : 
                         null;

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
          onSlotClick={handleSlotClick} 
          selectedSlot={selectedSlot} 
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
          <h2 className="text-xl text-white font-semibold">Beads</h2>
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
        
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {Array.from({ length: getAvailableBeadSlots() }, (_, index) => {
              const slotKey = `slot${index + 1}` as keyof BeadLoadout;
              const bead = beadLoadout[slotKey];
              const isSelected = selectedBeadSlot === slotKey;
              
              return (
                <BeadSlot
                  key={index}
                  bead={bead}
                  slotIndex={index}
                  isSelected={isSelected}
                  onClick={() => handleBeadSlotClick(slotKey)}
                />
              );
            })}
          </div>
          
          {getAvailableBeadSlots() === 0 && (
            <div className="text-gray-400 text-sm">
              Set your Slots in Settings to unlock bead slots
            </div>
          )}
          

          
          {/* Stat Requirements Table */}
          {Object.values(beadLoadout).some(bead => bead !== null) && (
            <div className="w-full mt-4">
              <h3 className="text-sm font-medium text-white mb-3">Stat Requirements for Current Beads</h3>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#555]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(calculateStatRequirements()).map(([stat, required]) => {
                    const userStat = userStats[stat as keyof BeadUserStats] as number;
                    const isMet = userStat >= required;
                    const statDisplayName = stat.charAt(0).toUpperCase() + stat.slice(1);
                    
                    return (
                      <div key={stat} className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded border border-[#444]">
                        <span className="text-gray-300 text-sm font-medium">{statDisplayName}:</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${
                            required === 0 ? 'text-gray-500' :
                            isMet ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {required === 0 ? 'N/A' : required}
                          </span>
                          {required > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              isMet ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                            }`}>
                              {isMet ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Item Selection */}
      {currentCategory && (
        <div className="relative bg-[#30303071] rounded-lg p-6 transition-colors border border-[#818181] overflow-hidden">
        <img
          src="/images/texture-transparent.PNG"
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
          src="/images/texture-transparent.PNG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        />
          <p className="text-white">Click on a loadout slot above to select an item for that slot.</p>
        </div>
      )}
      
      {/* Beads Settings Modal */}
      {showBeadSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
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
                { key: 'faith', label: 'Faith', min: 0, max: 100 }
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
                <div className="flex justify-between items-center">
                  <label className="text-gray-200 font-medium">Available Bead Slots:</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={userStats.slots}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      const finalValue = Math.min(5, value);
                      setUserStats(prev => ({
                        ...prev,
                        slots: finalValue
                      }));
                    }}
                    className="w-20 px-2 py-1 bg-[#404040] text-white rounded border border-[#606060] focus:border-[#ddaf7aa6] focus:outline-none text-center"
                  />
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
function getCategoryDisplayName(category: ItemCategory): string {
  switch (category) {
    case 'LightSpells': return 'Light Spells';
    case 'HeavySpells': return 'Heavy Spells';
    default: return category;
  }
}
