import { BaseItem } from "../types";
import { getItemsByCategory } from "@/data/items";

// Relic code mapping derived from Relics.csv and items.ts ids
// Code format examples: WATER_01, FIRE_01, EARTH_02, NELE_01
// Unlocked key uses pretty form: Water.01, Fire.01, Earth.02, Nele.01

export type RelicElementCode = "FIRE" | "EARTH" | "WATER" | "AIR" | "NELE";
export type RelicCode =
  | "FIRE_01"
  | "FIRE_02"
  | "WATER_01"
  | "AIR_01"
  | "AIR_02"
  | "EARTH_01"
  | "EARTH_02"
  | "EARTH_03"
  | "NELE_01";

export type RarityToken = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

// Map item ids in items.ts -> relic code
const idToCode: Record<string, RelicCode> = {
  r001: "FIRE_01", // Blood of a Banshee -> Fire.01
  r002: "EARTH_01", // Book of Serpents -> Earth.01
  r003: "WATER_01", // Braid of a Seductress -> Water.01
  r004: "AIR_01", // Eye of the Madwoman -> Air.01
  r005: "AIR_02", // Kirfane -> Air.02
  r006: "FIRE_02", // Painted Tooth -> Fire.02
  r007: "EARTH_03", // Parasite -> Earth.03
  r008: "NELE_01", // Scourge -> Nele.01
  r009: "EARTH_02", // Severed Ear -> Earth.02
};

const codeToId: Record<RelicCode, string> = Object.fromEntries(
  Object.entries(idToCode).map(([id, code]) => [code, id])
) as Record<RelicCode, string>;

// Pretty element token for unlocked keys (Type.Item.Relic.<Pretty>.<NN>)
const PrettyElement: Record<RelicElementCode, string> = {
  FIRE: "Fire",
  EARTH: "Earth",
  WATER: "Water",
  AIR: "Air",
  NELE: "Nele",
};

function splitCode(code: RelicCode): { elem: RelicElementCode; num: string } {
  const [rawElem, num] = code.split("_");
  return { elem: rawElem as RelicElementCode, num };
}

// Builders
export function buildRelicResearchKey(code: RelicCode): string {
  // Research.Relic.FIRE_01
  return `Research.Relic.${code}`;
}

export function buildRelicUnlockedKey(code: RelicCode): string {
  // Type.Item.Relic.Fire.01
  const { elem, num } = splitCode(code);
  return `Type.Item.Relic.${PrettyElement[elem]}.${num}`;
}

export function buildRelicInventoryHandle(
  code: RelicCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/RelicItemsData.RelicItemsData|Relic.FIRE_01.Rare
  return `/Game/Gameplay/Inventory/Data/RelicItemsData.RelicItemsData|Relic.${code}.${rarity}`;
}

export function buildRelicDetailsHandle(
  code: RelicCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/ItemDetails/RelicDataDetails.RelicDataDetails|Relic.FIRE_01.Rare
  return `/Game/Gameplay/Inventory/Data/ItemDetails/RelicDataDetails.RelicDataDetails|Relic.${code}.${rarity}`;
}

export function buildRelicQuestHandle(code: RelicCode, tier: 1 | 2 | 3): string {
  // /Game/Gameplay/Quests/RelicTierQuests.RelicTierQuests|Quest.Relic.FIRE_01.Tier2
  return `/Game/Gameplay/Quests/RelicTierQuests.RelicTierQuests|Quest.Relic.${code}.Tier${tier}`;
}

// Parsers
const RE_SEARCH = /^Research\.Relic\.([A-Z]+_\d{2})$/;
const RE_UNLOCK = /^Type\.Item\.Relic\.([A-Za-z]+)\.(\d{2})$/;
// Be tolerant: match code token after a '|Relic.' (or start) and ignore trailing tokens; case-insensitive
const RE_HANDLE = /(?:\|Relic\.|^Relic\.)\s*([A-Z]+_\d{2})\b/i;
const RE_QUEST = /\|Quest\.Relic\.([A-Z]+_\d{2})\.Tier(1|2|3)$/;

export function parseRelicResearchKey(key: string): RelicCode | null {
  const m = key.match(RE_SEARCH);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseRelicUnlockedKey(key: string): RelicCode | null {
  const m = key.match(RE_UNLOCK);
  if (!m) return null;
  const elemPretty = m[1];
  const num = m[2];
  const elem = elemPretty.toUpperCase() as RelicElementCode;
  return toCode(`${elem}_${num}`);
}

export function parseRelicInventoryOrDetailsHandle(handle: string): RelicCode | null {
  const m = handle.match(RE_HANDLE);
  if (!m) return null;
  // Ensure upper-case token for toCode()
  const token = m[1].toUpperCase();
  return toCode(token);
}

export function parseRelicQuestHandle(handle: string): { code: RelicCode; tier: 1 | 2 | 3 } | null {
  const m = handle.match(RE_QUEST);
  if (!m) return null;
  const code = toCode(m[1]);
  if (!code) return null;
  const tier = Number(m[2]) as 1 | 2 | 3;
  return { code, tier };
}

function toCode(token: string): RelicCode | null {
  const upper = token.toUpperCase();
  const valid: RelicCode[] = [
    "FIRE_01",
    "FIRE_02",
    "WATER_01",
    "AIR_01",
    "AIR_02",
    "EARTH_01",
    "EARTH_02",
    "EARTH_03",
    "NELE_01",
  ];
  return (valid as string[]).includes(upper) ? (upper as RelicCode) : null;
}

// Item mapping helpers
export function getAllRelics(): BaseItem[] {
  return getItemsByCategory("Relics");
}

export function getRelicByCode(code: RelicCode): BaseItem | null {
  const id = codeToId[code];
  const items = getAllRelics();
  return items.find((it) => it.id === id) ?? null;
}

export function getCodeForRelicItem(item: BaseItem): RelicCode | null {
  const code = idToCode[item.id];
  return (code as RelicCode) ?? null;
}
