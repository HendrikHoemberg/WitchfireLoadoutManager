import { BaseItem, Weapon } from '@/types';


// Weapons
export const weapons: Weapon[] = [
  {
    id: 'w001',
    name: 'Cricket',
    category: 'Weapons',
    iconUrl: '/images/weapons/Cricket.png',
    element: null,
    description: 'Dash after a kill reloads and boosts the gun.',
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
        'Enemies killed: 100  ',
        '1st Mysterium actions: 60'
      ]
    },
    mysterium3: {
      effect: 'Dashing right after the kill temporarily boosts the firearms damage. Consecutive kills and dashes increase the damage boost.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 80'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w002',
    name: 'Echo',
    category: 'Weapons',
    iconUrl: '/images/weapons/Echo.png',
    element: 'Fire',
    description: 'Pellets explode and ignite targets. Uses Stamina.',
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
        'Enemies killed: 70',
        '1st Mysterium actions: 80'
      ]
    },
    mysterium3: {
      effect: 'Sliding reloads two shells and temporarily doubles the damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 120',
        '2nd Mysterium actions: 100'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w003',
    name: 'Psychopomp',
    category: 'Weapons',
    iconUrl: '/images/weapons/Psychopomp.png',
    element: null,
    description: 'Fast firing, regenerates more than ammo. Uses Stamina.',
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
        'Enemies killed: 60',
        '1st Mysterium actions: 40'
      ]
    },
    mysterium3: {
      effect: 'Kills recharge the melee attack.',
      charismata: null,
      requirements: [
        'Enemies killed: 120',
        '2nd Mysterium actions: 240 '
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w004',
    name: 'Rotweaver',
    category: 'Weapons',
    iconUrl: '/images/weapons/Rotweaver.png',
    element: 'Earth',
    description: 'Designed for crowd control, spreads Decay among attacking hordes.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'After a few seconds, cysts form on decaying enemies. When shot, these cysts explode, spreading decay to nearby enemies.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w005',
    name: 'Judgement',
    category: 'Weapons',
    iconUrl: '/images/weapons/Judgement.png',
    element: 'Earth',
    description: 'Hard-hitting weapon with two firing modes. Both can be charged for extra damage.',
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
        'Enemies killed: 75',
        '1st Mysterium actions: 40'
      ]
    },
    mysterium3: {
      effect: 'Enemies surviving a shot with low health begin to Decay.',
      charismata: null,
      requirements: [
        'Enemies killed: 120',
        '2nd Mysterium actions: 60'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w006',
    name: 'Midas',
    category: 'Weapons',
    iconUrl: '/images/weapons/Midas.png',
    element: 'Fire',
    description: 'Heats bullets, boosting damage or igniting enemies.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 75'
      ]
    },
    mysterium3: {
      effect: 'Reloading while Overheated damages Burning enemies. Very fast reload when the gun is Overheated.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 50'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w007',
    name: 'Ricochet',
    category: 'Weapons',
    iconUrl: '/images/weapons/Ricochet.png',
    element: 'Air',
    description: 'Bullets ricochet among marked enemies.',
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
        'Enemies killed: 75',
        '1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'A powerful lightning each time an enemy is hit with seven ricocheted bullets.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 50'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w008',
    name: 'Angelus',
    category: 'Weapons',
    iconUrl: '/images/weapons/Angelus.png',
    element: null,
    description: 'Turns defense into devastating conterattacks.',
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
        'Enemies killed: 75',
        '1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Last-moment blocking reduces shield cooldown and stuns melee attackers.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 35'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w009',
    name: 'Hangfire',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hangfire.png',
    element: 'Fire',
    description: 'Fires slugs that detonate on command with a reload.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'Bullet explosions Burn enemies. Bullets lodged in the environment have significantly increased explosion range.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w010',
    name: 'Hunger',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hunger.png',
    element: 'Water',
    description: 'Rewards perfect aim with increasingly potent bullets.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 50'
      ]
    },
    mysterium3: {
      effect: 'The first body shot after reload counts as Critical Hit. Reloading grants Freeze for the first bullet if every shot was a Critical Hit.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w011',
    name: 'Duelist',
    category: 'Weapons',
    iconUrl: '/images/weapons/Duelist.png',
    element: 'Fire',
    description: 'Rewards duel victory with bullets that ignite enemies.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Killing enemies extends the empowerement duration.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 40'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w012',
    name: 'Striga',
    category: 'Weapons',
    iconUrl: '/images/weapons/Striga.png',
    element: 'Fire',
    description: 'A dual-element stake gun that impales targets or shatters them on impact.',
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
        'Enemies killed: 50',
        '1st Mysterium actions: 20'
      ]
    },
    mysterium3: {
      effect: 'Critical hits Shock all nearby foes.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w013',
    name: 'All-seeing Eye',
    category: 'Weapons',
    iconUrl: '/images/weapons/AllSeeingEye.png',
    element: 'Earth',
    description: 'Critical hits hurt all enemies inside the All-Seeing Eye.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 75'
      ]
    },
    mysterium3: {
      effect: 'If Critical Hits deal increased damage, the shockwave also applies Decay.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 100'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w014',
    name: 'Basilisk',
    category: 'Weapons',
    iconUrl: '/images/weapons/Basilisk.png',
    element: 'Fire',
    description: 'When ignited, the scope burns enemies. Uses Stamina.',
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
        'Enemies killed: 50',
        '1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Killing a burning enemy with a critical hit triggers an enhanced fiery scope that continuously damages enemies.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 100'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w015',
    name: 'Hypnosis',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hypnosis.png',
    element: 'Air',
    description: 'Rewards a patient marksman with increased damage.',
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
        'Enemies killed: 100',
        '1st Mysterium actions: 80'
      ]
    },
    mysterium3: {
      effect: 'After the third Perfect Shot in a row, Perfect Shots deal Lightning damage.',
      charismata: null,
      requirements: [
        'Enemies killed: 190',
        '2nd Mysterium actions: 120'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w016',
    name: 'Frostbite',
    category: 'Weapons',
    iconUrl: '/images/weapons/Frostbite.png',
    element: 'Water',
    description: 'Perfect reloading rythm imbues shots with freezing power.',
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
        'Enemies killed: 75',
        '1st Mysterium actions: 25'
      ]
    },
    mysterium3: {
      effect: 'Three consecutive perfect reloads empower next shot with double damage and Freezing trail.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 50'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  },
  {
    id: 'w017',
    name: 'Hailstorm',
    category: 'Weapons',
    iconUrl: '/images/weapons/Hailstorm.png',
    element: 'Water',
    description: 'Reloads bullets for Critical Hits. Uses Stamina.',
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
        'Enemies killed: 50',
        '1st Mysterium actions: 20'
      ]
    },
    mysterium3: {
      effect: 'Every third consecutive Critical Hit makes the target explode with a Freezing shockwave.',
      charismata: null,
      requirements: [
        'Enemies killed: 100',
        '2nd Mysterium actions: 75'
      ]
    },
    addedOn: '2025-05-02',
    updatedOn: '2025-05-05'
  }
];


