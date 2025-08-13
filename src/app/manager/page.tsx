/* eslint-disable @next/next/no-img-element */
"use client";

import ItemSelector from '@/components/loadout/ItemSelector';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import BeadSlot from '@/components/loadout/BeadSlot';
import { useLoadout } from '@/context/LoadoutContext';
import { ItemCategory, Loadout, BaseItem, BeadLoadout, BeadUserStats, Bead } from '@/types';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getItemById, getBeadById } from '@/data/items';
import { buildCompactShareParam, parseCompactShareParam } from '@/utils/share';

function ManagerPageContent() {
  const { loadout, setItemInLoadout, clearLoadout } = useLoadout();
  const searchParams = useSearchParams();
  
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
  const [shareCopied, setShareCopied] = useState(false);
  const selectorPanelRef = useRef<HTMLDivElement | null>(null);
  
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
  
  // Clear loadout on first load ONLY if no prefill params are present
  useEffect(() => {
    const slotKeys = ['primaryWeapon','secondaryWeapon','demonicWeapon','lightSpell','heavySpell','relic','fetish','ring'];
    const hasLoadoutParams = slotKeys.some(k => searchParams.get(k));
    const hasBeadParams = ['bead1','bead2','bead3','bead4','bead5'].some(k => searchParams.get(k));
    const hasCompact = !!searchParams.get('s');
    if (!hasLoadoutParams && !hasBeadParams && !hasCompact) {
      clearLoadout();
      // Also ensure beads are cleared if no params are present
      setBeadLoadout({ slot1: null, slot2: null, slot3: null, slot4: null, slot5: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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

  // Prefill loadout and bead slots from URL params on first mount
  useEffect(() => {
    // Prefer compact param 's' if present
    const compact = searchParams.get('s');
    if (compact) {
      const parsed = parseCompactShareParam(compact);
      if (parsed) {
        const order: (keyof Loadout)[] = [
          'primaryWeapon','secondaryWeapon','demonicWeapon','lightSpell','heavySpell','relic','fetish','ring'
        ];
        order.forEach((slot, idx) => {
          const id = parsed.loadoutIds[idx] ?? null;
          if (id) {
            const item = getItemById(id);
            if (item) setItemInLoadout(slot, item);
          }
        });

        const newBeads: BeadLoadout = { slot1: null, slot2: null, slot3: null, slot4: null, slot5: null };
        for (let i = 0; i < 5; i++) {
          const id = parsed.beadIds[i] ?? null;
          if (id) {
            const bead = getBeadById(id);
            if (bead) {
              const key = `slot${i+1}` as keyof BeadLoadout;
              newBeads[key] = bead;
            }
          }
        }
        setBeadLoadout(newBeads);
        return; // Done
      }
    }

    // Fallback: verbose params
    const loadoutKeys: (keyof Loadout)[] = [
      'primaryWeapon',
      'secondaryWeapon',
      'demonicWeapon',
      'lightSpell',
      'heavySpell',
      'relic',
      'fetish',
      'ring',
    ];

    loadoutKeys.forEach((key) => {
      const id = searchParams.get(key);
      if (id) {
        const item = getItemById(id);
        if (item) {
          setItemInLoadout(key, item);
        }
      }
    });

    const beadUpdates: Partial<BeadLoadout> = {};
    for (let i = 1; i <= 5; i++) {
      const beadId = searchParams.get(`bead${i}`);
      if (beadId) {
        const bead = getBeadById(beadId);
        if (bead) {
          beadUpdates[`slot${i}` as keyof BeadLoadout] = bead;
        }
      }
    }
    if (Object.keys(beadUpdates).length > 0) {
      setBeadLoadout((prev) => ({ ...prev, ...beadUpdates }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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

  // Generate a shareable link with current selections and copy to clipboard
  const handleGenerateShareLink = async () => {
    try {
      const url = new URL(window.location.href);
      // Reset any existing params
      url.search = '';

      // Build compact share param
      const s = buildCompactShareParam(loadout, beadLoadout);
      url.searchParams.set('s', s);

      await navigator.clipboard.writeText(url.toString());
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch (e) {
      console.error('Failed to generate share link', e);
      alert('Failed to copy the share link. You can copy the URL from the address bar.');
    }
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
  
  // Ordered lists used for auto-advancing selection
  const loadoutOrder: (keyof Loadout)[] = [
    'primaryWeapon',
    'secondaryWeapon',
    'demonicWeapon',
    'relic',
    'fetish',
    'ring',
    'lightSpell',
    'heavySpell'
  ];
  const beadOrder: (keyof BeadLoadout)[] = ['slot1','slot2','slot3','slot4','slot5'];
  
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
    // Track projected state for a unified completion check at the end
    let projectedLoadout: Loadout = loadout as Loadout;
    let projectedBeads: BeadLoadout = beadLoadout;

    if (selectedSlot && 'element' in item) {
      // This is a BaseItem for the main loadout
      setItemInLoadout(selectedSlot, item as BaseItem);

      // Auto-advance to next loadout slot, or first bead slot after the last
      const nextLoadout: Loadout = { ...loadout, [selectedSlot]: item as BaseItem } as Loadout;
      const isLoadoutComplete = Object.values(nextLoadout).every(v => v !== null);
      projectedLoadout = nextLoadout;
      const currentIdx = loadoutOrder.indexOf(selectedSlot);
      if (currentIdx >= 0) {
        if (currentIdx < loadoutOrder.length - 1) {
          setSelectedSlot(loadoutOrder[currentIdx + 1]);
          setSelectedBeadSlot(null);
        } else {
          // Last loadout slot reached -> move to first bead slot (if any available)
          const available = Math.max(0, Math.min(5, getAvailableBeadSlots()));
          if (available > 0) {
            // Find first empty bead slot among available; if none, and loadout complete, hide selector
            const firstEmpty = beadOrder
              .slice(0, available)
              .find((k) => beadLoadout[k] === null);
            if (firstEmpty) {
              setSelectedSlot(null);
              setSelectedBeadSlot(firstEmpty);
            } else if (isLoadoutComplete) {
              setSelectedSlot(null);
              setSelectedBeadSlot(null);
            }
          } else if (isLoadoutComplete) {
            // No bead slots available and loadout is complete -> hide selector
            setSelectedSlot(null);
            setSelectedBeadSlot(null);
          }
        }
      }
    } else if (selectedBeadSlot && 'requirements' in item) {
      // This is a Bead for the bead loadout
      const nextBeads: BeadLoadout = {
        ...beadLoadout,
        [selectedBeadSlot]: item as Bead
      };
      setBeadLoadout(nextBeads);
      projectedBeads = nextBeads;

      // Auto-advance to next available bead slot, but stop after last
      const available = Math.max(0, Math.min(5, getAvailableBeadSlots()));
      const currentBeadIdx = beadOrder.indexOf(selectedBeadSlot);
      const allBeadsFilled = beadOrder.slice(0, available).every((k) => nextBeads[k] !== null);
      const isLoadoutComplete = Object.values(loadout).every(v => v !== null);
      if (isLoadoutComplete && allBeadsFilled) {
        // Everything filled -> hide selector
        setSelectedBeadSlot(null);
        setSelectedSlot(null);
      } else if (currentBeadIdx >= 0 && currentBeadIdx < available - 1) {
        setSelectedBeadSlot(beadOrder[currentBeadIdx + 1]);
      }
    }

    // Final unified completion check: if all slots (loadout + available beads) are filled, hide selector
    const available = Math.max(0, Math.min(5, getAvailableBeadSlots()));
    const loadoutFull = Object.values(projectedLoadout).every(v => v !== null);
    const beadsFull = beadOrder.slice(0, available).every((k) => projectedBeads[k] !== null);
    if (loadoutFull && (available === 0 || beadsFull)) {
      setSelectedSlot(null);
      setSelectedBeadSlot(null);
    }
  };
  
  // Get the current category based on selected slot (loadout or bead)
  const currentCategory = selectedSlot ? slotToCategory[selectedSlot] : 
                         selectedBeadSlot ? 'Beads' as ItemCategory : 
                           null;

  // Close overlay on outside click/touch
  useEffect(() => {
    // Only add the event listeners if the selector is open
    if (!currentCategory) return;
    
    // Track if we're scrolling to prevent closing the selector during scroll
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      isScrolling = true;
      
      // Clear the timeout if it exists
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Set a timeout to reset isScrolling after scrolling stops
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };
    
    const handler = (e: MouseEvent | TouchEvent) => {
      // If we're scrolling, don't close the selector
      if (isScrolling) return;
      
      const target = e.target as Node | null;
      if (!target) return;
      
      // Check if the click/touch is inside the selector panel
      if (selectorPanelRef.current && !selectorPanelRef.current.contains(target)) {
        // Check if the click is on the close button inside the selector
        const closeButton = document.querySelector('.selector-close-button');
        if (closeButton && (closeButton === target || closeButton.contains(target))) {
          setSelectedSlot(null);
          setSelectedBeadSlot(null);
          return;
        }
        
        // On desktop, close on mousedown outside
        if (e.type === 'mousedown') {
          setSelectedSlot(null);
          setSelectedBeadSlot(null);
        }
        // On mobile, we'll only close with the explicit close button
        // This prevents accidental closing when scrolling
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add click/touch handlers
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler as EventListener);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [currentCategory]);

  // Exclusions for ItemSelector (Manager-only):
  // If selecting a weapon slot, exclude the weapon already chosen in the other weapon slot
  const excludedItemsForSelector: string[] = (() => {
    if (!currentCategory) return [];
    if (currentCategory === 'Weapons') {
      if (selectedSlot === 'primaryWeapon' && loadout.secondaryWeapon) {
        return [loadout.secondaryWeapon.id];
      }
      if (selectedSlot === 'secondaryWeapon' && loadout.primaryWeapon) {
        return [loadout.primaryWeapon.id];
      }
    } else if (currentCategory === 'Beads') {
      // Exclude beads already used in other slots; allow the current slot's bead to remain visible
      const usedBeadIds = Object.values(beadLoadout)
        .filter((b): b is Bead => b !== null)
        .map(b => b.id);

      if (selectedBeadSlot && beadLoadout[selectedBeadSlot]) {
        const currentId = (beadLoadout[selectedBeadSlot] as Bead).id;
        return usedBeadIds.filter(id => id !== currentId);
      }
      return usedBeadIds;
    }
    return [];
  })();

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
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 text-sm text-white rounded-md transition-colors ${
                shareCopied ? 'bg-green-600 hover:bg-green-500' : 'bg-[#646464] hover:bg-[#7a7a7a]'
              }`}
              onClick={handleGenerateShareLink}
            >
              {shareCopied ? 'Link copied to clipboard' : 'Generate Share Link'}
            </button>
            <button
              className="px-3 py-1 bg-[#646464] hover:bg-red-600 text-sm text-white rounded-md transition-colors"
              onClick={clearLoadout}
            >
              Clear All
            </button>
          </div>
        </div>
        
        <LoadoutDisplay 
          loadout={loadout} 
          onSlotClick={handleSlotClick} 
          selectedSlot={selectedSlot} 
        />
      </div>
      
      {/* Item Selector Overlay (bottom sheet) */}
      {currentCategory && (
        <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
          <div
            ref={selectorPanelRef}
            className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[60vh] md:h-[45vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            <img
              src="/images/texture-transparent.PNG"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
            />
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                <h2 className="text-lg text-white font-semibold m-0">
                  {getCategoryDisplayName(currentCategory)}
                </h2>
                {/* Close button */}
                <button
                  className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer selector-close-button"
                  onClick={() => {
                    setSelectedSlot(null);
                    setSelectedBeadSlot(null);
                  }}
                  aria-label="Close item selector"
                  title="Close"
                >
                  ×
                </button>
              </div>
              <div className="px-4">
                <ItemSelector
                  category={currentCategory}
                  onItemSelect={handleItemSelect}
                  excludedItems={excludedItemsForSelector}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
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
        </div>
      </div>
      
      {/* Bead selector now uses the same bottom-sheet overlay above */}

      {/* Spacer to allow scrolling content above the fixed bottom selector */}
      {currentCategory && (
        <div
          aria-hidden
          className="pointer-events-none"
          style={{ height: 'calc(40vh)' }}
        />
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

export default function ManagerPage() {
  return (
    <Suspense fallback={<div className="text-gray-300">Loading...</div>}>
      <ManagerPageContent />
    </Suspense>
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
