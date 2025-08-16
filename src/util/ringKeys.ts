import { BaseItem } from "../types";
import { getItemsByCategory } from "@/data/items";

// Ring code mapping derived from Rings.csv and items.ts ids
// Code format examples: WATER_01, FIRE_03, EARTH_01, NELE_02
// Unlocked key uses pretty form: Water.01, Fire.03, Earth.01, Nele.02

export type RingElementCode = "FIRE" | "EARTH" | "WATER" | "AIR" | "NELE";
export type RingCode =
  | "FIRE_01"
  | "FIRE_03"
  | "WATER_01"
  | "AIR_02"
  | "EARTH_01"
  | "EARTH_02"
  | "NELE_02"
  | "NELE_03";

export type RarityToken = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

// Map item ids in items.ts -> ring code
// From items.ts and Rings.csv mapping:
// rg001 Crown of Fire -> Fire.01
// rg002 Dynamo Ring -> Air.02
// rg003 Meteor Ring -> Fire.03
// rg004 Ring of Excreta -> Earth.01
// rg005 Ring of Obedience -> Nele.02
// rg006 Ring of Thorns -> Earth.02
// rg007 Ring of Wings -> Nele.03
// rg008 Shadowmist Ring -> Water.01
const idToCode: Record<string, RingCode> = {
  rg001: "FIRE_01",
  rg002: "AIR_02",
  rg003: "FIRE_03",
  rg004: "EARTH_01",
  rg005: "NELE_02",
  rg006: "EARTH_02",
  rg007: "NELE_03",
  rg008: "WATER_01",
};

const codeToId: Record<RingCode, string> = Object.fromEntries(
  Object.entries(idToCode).map(([id, code]) => [code, id])
) as Record<RingCode, string>;

// Pretty element token for unlocked keys (Type.Item.Ring.<Pretty>.<NN>)
const PrettyElement: Record<RingElementCode, string> = {
  FIRE: "Fire",
  EARTH: "Earth",
  WATER: "Water",
  AIR: "Air",
  NELE: "Nele",
};

function splitCode(code: RingCode): { elem: RingElementCode; num: string } {
  const [rawElem, num] = code.split("_");
  return { elem: rawElem as RingElementCode, num };
}

// Builders
export function buildRingResearchKey(code: RingCode): string {
  // Research.Ring.FIRE_01
  return `Research.Ring.${code}`;
}

export function buildRingUnlockedKey(code: RingCode): string {
  // Type.Item.Ring.Fire.01
  const { elem, num } = splitCode(code);
  return `Type.Item.Ring.${PrettyElement[elem]}.${num}`;
}

export function buildRingInventoryHandle(
  code: RingCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/RingItemsData.RingItemsData|Ring.FIRE_01.Rare
  return `/Game/Gameplay/Inventory/Data/RingItemsData.RingItemsData|Ring.${code}.${rarity}`;
}

export function buildRingDetailsHandle(
  code: RingCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/ItemDetails/RingDataDetails.RingDataDetails|Ring.FIRE_01.Rare
  return `/Game/Gameplay/Inventory/Data/ItemDetails/RingDataDetails.RingDataDetails|Ring.${code}.${rarity}`;
}

export function buildRingQuestHandle(code: RingCode, tier: 1 | 2 | 3): string {
  // /Game/Gameplay/Quests/RingTierQuests.RingTierQuests|Quest.Ring.FIRE_01.Tier2
  return `/Game/Gameplay/Quests/RingTierQuests.RingTierQuests|Quest.Ring.${code}.Tier${tier}`;
}

// Parsers
const RE_SEARCH = /^Research\.Ring\.([A-Z]+_\d{2})$/;
const RE_UNLOCK = /^Type\.Item\.Ring\.([A-Za-z]+)\.(\d{2})$/;
// Be tolerant: match code token after a '|Ring.' (or start) and ignore trailing tokens; case-insensitive
const RE_HANDLE = /(?:\|Ring\.|^Ring\.)\s*([A-Z]+_\d{2})\b/i;
const RE_QUEST = /\|Quest\.Ring\.([A-Z]+_\d{2})\.Tier(1|2|3)$/;

export function parseRingResearchKey(key: string): RingCode | null {
  const m = key.match(RE_SEARCH);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseRingUnlockedKey(key: string): RingCode | null {
  const m = key.match(RE_UNLOCK);
  if (!m) return null;
  const elemPretty = m[1];
  const num = m[2];
  const elem = elemPretty.toUpperCase() as RingElementCode;
  return toCode(`${elem}_${num}`);
}

export function parseRingInventoryOrDetailsHandle(handle: string): RingCode | null {
  const m = handle.match(RE_HANDLE);
  if (!m) return null;
  const token = m[1].toUpperCase();
  return toCode(token);
}

export function parseRingQuestHandle(handle: string): { code: RingCode; tier: 1 | 2 | 3 } | null {
  const m = handle.match(RE_QUEST);
  if (!m) return null;
  const code = toCode(m[1]);
  if (!code) return null;
  const tier = Number(m[2]) as 1 | 2 | 3;
  return { code, tier };
}

function toCode(token: string): RingCode | null {
  const upper = token.toUpperCase();
  const valid: RingCode[] = [
    "FIRE_01",
    "FIRE_03",
    "WATER_01",
    "AIR_02",
    "EARTH_01",
    "EARTH_02",
    "NELE_02",
    "NELE_03",
  ];
  return (valid as string[]).includes(upper) ? (upper as RingCode) : null;
}

// Item mapping helpers
export function getAllRings(): BaseItem[] {
  return getItemsByCategory("Rings");
}

export function getRingByCode(code: RingCode): BaseItem | null {
  const id = codeToId[code];
  const items = getAllRings();
  return items.find((it) => it.id === id) ?? null;
}

export function getCodeForRingItem(item: BaseItem): RingCode | null {
  const code = idToCode[item.id];
  return (code as RingCode) ?? null;
}
