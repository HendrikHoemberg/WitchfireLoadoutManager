// Item Categories and Element Types
export type ItemCategory = 'Weapons' | 'DemonicWeapons' | 'LightSpells' | 'HeavySpells' | 'Relics' | 'Fetishes' | 'Rings' | 'Beads';
export type Element = 'Fire' | 'Earth' | 'Water' | 'Air' | null;

// Base Item Structure
export interface BaseItem {
  id: string;
  name: string;
  category: ItemCategory;
  iconUrl: string;
  element: Element;
  description: string;
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
  category: 'Weapons' | 'DemonicWeapons';
  damage: number;
  stunPower: string;
  hipfireRange: number;
  adsRange: number;
  stability: string;
  rateOfFire: number;
  mobility: string;
  clipSize: number;
}

// Bead Requirement Structure
export interface BeadRequirement {
  stat: string;
  value: string; // Always represents an integer as string
}

// Bead-Specific Properties (no mysteriums)
export interface Bead {
  id: string;
  name: string;
  category: 'Beads';
  iconUrl: string;
  description: string;
  requirements: BeadRequirement[]; // Up to two requirements
  // Additional metadata
  addedOn: string; // ISO date
  updatedOn: string; // ISO date
}

// Type guards for item categories
export function isWeapon(item: BaseItem): item is Weapon {
  return item.category === 'Weapons' || item.category === 'DemonicWeapons';
}

export function isBead(item: BaseItem | Bead): item is Bead {
  return item.category === 'Beads';
}

// Loadout Structure
export interface Loadout {
  primaryWeapon: BaseItem | null;
  secondaryWeapon: BaseItem | null;
  demonicWeapon: BaseItem | null;
  lightSpell: BaseItem | null;
  heavySpell: BaseItem | null;
  relic: BaseItem | null;
  fetish: BaseItem | null;
  ring: BaseItem | null;
}

// Bead User Stats for determining availability and slot count
export interface BeadUserStats {
  flesh: number;
  blood: number;
  mind: number;
  witchery: number;
  arsenal: number;
  faith: number;
  gnosis: number; // 1-6, determines slot count (max 5 slots at gnosis 5+)
}

// Bead Loadout Structure (separate from main loadout)
export interface BeadLoadout {
  slot1: Bead | null;
  slot2: Bead | null;
  slot3: Bead | null;
  slot4: Bead | null;
  slot5: Bead | null;
}

// Randomizer Settings
export interface RandomizerSettings {
  preferredElements: Element[];
  excludedItems: string[]; // Array of item IDs
  emptySlotMode: boolean;
}
