// Item Categories and Element Types
export type ItemCategory = 'Weapons' | 'LightSpells' | 'HeavySpells' | 'Relics' | 'Fetishes' | 'Rings';
export type Element = 'Fire' | 'Decay' | 'Ice' | 'Lightning' | null;

// Base Item Structure
export interface BaseItem {
  id: string;
  name: string;
  category: ItemCategory;
  iconUrl: string;
  element: Element;
  mysterium1: {
    charismata: string[] | null; // Array of effects (null for weapons)
    effect?: string; // For weapons only
    requirements: string[];
  };
  mysterium2: {
    charismata: string[] | null;
    effect?: string;
    requirements: string[];
  };
  mysterium3: {
    charismata: string[] | null;
    effect?: string;
    requirements: string[];
  };
  // Additional metadata
  addedOn: string; // ISO date
  updatedOn: string; // ISO date
}

// Weapon-Specific Properties
export interface Weapon extends BaseItem {
  category: 'Weapons';
  damage: number;
  stunPower: string;
  hipfireRange: number;
  adsRange: number;
  stability: string;
  rateOfFire: number;
  mobility: string;
  clipSize: number;
  ammoReserves: number;
}

// Type guards for item categories
export function isWeapon(item: BaseItem): item is Weapon {
  return item.category === 'Weapons';
}

// Loadout Structure
export interface Loadout {
  weapon: BaseItem | null;
  lightSpell: BaseItem | null;
  heavySpell: BaseItem | null;
  relic: BaseItem | null;
  fetish: BaseItem | null;
  ring: BaseItem | null;
}

// Randomizer Settings
export interface RandomizerSettings {
  preferredElements: Element[];
  excludedItems: string[]; // Array of item IDs
}