// LightSpells
export const lightSpells: BaseItem[] = [
  {
    id: 'ls001',
    name: 'Blight Cyst',
    category: 'LightSpells',
    iconUrl: '/images/items/BlightCyst.png',
    element: 'Earth',
    description: 'A cyst that attaches to the environment or enemies. Explodes after a while but can be shot for a more powerful explosion.',
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
        'Auto-explosion range: 10 m',
        'Forced explosion range: 14 m',
        'The Cyst grows even bigger, allowing for easier targeting'
      ],
      requirements: [
        'Enemies hexed: 70'
      ]
    },
    mysterium3: {
      charismata: [
        'Auto-explosion range: 12 m',
        'Forced explosion range: 16 m',
        'The Cyst grows even bigger, allowing for easier targeting',
        'Chance to regrow if attaching to an enemy: 50 %'
      ],
      requirements: [
        'Enemies hexed: 150'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls002',
    name: 'Fireballs',
    category: 'LightSpells',
    iconUrl: '/images/items/Fireballs.png',
    element: 'Fire',
    description: 'Three Fireballs homing in onto multiple enemies.',
    mysterium1: {
      charismata: [
        'Direct hit damage: 35',
        'Explosion range: 4 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Direct hit damage: 45',
        'Explosion range: 5 m',
        'Extra charge'
      ],
      requirements: [
        'Enemies hexed: 70'
      ]
    },
    mysterium3: {
      charismata: [
        'Direct hit damage: 50',
        'Explosion range: 6 m',
        'Extra charge',
        'Casting when in ADS focuses fireballs on a single target.'
      ],
      requirements: [
        'Enemies hexed: 150'
      ]
    },
    addedOn: '2025-04-01',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls003',
    name: 'Firebreath',
    category: 'LightSpells',
    iconUrl: '/images/items/Firebreath.png',
    element: 'Fire',
    description: 'A fire breathers trick turned deadly, damaging enemies and recharging melee',
    mysterium1: {
      charismata: [
        'Range: 4 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Range: 5 m',
        'Deals bonus damage to already burning enemies'
      ],
      requirements: [
        'Enemies hexed: 25'
      ]
    },
    mysterium3: {
      charismata: [
        'Range: 6 m',
        'Deals bonus damage to already burning enemies',
        'Killing an enemy with the spell instantly recharges melee'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls004',
    name: 'Frost Cone',
    category: 'LightSpells',
    iconUrl: '/images/items/FrostCone.png',
    element: 'Water',
    description: 'An icy cloud that freezes any enemies on its path.',
    mysterium1: {
      charismata: [
        'Damage: 20'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Damage: 30',
        'Affecting three enemies or more instantly refills the clip from reserves.'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Damage: 40',
        'Affecting three enemies or more instantly refills the clip from reserves.',
        'Affecting five enemies or more instantly recharges the spell.'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls005',
    name: 'Ice Stiletto',
    category: 'LightSpells',
    iconUrl: '/images/items/IceStiletto.png',
    element: 'Water',
    description: 'An icy stiletto that freezes the targeted enemy.',
    mysterium1: {
      charismata: [
        'Damage: 20'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Damage: 30',
        'Critical hit with the stiletto doubles the damage and freeze time.'
      ],
      requirements: [
        'Enemies hexed: 25'
      ]
    },
    mysterium3: {
      charismata: [
        'Damage: 40',
        'Critical hit with the stiletto doubles the damage and freeze time.',
        'Instant spell recharge rate if the stiletto did not hit any enemy.'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls006',
    name: 'Lightning Bolt',
    category: 'LightSpells',
    iconUrl: '/images/items/LightningBolt.png',
    element: 'Air',
    description: 'A lightning bolt that knocks back and shocks enemies.',
    mysterium1: {
      charismata: [
        'Enemies affected: 3',
        'Range 16 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Enemies affected: 4',
        'Range 18 m',
        'Damage: 20'
      ],
      requirements: [
        'Enemies hexed: 150'
      ]
    },
    mysterium3: {
      charismata: [
        'Enemies affected: 5',
        'Range 20 m',
        'Damage: 40',
        'The initial bolt stuns any full health Minor enemy.'
      ],
      requirements: [
        'Enemies hexed: 300'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls007',
    name: 'Shockwave',
    category: 'LightSpells',
    iconUrl: '/images/items/Shockwave.png',
    element: null,
    description: 'A shockwave that stuns nearby Minor enemies and exhausted Major ones.',
    mysterium1: {
      charismata: [
        'Range 10 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Range 12 m',
        'Damage: 20'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Range 14 m',
        'Damage: 40',
        'Instant recharge per enemy affected: +10 %'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls008',
    name: 'Stigma Diabolicum',
    category: 'LightSpells',
    iconUrl: '/images/items/StigmaDiabolicum.png',
    element: 'Earth',
    description: 'A cyst that attaches to enemies, becoming their additional weak spot.',
    mysterium1: {
      charismata: [
        'Damage Modifier: ×1.25',
        'Duration: 20 s'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Damage Modifier: ×1.29',
        'Duration: 25 s',
        'Applies Decay on contact.'
      ],
      requirements: [
        'Enemies hexed: 25'
      ]
    },
    mysterium3: {
      charismata: [
        'Damage Modifier: ×1.35',
        'Duration: 30 s',
        'Applies Decay on contact.',
        'Killing an enemy with decay or a shot with the cyst partially regenerates the spell.'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls009',
    name: 'Stormball',
    category: 'LightSpells',
    iconUrl: '/images/items/Stormball.png',
    element: 'Air',
    description: 'A ball lightning that shocks any enemy near its path',
    mysterium1: {
      charismata: [
        'Range: 5 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Range: 6 m',
        'After two seconds, the spell grows in power and range'
      ],
      requirements: [
        'Enemies hexed: 25'
      ]
    },
    mysterium3: {
      charismata: [
        'Range: 7 m',
        'After two seconds, the spell grows in power and range',
        'The ball explodes upon hitting an obstacle'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'ls010',
    name: 'Twinshade',
    category: 'LightSpells',
    iconUrl: '/images/items/Twinshade.png',
    element: null,
    description: 'Strikes with a spectral sword or hammer, changing weapons mased on enemy health.',
    mysterium1: {
      charismata: [
        'Hammer damage: 30',
        'Sword damage: 60'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Hammer damage: 30',
        'Sword damage: 60',
        'Deals double damage to low health enemies.'
      ],
      requirements: [
        'Enemies hexed: 30'
      ]
    },
    mysterium3: {
      charismata: [
        'Hammer damage: 30',
        'Sword damage: 60',
        'Deals double damage to low health enemies.',
        'Hammer deals double stun damage to uninjured foes.'
      ],
      requirements: [
        'Enemies hexed: 60'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  }
];


// HeavySpells
export const heavySpells: BaseItem[] = [
  {
    id: 'hs001',
    name: 'Burning Stake',
    category: 'HeavySpells',
    iconUrl: '/images/items/BurningStake.png',
    element: 'Fire',
    description: 'Spawns a burning stake that ignite enemies. Damaging them charges the stake. Full charged, the stake releases a fiery explosion.',
    mysterium1: {
      charismata: [
        'Duration: 30 s',
        'Range: 20 m'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Duration: 35 s',
        'Range: 25 m',
        'Inferno burn damage boost: +25 %'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Duration: 40 s',
        'Range: 30 m',
        'Inferno burn damage boost: +50 %',
        'Killed enemies also partially charge the stake.'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'hs002',
    name: 'Cornucopia',
    category: 'HeavySpells',
    iconUrl: '/images/items/Cornucopia.png',
    element: null,
    description: 'The last bullet regenerates right after firing. Manual reload can still be executed. Does not work with Demonic Weapons.',
    mysterium1: {
      charismata: [
        'Duration: 12 s'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Duration: 16 s',
        'Improved handling, stability and reload.'
      ],
      requirements: [
        'Spell casts: 20'
      ]
    },
    mysterium3: {
      charismata: [
        'Duration: 20 s',
        'Improved handling, stability and reload.',
        'Duration extended per kill: +1 s'
      ],
      requirements: [
        'Spell casts: 40'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'hs003',
    name: 'Cursed Bell',
    category: 'HeavySpells',
    iconUrl: '/images/items/CursedBell.png',
    element: null,
    description: 'Spawns a cursed bell. Firing at the bell tolls it, stunning all nearby Minor enemies.',
    mysterium1: {
      charismata: [
        'Shockwave range: 30 m',
        'Duration: 20 s'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Shockwave range: 35 m',
        'Duration: 25 s',
        'Recharge speed reduction: 1 s'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Shockwave range: 40 m',
        'Duration: 30 s',
        'Recharge speed reduction: 2 s',
        'The final toll also stuns Major enemies.'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'hs004',
    name: 'Ice Sphere',
    category: 'HeavySpells',
    iconUrl: '/images/items/IceSphere.png',
    element: 'Water',
    description: 'Spawns an icy sphere that protects the caster from damage and freezes any enemy that gets inside it.',
    mysterium1: {
      charismata: [
        'Sphere HP: 300 HP'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Sphere HP: 400 HP',
        'Double range for all weapons when inside the sphere.'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Sphere HP: 500 HP',
        'Double range for all weapons when inside the sphere.',
        'Double reload speed for all weapons when inside the sphere.'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'hs005',
    name: 'Iron Cross',
    category: 'HeavySpells',
    iconUrl: '/images/items/IronCross.png',
    element: 'Air',
    description: 'Spawns an iron cross with lightning bolts that bind all nearby enemies to it.',
    mysterium1: {
      charismata: [
        'Range: 25 m',
        'Duration: +10 s'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Range: 30 m',
        'Duration: +15 s',
        'Shock duration: +50 %'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Range: 35 m',
        'Duration: +20 s',
        'Shock duration: +100 %',
        'When finished, the cross Shocks all enemies in a double-range zone.'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'hs006',
    name: 'Miasma',
    category: 'HeavySpells',
    iconUrl: '/images/items/Miasma.png',
    element: 'Earth',
    description: 'Summons a swinging incense burner that decays nearby enemies. Shooting the burner before it stops prolongs its duration.',
    mysterium1: {
      charismata: [
        'Radius: 15m',
        'Duration: 25s',
        'Enemies take increasing damage the longer they remain in the deadly cloud.'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Radius: 15m',
        'Duration: 30s',
        'Enemies take increasing damage the longer they remain in the deadly cloud.',
        'Burner spills acid when in full swing.'
      ],
      requirements: [
        'Enemies hexed: 125'
      ]
    },
    mysterium3: {
      charismata: [
        'Radius: 15m',
        'Duration: 35s',
        'Enemies take increasing damage the longer they remain in the deadly cloud.',
        'Burner spills acid when in full swing.'
      ],
      requirements: [
        'Enemies hexed: 200'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  },
  {
    id: 'hs007',
    name: 'Rotten Fiend',
    category: 'HeavySpells',
    iconUrl: '/images/items/RottenFiend.png',
    element: 'Earth',
    description: 'Resurrects a Grenadier who now attacks his former allies with incredible ferocity.',
    mysterium1: {
      charismata: [
        'Grenadier HP: 200'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Grenadier HP: 300',
        'Decay Aura around the Fiend. Affects all nearby enemies.'
      ],
      requirements: [
        'Enemies hexed: 50'
      ]
    },
    mysterium3: {
      charismata: [
        'Grenadier HP: 400',
        'Decay Aura around the Fiend. Affects all nearby enemies.',
        'Taunts all nearby enemies when spawned.'
      ],
      requirements: [
        'Enemies hexed: 100'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  }
];


// Relics
export const relics: BaseItem[] = [
  {
    id: 'r001',
    name: 'Blood Of A Banshee',
    category: 'Relics',
    iconUrl: '/images/items/BloodOfABanshee.png',
    element: 'Fire',
    description: 'Bloods spilled by a banshee burned on the stake. Overkill causes the victim to explode, igniting nearby enemies.',
    mysterium1: {
      charismata: [
        'Explosion range: 6 m',
        'Overkill value: 60 HP'
      ],
      requirements: [
        '-'
      ]
    },
    mysterium2: {
      charismata: [
        'Explosion range: 8 m',
        'Overkill value: 55 HP',
        'Explosion damage: 20'
      ],
      requirements: [
        'Kills with item equipped: 150'
      ]
    },
    mysterium3: {
      charismata: [
        'Explosion range: 10 m',
        'Overkill value: 50 HP',
        'Explosion damage: 30',
        'The explosion knocks back Minor enemies.'
      ],
      requirements: [
        'Kills with item equipped: 250'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  }
];


// Fetishes
export const fetishes: BaseItem[] = [
  {
    id: 'f001',
    name: 'New Item',
    category: 'Fetishes',
    iconUrl: '/images/items/default.png',
    element: null,
    description: '',
    mysterium1: {
      charismata: [
        'Effect 1',
        'Effect 2'
      ],
      requirements: [
        'Requirement 1'
      ]
    },
    mysterium2: {
      charismata: [
        'Effect 1',
        'Effect 2'
      ],
      requirements: [
        'Requirement 1'
      ]
    },
    mysterium3: {
      charismata: [
        'Effect 1',
        'Effect 2'
      ],
      requirements: [
        'Requirement 1'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
  }
];


// Rings
export const rings: BaseItem[] = [
  {
    id: 'rg001',
    name: 'New Item',
    category: 'Rings',
    iconUrl: '/images/items/default.png',
    element: null,
    description: 'test',
    mysterium1: {
      charismata: [
        'Effect 1',
        'Effect 2'
      ],
      requirements: [
        'Requirement 1'
      ]
    },
    mysterium2: {
      charismata: [
        'Effect 1',
        'Effect 2'
      ],
      requirements: [
        'Requirement 1'
      ]
    },
    mysterium3: {
      charismata: [
        'Effect 1',
        'Effect 2'
      ],
      requirements: [
        'Requirement 1'
      ]
    },
    addedOn: '2025-05-05',
    updatedOn: '2025-05-05'
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
    description: 'Fires a difficult to satiate arrow that actively seeks the next target after wounding one.',
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
    updatedOn: '2025-05-05'
  },
  {
    id: 'dw002',
    name: 'Falling Star',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/FallingStar.png',
    element: null,
    description: 'When fired while aiming down sights, grenades home in onto the tagged enemy. The longer the grenades travel, the higher their damage.',
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
    updatedOn: '2025-05-05'
  },
  {
    id: 'dw003',
    name: 'Whisper',
    category: 'DemonicWeapons',
    iconUrl: '/images/weapons/Whisper.png',
    element: null,
    description: 'A device capable of stunning almost any enemy.',
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
    updatedOn: '2025-05-05'
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
