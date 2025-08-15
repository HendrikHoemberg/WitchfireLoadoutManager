import { BaseItem } from "../types";
import { getItemsByCategory } from "@/data/items";

// Light spell code mapping derived from LightSpells.csv and items.ts ids
// Code format examples: WATER_01, FIRE_02, NELE_01, etc.
// Unlocked key uses pretty form: Water.01, Fire.02, Nele.01

export type SpellElementCode = "FIRE" | "EARTH" | "WATER" | "AIR" | "NELE";
export type LightSpellCode =
  | "EARTH_01"
  | "FIRE_01"
  | "FIRE_02"
  | "WATER_01"
  | "WATER_02"
  | "AIR_01"
  | "NELE_01"
  | "EARTH_02"
  | "AIR_02"
  | "NELE_02";

export type RarityToken = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

// Map item ids in items.ts -> light spell code
const idToCode: Record<string, LightSpellCode> = {
  ls001: "EARTH_01", // Blight Cyst
  ls002: "FIRE_01", // Fireballs
  ls003: "FIRE_02", // Firebreath
  ls004: "WATER_01", // Frost Cone
  ls005: "WATER_02", // Ice Stiletto
  ls006: "AIR_01", // Lightning Bolt
  ls007: "NELE_01", // Shockwave
  ls008: "EARTH_02", // Stigma Diabolicum
  ls009: "AIR_02", // Stormball
  ls010: "NELE_02", // Twinshade
};

const codeToId: Record<LightSpellCode, string> = Object.fromEntries(
  Object.entries(idToCode).map(([id, code]) => [code, id])
) as Record<LightSpellCode, string>;

// Pretty element token for unlocked keys (Type.Item.Ability.Spell.Light.<Pretty>.<NN>)
const PrettyElement: Record<SpellElementCode, string> = {
  FIRE: "Fire",
  EARTH: "Earth",
  WATER: "Water",
  AIR: "Air",
  NELE: "Nele",
};

function splitCode(code: LightSpellCode): { elem: SpellElementCode; num: string } {
  const [rawElem, num] = code.split("_");
  return { elem: rawElem as SpellElementCode, num };
}

// Builders
export function buildLightSpellResearchKey(code: LightSpellCode): string {
  // Research.Ability.Spell.Light.WATER_01
  return `Research.Ability.Spell.Light.${code}`;
}

export function buildLightSpellUnlockedKey(code: LightSpellCode): string {
  // Type.Item.Ability.Spell.Light.Water.01
  const { elem, num } = splitCode(code);
  return `Type.Item.Ability.Spell.Light.${PrettyElement[elem]}.${num}`;
}

export function buildLightSpellInventoryHandle(
  code: LightSpellCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/Abilities/LightSpellItemsData.LightSpellItemsData|Ability.Spell.Light.WATER_01.Rare
  return `/Game/Gameplay/Inventory/Data/Abilities/LightSpellItemsData.LightSpellItemsData|Ability.Spell.Light.${code}.${rarity}`;
}

export function buildLightSpellAbilityDetailsHandle(
  code: LightSpellCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/ItemDetails/AbilityItemDataDetails.AbilityItemDataDetails|Ability.Spell.Light.WATER_01.Rare
  return `/Game/Gameplay/Inventory/Data/ItemDetails/AbilityItemDataDetails.AbilityItemDataDetails|Ability.Spell.Light.${code}.${rarity}`;
}

export function buildLightSpellQuestHandle(code: LightSpellCode, tier: 1 | 2 | 3): string {
  // /Game/Gameplay/Quests/SpellTierQuests.SpellTierQuests|Quest.Spell.Light.WATER_01.Tier2
  return `/Game/Gameplay/Quests/SpellTierQuests.SpellTierQuests|Quest.Spell.Light.${code}.Tier${tier}`;
}

// Parsers
const RE_SEARCH = /^Research\.Ability\.Spell\.Light\.([A-Z]+_\d{2})$/;
const RE_UNLOCK = /^Type\.Item\.Ability\.Spell\.Light\.([A-Za-z]+)\.(\d{2})$/;
const RE_HANDLE = /\|Ability\.Spell\.Light\.([A-Z]+_\d{2})\.([A-Za-z]+)$/;
const RE_QUEST = /\|Quest\.Spell\.Light\.([A-Z]+_\d{2})\.Tier(1|2|3)$/;

export function parseLightSpellResearchKey(key: string): LightSpellCode | null {
  const m = key.match(RE_SEARCH);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseLightSpellUnlockedKey(key: string): LightSpellCode | null {
  const m = key.match(RE_UNLOCK);
  if (!m) return null;
  const elemPretty = m[1];
  const num = m[2];
  const elem = elemPretty.toUpperCase() as SpellElementCode;
  return toCode(`${elem}_${num}`);
}

export function parseLightSpellInventoryOrDetailsHandle(handle: string): LightSpellCode | null {
  const m = handle.match(RE_HANDLE);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseLightSpellQuestHandle(handle: string): { code: LightSpellCode; tier: 1 | 2 | 3 } | null {
  const m = handle.match(RE_QUEST);
  if (!m) return null;
  const code = toCode(m[1]);
  if (!code) return null;
  const tier = Number(m[2]) as 1 | 2 | 3;
  return { code, tier };
}

function toCode(token: string): LightSpellCode | null {
  const upper = token.toUpperCase();
  const valid: LightSpellCode[] = [
    "EARTH_01",
    "FIRE_01",
    "FIRE_02",
    "WATER_01",
    "WATER_02",
    "AIR_01",
    "NELE_01",
    "EARTH_02",
    "AIR_02",
    "NELE_02",
  ];
  return (valid as string[]).includes(upper) ? (upper as LightSpellCode) : null;
}

// Item mapping helpers
export function getAllLightSpells(): BaseItem[] {
  return getItemsByCategory("LightSpells");
}

export function getLightSpellByCode(code: LightSpellCode): BaseItem | null {
  const id = codeToId[code];
  const items = getAllLightSpells();
  return items.find((it) => it.id === id) ?? null;
}

export function getCodeForLightSpellItem(item: BaseItem): LightSpellCode | null {
  const code = idToCode[item.id];
  return (code as LightSpellCode) ?? null;
}
