import { BaseItem } from "../types";
import { getItemsByCategory } from "@/data/items";

// Fetish code mapping derived from Fetishes.csv and items.ts ids
// CSV FileName uses Pretty element and number: Nele.01 .. Nele.07
// We normalize to upper-case token form: NELE_01 .. NELE_07

export type FetishElementCode = "FIRE" | "EARTH" | "WATER" | "AIR" | "NELE";
export type FetishCode =
  | "NELE_01"
  | "NELE_02"
  | "NELE_03"
  | "NELE_05"
  | "NELE_06"
  | "NELE_07"
  | "NELE_09";

export type RarityToken = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

// Map item ids in items.ts -> fetish code (from Fetishes.csv)
// items.ts order:
// f001 Balewort -> Nele.06
// f002 Belladonna -> Nele.05
// f003 Bittersweet Nightshade -> Nele.01
// f004 Henbane -> Nele.02
// f005 Mandrake -> Nele.07
// f006 Monkshood -> Nele.03
// f007 Yew -> Nele.09
const idToCode: Record<string, FetishCode> = {
  f003: "NELE_01",
  f004: "NELE_02",
  f006: "NELE_03",
  f007: "NELE_09",
  f002: "NELE_05",
  f001: "NELE_06",
  f005: "NELE_07",
};

const codeToId: Record<FetishCode, string> = Object.fromEntries(
  Object.entries(idToCode).map(([id, code]) => [code, id])
) as Record<FetishCode, string>;

// Pretty element token for unlocked keys (Type.Item.Fetish.<Pretty>.<NN>)
const PrettyElement: Record<FetishElementCode, string> = {
  FIRE: "Fire",
  EARTH: "Earth",
  WATER: "Water",
  AIR: "Air",
  NELE: "Nele",
};

function splitCode(code: FetishCode): { elem: FetishElementCode; num: string } {
  const [rawElem, num] = code.split("_");
  return { elem: rawElem as FetishElementCode, num };
}

// Builders
export function buildFetishResearchKey(code: FetishCode): string {
  // Research.Fetish.NELE_01
  return `Research.Fetish.${code}`;
}

export function buildFetishUnlockedKey(code: FetishCode): string {
  // Type.Item.Fetish.Nele.01
  const { elem, num } = splitCode(code);
  return `Type.Item.Fetish.${PrettyElement[elem]}.${num}`;
}

export function buildFetishInventoryHandle(
  code: FetishCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/FetishItemsData.FetishItemsData|Fetish.NELE_01.Rare
  return `/Game/Gameplay/Inventory/Data/FetishItemsData.FetishItemsData|Fetish.${code}.${rarity}`;
}

export function buildFetishDetailsHandle(
  code: FetishCode,
  rarity: RarityToken = "Rare"
): string {
  // /Game/Gameplay/Inventory/Data/ItemDetails/FetishDataDetails.FetishDataDetails|Fetish.NELE_01.Rare
  return `/Game/Gameplay/Inventory/Data/ItemDetails/FetishDataDetails.FetishDataDetails|Fetish.${code}.${rarity}`;
}

// Parsers
const RE_SEARCH = /^Research\.Fetish\.([A-Z]+_\d{2})$/;
const RE_UNLOCK = /^Type\.Item\.Fetish\.([A-Za-z]+)\.(\d{2})$/;
// Be tolerant: match code token after a '|Fetish.' (or start) and ignore trailing tokens; case-insensitive
const RE_HANDLE = /(?:\|Fetish\.|^Fetish\.)\s*([A-Z]+_\d{2})\b/i;

export function parseFetishResearchKey(key: string): FetishCode | null {
  const m = key.match(RE_SEARCH);
  if (!m) return null;
  return toCode(m[1]);
}

export function parseFetishUnlockedKey(key: string): FetishCode | null {
  const m = key.match(RE_UNLOCK);
  if (!m) return null;
  const elemPretty = m[1];
  const num = m[2];
  const elem = elemPretty.toUpperCase() as FetishElementCode;
  return toCode(`${elem}_${num}`);
}

export function parseFetishInventoryOrDetailsHandle(handle: string): FetishCode | null {
  const m = handle.match(RE_HANDLE);
  if (!m) return null;
  const token = m[1].toUpperCase();
  return toCode(token);
}

function toCode(token: string): FetishCode | null {
  const upper = token.toUpperCase();
  const valid: FetishCode[] = [
    "NELE_01",
    "NELE_02",
    "NELE_03",
    "NELE_05",
    "NELE_06",
    "NELE_07",
    "NELE_09",
  ];
  return (valid as string[]).includes(upper) ? (upper as FetishCode) : null;
}

// Item mapping helpers
export function getAllFetishes(): BaseItem[] {
  return getItemsByCategory("Fetishes");
}

export function getFetishByCode(code: FetishCode): BaseItem | null {
  const id = codeToId[code];
  const items = getAllFetishes();
  return items.find((it) => it.id === id) ?? null;
}

export function getCodeForFetishItem(item: BaseItem): FetishCode | null {
  const code = idToCode[item.id];
  return (code as FetishCode) ?? null;
}
