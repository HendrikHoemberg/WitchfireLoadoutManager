import { BaseItem } from "../types";
import { getItemsByCategory } from "@/data/items";

// Heavy spell code mapping derived from HeavySpells.csv and items.ts ids
// Code format examples: WATER_01, FIRE_01, NELE_01, etc.
// Unlocked key uses pretty form: Water.01, Fire.01, Nele.02

export type SpellElementCode = "FIRE" | "EARTH" | "WATER" | "AIR" | "NELE";
export type HeavySpellCode =
  | "FIRE_01"
  | "AIR_01"
  | "EARTH_01"
  | "EARTH_02"
  | "WATER_01"
  | "NELE_01"
  | "NELE_02";

export type RarityToken = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

// Map item ids in items.ts -> heavy spell code
const idToCode: Record<string, HeavySpellCode> = {
  hs001: "FIRE_01", // Burning Stake
  hs005: "AIR_01", // Iron Cross
  hs007: "EARTH_01", // Rotten Fiend
  hs006: "EARTH_02", // Miasma
  hs004: "WATER_01", // Ice Sphere
  hs003: "NELE_01", // Cursed Bell
  hs002: "NELE_02", // Cornucopia
};

const codeToId: Record<HeavySpellCode, string> = Object.fromEntries(
  Object.entries(idToCode).map(([id, code]) => [code, id])
) as Record<HeavySpellCode, string>;

// Pretty element token for unlocked keys (Type.Item.Ability.Spell.Heavy.<Pretty>.<NN>)
const PrettyElement: Record<SpellElementCode, string> = {
  FIRE: "Fire",
  EARTH: "Earth",
  WATER: "Water",
  AIR: "Air",
  NELE: "Nele",
};

function splitCode(code: HeavySpellCode): { elem: SpellElementCode; num: string } {
  const [rawElem, num] = code.split("_");
  return { elem: rawElem as SpellElementCode, num };
}

// Builders
export function buildHeavySpellResearchKey(code: HeavySpellCode): string {
  // Research.Ability.Spell.Heavy.WATER_01
  return `Research.Ability.Spell.Heavy.${code}`;
}

export function buildHeavySpellUnlockedKey(code: HeavySpellCode): string {
  // Type.Item.Ability.Spell.Heavy.Water.01
  const { elem, num } = splitCode(code);
  return `Type.Item.Ability.Spell.Heavy.${PrettyElement[elem]}.${num}`;
}

export function buildHeavySpellInventoryHandle(
  code: HeavySpellCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/Abilities/HeavySpellItemsData.HeavySpellItemsData|Ability.Spell.Heavy.WATER_01.Rare
  return `/Game/Gameplay/Inventory/Data/Abilities/HeavySpellItemsData.HeavySpellItemsData|Ability.Spell.Heavy.${code}.${rarity}`;
}

export function buildHeavySpellAbilityDetailsHandle(
  code: HeavySpellCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/ItemDetails/AbilityItemDataDetails.AbilityItemDataDetails|Ability.Spell.Heavy.WATER_01.Rare
  return `/Game/Gameplay/Inventory/Data/ItemDetails/AbilityItemDataDetails.AbilityItemDataDetails|Ability.Spell.Heavy.${code}.${rarity}`;
}

export function buildHeavySpellQuestHandle(code: HeavySpellCode, tier: 1 | 2 | 3): string {
  // /Game/Gameplay/Quests/SpellTierQuests.SpellTierQuests|Quest.Spell.Heavy.WATER_01.Tier2
  return `/Game/Gameplay/Quests/SpellTierQuests.SpellTierQuests|Quest.Spell.Heavy.${code}.Tier${tier}`;
}

// Parsers
const RE_SEARCH = /^Research\.Ability\.Spell\.Heavy\.([A-Z]+_\d{2})$/;
const RE_UNLOCK = /^Type\.Item\.Ability\.Spell\.Heavy\.([A-Za-z]+)\.(\d{2})$/;
const RE_HANDLE = /\|Ability\.Spell\.Heavy\.([A-Z]+_\d{2})\.([A-Za-z]+)$/;
const RE_QUEST = /\|Quest\.Spell\.Heavy\.([A-Z]+_\d{2})\.Tier(1|2|3)$/;

export function parseHeavySpellResearchKey(key: string): HeavySpellCode | null {
  const m = key.match(RE_SEARCH);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseHeavySpellUnlockedKey(key: string): HeavySpellCode | null {
  const m = key.match(RE_UNLOCK);
  if (!m) return null;
  const elemPretty = m[1];
  const num = m[2];
  const elem = elemPretty.toUpperCase() as SpellElementCode;
  return toCode(`${elem}_${num}`);
}

export function parseHeavySpellInventoryOrDetailsHandle(handle: string): HeavySpellCode | null {
  const m = handle.match(RE_HANDLE);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseHeavySpellQuestHandle(handle: string): { code: HeavySpellCode; tier: 1 | 2 | 3 } | null {
  const m = handle.match(RE_QUEST);
  if (!m) return null;
  const code = toCode(m[1]);
  if (!code) return null;
  const tier = Number(m[2]) as 1 | 2 | 3;
  return { code, tier };
}

function toCode(token: string): HeavySpellCode | null {
  const upper = token.toUpperCase();
  const valid: HeavySpellCode[] = [
    "FIRE_01",
    "AIR_01",
    "EARTH_01",
    "EARTH_02",
    "WATER_01",
    "NELE_01",
    "NELE_02",
  ];
  return (valid as string[]).includes(upper) ? (upper as HeavySpellCode) : null;
}

// Item mapping helpers
export function getAllHeavySpells(): BaseItem[] {
  return getItemsByCategory("HeavySpells");
}

export function getHeavySpellByCode(code: HeavySpellCode): BaseItem | null {
  const id = codeToId[code];
  const items = getAllHeavySpells();
  return items.find((it) => it.id === id) ?? null;
}

export function getCodeForHeavySpellItem(item: BaseItem): HeavySpellCode | null {
  const code = idToCode[item.id];
  return (code as HeavySpellCode) ?? null;
}
