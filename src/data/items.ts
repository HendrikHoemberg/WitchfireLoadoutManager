import { BaseItem, Weapon } from '@/types';


// Weapons
export const weapons: Weapon[] = [
  {
    id: 'w001',
    name: 'Flintlock Pistol',
    category: 'Weapons',
    iconUrl: '/images/weapons/flintlock-pistol.png',
    element: null,
    damage: 80,
    stunPower: 'Medium',
    hipfireRange: 15,
    adsRange: 25,
    stability: 'High',
    rateOfFire: 3,
    mobility: 'High',
    clipSize: 1,
    ammoReserves: 24,
    mysterium1: {
      effect: 'Increased damage at close range',
      charismata: null,
      requirements: [
        'Kill 50 enemies with this weapon'
      ]
    },
    mysterium2: {
      effect: 'Critical hits cause enemies to stagger',
      charismata: null,
      requirements: [
        'Get 25 critical hits with this weapon'
      ]
    },
    mysterium3: {
      effect: 'Final shot in clip deals 50% more damage',
      charismata: null,
      requirements: [
        'Kill 10 elite enemies with this weapon'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w002',
    name: 'Blunderbuss',
    category: 'Weapons',
    iconUrl: '/images/weapons/blunderbuss.png',
    element: 'Fire',
    damage: 120,
    stunPower: 'High',
    hipfireRange: 12,
    adsRange: 12,
    stability: 'Low',
    rateOfFire: 0.8,
    mobility: 'Medium',
    clipSize: 1,
    ammoReserves: 18,
    mysterium1: {
      effect: 'Shots ignite enemies, dealing fire damage over time',
      charismata: null,
      requirements: [
        'Kill 40 enemies with this weapon'
      ]
    },
    mysterium2: {
      effect: 'Increased pellet count',
      charismata: null,
      requirements: [
        'Kill 3 enemies with a single shot 10 times'
      ]
    },
    mysterium3: {
      effect: 'Killing an enemy causes them to explode, dealing fire damage to nearby enemies',
      charismata: null,
      requirements: [
        'Kill 15 elite enemies with this weapon'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w003',
    name: 'Repeater Rifle',
    category: 'Weapons',
    iconUrl: '/images/weapons/repeater-rifle.png',
    element: null,
    damage: 65,
    stunPower: 'Medium',
    hipfireRange: 30,
    adsRange: 50,
    stability: 'Medium',
    rateOfFire: 2.5,
    mobility: 'Medium',
    clipSize: 8,
    ammoReserves: 48,
    mysterium1: {
      effect: 'Increased headshot damage',
      charismata: null,
      requirements: [
        'Get 30 headshots with this weapon'
      ]
    },
    mysterium2: {
      effect: 'Each consecutive hit on the same target increases damage',
      charismata: null,
      requirements: [
        'Hit the same enemy 5 times in a row without missing 15 times'
      ]
    },
    mysterium3: {
      effect: 'Killing an enemy instantly reloads 2 bullets into the magazine',
      charismata: null,
      requirements: [
        'Get 50 kills without reloading'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// LightSpells
export const lightSpells: BaseItem[] = [
  {
    id: 'ls001',
    name: 'Firebolt',
    category: 'LightSpells',
    iconUrl: '/images/spells/firebolt.png',
    element: 'Fire',
    mysterium1: {
      charismata: [
        'Deals fire damage',
        'Medium range'
      ],
      requirements: [
        'Cast this spell 30 times'
      ]
    },
    mysterium2: {
      charismata: [
        'Increased damage',
        'Chance to ignite enemies'
      ],
      requirements: [
        'Kill 25 enemies with this spell'
      ]
    },
    mysterium3: {
      charismata: [
        'Splits into 3 smaller projectiles on impact'
      ],
      requirements: [
        'Kill 3 enemies with a single cast 5 times'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  },
  {
    id: 'ls002',
    name: 'Frost Spike',
    category: 'LightSpells',
    iconUrl: '/images/spells/frost-spike.png',
    element: 'Ice',
    mysterium1: {
      charismata: [
        'Deals ice damage',
        'Slows enemies'
      ],
      requirements: [
        'Cast this spell 30 times'
      ]
    },
    mysterium2: {
      charismata: [
        'Increased slow effect',
        'Chance to freeze weaker enemies'
      ],
      requirements: [
        'Slow 50 enemies with this spell'
      ]
    },
    mysterium3: {
      charismata: [
        'Frozen enemies shatter when killed, damaging nearby enemies'
      ],
      requirements: [
        'Freeze 25 enemies with this spell'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// HeavySpells
export const heavySpells: BaseItem[] = [
  {
    id: 'hs001',
    name: 'Lightning Storm',
    category: 'HeavySpells',
    iconUrl: '/images/spells/lightning-storm.png',
    element: 'Lightning',
    mysterium1: {
      charismata: [
        'Summons lightning strikes in target area',
        'Deals lightning damage'
      ],
      requirements: [
        'Cast this spell 20 times'
      ]
    },
    mysterium2: {
      charismata: [
        'Increased area of effect',
        'Lightning strikes more frequently'
      ],
      requirements: [
        'Kill 30 enemies with this spell'
      ]
    },
    mysterium3: {
      charismata: [
        'Lightning chains between enemies',
        'Stunned enemies take increased damage'
      ],
      requirements: [
        'Kill 5 enemies with a single cast 3 times'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  },
  {
    id: 'hs002',
    name: 'Decay Nova',
    category: 'HeavySpells',
    iconUrl: '/images/spells/decay-nova.png',
    element: 'Decay',
    mysterium1: {
      charismata: [
        'Releases a wave of decay energy',
        'Deals decay damage over time'
      ],
      requirements: [
        'Cast this spell 20 times'
      ]
    },
    mysterium2: {
      charismata: [
        'Increased radius',
        'Enemies affected by decay take more damage from all sources'
      ],
      requirements: [
        'Kill 30 enemies with this spell'
      ]
    },
    mysterium3: {
      charismata: [
        'Healing received from all sources increased while active',
        'Enemies killed by decay explode'
      ],
      requirements: [
        'Have 5 enemies affected by decay simultaneously 10 times'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// Relics
export const relics: BaseItem[] = [
  {
    id: 'r001',
    name: 'Ember Heart',
    category: 'Relics',
    iconUrl: '/images/relics/ember-heart.png',
    element: 'Fire',
    mysterium1: {
      charismata: [
        'Increases fire damage by 15%',
        'Reduces fire damage taken by 10%'
      ],
      requirements: [
        'Deal 1000 fire damage'
      ]
    },
    mysterium2: {
      charismata: [
        'Killing enemies with fire damage restores health',
        'Further increases fire damage by 10%'
      ],
      requirements: [
        'Kill 50 enemies with fire damage'
      ]
    },
    mysterium3: {
      charismata: [
        'Creates a fire explosion around you when health drops below 25%',
        'Cooldown: 60 seconds'
      ],
      requirements: [
        'Survive with less than 25% health for a cumulative 5 minutes'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  },
  {
    id: 'r002',
    name: 'Frost Anchor',
    category: 'Relics',
    iconUrl: '/images/relics/frost-anchor.png',
    element: 'Ice',
    mysterium1: {
      charismata: [
        'Increases ice damage by 15%',
        'Enemies you damage have 20% chance to be slowed'
      ],
      requirements: [
        'Deal 1000 ice damage'
      ]
    },
    mysterium2: {
      charismata: [
        'Creates a frost barrier when taking damage that reduces incoming damage by 30% for 5 seconds',
        'Cooldown: 30 seconds'
      ],
      requirements: [
        'Take damage 100 times'
      ]
    },
    mysterium3: {
      charismata: [
        'Frozen enemies have a 50% chance to drop additional resources when killed'
      ],
      requirements: [
        'Freeze 30 enemies'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// Fetishes
export const fetishes: BaseItem[] = [
  {
    id: 'f001',
    name: 'Thunderstone',
    category: 'Fetishes',
    iconUrl: '/images/fetishes/thunderstone.png',
    element: 'Lightning',
    mysterium1: {
      charismata: [
        'Increases lightning damage by 15%',
        'Lightning spells have 10% reduced cooldown'
      ],
      requirements: [
        'Cast 30 lightning spells'
      ]
    },
    mysterium2: {
      charismata: [
        'Critical hits have a 25% chance to call down a lightning strike on the target'
      ],
      requirements: [
        'Get 50 critical hits'
      ]
    },
    mysterium3: {
      charismata: [
        'When your health drops below 30%, you emit a lightning nova that stuns nearby enemies',
        'Cooldown: 45 seconds'
      ],
      requirements: [
        'Kill 20 enemies while below 30% health'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  },
  {
    id: 'f002',
    name: 'Plague Idol',
    category: 'Fetishes',
    iconUrl: '/images/fetishes/plague-idol.png',
    element: 'Decay',
    mysterium1: {
      charismata: [
        'Increases decay damage by 15%',
        'Decay effects last 20% longer'
      ],
      requirements: [
        'Deal 1000 decay damage'
      ]
    },
    mysterium2: {
      charismata: [
        'Enemies affected by decay take 10% more damage from all sources',
        'Killing enemies affected by decay has a 20% chance to spread decay to nearby enemies'
      ],
      requirements: [
        'Kill 40 enemies affected by decay'
      ]
    },
    mysterium3: {
      charismata: [
        'When you take damage, you release a cloud of decay that damages enemies over time',
        'Cooldown: 20 seconds'
      ],
      requirements: [
        'Take damage from 50 different enemy attacks'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// Rings
export const rings: BaseItem[] = [
  {
    id: 'rg001',
    name: 'Band of Embers',
    category: 'Rings',
    iconUrl: '/images/rings/band-of-embers.png',
    element: 'Fire',
    mysterium1: {
      charismata: [
        'Weapon attacks have a 10% chance to ignite enemies',
        'Ignited enemies take 5 fire damage per second for 5 seconds'
      ],
      requirements: [
        'Kill 30 enemies with weapons'
      ]
    },
    mysterium2: {
      charismata: [
        'Ignited enemies have a 15% chance to spread fire to nearby enemies when killed'
      ],
      requirements: [
        'Kill 25 ignited enemies'
      ]
    },
    mysterium3: {
      charismata: [
        'Killing 3 ignited enemies in quick succession creates a fire explosion',
        'Fire explosion deals 50 fire damage to nearby enemies'
      ],
      requirements: [
        'Kill 3 ignited enemies within 5 seconds 10 times'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  },
  {
    id: 'rg002',
    name: 'Signet of Frost',
    category: 'Rings',
    iconUrl: '/images/rings/signet-of-frost.png',
    element: 'Ice',
    mysterium1: {
      charismata: [
        'Critical hits have a 20% chance to slow enemies',
        'Slowed enemies move and attack 30% slower for 3 seconds'
      ],
      requirements: [
        'Get 50 critical hits'
      ]
    },
    mysterium2: {
      charismata: [
        'Slowed enemies take 15% more damage from all sources'
      ],
      requirements: [
        'Deal 1000 damage to slowed enemies'
      ]
    },
    mysterium3: {
      charismata: [
        'Killing a slowed enemy creates a frost nova that slows nearby enemies',
        'Enemies already slowed by this effect have a 25% chance to be frozen for 2 seconds'
      ],
      requirements: [
        'Kill 30 slowed enemies'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// DemonicWeapons
export const demonicWeapons: BaseItem[] = [
  {
    id: 'dw001',
    name: 'Hellfire Blade',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/hellfire-blade.png',
    element: 'Fire',
    mysterium1: {
      charismata: [
        'Deals fire damage on hit',
        'Ignites enemies with a 20% chance'
      ],
      requirements: [
        'Use this weapon 30 times'
      ]
    },
    mysterium2: {
      charismata: [
        'Increased fire damage',
        'Burning enemies take 15% more damage from all sources'
      ],
      requirements: [
        'Kill 25 enemies with this weapon'
      ]
    },
    mysterium3: {
      charismata: [
        'Killing a burning enemy creates a fire explosion',
        'Explosion deals 40 fire damage to nearby enemies'
      ],
      requirements: [
        'Kill 3 burning enemies in quick succession 5 times'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  },
  {
    id: 'dw002',
    name: 'Soul Reaper',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/soul-reaper.png',
    element: 'Decay',
    mysterium1: {
      charismata: [
        'Deals decay damage',
        'Heals the user for 5% of damage dealt'
      ],
      requirements: [
        'Use this weapon 30 times'
      ]
    },
    mysterium2: {
      charismata: [
        'Increased decay damage',
        'Healing increased to 10% of damage dealt'
      ],
      requirements: [
        'Kill 25 enemies with this weapon'
      ]
    },
    mysterium3: {
      charismata: [
        'Killing an enemy grants a soul fragment',
        'Collecting 3 soul fragments grants 50% increased damage for 10 seconds'
      ],
      requirements: [
        'Kill 50 enemies with this weapon'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-04-01'
  }
];


// Export all items in a single array
export const allItems: BaseItem[] = [
  ...weapons,
  ...demonicWeapons,
  ...lightSpells,
  ...heavySpells,
  ...relics,
  ...fetishes,
  ...rings
];

// Helper function to get items by category
export const getItemsByCategory = (category: string): BaseItem[] => {
  switch (category) {
    case 'Weapons':
      return weapons;
    case 'DemonicWeapons':
      return demonicWeapons;
    case 'LightSpells':
      return lightSpells;
    case 'HeavySpells':
      return heavySpells;
    case 'Relics':
      return relics;
    case 'Fetishes':
      return fetishes;
    case 'Rings':
      return rings;
    default:
      return [];
  }
};

// Helper function to get item by ID
export const getItemById = (id: string): BaseItem | undefined => {
  return allItems.find(item => item.id === id);
};
