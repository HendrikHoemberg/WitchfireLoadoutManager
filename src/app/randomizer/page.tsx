/* eslint-disable @next/next/no-img-element */
"use client";

import ItemSelector from '@/components/loadout/ItemSelector';
import LoadoutDisplay from '@/components/loadout/LoadoutDisplay';
import BeadSlot from '@/components/loadout/BeadSlot';
import { useLoadout } from '@/context/LoadoutContext';
import { Element, ItemCategory, BeadLoadout, BeadUserStats, Bead, LoadoutLockState, BeadLockState, Loadout } from '@/types';
import { getBeads, getItemsByCategory, getItemById, getBeadById } from '@/data/items';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { buildCompactShareParam, parseCompactShareParam } from '@/utils/share';

function RandomizerPageContent() {
  const { 
    loadout, 
    randomizerSettings, 
    setPreferredElements, 
    toggleExcludedItem, 
    clearExcludedItems,
    clearLoadout,
    toggleEmptySlotMode,
    setItemInLoadout
  } = useLoadout();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('Weapons');
  
  // Beads state
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBeadSettings, setShowBeadSettings] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  
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
    slots: 5,
  });
  
  // Lock state for loadout slots
  const [loadoutLockState, setLoadoutLockState] = useState<LoadoutLockState>({
    primaryWeapon: false,
    secondaryWeapon: false,
    demonicWeapon: false,
    lightSpell: false,
    heavySpell: false,
    relic: false,
    fetish: false,
    ring: false,
  });
  
  // Lock state for bead slots
  const [beadLockState, setBeadLockState] = useState<BeadLockState>({
    slot1: false,
    slot2: false,
    slot3: false,
    slot4: false,
    slot5: false,
  });

  // Clear loadout on first load ONLY if no prefill params are present
  useEffect(() => {
    const slotKeys = ['primaryWeapon','secondaryWeapon','demonicWeapon','lightSpell','heavySpell','relic','fetish','ring'];
    const hasLoadoutParams = slotKeys.some(k => searchParams.get(k));
    const hasBeadParams = ['bead1','bead2','bead3','bead4','bead5'].some(k => searchParams.get(k));
    const hasCompact = !!searchParams.get('s');
    if (!hasLoadoutParams && !hasBeadParams && !hasCompact) {
      clearLoadout();
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

    // Fallback to verbose params
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

  // Generate a shareable link with current selections and copy to clipboard
  const handleGenerateShareLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.search = '';

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
  
  // Helper function to get available bead slots based on slots setting
  const getAvailableBeadSlots = (): number => {
    // Slots can be 1-5 directly
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
        slot1: beadLoadout.slot1, // Start with current loadout
        slot2: beadLoadout.slot2,
        slot3: beadLoadout.slot3,
        slot4: beadLoadout.slot4,
        slot5: beadLoadout.slot5,
      };
      
      const usedBeads: string[] = [];
      
      // First, collect already used beads from locked slots
      for (let i = 1; i <= availableSlots; i++) {
        const slotKey = `slot${i}` as keyof BeadLoadout;
        const lockKey = slotKey as keyof BeadLockState;
        
        if (beadLockState[lockKey] && newBeadLoadout[slotKey]) {
          usedBeads.push(newBeadLoadout[slotKey]!.id);
        }
      }
      
      for (let i = 1; i <= availableSlots; i++) {
        const slotKey = `slot${i}` as keyof BeadLoadout;
        const lockKey = slotKey as keyof BeadLockState;
        
        // Skip locked slots
        if (beadLockState[lockKey]) {
          continue;
        }
        
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
        } else {
          newBeadLoadout[slotKey] = null;
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

  // Toggle lock state for loadout slots
  const toggleLoadoutLock = (slot: keyof LoadoutLockState) => {
    setLoadoutLockState(prev => ({
      ...prev,
      [slot]: !prev[slot]
    }));
  };

  // Toggle lock state for bead slots
  const toggleBeadLock = (slot: keyof BeadLockState) => {
    setBeadLockState(prev => ({
      ...prev,
      [slot]: !prev[slot]
    }));
  };

  // Custom animation state for locked randomizer
  const [customIsGenerating, setCustomIsGenerating] = useState(false);

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Custom randomizer that only randomizes unlocked slots
  const generateRandomLoadoutWithLocks = () => {
    // Get list of unlocked slots that can be randomized
    const unlockedSlots = Object.keys(loadoutLockState).filter(slot => {
      const slotKey = slot as keyof LoadoutLockState;
      return !loadoutLockState[slotKey];
    }) as (keyof Loadout)[];

    // If no slots are unlocked, don't do anything
    if (unlockedSlots.length === 0) {
      return;
    }

    // Start our custom generating state for animations
    setCustomIsGenerating(true);
    
    // Store the new items to be set after animation completes
    const newItems: Partial<Loadout> = {};
    
    // Keep track of preferred elements that haven't been included yet
    const elementsToInclude = [...randomizerSettings.preferredElements].filter(e => e !== null);
    const assignedSlots: (keyof Loadout)[] = [];
    const emptySlots: (keyof Loadout)[] = []; // Track slots that should remain empty
    const selectedItemIds: string[] = []; // Track selected item IDs to prevent duplicates
    
    // Map category names to loadout slot names
    const categoryToSlot: Record<string, keyof Loadout> = {
      'Weapons': 'primaryWeapon', // Primary weapon gets items from Weapons category
      'DemonicWeapons': 'demonicWeapon',
      'LightSpells': 'lightSpell',
      'HeavySpells': 'heavySpell',
      'Relics': 'relic',
      'Fetishes': 'fetish',
      'Rings': 'ring'
    };
    
    // Shuffle unlocked slots to ensure random distribution
    const shuffledUnlockedSlots = shuffleArray([...unlockedSlots]);
    
    // Process each unlocked slot and try to assign items with preferred elements
    for (const slot of shuffledUnlockedSlots) {
      // Skip secondary weapon for now, we'll handle it separately
      if (slot === 'secondaryWeapon') continue;
      
      // Empty Slot Mode: 35% chance for a slot to be empty (except primary weapon which is guaranteed)
      if (randomizerSettings.emptySlotMode && slot !== 'primaryWeapon') {
        if (Math.random() < 0.35) {
          // Mark this slot as intentionally empty and continue to next slot
          emptySlots.push(slot);
          continue;
        }
      }
      
      // Get the corresponding category for this slot
      const categoryEntry = Object.entries(categoryToSlot)
        .find(entry => entry[1] === slot);
      const category = categoryEntry?.[0];
      
      if (!category) continue;
      
      // Get all items for this category
      let availableItems = getItemsByCategory(category);
      
      // Filter out excluded items
      if (randomizerSettings.excludedItems.length > 0) {
        availableItems = availableItems.filter(
          item => !randomizerSettings.excludedItems.includes(item.id)
        );
      }
      
      // Filter out already selected items to prevent duplicates
      availableItems = availableItems.filter(
        item => !selectedItemIds.includes(item.id)
      );
      
      // Check if we have enough items to randomize
      if (availableItems.length < 1) continue;
      
      // Prioritize items with any preferred element
      if (randomizerSettings.preferredElements.length > 0) {
        const itemsWithPreferredElements = availableItems.filter(
          item => item.element !== null && randomizerSettings.preferredElements.includes(item.element)
        );
        
        if (itemsWithPreferredElements.length > 0) {
          // Find items with elements we haven't assigned yet (if any are left)
          if (elementsToInclude.length > 0) {
            const itemsWithMissingElements = itemsWithPreferredElements.filter(
              item => item.element !== null && elementsToInclude.includes(item.element)
            );
            
            if (itemsWithMissingElements.length > 0) {
              // Pick a random item from those with missing elements
              const randomIndex = Math.floor(Math.random() * itemsWithMissingElements.length);
              const selectedItem = itemsWithMissingElements[randomIndex];
              newItems[slot] = selectedItem;
              
              // Track this item to prevent duplicates
              selectedItemIds.push(selectedItem.id);
              
              // Remove this element from our tracking list
              if (selectedItem.element) {
                const elementIndex = elementsToInclude.indexOf(selectedItem.element);
                if (elementIndex !== -1) {
                  elementsToInclude.splice(elementIndex, 1);
                }
              }
              
              assignedSlots.push(slot);
              continue;
            }
          }
          
          // If we don't have any missing elements or no items with missing elements,
          // just pick any item with a preferred element
          const randomIndex = Math.floor(Math.random() * itemsWithPreferredElements.length);
          const selectedItem = itemsWithPreferredElements[randomIndex];
          newItems[slot] = selectedItem;
          
          // Track this item to prevent duplicates
          selectedItemIds.push(selectedItem.id);
          
          assignedSlots.push(slot);
          continue;
        }
      }
      
      // If we reached here, there are no preferred elements for this slot
      // We'll leave it empty for now and fill it in Phase 2 if we need to
    }
    
    // Handle secondary weapon separately (to avoid duplicating primary weapon)
    if (unlockedSlots.includes('secondaryWeapon') && !assignedSlots.includes('secondaryWeapon') && !emptySlots.includes('secondaryWeapon')) {
      // Empty Slot Mode: 35% chance for secondary weapon to be empty
      if (randomizerSettings.emptySlotMode && Math.random() < 0.35) {
        // Mark secondary weapon slot as intentionally empty
        emptySlots.push('secondaryWeapon');
      } else {
        let availableWeapons = getItemsByCategory('Weapons');
        
        // Filter out excluded items
        if (randomizerSettings.excludedItems.length > 0) {
          availableWeapons = availableWeapons.filter(
            item => !randomizerSettings.excludedItems.includes(item.id)
          );
        }
        
        // Filter out the primary weapon to avoid duplicates (whether locked or not)
        if (loadout.primaryWeapon) {
          availableWeapons = availableWeapons.filter(
            item => item.id !== loadout.primaryWeapon?.id
          );
        }
        
        // Filter out already selected items to prevent duplicates
        availableWeapons = availableWeapons.filter(
          item => !selectedItemIds.includes(item.id)
        );
        
        // Check if we have enough items to randomize
        if (availableWeapons.length >= 1) {
          // Prioritize weapons with any preferred element
          if (randomizerSettings.preferredElements.length > 0) {
            const weaponsWithPreferredElements = availableWeapons.filter(
              item => item.element !== null && randomizerSettings.preferredElements.includes(item.element)
            );
            
            if (weaponsWithPreferredElements.length > 0) {
              // Find weapons with elements we haven't assigned yet (if any are left)
              if (elementsToInclude.length > 0) {
                const weaponsWithMissingElements = weaponsWithPreferredElements.filter(
                  item => item.element !== null && elementsToInclude.includes(item.element)
                );
                
                if (weaponsWithMissingElements.length > 0) {
                  // Pick a random weapon from those with missing elements
                  const randomIndex = Math.floor(Math.random() * weaponsWithMissingElements.length);
                  const selectedWeapon = weaponsWithMissingElements[randomIndex];
                  newItems.secondaryWeapon = selectedWeapon;
                  
                  // Track this item to prevent duplicates
                  selectedItemIds.push(selectedWeapon.id);
                  
                  // Remove this element from our tracking list
                  if (selectedWeapon.element) {
                    const elementIndex = elementsToInclude.indexOf(selectedWeapon.element);
                    if (elementIndex !== -1) {
                      elementsToInclude.splice(elementIndex, 1);
                    }
                  }
                  
                  assignedSlots.push('secondaryWeapon');
                } else {
                  // Just pick any weapon with a preferred element
                  const randomIndex = Math.floor(Math.random() * weaponsWithPreferredElements.length);
                  const selectedWeapon = weaponsWithPreferredElements[randomIndex];
                  newItems.secondaryWeapon = selectedWeapon;
                  
                  // Track this item to prevent duplicates
                  selectedItemIds.push(selectedWeapon.id);
                  
                  assignedSlots.push('secondaryWeapon');
                }
              } else {
                // Just pick any weapon with a preferred element
                const randomIndex = Math.floor(Math.random() * weaponsWithPreferredElements.length);
                const selectedWeapon = weaponsWithPreferredElements[randomIndex];
                newItems.secondaryWeapon = selectedWeapon;
                
                // Track this item to prevent duplicates
                selectedItemIds.push(selectedWeapon.id);
                
                assignedSlots.push('secondaryWeapon');
              }
            }
          }
          
          // If secondary weapon still not assigned and no preferred elements constraint
          if (!assignedSlots.includes('secondaryWeapon')) {
            // Phase 2: Fill remaining slots with random items (no preferred element constraints)
            const randomIndex = Math.floor(Math.random() * availableWeapons.length);
            const selectedWeapon = availableWeapons[randomIndex];
            newItems.secondaryWeapon = selectedWeapon;
            
            // Track this item to prevent duplicates
            selectedItemIds.push(selectedWeapon.id);
          }
        }
      }
    }
    
    // Phase 2: Fill any remaining unlocked slots that weren't assigned and aren't marked as empty
    const remainingUnlockedSlots = unlockedSlots.filter(slot => 
      !assignedSlots.includes(slot) && !emptySlots.includes(slot)
    );
    
    for (const slot of remainingUnlockedSlots) {
      // Get the appropriate category for this slot
      const categoryMap: Record<keyof Loadout, string> = {
        primaryWeapon: 'Weapons',
        secondaryWeapon: 'Weapons',
        demonicWeapon: 'DemonicWeapons',
        lightSpell: 'LightSpells',
        heavySpell: 'HeavySpells',
        relic: 'Relics',
        fetish: 'Fetishes',
        ring: 'Rings'
      };
      
      const category = categoryMap[slot];
      if (!category) continue;
      
      // Get available items for this category
      let availableItems = getItemsByCategory(category);
      
      // Filter out excluded items
      if (randomizerSettings.excludedItems.length > 0) {
        availableItems = availableItems.filter(
          item => !randomizerSettings.excludedItems.includes(item.id)
        );
      }
      
      // For secondary weapon, avoid duplicating primary weapon
      if (slot === 'secondaryWeapon' && loadout.primaryWeapon) {
        availableItems = availableItems.filter(
          item => item.id !== loadout.primaryWeapon?.id
        );
      }
      
      // Filter out already selected items to prevent duplicates
      availableItems = availableItems.filter(
        item => !selectedItemIds.includes(item.id)
      );
      
      // Select random item
      if (availableItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const selectedItem = availableItems[randomIndex];
        newItems[slot] = selectedItem;
        
        // Track this item to prevent duplicates
        selectedItemIds.push(selectedItem.id);
      }
    }
    
    // Wait for animation to play (800ms) before updating items
    setTimeout(() => {
      // First, clear slots that were intentionally marked as empty
      emptySlots.forEach((slot) => {
        if (unlockedSlots.includes(slot)) {
          setItemInLoadout(slot as keyof Loadout, null);
        }
      });

      // Now update all slots at once after animation has played
      Object.entries(newItems).forEach(([slot, item]) => {
        setItemInLoadout(slot as keyof Loadout, item);
      });
      
      // End the generating state after a short delay
      setTimeout(() => {
        setCustomIsGenerating(false);
      }, 200);
    }, 800);
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
          onSlotClick={(slot) => toggleLoadoutLock(slot)}
          isGenerating={customIsGenerating}
          lockState={loadoutLockState}
          onLockToggle={toggleLoadoutLock}
        />
        <div className="mt-3 pt-3 border-t border-[#555]">
          <p className="text-xs text-gray-400">
            Click on a Slot to lock/unlock it.
          </p>
        </div>
      </div>

      {/* Randomize Button */}
      <div className="flex justify-center">
        <button
          className="px-6 py-3 cursor-pointer hover:bg-[#ddaf7ada] bg-[#ddaf7aa6] text-white font-bold rounded-md transition-colors"
          onClick={() => {
            generateRandomLoadoutWithLocks();
            generateRandomBeadLoadout();
          }}
          disabled={customIsGenerating}
        >
          {customIsGenerating ? 'Generating...' : 'Generate New Loadout'}
        </button>
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
                const slotKey = `slot${index + 1}` as keyof BeadLockState;
                
                return (
                  <BeadSlot
                    key={index}
                    bead={bead}
                    slotIndex={index}
                    onClick={() => toggleBeadLock(slotKey)}
                    isGenerating={customIsGenerating}
                    isLocked={beadLockState[slotKey]}
                    onLockToggle={() => toggleBeadLock(slotKey)}
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
        )}
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
      <div className="relative bg-[#292929] rounded-lg p-6 transition-colors border border-[#818181] overflow-hidden">
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
        <div className="flex overflow-x-auto pb-2">
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

export default function RandomizerPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 text-sm">Loading...</div>}>
      <RandomizerPageContent />
    </Suspense>
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
