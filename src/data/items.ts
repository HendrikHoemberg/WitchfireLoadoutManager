import { BaseItem, Weapon } from '@/types';


// Weapons
export const weapons: Weapon[] = [
  {
    id: 'w001',
    name: 'Cricket',
    category: 'Weapons',
    iconUrl: '/images/weapons/Cricket.png',
    element: null,
    damage: 17,
    stunPower: 'very low',
    hipfireRange: 9,
    adsRange: 9.9,
    stability: 'low',
    rateOfFire: 10,
    mobility: 'very high',
    clipSize: 20,
    ammoReserves: 340,
    mysterium1: {
      effect: 'More potent regenerating witchfire essence from killed enemies',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Dashing right after the kill reloads the firearm.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 60  '
      ]
    },
    mysterium3: {
      effect: 'Dashing right after the kill temporarily boosts the firearms damage. Consecutive kills and dashes increase the damage boost.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 80'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w002',
    name: 'Echo',
    category: 'Weapons',
    iconUrl: '/images/weapons/Echo.png',
    element: 'Fire',
    damage: 111,
    stunPower: 'average',
    hipfireRange: 7,
    adsRange: 7.7,
    stability: 'low',
    rateOfFire: 1.7,
    mobility: 'very high',
    clipSize: 6,
    ammoReserves: 42,
    mysterium1: {
      effect: 'Pellets have a delayed explosion that applies Burn. Lethal shots push enemies back with great force.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Lethal pellet explosion has more range and applies Burn to nearby enemies.',
      charismata: null,
      requirements: [
        'Enemies killed: 70 | 1st Mysterium actions: 80'
      ]
    },
    mysterium3: {
      effect: 'Sliding reloads two shells and temporarily doubles the damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 120 | 2nd Mysterium actions: 100'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w003',
    name: 'Psychopomp',
    category: 'Weapons',
    iconUrl: '/images/weapons/Psychopomp.png',
    element: null,
    damage: 80,
    stunPower: 'low',
    hipfireRange: 9,
    adsRange: 9,
    stability: 'very low',
    rateOfFire: 4.3,
    mobility: 'very high',
    clipSize: 10,
    ammoReserves: 44,
    mysterium1: {
      effect: 'Kills with a charged melee regenerate up to half a magazine.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Consecutive shots at the same target deal increased damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 60 | 1st Mysterium actions: 40'
      ]
    },
    mysterium3: {
      effect: 'Kills recharge the melee attack.',
      charismata: null,
      requirements: [
        'Enemies killed: 120 | 2nd Mysterium actions: 240 '
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w004',
    name: 'Rotweaver',
    category: 'Weapons',
    iconUrl: '/images/weapons/Rotweaver.png',
    element: 'Decay',
    damage: 8,
    stunPower: 'low',
    hipfireRange: 10,
    adsRange: 11,
    stability: 'low',
    rateOfFire: 15.2,
    mobility: 'very high',
    clipSize: 60,
    ammoReserves: 480,
    mysterium1: {
      effect: 'Shots apply decay. The longer the burst, the more powerful the curse. The effect wanes when the gun is not in use.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'When an enemy dies from decay, a few bullets are regenerated in the magazine.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'After a few seconds, cysts form on decaying enemies. When shot, these cysts explode, spreading decay to nearby enemies.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w005',
    name: 'Judgement',
    category: 'Weapons',
    iconUrl: '/images/weapons/Judgement.png',
    element: 'Decay',
    damage: 140,
    stunPower: 'High',
    hipfireRange: 7,
    adsRange: 7.7,
    stability: 'low',
    rateOfFire: 1,
    mobility: 'very low',
    clipSize: 6,
    ammoReserves: 30,
    mysterium1: {
      effect: 'Aiming down sights fires a slow-moving, long-range projectile.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Shots can be charged to increase power and projectile speed.',
      charismata: null,
      requirements: [
        'Enemies killed: 75 | 1st Mysterium actions: 40'
      ]
    },
    mysterium3: {
      effect: 'Enemies surviving a shot with low health begin to Decay.',
      charismata: null,
      requirements: [
        'Enemies killed: 120 | 2nd Mysterium actions: 60'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w006',
    name: 'Midas',
    category: 'Weapons',
    iconUrl: '/images/weapons/Midas.png',
    element: 'Fire',
    damage: 9,
    stunPower: 'very low',
    hipfireRange: 17,
    adsRange: 25.5,
    stability: 'average',
    rateOfFire: 11.1,
    mobility: 'medium',
    clipSize: 60,
    ammoReserves: 490,
    mysterium1: {
      effect: 'Continuous fire heats up the weapon. Bullets deal more damage when Heated and less when Overheated.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Overheated bullets apply Burn to enemies.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 75'
      ]
    },
    mysterium3: {
      effect: 'Reloading while Overheated damages Burning enemies. Very fast reload when the gun is Overheated.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 50'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w007',
    name: 'Ricochet',
    category: 'Weapons',
    iconUrl: '/images/weapons/Ricochet.png',
    element: 'Lightning',
    damage: 16,
    stunPower: 'High',
    hipfireRange: 20,
    adsRange: 26.6,
    stability: 'average',
    rateOfFire: 6.7,
    mobility: 'medium',
    clipSize: 30,
    ammoReserves: 270,
    mysterium1: {
      effect: 'Up to three enemies can be tagged while aiming down sights. Shooting one ricochets the bullet to the others. The link breaks on reload or when all targets die.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'The first shot on a tagged enemy deals massively increased stun damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 75 | 1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'A powerful lightning each time an enemy is hit with seven ricocheted bullets.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 2nd Mysterium actions: 50'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w008',
    name: 'Angelus',
    category: 'Weapons',
    iconUrl: '/images/weapons/Angelus.png',
    element: null,
    damage: 13,
    stunPower: 'average',
    hipfireRange: 18,
    adsRange: 21.6,
    stability: 'low',
    rateOfFire: 8.3,
    mobility: 'medium',
    clipSize: 70,
    ammoReserves: 560,
    mysterium1: {
      effect: 'Aiming down sights conjures ethereal shield wings.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Successful blocks briefly grant reduced fire rate with massively increased damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 75 | 1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Last-moment blocking reduces shield cooldown and stuns melee attackers.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 2nd Mysterium actions: 35'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w009',
    name: 'Hangfire',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hangfire.png',
    element: 'Fire',
    damage: 35,
    stunPower: 'average',
    hipfireRange: 15,
    adsRange: 19.5,
    stability: 'low',
    rateOfFire: 0.9,
    mobility: 'very high',
    clipSize: 6,
    ammoReserves: 84,
    mysterium1: {
      effect: 'Bullets lodge into enemies or the environment and explode on reload.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'The more enemies with lodged bullets, the bigger the damage of each bullet explosion.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'Bullet explosions Burn enemies. Bullets lodged in the environment have significantly increased explosion range.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w010',
    name: 'Hunger',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hunger.png',
    element: 'Ice',
    damage: 38,
    stunPower: 'very high',
    hipfireRange: 15,
    adsRange: 21,
    stability: 'low',
    rateOfFire: 2.8,
    mobility: 'very high',
    clipSize: 6,
    ammoReserves: 84,
    mysterium1: {
      effect: 'Reloading grants one Charged Bullet for each Critical Hit before the reload. Charged Bullets deal increased damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'The more Critical Hits before reload, the more powerful each Charged Bullet after.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'The first body shot after reload counts as Critical Hit. Reloading grants Freeze for the first bullet if every shot was a Critical Hit.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w011',
    name: 'Duelist',
    category: 'Weapons',
    iconUrl: '/images/weapons/Duelist.png',
    element: 'Fire',
    damage: 25,
    stunPower: 'very high',
    hipfireRange: 16,
    adsRange: 19.2,
    stability: 'high',
    rateOfFire: 4.2,
    mobility: 'very low',
    clipSize: 12,
    ammoReserves: 192,
    mysterium1: {
      effect: 'After any kill, a duel can be initiated by shooting an enemy while aiming down sights. Landing a critical hit right after the mark empowers the gun temporarily. Dueling is disabled while empowered.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Duel victory also reloads the gun, adds Burn to bullets and quickens the reload while the empowerement lasts.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Killing enemies extends the empowerement duration.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 40'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w012',
    name: 'Striga',
    category: 'Weapons',
    iconUrl: '/images/weapons/Striga.png',
    element: 'Fire',
    damage: 80,
    stunPower: 'high',
    hipfireRange: 30,
    adsRange: 30,
    stability: 'high',
    rateOfFire: 0.7,
    mobility: 'very high',
    clipSize: 7,
    ammoReserves: 83,
    mysterium1: {
      effect: 'Stakes ignite mid-flight, Burning the target upon impact.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Ignited stakes hit with a fiery explosion that Burns all nearby foes.',
      charismata: null,
      requirements: [
        'Enemies killed: 50 | 1st Mysterium actions: 20'
      ]
    },
    mysterium3: {
      effect: 'Critical hits Shock all nearby foes.',
      charismata: null,
      requirements: [
        'Enemies killed: 100| 2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w013',
    name: 'All-seeing Eye',
    category: 'Weapons',
    iconUrl: '/images/weapons/AllSeeingEye.png',
    element: 'Decay',
    damage: 38,
    stunPower: 'low',
    hipfireRange: 18,
    adsRange: 32.4,
    stability: 'high',
    rateOfFire: 0.8,
    mobility: 'low',
    clipSize: 5,
    ammoReserves: 95,
    mysterium1: {
      effect: 'Increased damage against enemies with more than 75 % HP.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Critical Hits trigger radial shockwave, damaging all enemies inside the shockwaves circle.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 75'
      ]
    },
    mysterium3: {
      effect: 'If Critical Hits deal increased damage, the shockwave also applies Decay.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 100'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w014',
    name: 'Basilisk',
    category: 'Weapons',
    iconUrl: '/images/weapons/Basilisk.png',
    element: 'Fire',
    damage: 60,
    stunPower: 'average',
    hipfireRange: 20,
    adsRange: 36,
    stability: 'high',
    rateOfFire: 1.1,
    mobility: 'low',
    clipSize: 10,
    ammoReserves: 50,
    mysterium1: {
      effect: 'Critical hits ignite the scope for a few seconds, causing enemies viewed through the fiery scope to burn.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Shooting a burning enemy extends the burn duration.',
      charismata: null,
      requirements: [
        'Enemies killed: 50 | 1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Killing a burning enemy with a critical hit triggers an enhanced fiery scope that continuously damages enemies.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 2nd Mysterium actions: 100'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w015',
    name: 'Hypnosis',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hypnosis.png',
    element: 'Lightning',
    damage: 40,
    stunPower: 'average',
    hipfireRange: 20,
    adsRange: 36,
    stability: 'low',
    rateOfFire: 0.9,
    mobility: 'medium',
    clipSize: 10,
    ammoReserves: 70,
    mysterium1: {
      effect: 'Aiming down sights slowly charges the bullet with bonus damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Increased damage is weighted towards the end of the time window. A shot perfectly timed at the end of it inflicts even more damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 1st Mysterium actions: 80'
      ]
    },
    mysterium3: {
      effect: 'After the third Perfect Shot in a row, Perfect Shots deal Lightning damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 190 | 2nd Mysterium actions: 120'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w016',
    name: 'Frostbite',
    category: 'Weapons',
    iconUrl: '/images/weapons/Frostbite.png',
    element: 'Ice',
    damage: 77,
    stunPower: 'high',
    hipfireRange: 26,
    adsRange: 46.8,
    stability: 'low',
    rateOfFire: 0.8,
    mobility: 'medium',
    clipSize: 6,
    ammoReserves: 74,
    mysterium1: {
      effect: 'Well-timed secondary reload boosts damage for three shots.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Perect Reload adds Freeze, duration scales with shots fired before reloading. Chaining Perfect Reload further boosts Mysterium I damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 75 | 1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Three consecutive perfect reloads empower next shot with double damage and Freezing trail.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 2nd Mysterium actions: 50'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'w017',
    name: 'Hailstorm',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hailstorm.png',
    element: 'Ice',
    damage: 160,
    stunPower: 'average',
    hipfireRange: 15,
    adsRange: 67.5,
    stability: 'very low',
    rateOfFire: 0.8,
    mobility: 'very low',
    clipSize: 5,
    ammoReserves: 20,
    mysterium1: {
      effect: 'Every third consecutive Critical Hit recharges the magazine with two extra bullets.',
      charismata: null,
      requirements: [
        'Enemies killed: 25'
      ]
    },
    mysterium2: {
      effect: 'Consecutive Critical Hits decrease zoom and flinch and increase handling and bullet bending. Mistakes or reloading reset the buff.',
      charismata: null,
      requirements: [
        'Enemies killed: 50 | 1st Mysterium actions: 20'
      ]
    },
    mysterium3: {
      effect: 'Every third consecutive Critical Hit makes the target explode with a Freezing shockwave.',
      charismata: null,
      requirements: [
        'Enemies killed: 100 | 2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  }
];


// LightSpells
export const lightSpells: BaseItem[] = [
  {
    id: 'ls001',
    name: 'Blight Cyst',
    category: 'LightSpells',
    iconUrl: '/images/spells/BlightCyst.png',
    element: 'Decay',
    mysterium1: {
      charismata: [
        'Auto-explosion range: 8 m',
        'Forced explosion range: 12 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'The Cyst grows even bigger, allowing for easier targeting'
      ],
      requirements: [
        'Enemies hexed: 70'
      ]
    },
    mysterium3: {
      charismata: [
        'Chance to regrow if attaching to an enemy: 50 %'
      ],
      requirements: [
        'Enemies hexed: 150'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-02'
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
    name: 'Vulture',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/Vulture.png',
    element: null,
    damage: 200,
    stunPower: 'High',
    hipfireRange: 20,
    adsRange: 24,
    stability: 'high',
    rateOfFire: 0.5,
    mobility: 'medium',
    clipSize: 5,
    ammoReserves: 10,
    mysterium1: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    mysterium3: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'dw002',
    name: 'Falling Star',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/FallingStar.png',
    element: null,
    damage: 250,
    stunPower: 'average',
    hipfireRange: 30,
    adsRange: 30,
    stability: 'average',
    rateOfFire: 1,
    mobility: 'low',
    clipSize: 6,
    ammoReserves: 14,
    mysterium1: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    mysterium3: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
  },
  {
    id: 'dw003',
    name: 'Whisper',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/Whisper.png',
    element: null,
    damage: 220,
    stunPower: 'very high',
    hipfireRange: 20,
    adsRange: 20,
    stability: 'very low',
    rateOfFire: 2,
    mobility: 'very high',
    clipSize: 3,
    ammoReserves: 17,
    mysterium1: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    mysterium3: {
      effect: '-',
      charismata: null,
      requirements: [
        '-'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-02'
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
