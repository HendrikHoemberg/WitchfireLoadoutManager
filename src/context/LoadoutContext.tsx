"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { BaseItem, Loadout, Element, RandomizerSettings } from '@/types';
import { getItemsByCategory } from '@/data/items';

interface LoadoutContextType {
  // Current loadout state
  loadout: Loadout;
  setItemInLoadout: (slot: keyof Loadout, item: BaseItem | null) => void;
  clearLoadout: () => void;
  
  // Randomizer settings
  randomizerSettings: RandomizerSettings;
  setPreferredElements: (elements: Element[]) => void;
  toggleExcludedItem: (itemId: string) => void;
  clearExcludedItems: () => void;
  
  // Randomizer functions
  generateRandomLoadout: () => void;
  isGenerating: boolean;
  
  // Helper functions
  getActiveElements: () => Element[];
}

const defaultLoadout: Loadout = {
  primaryWeapon: null,
  secondaryWeapon: null,
  demonicWeapon: null,
  lightSpell: null,
  heavySpell: null,
  relic: null,
  fetish: null,
  ring: null
};

const defaultRandomizerSettings: RandomizerSettings = {
  preferredElements: [],
  excludedItems: []
};

const LoadoutContext = createContext<LoadoutContextType | undefined>(undefined);

export function LoadoutProvider({ children }: { children: ReactNode }) {
  const [loadout, setLoadout] = useState<Loadout>(defaultLoadout);
  const [randomizerSettings, setRandomizerSettings] = useState<RandomizerSettings>(defaultRandomizerSettings);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Set a specific item in the loadout
  const setItemInLoadout = useCallback((slot: keyof Loadout, item: BaseItem | null) => {
    setLoadout(prev => ({
      ...prev,
      [slot]: item
    }));
  }, []);

  // Clear the entire loadout
  const clearLoadout = useCallback(() => {
    setLoadout(defaultLoadout);
  }, []);

  // Set preferred elements for randomization
  const setPreferredElements = useCallback((elements: Element[]) => {
    setRandomizerSettings(prev => ({
      ...prev,
      preferredElements: elements
    }));
  }, []);

  // Toggle an item in the excluded items list
  const toggleExcludedItem = useCallback((itemId: string) => {
    setRandomizerSettings(prev => {
      const isExcluded = prev.excludedItems.includes(itemId);
      return {
        ...prev,
        excludedItems: isExcluded
          ? prev.excludedItems.filter(id => id !== itemId)
          : [...prev.excludedItems, itemId]
      };
    });
  }, []);

  // Clear all excluded items
  const clearExcludedItems = useCallback(() => {
    setRandomizerSettings(prev => ({
      ...prev,
      excludedItems: []
    }));
  }, []);

  // Get all active elements in the current loadout
  const getActiveElements = useCallback((): Element[] => {
    const elements = Object.values(loadout)
      .filter((item): item is BaseItem => item !== null)
      .map(item => item.element)
      .filter((element): element is Exclude<Element, null> => element !== null);
    
    return Array.from(new Set(elements));
  }, [loadout]);

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Generate a random loadout based on current settings
  const generateRandomLoadout = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newLoadout: Loadout = {
        primaryWeapon: null,
        secondaryWeapon: null,
        demonicWeapon: null,
        lightSpell: null,
        heavySpell: null,
        relic: null,
        fetish: null,
        ring: null
      };

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
      
      // Keep track of preferred elements that haven't been included yet
      const elementsToInclude = [...randomizerSettings.preferredElements].filter(e => e !== null);
      const assignedSlots: (keyof Loadout)[] = [];
      
      // First, let's make sure ALL preferred elements are included (Phase 1)
      const allSlots: (keyof Loadout)[] = [
        'primaryWeapon', 'secondaryWeapon', 'demonicWeapon', 
        'lightSpell', 'heavySpell', 'relic', 'fetish', 'ring'
      ];
      
      // Shuffle slots to ensure random distribution
      const shuffledSlots = shuffleArray([...allSlots]);
      
      // Process each slot and try to assign items with preferred elements
      for (const slot of shuffledSlots) {
        // Skip secondary weapon for now, we'll handle it separately
        if (slot === 'secondaryWeapon') continue;
        
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
                newLoadout[slot] = selectedItem;
                
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
            newLoadout[slot] = itemsWithPreferredElements[randomIndex];
            assignedSlots.push(slot);
            continue;
          }
        }
        
        // If we reached here, there are no preferred elements for this slot
        // We'll leave it empty for now and fill it in Phase 2 if we need to
      }
      
      // Handle secondary weapon separately (to avoid duplicating primary)
      if (!assignedSlots.includes('secondaryWeapon')) {
        let availableWeapons = getItemsByCategory('Weapons');
        
        // Filter out excluded items
        if (randomizerSettings.excludedItems.length > 0) {
          availableWeapons = availableWeapons.filter(
            item => !randomizerSettings.excludedItems.includes(item.id)
          );
        }
        
        // Filter out the primary weapon to avoid duplicates
        if (newLoadout.primaryWeapon) {
          availableWeapons = availableWeapons.filter(
            item => item.id !== newLoadout.primaryWeapon?.id
          );
        }
        
        // Check if we have enough items to randomize
        if (availableWeapons.length >= 1) {
          // Prioritize items with any preferred element
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
                  const selectedItem = weaponsWithMissingElements[randomIndex];
                  newLoadout.secondaryWeapon = selectedItem;
                  
                  // Remove this element from our tracking list
                  if (selectedItem.element) {
                    const elementIndex = elementsToInclude.indexOf(selectedItem.element);
                    if (elementIndex !== -1) {
                      elementsToInclude.splice(elementIndex, 1);
                    }
                  }
                  
                  assignedSlots.push('secondaryWeapon');
                } else {
                  // Just pick any weapon with a preferred element
                  const randomIndex = Math.floor(Math.random() * weaponsWithPreferredElements.length);
                  newLoadout.secondaryWeapon = weaponsWithPreferredElements[randomIndex];
                  assignedSlots.push('secondaryWeapon');
                }
              } else {
                // Just pick any weapon with a preferred element
                const randomIndex = Math.floor(Math.random() * weaponsWithPreferredElements.length);
                newLoadout.secondaryWeapon = weaponsWithPreferredElements[randomIndex];
                assignedSlots.push('secondaryWeapon');
              }
            }
          }
        }
      }
      
      // Phase 2: Fill any remaining slots with remaining preferred elements or random items
      const remainingSlots = allSlots.filter(slot => !assignedSlots.includes(slot));
      
      // If we still have preferred elements to include, try to ensure they are included
      if (elementsToInclude.length > 0 && remainingSlots.length > 0) {
        for (const element of elementsToInclude) {
          if (remainingSlots.length === 0) break;
          
          // Get a random slot from remaining slots
          const randomSlotIndex = Math.floor(Math.random() * remainingSlots.length);
          const slot = remainingSlots[randomSlotIndex];
          
          // Get the category for this slot
          const categoryEntry = Object.entries(categoryToSlot)
            .find(entry => entry[1] === slot);
          const category = categoryEntry?.[0];
            
          if (!category) {
            // If we're dealing with secondaryWeapon
            if (slot === 'secondaryWeapon') {
              let availableWeapons = getItemsByCategory('Weapons');
              
              // Filter out excluded items
              if (randomizerSettings.excludedItems.length > 0) {
                availableWeapons = availableWeapons.filter(
                  item => !randomizerSettings.excludedItems.includes(item.id)
                );
              }
              
              // Filter out the primary weapon to avoid duplicates
              if (newLoadout.primaryWeapon) {
                availableWeapons = availableWeapons.filter(
                  item => item.id !== newLoadout.primaryWeapon?.id
                );
              }
              
              // Find weapons with this element
              const weaponsWithElement = availableWeapons.filter(
                item => item.element === element
              );
              
              if (weaponsWithElement.length > 0) {
                const randomIndex = Math.floor(Math.random() * weaponsWithElement.length);
                newLoadout.secondaryWeapon = weaponsWithElement[randomIndex];
                
                // Remove this slot from remaining slots
                remainingSlots.splice(randomSlotIndex, 1);
                continue;
              }
            }
            continue;
          }
          
          // Get items with this specific element
          let itemsWithElement = getItemsByCategory(category)
            .filter(item => item.element === element);
            
          // Filter out excluded items
          if (randomizerSettings.excludedItems.length > 0) {
            itemsWithElement = itemsWithElement.filter(
              item => !randomizerSettings.excludedItems.includes(item.id)
            );
          }
          
          if (itemsWithElement.length > 0) {
            const randomIndex = Math.floor(Math.random() * itemsWithElement.length);
            newLoadout[slot] = itemsWithElement[randomIndex];
            
            // Remove this slot from remaining slots
            remainingSlots.splice(randomSlotIndex, 1);
          }
        }
      }
      
      // Fill remaining slots with random items, still prioritizing preferred elements
      for (const slot of remainingSlots) {
        // Skip secondaryWeapon, we'll handle it specially
        if (slot === 'secondaryWeapon') {
          // Only process secondaryWeapon if it's still null
          if (newLoadout.secondaryWeapon === null) {
            let availableWeapons = getItemsByCategory('Weapons');
            
            // Filter out excluded items
            if (randomizerSettings.excludedItems.length > 0) {
              availableWeapons = availableWeapons.filter(
                item => !randomizerSettings.excludedItems.includes(item.id)
              );
            }
            
            // Filter out the primary weapon to avoid duplicates
            if (newLoadout.primaryWeapon) {
              availableWeapons = availableWeapons.filter(
                item => item.id !== newLoadout.primaryWeapon?.id
              );
            }
            
            if (availableWeapons.length > 0) {
              // Prioritize preferred elements if possible
              if (randomizerSettings.preferredElements.length > 0) {
                const weaponsWithPreferredElements = availableWeapons.filter(
                  item => item.element !== null && randomizerSettings.preferredElements.includes(item.element)
                );
                
                if (weaponsWithPreferredElements.length > 0) {
                  const randomIndex = Math.floor(Math.random() * weaponsWithPreferredElements.length);
                  newLoadout.secondaryWeapon = weaponsWithPreferredElements[randomIndex];
                  continue;
                }
              }
              
              // No preferred elements match, pick any random weapon
              const randomIndex = Math.floor(Math.random() * availableWeapons.length);
              newLoadout.secondaryWeapon = availableWeapons[randomIndex];
            }
          }
          continue;
        }
        
        // Get the category for this slot
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
        
        if (availableItems.length > 0) {
          // Prioritize preferred elements if possible
          if (randomizerSettings.preferredElements.length > 0) {
            const itemsWithPreferredElements = availableItems.filter(
              item => item.element !== null && randomizerSettings.preferredElements.includes(item.element)
            );
            
            if (itemsWithPreferredElements.length > 0) {
              const randomIndex = Math.floor(Math.random() * itemsWithPreferredElements.length);
              newLoadout[slot] = itemsWithPreferredElements[randomIndex];
              continue;
            }
          }
          
          // No preferred elements match, pick a random item
          const randomIndex = Math.floor(Math.random() * availableItems.length);
          newLoadout[slot] = availableItems[randomIndex];
        }
      }
      
      // Set the loadout first
      setLoadout(newLoadout);
      
      // Then set isGenerating to false after a small delay (200ms)
      // This allows the white-fill animation to continue after items appear
      setTimeout(() => {
        setIsGenerating(false);
      }, 200);
      
    }, 800); // 800ms for main animation (reduced from 1000ms)
  }, [randomizerSettings]);

  const value = {
    loadout,
    setItemInLoadout,
    clearLoadout,
    randomizerSettings,
    setPreferredElements,
    toggleExcludedItem,
    clearExcludedItems,
    generateRandomLoadout,
    isGenerating,
    getActiveElements
  };

  return (
    <LoadoutContext.Provider value={value}>
      {children}
    </LoadoutContext.Provider>
  );
}

export function useLoadout() {
  const context = useContext(LoadoutContext);
  if (context === undefined) {
    throw new Error('useLoadout must be used within a LoadoutProvider');
  }
  return context;
}
