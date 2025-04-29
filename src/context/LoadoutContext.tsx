"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { BaseItem, Loadout, Element, RandomizerSettings } from '@/types';
import { allItems, getItemsByCategory } from '@/data/items';

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

  // Generate a random loadout based on current settings
  const generateRandomLoadout = useCallback(() => {
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
    
    // Secondary weapon also gets items from Weapons category
    // We'll handle this separately

    // For each category, select a random item
    Object.entries(categoryToSlot).forEach(([category, slot]) => {
      // Get all items in this category
      let availableItems = getItemsByCategory(category);
      
      // Filter out excluded items
      if (randomizerSettings.excludedItems.length > 0) {
        availableItems = availableItems.filter(
          item => !randomizerSettings.excludedItems.includes(item.id)
        );
      }
      
      // Check if we have enough items to randomize
      if (availableItems.length < 2) {
        // Not enough items to randomize, skip this category
        return;
      }
      
      // If preferred elements are specified, prioritize items with those elements
      if (randomizerSettings.preferredElements.length > 0) {
        const itemsWithPreferredElements = availableItems.filter(
          item => item.element !== null && randomizerSettings.preferredElements.includes(item.element)
        );
        
        // If we have items with preferred elements, use those
        if (itemsWithPreferredElements.length > 0) {
          const randomIndex = Math.floor(Math.random() * itemsWithPreferredElements.length);
          newLoadout[slot] = itemsWithPreferredElements[randomIndex];
          return;
        }
      }
      
      // Otherwise, select a random item from all available items
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      newLoadout[slot] = availableItems[randomIndex];
    });
    
    // Handle secondary weapon separately (also from Weapons category)
    // Get all weapons
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
      // If preferred elements are specified, prioritize items with those elements
      if (randomizerSettings.preferredElements.length > 0) {
        const weaponsWithPreferredElements = availableWeapons.filter(
          item => item.element !== null && randomizerSettings.preferredElements.includes(item.element)
        );
        
        // If we have items with preferred elements, use those
        if (weaponsWithPreferredElements.length > 0) {
          const randomIndex = Math.floor(Math.random() * weaponsWithPreferredElements.length);
          newLoadout.secondaryWeapon = weaponsWithPreferredElements[randomIndex];
        } else {
          // Otherwise, select a random weapon
          const randomIndex = Math.floor(Math.random() * availableWeapons.length);
          newLoadout.secondaryWeapon = availableWeapons[randomIndex];
        }
      } else {
        // No element preference, select a random weapon
        const randomIndex = Math.floor(Math.random() * availableWeapons.length);
        newLoadout.secondaryWeapon = availableWeapons[randomIndex];
      }
    }
    
    setLoadout(newLoadout);
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
