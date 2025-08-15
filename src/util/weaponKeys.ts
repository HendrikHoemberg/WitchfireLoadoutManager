import { WeaponFamily, WeightClass } from "../types";

// Known save-file token quirks
// - StunGun is saved as "Stungun" in Research keys
// - AutoRifle Exotic (Koschei) uses weight token "Bone" in Type.Item/Quest keys
export const SaveFamilyToken: Record<WeaponFamily, string> = {
  AutoRifle: "AutoRifle",
  BoltActionRifle: "BoltActionRifle",
  HandCannon: "HandCannon",
  LeverActionRifle: "LeverActionRifle",
  MachinePistol: "MachinePistol",
  Shotgun: "Shotgun",
  SniperRifle: "SniperRifle",
  StakeGun: "StakeGun",
  Crossbow: "Crossbow",
  StunGun: "Stungun", // save uses lowercase g variant
  GrenadeLauncher: "GrenadeLauncher",
};

export function familyToSaveToken(family: WeaponFamily): string {
  return SaveFamilyToken[family] ?? family;
}

// Map families to pluralized item data asset token used in save handles
const FamilyPluralToken: Record<WeaponFamily, string> = {
  AutoRifle: "AutoRifles",
  BoltActionRifle: "BoltActionRifles",
  HandCannon: "HandCannons",
  LeverActionRifle: "LeverActionRifles",
  MachinePistol: "MachinePistols",
  Shotgun: "Shotguns",
  SniperRifle: "SniperRifles",
  StakeGun: "StakeGuns",
  Crossbow: "Crossbows",
  StunGun: "StunGuns",
  GrenadeLauncher: "GrenadeLaunchers",
};

export type RarityToken = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

// Example:
// /Game/Gameplay/Inventory/Data/Weapons/AutoRiflesItemData.AutoRiflesItemData|AutoRifle.Heavy.Epic
export function buildInventoryContainerSourceHandle(
  family: WeaponFamily,
  weight: WeightClass,
  rarity: RarityToken = "Common"
): string {
  const fam = familyToSaveToken(family);
  const wt = weightToSaveToken(family, weight);
  const plural = FamilyPluralToken[family];
  return `/Game/Gameplay/Inventory/Data/Weapons/${plural}ItemData.${plural}ItemData|${fam}.${wt}.${rarity}`;
}

// Example:
// /Game/Gameplay/Inventory/Data/ItemDetails/WeaponDataDetails.WeaponDataDetails|AutoRifle.Heavy.Epic
export function buildWeaponDetailsSourceHandle(
  family: WeaponFamily,
  weight: WeightClass,
  rarity: RarityToken = "Common"
): string {
  const fam = familyToSaveToken(family);
  const wt = weightToSaveToken(family, weight);
  return `/Game/Gameplay/Inventory/Data/ItemDetails/WeaponDataDetails.WeaponDataDetails|${fam}.${wt}.${rarity}`;
}

// Some families may remap certain weights in save keys
export function weightToSaveToken(family: WeaponFamily, weight: WeightClass): string {
  // Exotic AutoRifle (Koschei) appears as AutoRifle.Bone
  if (family === "AutoRifle" && weight === "Exotic") return "Bone";
  // Striga (StakeGun Light) observed as Medium in saves
  if (family === "StakeGun" && weight === "Light") return "Medium";
  // Whisper (StunGun Light) observed as Medium in saves (we don't write demonic tiers, but keep consistent)
  if (family === "StunGun" && weight === "Light") return "Medium";
  return weight;
}

// Reverse lookups
const ReverseFamilyToken: Record<string, WeaponFamily> = Object.entries(SaveFamilyToken)
  .reduce((acc, [fam, token]) => {
    acc[token] = fam as WeaponFamily;
    return acc;
  }, {} as Record<string, WeaponFamily>);

export function saveTokenToFamily(token: string): WeaponFamily | null {
  // Normalize casing quirks
  const normalized = token === "StunGun" ? "Stungun" : token;
  return ReverseFamilyToken[normalized] ?? null;
}

export function saveTokenToWeight(family: WeaponFamily, token: string): WeightClass | null {
  if (family === "AutoRifle" && token === "Bone") return "Exotic";
  if ((family === "StakeGun" || family === "StunGun") && token === "Medium") return "Light";
  if (token === "Light" || token === "Medium" || token === "Heavy" || token === "Exotic") return token;
  return null;
}

export type MysteriumTier = 1 | 2 | 3;

export function mysteriumLevelToTier(level: number): MysteriumTier {
  if (level <= 1) return 1;
  if (level === 2) return 2;
  return 3;
}

// Research keys
// Primary (observed common): Research.Weapon.<Family>.<Weight>
// Alternate (observed anomaly): Research.<Family>.<Weight> (e.g., LeverActionRifle)
export function buildResearchKey(
  family: WeaponFamily,
  weight: WeightClass
): string {
  const fam = familyToSaveToken(family);
  const wt = weightToSaveToken(family, weight);
  return `Research.Weapon.${fam}.${wt}`;
}

export function buildResearchKeyVariants(
  family: WeaponFamily,
  weight: WeightClass
): string[] {
  const fam = familyToSaveToken(family);
  const wt = weightToSaveToken(family, weight);
  return [
    `Research.Weapon.${fam}.${wt}`,
    `Research.${fam}.${wt}`, // fallback for observed inconsistent entries
  ];
}

// Unlocked counters in save (ProgressManager/IntegerMaps):
// Type.Item.Weapon.<Family>.<Weight>
export function buildUnlockedKey(
  family: WeaponFamily,
  weight: WeightClass
): string {
  const fam = familyToSaveToken(family);
  const wt = weightToSaveToken(family, weight);
  return `Type.Item.Weapon.${fam}.${wt}`;
}

// Weapon tier quest source handle, used for mysterium progression
// Example observed: /Game/Gameplay/Quests/WeaponTierQuests.WeaponTierQuests|Quest.<Family>.<Weight>.Tier<N>
export function buildWeaponQuestSourceHandle(
  family: WeaponFamily,
  weight: WeightClass,
  tier: MysteriumTier
): string {
  const fam = familyToSaveToken(family);
  const wt = weightToSaveToken(family, weight);
  return `/Game/Gameplay/Quests/WeaponTierQuests.WeaponTierQuests|Quest.${fam}.${wt}.Tier${tier}`;
}

export function buildAllKeysForWeapon(
  family: WeaponFamily,
  weight: WeightClass,
  mysteriumLevel?: number
) {
  const tier = mysteriumLevel ? mysteriumLevelToTier(mysteriumLevel) : undefined;
  const research = buildResearchKey(family, weight);
  const researchVariants = buildResearchKeyVariants(family, weight);
  const unlocked = buildUnlockedKey(family, weight);
  const questHandle = tier ? buildWeaponQuestSourceHandle(family, weight, tier) : undefined;

  return {
    research,
    researchVariants,
    unlocked,
    questHandle,
    tier,
  } as const;
}
