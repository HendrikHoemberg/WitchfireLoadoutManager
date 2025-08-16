import { WeaponFamily, WeightClass } from "../types";
import { saveTokenToFamily, saveTokenToWeight } from "./weaponKeys";

export interface ResearchedWeapon {
  family: WeaponFamily;
  weight: WeightClass;
}

const weightGroup = "(Light|Medium|Heavy|Exotic|Bone)";
const familyGroup = "([A-Za-z]+)"; // matches AutoRifle, BoltActionRifle, etc.

const RESEARCH_PATTERNS = [
  new RegExp(`^Research\\.Weapon\\.${familyGroup}\\.${weightGroup}$`),
  new RegExp(`^Research\\.${familyGroup}\\.${weightGroup}$`), // observed anomaly
];

const UNLOCKED_PATTERN = new RegExp(`^Type\\.Item\\.Weapon\\.${familyGroup}\\.${weightGroup}$`);

const QUEST_SOURCE_PATTERN = new RegExp(
  `\\|Quest\\.${familyGroup}\\.${weightGroup}\\.Tier(1|2|3)$`
);

// Some items (e.g., demonic weapons) may use a non-standard rarity token; accept any alpha token
const INVENTORY_WEAPON_PATTERN = new RegExp(
  `\\|${familyGroup}\\.${weightGroup}\\.([A-Za-z]+)$`
);

function parseFamilyWeight(
  famToken: string,
  wtToken: string
): { family: WeaponFamily; weight: WeightClass } | null {
  const family = saveTokenToFamily(famToken);
  if (!family) return null;
  const weight = saveTokenToWeight(family, wtToken);
  if (!weight) return null;
  return normalizeFamilyWeight({ family, weight });
}

// Some saves encode demonic or special weapons with a different weight token than our canonical data.
// Normalize those here so UI name/icon mapping works.
function normalizeFamilyWeight<T extends { family: WeaponFamily; weight: WeightClass }>(
  entry: T
): T {
  const { family, weight } = entry;
  // Whisper (StunGun) and Striga (StakeGun) observed as Medium in saves; canonical is Light
  if ((family === "StunGun" || family === "StakeGun") && weight === "Medium") {
    return { ...entry, weight: "Light" as WeightClass } as T;
  }
  // Vulture (Crossbow) observed as Medium in some saves; canonical is Heavy
  if (family === "Crossbow" && weight === "Medium") {
    return { ...entry, weight: "Medium" as WeightClass } as T;
  }
  // Falling Star (GrenadeLauncher) observed as Medium in some saves; canonical is Heavy
  if (family === "GrenadeLauncher" && weight === "Medium") {
    return { ...entry, weight: "Medium" as WeightClass } as T;
  }
  return entry;
}

export function parseResearchKey(key: string): ResearchedWeapon | null {
  for (const rx of RESEARCH_PATTERNS) {
    const m = key.match(rx);
    if (m) {
      const fam = m[1];
      const wt = m[2];
      return parseFamilyWeight(fam, wt);
    }
  }
  return null;
}

export function parseUnlockedKey(key: string): ResearchedWeapon | null {
  const m = key.match(UNLOCKED_PATTERN);
  if (!m) return null;
  return parseFamilyWeight(m[1], m[2]);
}

export function parseWeaponQuestSourceHandle(handle: string): {
  family: WeaponFamily;
  weight: WeightClass;
  tier: 1 | 2 | 3;
} | null {
  const m = handle.match(QUEST_SOURCE_PATTERN);
  if (!m) return null;
  const parsed = parseFamilyWeight(m[1], m[2]);
  if (!parsed) return null;
  const tier = Number(m[3]) as 1 | 2 | 3;
  return { ...parsed, tier };
}

export function parseInventoryWeaponSourceHandle(handle: string): ResearchedWeapon | null {
  const m = handle.match(INVENTORY_WEAPON_PATTERN);
  if (!m) return null;
  return parseFamilyWeight(m[1], m[2]);
}

// Minimal typed view of the save structure we traverse
interface SaveLike {
  Save?: {
    Research?: {
      SaveLoadResearchedProjects?: Record<string, unknown>;
    };
  };
  GameInstance?: {
    ProgressManager?: {
      IntegerMaps?: Record<string, { map?: Record<string, unknown> }>;
    };
  };
  PlayerController?: {
    ItemStorage?: {
      SaveLoadItemDataContainers?: Array<{ sourceHandle?: string } | undefined>;
    };
  };
}

// Extractors operating on parsed save JSON
export function extractResearchedWeapons(save: SaveLike | null | undefined): ResearchedWeapon[] {
  const out: ResearchedWeapon[] = [];
  const research = save?.Save?.Research?.SaveLoadResearchedProjects;
  if (research && typeof research === "object") {
    for (const key of Object.keys(research)) {
      const parsed = parseResearchKey(key);
      if (parsed) out.push(parsed);
    }
  }
  return out;
}

export function extractUnlockedWeaponCounts(save: SaveLike | null | undefined): Map<string, number> {
  // Returns counts keyed by normalized "Family.Weight" (e.g., "Shotgun.Light")
  const result = new Map<string, number>();
  const maps = save?.GameInstance?.ProgressManager?.IntegerMaps;
  // Walk every category map to be robust
  if (maps && typeof maps === "object") {
    for (const category of Object.values(maps) as Array<{ map?: Record<string, unknown> }>) {
      const map = category?.map;
      if (!map || typeof map !== "object") continue;
      for (const [key, value] of Object.entries(map)) {
        const parsed = parseUnlockedKey(key);
        if (parsed) {
          const k = `${parsed.family}.${parsed.weight}`;
          result.set(k, Number(value));
        }
      }
    }
  }
  return result;
}

export function extractInventoryWeapons(save: SaveLike | null | undefined): ResearchedWeapon[] {
  const out: ResearchedWeapon[] = [];
  const containers = save?.PlayerController?.ItemStorage?.SaveLoadItemDataContainers;
  if (Array.isArray(containers)) {
    for (const c of containers) {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") continue;
      const parsed = parseInventoryWeaponSourceHandle(sh);
      if (parsed) out.push(parsed);
    }
  }
  return out;
}
