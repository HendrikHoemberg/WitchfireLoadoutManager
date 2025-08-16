"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPlayerClassInfoFromPlayerClass,
  PlayerClassInfo,
} from "@/data/playerClasses";
import { getItemsByCategory } from "@/data/items";
import { Weapon, WeaponFamily, WeightClass, isWeapon, BaseItem, Bead } from "@/types";
import { parseWeaponQuestSourceHandle, parseInventoryWeaponSourceHandle, parseUnlockedKey } from "@/util/saveWeaponParsers";
import {
  buildLightSpellAbilityDetailsHandle,
  buildLightSpellInventoryHandle,
  buildLightSpellQuestHandle,
  buildLightSpellResearchKey,
  buildLightSpellUnlockedKey,
  getAllLightSpells,
  getLightSpellByCode,
  getCodeForLightSpellItem,
  parseLightSpellInventoryOrDetailsHandle,
  parseLightSpellQuestHandle,
  parseLightSpellResearchKey,
  parseLightSpellUnlockedKey,
  type LightSpellCode,
} from "@/util/spellKeys";
import {
  buildHeavySpellAbilityDetailsHandle,
  buildHeavySpellInventoryHandle,
  buildHeavySpellQuestHandle,
  buildHeavySpellResearchKey,
  buildHeavySpellUnlockedKey,
  getAllHeavySpells,
  getHeavySpellByCode,
  getCodeForHeavySpellItem,
  parseHeavySpellInventoryOrDetailsHandle,
  parseHeavySpellQuestHandle,
  parseHeavySpellResearchKey,
  parseHeavySpellUnlockedKey,
  type HeavySpellCode,
} from "@/util/heavySpellKeys";
import {
  buildRelicDetailsHandle,
  buildRelicInventoryHandle,
  buildRelicQuestHandle,
  buildRelicResearchKey,
  buildRelicUnlockedKey,
  getAllRelics,
  getRelicByCode,
  getCodeForRelicItem,
  parseRelicInventoryOrDetailsHandle,
  parseRelicQuestHandle,
  parseRelicResearchKey,
  parseRelicUnlockedKey,
  type RelicCode,
} from "@/util/relicKeys";
import {
  buildFetishDetailsHandle,
  buildFetishInventoryHandle,
  buildFetishResearchKey,
  buildFetishUnlockedKey,
  getAllFetishes,
  getFetishByCode,
  getCodeForFetishItem,
  parseFetishInventoryOrDetailsHandle,
  parseFetishResearchKey,
  parseFetishUnlockedKey,
  type FetishCode,
} from "@/util/fetishKeys";
import {
  buildRingDetailsHandle,
  buildRingInventoryHandle,
  buildRingResearchKey,
  buildRingUnlockedKey,
  getAllRings,
  getRingByCode,
  getCodeForRingItem,
  parseRingInventoryOrDetailsHandle,
  parseRingResearchKey,
  parseRingUnlockedKey,
  parseRingQuestHandle,
  type RingCode,
} from "@/util/ringKeys";
import {
  buildInventoryContainerSourceHandle,
  buildWeaponDetailsSourceHandle,
  buildResearchKey,
  familyToSaveToken,
  weightToSaveToken,
} from "@/util/weaponKeys";
import ItemSelector from "@/components/loadout/ItemSelector";

// Save file pieces we care about
interface SaveLoadPropertyValues {
  FleshLevel: number;
  MindLevel: number;
  BloodLevel: number;
  WitcheryLevel: number;
  ArsenalLevel: number;
  FaithLevel: number;
  LevelPoints: number;
  AvailableLevelPoints?: number;
  GnosisLevel?: number;
  GnosisLevelUpCounter?: number;
}

interface AbilitySystemContainer {
  SaveLoadPropertyValues: SaveLoadPropertyValues;
}

interface QuestSubsystem {
  SaveLoadQuests?: Array<{ sourceHandle?: string } | undefined>;
}

interface SaveResearchSection {
  SaveLoadResearchedProjects?: Record<string, number>;
}

interface SaveSection {
  Player?: {
    AbilitySystem?: AbilitySystemContainer;
  };
  Subsystems?: {
    Quest?: QuestSubsystem;
    Research?: SaveResearchSection;
  };
  GameInstance?: GameInstanceSection;
}

interface IntegerMapCategory { map?: Record<string, number>; }

interface ProgressManagerSection {
  IntegerMaps?: Record<string, IntegerMapCategory>;
}

interface GameInstanceSection {
  ProgressManager?: ProgressManagerSection;
}

interface ItemStorageContainer {
  slotId?: number;
  detailsId?: number;
  itemCount?: number;
  bStashed?: boolean;
  dateTimeAdded?: string;
  sourceHandle?: string;
}

interface WeaponDataDetail {
  detailsId?: number;
  tierQuestId?: number; // -1 by default
  sourceHandle?: string;
}

interface AbilityItemDataDetail {
  detailsId?: number;
  tierQuestId?: number; // -1 by default
  sourceHandle?: string;
}

interface WitchfireSaveFile {
  PlayerClass?: string; // e.g. "Player.Class.AggroChaotic"
  PlayerLevel?: number;
  Save?: SaveSection;
  GameInstance?: {
    ProgressManager?: {
      IntegerMaps?: Record<string, IntegerMapCategory>;
    };
  };
  PlayerController?: {
    ItemStorage?: {
      SaveLoadItemDataContainers?: Array<ItemStorageContainer>;
      SaveLoadWeaponDataDetails?: Array<WeaponDataDetail>;
      SaveLoadAbilityItemDataDetails?: Array<AbilityItemDataDetail>;
    };
  };
}

type StatKey = "flesh" | "mind" | "blood" | "witchery" | "arsenal" | "faith";

const STAT_LABELS: Record<StatKey, string> = {
  flesh: "Flesh",
  mind: "Mind",
  blood: "Blood",
  witchery: "Witchery",
  arsenal: "Arsenal",
  faith: "Faith",
};

export default function SaveEditorPage() {
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [loadedJson, setLoadedJson] = useState<WitchfireSaveFile | null>(null);
  const [workingJson, setWorkingJson] = useState<WitchfireSaveFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showAddWeaponModal, setShowAddWeaponModal] = useState(false);
  const [showAddLightSpellModal, setShowAddLightSpellModal] = useState(false);
  const [showAddHeavySpellModal, setShowAddHeavySpellModal] = useState(false);
  const [showAddRelicModal, setShowAddRelicModal] = useState(false);
  const [showAddFetishModal, setShowAddFetishModal] = useState(false);
  const [showAddRingModal, setShowAddRingModal] = useState(false);

  // --- Helpers: File System Access availability and regular file chooser ---
  const isFSAAvailable = typeof window !== "undefined" &&
    // @ts-ignore - TS doesn't know about these on Window in all TS libs
    typeof (window as any).showOpenFilePicker === "function";

  const onChooseFile = async (file: File) => {
    try {
      setError(null);
      setInfo(null);
      const text = await file.text();
      const json = JSON.parse(text) as WitchfireSaveFile;
      setLoadedJson(structuredClone(json));
      setWorkingJson(structuredClone(json));
      setFileHandle(null); // regular input clears any prior handle
      setInfo(`Loaded ${file.name}`);
    } catch (e) {
      console.error(e);
      setError("Failed to parse JSON file. Make sure it is a valid Witchfire save file.");
    }
  };

  // --- Helpers: Stats accessors and updates ---
  const getSLPV = (j: WitchfireSaveFile | null | undefined): SaveLoadPropertyValues | null => {
    return j?.Save?.Player?.AbilitySystem?.SaveLoadPropertyValues ?? null;
  };

  // Recompute any derived fields after load or stat edits (lightweight)
  const recomputeLevels = (j: WitchfireSaveFile) => {
    // Ensure path exists
    j.Save = j.Save ?? {};
    j.Save.Player = j.Save.Player ?? {};
    j.Save.Player.AbilitySystem = j.Save.Player.AbilitySystem ?? ({} as AbilitySystemContainer);
    j.Save.Player.AbilitySystem.SaveLoadPropertyValues = j.Save.Player.AbilitySystem.SaveLoadPropertyValues ?? ({
      FleshLevel: 0,
      MindLevel: 0,
      BloodLevel: 0,
      WitcheryLevel: 0,
      ArsenalLevel: 0,
      FaithLevel: 0,
      LevelPoints: 0,
    } as SaveLoadPropertyValues);
    // Optionally clamp to non-negative integers
    const slpv = j.Save.Player.AbilitySystem.SaveLoadPropertyValues;
    const clamp = (n: any) => Math.max(0, Math.floor(Number(n) || 0));
    slpv.FleshLevel = clamp(slpv.FleshLevel);
    slpv.MindLevel = clamp(slpv.MindLevel);
    slpv.BloodLevel = clamp(slpv.BloodLevel);
    slpv.WitcheryLevel = clamp(slpv.WitcheryLevel);
    slpv.ArsenalLevel = clamp(slpv.ArsenalLevel);
    slpv.FaithLevel = clamp(slpv.FaithLevel);
    slpv.LevelPoints = clamp(slpv.LevelPoints);
  };

  const updateAbsoluteStat = (key: StatKey, newAbsolute: number) => {
    if (!workingJson || !base) return;
    const next = structuredClone(workingJson);
    const slpv = getSLPV(next);
    if (!slpv) return;
    const diff = Math.max(0, Math.round(newAbsolute - base[key]));
    const map: Record<StatKey, keyof SaveLoadPropertyValues> = {
      flesh: "FleshLevel",
      mind: "MindLevel",
      blood: "BloodLevel",
      witchery: "WitcheryLevel",
      arsenal: "ArsenalLevel",
      faith: "FaithLevel",
    };
    const field = map[key];
    // @ts-ignore index by known key
    slpv[field] = diff;
    // keep LevelPoints untouched; recompute/clamp basics
    recomputeLevels(next);
    setWorkingJson(next);
  };

  // Derived class info from working JSON
  const playerClassInfo: PlayerClassInfo | null = useMemo(() => {
    if (!workingJson?.PlayerClass) return null;
    return getPlayerClassInfoFromPlayerClass(workingJson.PlayerClass);
  }, [workingJson?.PlayerClass]);

  // Extract points (raw levels from file) and convert to absolute for UI
  const base = useMemo(() => {
    if (!playerClassInfo) return null;
    return playerClassInfo.base;
  }, [playerClassInfo]);

  // ============ Heavy Spells Section ============
  // Map HeavySpellCode -> BaseItem
  const heavySpellByCode = useMemo(() => {
    const items = getAllHeavySpells();
    const map = new Map<string, BaseItem>();
    for (const it of items) {
      const code = getCodeForHeavySpellItem(it);
      if (code) map.set(code, it);
    }
    return map;
  }, []);

  // Parse current mysterium tiers for Heavy spells from Unlocked.Items map (UI 1..3 from stored 2..4)
  const heavySpellTierMap = useMemo(() => {
    const m = new Map<string, number>();
    const unlockedItems = workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map;
    if (unlockedItems && typeof unlockedItems === "object") {
      for (const [k, v] of Object.entries(unlockedItems as Record<string, number>)) {
        const code = parseHeavySpellUnlockedKey(k);
        if (!code) continue;
        const stored = Number(v);
        const tier = Math.max(1, Math.min(3, stored - 1));
        m.set(code, tier);
      }
    }
    return m;
  }, [workingJson]);

  // Parse inventory heavy spells counts (by HeavySpellCode)
  const heavySpellInventoryCountMap = useMemo(() => {
    const m = new Map<string, number>();
    const storage = workingJson?.PlayerController?.ItemStorage;
    const seen = new Set<string>();
    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh !== "string") continue;
        const code = parseHeavySpellInventoryOrDetailsHandle(sh);
        if (code) {
          seen.add(sh);
          m.set(code, (m.get(code) ?? 0) + 1);
        }
      }
    }
    const abilityDetails = (storage as any)?.SaveLoadAbilityItemDataDetails as Array<AbilityItemDataDetail> | undefined;
    if (Array.isArray(abilityDetails)) {
      for (const d of abilityDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string" || seen.has(sh)) continue;
        const code = parseHeavySpellInventoryOrDetailsHandle(sh);
        if (code) m.set(code, (m.get(code) ?? 0) + 1);
      }
    }
    // Deep scan for any stray handles
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          const code = parseHeavySpellInventoryOrDetailsHandle(val);
          if (code) m.set(code, (m.get(code) ?? 0) + 1);
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }
    return m;
  }, [workingJson]);

  const excludedHeavyForAdd = useMemo(() => {
    return Array.from(heavySpellInventoryCountMap.entries())
      .filter(([, c]) => c > 0)
      .map(([code]) => heavySpellByCode.get(code)?.id)
      .filter((x): x is string => typeof x === "string");
  }, [heavySpellInventoryCountMap, heavySpellByCode]);

  const hasAddableHeavySpells = useMemo(() => {
    return getAllHeavySpells().some((it) => !excludedHeavyForAdd.includes(it.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedHeavyForAdd.join("|")]);

  const addInventoryForHeavySpell = (item: BaseItem) => {
    if (!workingJson) return;
    const code = getCodeForHeavySpellItem(item);
    if (!code) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);

    // Compute next available ID across containers, weapon details, and ability details
    let maxId = 0;
    for (const c of containers) {
      if (typeof c.slotId === "number" && c.slotId > maxId) maxId = c.slotId;
      if (typeof c.detailsId === "number" && c.detailsId > maxId) maxId = c.detailsId;
    }
    const weaponDetails = (next.PlayerController?.ItemStorage?.SaveLoadWeaponDataDetails ?? []) as Array<WeaponDataDetail>;
    for (const d of weaponDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    for (const d of abilityDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    const nextId = maxId + 1;

    // Spells start at Rare
    const detailsHandle = buildHeavySpellAbilityDetailsHandle(code, "Rare");
    const containerHandle = buildHeavySpellInventoryHandle(code, "Rare");

    abilityDetails.push({ detailsId: nextId, tierQuestId: -1, sourceHandle: detailsHandle });
    containers.push({
      slotId: nextId,
      detailsId: nextId,
      itemCount: 1,
      bStashed: false,
      dateTimeAdded: formatDateForSave(),
      sourceHandle: containerHandle,
    });

    // Research key
    ensureResearchPath(next);
    const projects = next.Save!.Subsystems!.Research!.SaveLoadResearchedProjects as Record<string, number>;
    projects[buildHeavySpellResearchKey(code)] = 1;

    // Ensure mysterium map base entry exists (2 => Rare)
    const unlocked = getUnlockedItemsMap(next);
    const unlockedKey = buildHeavySpellUnlockedKey(code);
    const current = unlocked[unlockedKey];
    if (typeof current !== "number" || current < 2) unlocked[unlockedKey] = 2;

    setWorkingJson(next);
  };

  const removeInventoryForHeavySpell = (code: HeavySpellCode) => {
    if (!workingJson) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);
    // Containers
    const filteredC = containers.filter((c) => {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseHeavySpellInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    containers.splice(0, containers.length, ...filteredC);
    // Ability details
    const filteredD = abilityDetails.filter((d) => {
      const sh = d?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseHeavySpellInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    abilityDetails.splice(0, abilityDetails.length, ...filteredD);

    // Research
    const research = next.Save?.Subsystems?.Research?.SaveLoadResearchedProjects as Record<string, number> | undefined;
    if (research) {
      const k = buildHeavySpellResearchKey(code);
      if (k in research) delete research[k];
    }
    // Unlocked mysterium
    const unlocked = getUnlockedItemsMap(next);
    const uKey = buildHeavySpellUnlockedKey(code);
    if (uKey in unlocked) delete unlocked[uKey];
    // Quests for this spell
    const quests = next.Save?.Subsystems?.Quest?.SaveLoadQuests;
    if (Array.isArray(quests)) {
      const filteredQ = quests.filter((q) => {
        const sh = q?.sourceHandle;
        if (typeof sh !== "string") return true;
        const parsed = parseHeavySpellQuestHandle(sh);
        if (!parsed) return true;
        return parsed.code !== code;
      });
      quests.splice(0, quests.length, ...filteredQ);
    }

    setWorkingJson(next);
  };

  const setHeavySpellMysteriumTier = (code: HeavySpellCode, value: number) => {
    if (!workingJson) return;
    const tier = Math.max(1, Math.min(3, Math.round(value)));
    const next = structuredClone(workingJson);
    const unlocked = getUnlockedItemsMap(next);
    const key = buildHeavySpellUnlockedKey(code);
    unlocked[key] = tier + 1; // store 2..4
    setWorkingJson(next);
  };

  const renderHeavySpellsSection = () => {
    if (!workingJson) return null;
    const present = Array.from(heavySpellInventoryCountMap.entries())
      .filter(([, c]) => c > 0)
      .map(([code, count]) => ({ code: code as HeavySpellCode, count, name: heavySpellByCode.get(code)?.name ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const openAdd = () => {
      if (!hasAddableHeavySpells) return;
      setShowAddHeavySpellModal(true);
    };
    const closeAdd = () => setShowAddHeavySpellModal(false);
    const handleAddSelect = (item: BaseItem | Bead) => {
      if ((item as any)?.category === "HeavySpells") {
        addInventoryForHeavySpell(item as BaseItem);
        const remaining = getAllHeavySpells().filter((it) => ![...excludedHeavyForAdd, (item as BaseItem).id].includes(it.id));
        if (remaining.length === 0) closeAdd();
      }
    };

    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Heavy Spells</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3 w-14"></th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Mysterium Tier</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {present.map(({ code }) => {
                const item = heavySpellByCode.get(code);
                const name = item?.name ?? code;
                const tier = heavySpellTierMap.get(code) ?? 1;
                return (
                  <tr key={code} className="border-b border-gray-700">
                    <td className="py-2 px-3">
                      {item?.iconUrl ? (
                        <img src={item.iconUrl} alt={name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12" />)
                      }
                    </td>
                    <td className="py-2 px-3 text-gray-200">{name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        max={3}
                        step={1}
                        value={tier}
                        onChange={(e) => setHeavySpellMysteriumTier(code, Number(e.target.value))}
                        className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeInventoryForHeavySpell(code)}
                        className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center cursor-pointer"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {present.length === 0 && (
                <tr>
                  <td className="py-3 px-3 text-gray-400" colSpan={4}>No heavy spells in inventory. Add some with the + button.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasAddableHeavySpells && (
          <div className="mt-3">
            <button onClick={openAdd} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">+ Add heavy spell</button>
          </div>
        )}

        {showAddHeavySpellModal && (
          <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[50vh] md:h-[50vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden">
              <img src="/images/texture-transparent.PNG" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                  <h2 className="text-lg text-white font-semibold m-0">Add Heavy Spell</h2>
                  <button className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer" onClick={closeAdd} aria-label="Close item selector" title="Close">×</button>
                </div>
                <div className="px-4">
                  <ItemSelector
                    category="HeavySpells"
                    onItemSelect={handleAddSelect}
                    excludedItems={excludedHeavyForAdd}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // For displaying and editing absolute stats in UI
  const absoluteStats = useMemo(() => {
    const slpv = getSLPV(workingJson);
    if (!slpv || !base) return null;
    return {
      flesh: base.flesh + (slpv.FleshLevel ?? 0),
      mind: base.mind + (slpv.MindLevel ?? 0),
      blood: base.blood + (slpv.BloodLevel ?? 0),
      witchery: base.witchery + (slpv.WitcheryLevel ?? 0),
      arsenal: base.arsenal + (slpv.ArsenalLevel ?? 0),
      faith: base.faith + (slpv.FaithLevel ?? 0),
    } as Record<StatKey, number>;
  }, [workingJson, base]);

  // ============ Weapons Section ============
  // Map Family.Weight -> Weapon item (for name/icon)
  const weaponByCombo = useMemo(() => {
    const items = [
      ...getItemsByCategory("Weapons"),
      ...getItemsByCategory("DemonicWeapons"),
    ].filter(isWeapon);
    const map = new Map<string, Weapon>();
    for (const it of items) {
      const family: WeaponFamily | undefined = it.weaponFamily;
      const weight: WeightClass | undefined = it.weightClass;
      if (!family || !weight) continue;
      const key = `${family}.${weight}`;
      if (!map.has(key)) map.set(key, it);
    }
    return map;
  }, []);

  // All selectable weapon ids across normal and demonic weapons
  const allSelectableWeaponIds = useMemo(() => {
    return [
      ...getItemsByCategory("Weapons"),
      ...getItemsByCategory("DemonicWeapons"),
    ]
      .filter(isWeapon)
      .map((w) => w.id);
  }, []);

  // Researched projects are auto-applied when adding a weapon.

  const formatDateForSave = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const MM = pad(d.getMinutes());
    const SS = pad(d.getSeconds());
    return `${yyyy}.${mm}.${dd}-${HH}.${MM}.${SS}`;
  };

  // Parse current mysterium tiers from ProgressManager IntegerMaps -> Progression.Category.Unlocked.Items
  const mysteriumTierMap = useMemo(() => {
    const m = new Map<string, number>();
    const unlockedItems = workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map;
    if (unlockedItems && typeof unlockedItems === "object") {
      for (const [k, v] of Object.entries(unlockedItems as Record<string, number>)) {
        const parsed = parseUnlockedKey(k);
        if (!parsed) continue;
        const key = `${parsed.family}.${parsed.weight}`;
        const stored = Number(v);
        // Stored range: 1..4 maps to UI tier: 0..3
        const tier = Math.max(0, Math.min(3, stored - 1));
        m.set(key, tier);
      }
    }
    return m;
  }, [workingJson]);

  // ============ Light Spells Section ============
  // Map LightSpellCode -> BaseItem
  const lightSpellByCode = useMemo(() => {
    const items = getAllLightSpells();
    const map = new Map<string, BaseItem>();
    for (const it of items) {
      const code = getCodeForLightSpellItem(it);
      if (code) map.set(code, it);
    }
    return map;
  }, []);

  // Parse current mysterium tiers for Light spells from Unlocked.Items map
  const lightSpellTierMap = useMemo(() => {
    const m = new Map<string, number>();
    const unlockedItems = workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map;
    if (unlockedItems && typeof unlockedItems === "object") {
      for (const [k, v] of Object.entries(unlockedItems as Record<string, number>)) {
        const code = parseLightSpellUnlockedKey(k);
        if (!code) continue;
        const stored = Number(v);
        // UI: 1..3, Stored: 2..4 (Rare..Legendary)
        const tier = Math.max(1, Math.min(3, stored - 1));
        m.set(code, tier);
      }
    }
    return m;
  }, [workingJson]);

  // Parse inventory light spells counts (by LightSpellCode)
  const lightSpellInventoryCountMap = useMemo(() => {
    const m = new Map<string, number>();
    const storage = workingJson?.PlayerController?.ItemStorage;
    const seen = new Set<string>();
    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh !== "string") continue;
        const code = parseLightSpellInventoryOrDetailsHandle(sh);
        if (code) {
          seen.add(sh);
          m.set(code, (m.get(code) ?? 0) + 1);
        }
      }
    }
    const abilityDetails = (storage as any)?.SaveLoadAbilityItemDataDetails as Array<AbilityItemDataDetail> | undefined;
    if (Array.isArray(abilityDetails)) {
      for (const d of abilityDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string" || seen.has(sh)) continue;
        const code = parseLightSpellInventoryOrDetailsHandle(sh);
        if (code) m.set(code, (m.get(code) ?? 0) + 1);
      }
    }
    // Deep scan for any stray handles
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          const code = parseLightSpellInventoryOrDetailsHandle(val);
          if (code) m.set(code, (m.get(code) ?? 0) + 1);
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }
    return m;
  }, [workingJson]);

  const excludedLightForAdd = useMemo(() => {
    return Array.from(lightSpellInventoryCountMap.entries())
      .filter(([, c]) => c > 0)
      .map(([code]) => lightSpellByCode.get(code)?.id)
      .filter((x): x is string => typeof x === "string");
  }, [lightSpellInventoryCountMap, lightSpellByCode]);

  const hasAddableLightSpells = useMemo(() => {
    return getAllLightSpells().some((it) => !excludedLightForAdd.includes(it.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedLightForAdd.join("|")]);

  const addInventoryForLightSpell = (item: BaseItem) => {
    if (!workingJson) return;
    const code = getCodeForLightSpellItem(item);
    if (!code) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);

    // Compute next available ID across containers, weapon details, and ability details
    let maxId = 0;
    for (const c of containers) {
      if (typeof c.slotId === "number" && c.slotId > maxId) maxId = c.slotId;
      if (typeof c.detailsId === "number" && c.detailsId > maxId) maxId = c.detailsId;
    }
    const weaponDetails = (next.PlayerController?.ItemStorage?.SaveLoadWeaponDataDetails ?? []) as Array<WeaponDataDetail>;
    for (const d of weaponDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    for (const d of abilityDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    const nextId = maxId + 1;

    // Spells start at Rare
    const detailsHandle = buildLightSpellAbilityDetailsHandle(code, "Rare");
    const containerHandle = buildLightSpellInventoryHandle(code, "Rare");

    abilityDetails.push({ detailsId: nextId, tierQuestId: -1, sourceHandle: detailsHandle });
    containers.push({
      slotId: nextId,
      detailsId: nextId,
      itemCount: 1,
      bStashed: false,
      dateTimeAdded: formatDateForSave(),
      sourceHandle: containerHandle,
    });

    // Research key
    ensureResearchPath(next);
    const projects = next.Save!.Subsystems!.Research!.SaveLoadResearchedProjects as Record<string, number>;
    projects[buildLightSpellResearchKey(code)] = 1;

    // Ensure mysterium map base entry exists (2 => Rare)
    const unlocked = getUnlockedItemsMap(next);
    const unlockedKey = buildLightSpellUnlockedKey(code);
    const current = unlocked[unlockedKey];
    if (typeof current !== "number" || current < 2) unlocked[unlockedKey] = 2;

    setWorkingJson(next);
  };

  const removeInventoryForLightSpell = (code: LightSpellCode) => {
    if (!workingJson) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);
    // Containers
    const filteredC = containers.filter((c) => {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseLightSpellInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    containers.splice(0, containers.length, ...filteredC);
    // Ability details
    const filteredD = abilityDetails.filter((d) => {
      const sh = d?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseLightSpellInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    abilityDetails.splice(0, abilityDetails.length, ...filteredD);

    // Research
    const research = next.Save?.Subsystems?.Research?.SaveLoadResearchedProjects as Record<string, number> | undefined;
    if (research) {
      const k = buildLightSpellResearchKey(code);
      if (k in research) delete research[k];
    }
    // Unlocked mysterium
    const unlocked = getUnlockedItemsMap(next);
    const uKey = buildLightSpellUnlockedKey(code);
    if (uKey in unlocked) delete unlocked[uKey];
    // Quests for this spell
    const quests = next.Save?.Subsystems?.Quest?.SaveLoadQuests;
    if (Array.isArray(quests)) {
      const filteredQ = quests.filter((q) => {
        const sh = q?.sourceHandle;
        if (typeof sh !== "string") return true;
        const parsed = parseLightSpellQuestHandle(sh);
        if (!parsed) return true;
        return parsed.code !== code;
      });
      quests.splice(0, quests.length, ...filteredQ);
    }

    setWorkingJson(next);
  };

  const setLightSpellMysteriumTier = (code: LightSpellCode, value: number) => {
    if (!workingJson) return;
    // UI tier in [1..3]
    const tier = Math.max(1, Math.min(3, Math.round(value)));
    const next = structuredClone(workingJson);
    const unlocked = getUnlockedItemsMap(next);
    const key = buildLightSpellUnlockedKey(code);
    unlocked[key] = tier + 1; // store 2..4 (Rare..Legendary)
    setWorkingJson(next);
  };

  const renderLightSpellsSection = () => {
    if (!workingJson) return null;
    const present = Array.from(lightSpellInventoryCountMap.entries())
      .filter(([, c]) => c > 0)
      .map(([code, count]) => ({ code: code as LightSpellCode, count, name: lightSpellByCode.get(code)?.name ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const openAdd = () => {
      if (!hasAddableLightSpells) return;
      setShowAddLightSpellModal(true);
    };
    const closeAdd = () => setShowAddLightSpellModal(false);
    const handleAddSelect = (item: BaseItem | Bead) => {
      if ((item as any)?.category === "LightSpells") {
        addInventoryForLightSpell(item as BaseItem);
        const remaining = getAllLightSpells().filter((it) => ![...excludedLightForAdd, (item as BaseItem).id].includes(it.id));
        if (remaining.length === 0) closeAdd();
      }
    };

    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Light Spells</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3 w-14"></th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Mysterium Tier</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {present.map(({ code }) => {
                const item = lightSpellByCode.get(code);
                const name = item?.name ?? code;
                const tier = lightSpellTierMap.get(code) ?? 1;
                return (
                  <tr key={code} className="border-b border-gray-700">
                    <td className="py-2 px-3">
                      {item?.iconUrl ? (
                        <img src={item.iconUrl} alt={name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12" />)
                      }
                    </td>
                    <td className="py-2 px-3 text-gray-200">{name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        max={3}
                        step={1}
                        value={tier}
                        onChange={(e) => setLightSpellMysteriumTier(code, Number(e.target.value))}
                        className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeInventoryForLightSpell(code)}
                        className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center cursor-pointer"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {present.length === 0 && (
                <tr>
                  <td className="py-3 px-3 text-gray-400" colSpan={4}>No light spells in inventory. Add some with the + button.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasAddableLightSpells && (
          <div className="mt-3">
            <button onClick={openAdd} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">+ Add light spell</button>
          </div>
        )}

        {showAddLightSpellModal && (
          <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[50vh] md:h-[50vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden">
              <img src="/images/texture-transparent.PNG" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                  <h2 className="text-lg text-white font-semibold m-0">Add Light Spell</h2>
                  <button className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer" onClick={closeAdd} aria-label="Close item selector" title="Close">×</button>
                </div>
                <div className="px-4">
                  <ItemSelector
                    category="LightSpells"
                    onItemSelect={handleAddSelect}
                    excludedItems={excludedLightForAdd}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============ Relics Section ============
  // Map RelicCode -> BaseItem
  const relicByCode = useMemo(() => {
    const items = getAllRelics();
    const map = new Map<string, BaseItem>();
    for (const it of items) {
      const code = getCodeForRelicItem(it);
      if (code) map.set(code, it);
    }
    return map;
  }, [workingJson]);

  // Parse current mysterium tiers for Relics from Unlocked.Items map (UI 1..3 from stored 2..4)
  const relicTierMap = useMemo(() => {
    const m = new Map<string, number>();
    const unlockedItems = workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map;
    if (unlockedItems && typeof unlockedItems === "object") {
      for (const [k, v] of Object.entries(unlockedItems as Record<string, number>)) {
        const code = parseRelicUnlockedKey(k);
        if (!code) continue;
        const stored = Number(v);
        const tier = Math.max(1, Math.min(3, stored - 1));
        m.set(code, tier);
      }
    }
    return m;
  }, [workingJson]);

  // Parse inventory relic counts (by RelicCode)
  const relicInventoryCountMap = useMemo(() => {
    const m = new Map<string, number>();
    const storage = workingJson?.PlayerController?.ItemStorage;
    const seen = new Set<string>();
    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh !== "string") continue;
        const code = parseRelicInventoryOrDetailsHandle(sh);
        if (code) {
          seen.add(sh);
          m.set(code, (m.get(code) ?? 0) + 1);
        }
      }
    }
    const abilityDetails = (storage as any)?.SaveLoadAbilityItemDataDetails as Array<AbilityItemDataDetail> | undefined;
    if (Array.isArray(abilityDetails)) {
      for (const d of abilityDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string" || seen.has(sh)) continue;
        const code = parseRelicInventoryOrDetailsHandle(sh);
        if (code) m.set(code, (m.get(code) ?? 0) + 1);
      }
    }
    // Deep scan
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          const code = parseRelicInventoryOrDetailsHandle(val);
          if (code) m.set(code, (m.get(code) ?? 0) + 1);
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }
    return m;
  }, [workingJson]);

  // Any relic code seen in inventory, unlocked mysterium tiers, or research projects
  const relicAvailableCodeSet = useMemo(() => {
    const set = new Set<string>();
    // From inventory
    for (const code of relicInventoryCountMap.keys()) set.add(code);
    // From unlocked mysterium tiers
    for (const code of relicTierMap.keys()) set.add(code);
    // From research keys
    const projects = workingJson?.Save?.Subsystems?.Research?.SaveLoadResearchedProjects;
    if (projects && typeof projects === "object") {
      for (const k of Object.keys(projects as Record<string, number>)) {
        const code = parseRelicResearchKey(k);
        if (code) set.add(code);
      }
    }
    return set;
  }, [relicInventoryCountMap, relicTierMap, workingJson]);

  const excludedRelicsForAdd = useMemo(() => {
    const ids: string[] = [];
    for (const code of relicAvailableCodeSet.values()) {
      const id = relicByCode.get(code)?.id;
      if (typeof id === "string") ids.push(id);
    }
    return ids;
  }, [relicAvailableCodeSet, relicByCode]);

  const hasAddableRelics = useMemo(() => {
    return getAllRelics().some((it) => !excludedRelicsForAdd.includes(it.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedRelicsForAdd.join("|")]);

  const addInventoryForRelic = (item: BaseItem) => {
    if (!workingJson) return;
    const code = getCodeForRelicItem(item);
    if (!code) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);

    // Compute next available ID across containers, weapon details, and ability details
    let maxId = 0;
    for (const c of containers) {
      if (typeof c.slotId === "number" && c.slotId > maxId) maxId = c.slotId;
      if (typeof c.detailsId === "number" && c.detailsId > maxId) maxId = c.detailsId;
    }
    const weaponDetails = (next.PlayerController?.ItemStorage?.SaveLoadWeaponDataDetails ?? []) as Array<WeaponDataDetail>;
    for (const d of weaponDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    for (const d of abilityDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    const nextId = maxId + 1;

    // Relics start at Rare
    const detailsHandle = buildRelicDetailsHandle(code, "Rare");
    const containerHandle = buildRelicInventoryHandle(code, "Rare");

    abilityDetails.push({ detailsId: nextId, tierQuestId: -1, sourceHandle: detailsHandle });
    containers.push({
      slotId: nextId,
      detailsId: nextId,
      itemCount: 1,
      bStashed: false,
      dateTimeAdded: formatDateForSave(),
      sourceHandle: containerHandle,
    });

    // Research key
    ensureResearchPath(next);
    const projects = next.Save!.Subsystems!.Research!.SaveLoadResearchedProjects as Record<string, number>;
    projects[buildRelicResearchKey(code)] = 1;

    // Ensure mysterium map base entry exists (2 => Rare)
    const unlocked = getUnlockedItemsMap(next);
    const unlockedKey = buildRelicUnlockedKey(code);
    const current = unlocked[unlockedKey];
    if (typeof current !== "number" || current < 2) unlocked[unlockedKey] = 2;

    setWorkingJson(next);
  };

  const removeInventoryForRelic = (code: RelicCode) => {
    if (!workingJson) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);
    // Containers
    const filteredC = containers.filter((c) => {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseRelicInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    containers.splice(0, containers.length, ...filteredC);
    // Ability details
    const filteredD = abilityDetails.filter((d) => {
      const sh = d?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseRelicInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    abilityDetails.splice(0, abilityDetails.length, ...filteredD);

    // Research: delete any keys that parse to this relic code
    const research = next.Save?.Subsystems?.Research?.SaveLoadResearchedProjects as Record<string, number> | undefined;
    if (research) {
      for (const k of Object.keys(research)) {
        const parsed = parseRelicResearchKey(k);
        if (parsed === code) delete research[k];
      }
    }
    // Unlocked mysterium: delete any keys that parse to this relic code
    const unlocked = getUnlockedItemsMap(next);
    for (const k of Object.keys(unlocked)) {
      const parsed = parseRelicUnlockedKey(k);
      if (parsed === code) delete unlocked[k];
    }
    // Quests for this relic
    const quests = next.Save?.Subsystems?.Quest?.SaveLoadQuests;
    if (Array.isArray(quests)) {
      const filteredQ = quests.filter((q) => {
        const sh = q?.sourceHandle;
        if (typeof sh !== "string") return true;
        const parsed = parseRelicQuestHandle(sh);
        if (!parsed) return true;
        return parsed.code !== code;
      });
      quests.splice(0, quests.length, ...filteredQ);
    }

    // Deep scrub: clear any lingering string fields that embed this relic handle code
    const scrub = (val: unknown, obj: any, key: string | number | null) => {
      if (typeof val === "string") {
        const parsed = parseRelicInventoryOrDetailsHandle(val);
        if (parsed === code) {
          if (obj && key !== null) obj[key as any] = "";
        }
        return;
      }
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) scrub(val[i], val, i);
        return;
      }
      if (val && typeof val === "object") {
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) scrub(v, val as any, k);
      }
    };
    scrub(next, null as any, null);

    setWorkingJson(next);
  };

  const setRelicMysteriumTier = (code: RelicCode, value: number) => {
    if (!workingJson) return;
    const tier = Math.max(1, Math.min(3, Math.round(value)));
    const next = structuredClone(workingJson);
    const unlocked = getUnlockedItemsMap(next);
    const key = buildRelicUnlockedKey(code);
    unlocked[key] = tier + 1; // store 2..4
    setWorkingJson(next);
  };

  const renderRelicsSection = () => {
    if (!workingJson) return null;
    // Present relics are any detected via inventory, unlocked tiers, or research
    const present: Array<{ code: RelicCode; count: number; name: string }> = Array.from(relicAvailableCodeSet.values())
      .map((code) => ({ code: code as RelicCode, count: relicInventoryCountMap.get(code) ?? 0, name: (relicByCode.get(code)?.name ?? code) as string }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const openAdd = () => {
      if (!hasAddableRelics) return;
      setShowAddRelicModal(true);
    };
    const closeAdd = () => setShowAddRelicModal(false);
    const handleAddSelect = (item: BaseItem | Bead) => {
      if ((item as any)?.category === "Relics") {
        addInventoryForRelic(item as BaseItem);
        const remaining = getAllRelics().filter((it) => ![...excludedRelicsForAdd, (item as BaseItem).id].includes(it.id));
        if (remaining.length === 0) closeAdd();
      }
    };

    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Relics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3 w-14"></th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Mysterium Tier</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {present.map(({ code }) => {
                const item = relicByCode.get(code);
                const name = item?.name ?? code;
                const tier = relicTierMap.get(code) ?? 1;
                return (
                  <tr key={code} className="border-b border-gray-700">
                    <td className="py-2 px-3">
                      {item?.iconUrl ? (
                        <img src={item.iconUrl} alt={name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12" />)
                      }
                    </td>
                    <td className="py-2 px-3 text-gray-200">{name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        max={3}
                        step={1}
                        value={tier}
                        onChange={(e) => setRelicMysteriumTier(code, Number(e.target.value))}
                        className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeInventoryForRelic(code)}
                        className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center cursor-pointer"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {present.length === 0 && (
                <tr>
                  <td className="py-3 px-3 text-gray-400" colSpan={4}>No relics in inventory. Add some with the + button.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasAddableRelics && (
          <div className="mt-3">
            <button onClick={openAdd} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">+ Add relic</button>
          </div>
        )}

        {showAddRelicModal && (
          <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[50vh] md:h-[50vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden">
              <img src="/images/texture-transparent.PNG" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                  <h2 className="text-lg text-white font-semibold m-0">Add Relic</h2>
                  <button className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer" onClick={closeAdd} aria-label="Close item selector" title="Close">×</button>
                </div>
                <div className="px-4">
                  <ItemSelector
                    category="Relics"
                    onItemSelect={handleAddSelect}
                    excludedItems={excludedRelicsForAdd}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Parse current inventory weapon counts (by Family.Weight, ignoring rarity)
  const inventoryCountMap = useMemo(() => {
    const m = new Map<string, number>();
    const storage = workingJson?.PlayerController?.ItemStorage;
    const seenHandles = new Set<string>();
    // Primary: item data containers (includes many item types)
    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh !== "string") continue;
        seenHandles.add(sh);
        const parsed = parseInventoryWeaponSourceHandle(sh);
        if (parsed) {
          const key = `${parsed.family}.${parsed.weight}`;
          m.set(key, (m.get(key) ?? 0) + 1);
        }
      }
    }
    // Also: dedicated weapon details list sometimes mirrors inventory; add entries not present in containers
    const weaponDetails = storage?.SaveLoadWeaponDataDetails;
    if (Array.isArray(weaponDetails)) {
      for (const d of weaponDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string") continue;
        if (seenHandles.has(sh)) continue; // avoid double counting the same exact handle
        const parsed = parseInventoryWeaponSourceHandle(sh);
        if (parsed) {
          const key = `${parsed.family}.${parsed.weight}`;
          m.set(key, (m.get(key) ?? 0) + 1);
        }
      }
    }
    // Deep-scan entire JSON to supplement counts (handles outside known arrays)
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          if (seenHandles.has(val)) return; // already counted from arrays
          const parsed = parseInventoryWeaponSourceHandle(val);
          if (parsed) {
            const key = `${parsed.family}.${parsed.weight}`;
            m.set(key, (m.get(key) ?? 0) + 1);
          }
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }
    return m;
  }, [workingJson]);

  // Debug info: how many entries we see in each list and how many parse as weapons
  const inventoryDebug = useMemo(() => {
    const playerControllerExists = Boolean(workingJson?.PlayerController);
    const storage = workingJson?.PlayerController?.ItemStorage;
    const itemStorageExists = Boolean(storage);
    let containersTotal = 0;
    let containersWeapons = 0;
    let weaponDetailsTotal = 0;
    let weaponDetailsWeapons = 0;
    const sampleContainerHandles: string[] = [];
    const sampleWeaponDetailHandles: string[] = [];
    let deepScanMatches = 0;
    const sampleDeepHandles: string[] = [];

    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      containersTotal = containers.length;
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh === "string") {
          if (sampleContainerHandles.length < 3) sampleContainerHandles.push(sh);
          if (parseInventoryWeaponSourceHandle(sh)) containersWeapons++;
        }
      }
    }

    const weaponDetails = (storage as unknown as { SaveLoadWeaponDataDetails?: Array<{ sourceHandle?: string }> })?.SaveLoadWeaponDataDetails;
    if (Array.isArray(weaponDetails)) {
      weaponDetailsTotal = weaponDetails.length;
      for (const d of weaponDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh === "string") {
          if (sampleWeaponDetailHandles.length < 3) sampleWeaponDetailHandles.push(sh);
          if (parseInventoryWeaponSourceHandle(sh)) weaponDetailsWeapons++;
        }
      }
    }

    // Deep scan sample (debug only)
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          const parsed = parseInventoryWeaponSourceHandle(val);
          if (parsed) {
            deepScanMatches++;
            if (sampleDeepHandles.length < 3) sampleDeepHandles.push(val);
          }
          // also sample spell handles
          if (parseLightSpellInventoryOrDetailsHandle(val)) {
            if (sampleDeepHandles.length < 3) sampleDeepHandles.push(val);
          }
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }

    return {
      playerControllerExists,
      itemStorageExists,
      containersTotal,
      containersWeapons,
      weaponDetailsTotal,
      weaponDetailsWeapons,
      combos: inventoryCountMap.size,
      sampleContainerHandles,
      sampleWeaponDetailHandles,
      deepScanMatches,
      sampleDeepHandles,
    };
  }, [workingJson, inventoryCountMap]);

  // IDs of weapons already present (exclude from Add selector)
  const excludedIdsForAdd = useMemo(() => {
    return Array.from(inventoryCountMap.entries())
      .filter(([, count]) => count > 0)
      .map(([key]) => weaponByCombo.get(key)?.id)
      .filter((x): x is string => typeof x === "string");
  }, [inventoryCountMap, weaponByCombo]);

  // Whether there are any more weapons that can be added
  const hasAddableWeapons = useMemo(() => {
    return allSelectableWeaponIds.some((id) => !excludedIdsForAdd.includes(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedIdsForAdd.join("|")]);

  // Auto-close selector if open and list becomes full due to external changes
  useEffect(() => {
    if (showAddWeaponModal && !hasAddableWeapons) {
      setShowAddWeaponModal(false);
    }
  }, [showAddWeaponModal, hasAddableWeapons]);

  const ensureResearchPath = (j: WitchfireSaveFile) => {
    j.Save = j.Save ?? {};
    j.Save.Subsystems = j.Save.Subsystems ?? {};
    j.Save.Subsystems.Research = j.Save.Subsystems.Research ?? {};
    j.Save.Subsystems.Research.SaveLoadResearchedProjects = j.Save.Subsystems.Research.SaveLoadResearchedProjects ?? {};
  };

  const ensureInventoryPath = (j: WitchfireSaveFile) => {
    j.PlayerController = j.PlayerController ?? {};
    j.PlayerController.ItemStorage = j.PlayerController.ItemStorage ?? {};
    j.PlayerController.ItemStorage.SaveLoadItemDataContainers =
      j.PlayerController.ItemStorage.SaveLoadItemDataContainers ?? [];
    // Ensure weapon details array exists
    j.PlayerController.ItemStorage.SaveLoadWeaponDataDetails =
      j.PlayerController.ItemStorage.SaveLoadWeaponDataDetails ?? [];
    // Ensure ability item details array exists (for Light/Heavy spells)
    (j.PlayerController.ItemStorage as any).SaveLoadAbilityItemDataDetails =
      (j.PlayerController.ItemStorage as any).SaveLoadAbilityItemDataDetails ?? [];
  };

  // Locate the existing arrays anywhere in the JSON tree. If not found, fall back to top-level PlayerController.ItemStorage
  const getInventoryArrays = (j: WitchfireSaveFile): {
    containers: Array<ItemStorageContainer>;
    details: Array<WeaponDataDetail>;
  } => {
    let containers: Array<ItemStorageContainer> | null = null;
    let details: Array<WeaponDataDetail> | null = null;
    const visit = (val: unknown) => {
      if (containers && details) return; // found both
      if (!val || typeof val !== "object") return;
      const obj = val as Record<string, unknown>;
      const c = obj["SaveLoadItemDataContainers"];
      if (!containers && Array.isArray(c)) containers = c as Array<ItemStorageContainer>;
      const d = obj["SaveLoadWeaponDataDetails"];
      if (!details && Array.isArray(d)) details = d as Array<WeaponDataDetail>;
      for (const v of Object.values(obj)) visit(v);
    };
    visit(j);
    if (!containers || !details) {
      ensureInventoryPath(j);
      containers = j.PlayerController!.ItemStorage!.SaveLoadItemDataContainers!;
      details = j.PlayerController!.ItemStorage!.SaveLoadWeaponDataDetails!;
    }
    return { containers: containers!, details: details! };
  };

  // Ability item arrays (Light/Heavy spells)
  const getAbilityInventoryArrays = (j: WitchfireSaveFile): {
    containers: Array<ItemStorageContainer>;
    abilityDetails: Array<AbilityItemDataDetail>;
  } => {
    let containers: Array<ItemStorageContainer> | null = null;
    let abilityDetails: Array<AbilityItemDataDetail> | null = null;
    const visit = (val: unknown) => {
      if (containers && abilityDetails) return; // found both
      if (!val || typeof val !== "object") return;
      const obj = val as Record<string, unknown>;
      const c = obj["SaveLoadItemDataContainers"];
      if (!containers && Array.isArray(c)) containers = c as Array<ItemStorageContainer>;
      const d = obj["SaveLoadAbilityItemDataDetails"];
      if (!abilityDetails && Array.isArray(d)) abilityDetails = d as Array<AbilityItemDataDetail>;
      for (const v of Object.values(obj)) visit(v);
    };
    visit(j);
    if (!containers || !abilityDetails) {
      ensureInventoryPath(j);
      containers = j.PlayerController!.ItemStorage!.SaveLoadItemDataContainers!;
      abilityDetails = (j.PlayerController!.ItemStorage as any).SaveLoadAbilityItemDataDetails!;
    }
    return { containers: containers!, abilityDetails: abilityDetails! };
  };

  // Ensure ProgressManager path for Unlocked.Items integer map exists
  const ensureProgressUnlockedItemsPath = (j: WitchfireSaveFile) => {
    j.Save = j.Save ?? {};
    j.Save.GameInstance = j.Save.GameInstance ?? {};
    j.Save.GameInstance.ProgressManager = j.Save.GameInstance.ProgressManager ?? {};
    const pm = j.Save.GameInstance.ProgressManager as ProgressManagerSection;
    pm.IntegerMaps = pm.IntegerMaps ?? {};
    pm.IntegerMaps["Progression.Category.Unlocked.Items"] = pm.IntegerMaps["Progression.Category.Unlocked.Items"] ?? {};
    pm.IntegerMaps["Progression.Category.Unlocked.Items"].map = pm.IntegerMaps["Progression.Category.Unlocked.Items"].map ?? {};
  };

  // Locate the Unlocked.Items integer map anywhere in the JSON tree; fallback to Save.GameInstance path
  const getUnlockedItemsMap = (j: WitchfireSaveFile): Record<string, number> => {
    let found: Record<string, number> | null = null;
    const visit = (val: unknown) => {
      if (found) return;
      if (!val || typeof val !== "object") return;
      const obj = val as Record<string, unknown>;
      const integerMaps = (obj as any).IntegerMaps as Record<string, IntegerMapCategory> | undefined;
      if (integerMaps && integerMaps["Progression.Category.Unlocked.Items"]?.map) {
        const m = integerMaps["Progression.Category.Unlocked.Items"].map as Record<string, number>;
        if (m && typeof m === "object") {
          found = m;
          return;
        }
      }
      for (const v of Object.values(obj)) visit(v);
    };
    visit(j);
    if (!found) {
      ensureProgressUnlockedItemsPath(j);
      found = j.Save!.GameInstance!.ProgressManager!.IntegerMaps!["Progression.Category.Unlocked.Items"].map!;
    }
    return found!;
  };

  // Removed UI for toggling research; research is auto-applied when adding a weapon.

  // Add a single inventory entry for a given weapon (defaults to Common rarity)
  const addInventoryForWeapon = (weapon: Weapon) => {
    if (!workingJson) return;
    const family = weapon.weaponFamily;
    const weight = weapon.weightClass;
    if (!family || !weight) return;
    const next = structuredClone(workingJson);
    const { containers, details } = getInventoryArrays(next);

    // Compute next available IDs (max+1 across slotId/detailsId)
    let maxId = 0;
    for (const c of containers) {
      if (typeof c.slotId === "number" && c.slotId > maxId) maxId = c.slotId;
      if (typeof c.detailsId === "number" && c.detailsId > maxId) maxId = c.detailsId;
    }
    const weaponDetails = (next.PlayerController?.ItemStorage?.SaveLoadWeaponDataDetails ?? []) as Array<WeaponDataDetail>;
    for (const d of weaponDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    const nextId = maxId + 1;

    const containerHandle = buildInventoryContainerSourceHandle(family, weight, "Common");
    const detailsHandle = buildWeaponDetailsSourceHandle(family, weight, "Common");

    // Push weapon details entry first
    details.push({
      detailsId: nextId,
      tierQuestId: -1,
      sourceHandle: detailsHandle,
    });

    // Then push container entry referencing same detailsId
    containers.push({
      slotId: nextId,
      detailsId: nextId,
      itemCount: 1,
      bStashed: false,
      dateTimeAdded: formatDateForSave(),
      sourceHandle: containerHandle,
    });
    // Auto-apply research when adding — only the correct single key
    ensureResearchPath(next);
    const projects = next.Save!.Subsystems!.Research!.SaveLoadResearchedProjects as Record<string, number>;
    const isNemesis = family === "LeverActionRifle" && weight === "Light";
    const primaryKey = isNemesis ? `Research.LeverActionRifle.Light` : buildResearchKey(family, weight);
    projects[primaryKey] = 1;
    // Remove the alternative variant if it exists to avoid duplicates
    const altKey = isNemesis ? `Research.Weapon.LeverActionRifle.Light` : `Research.${familyToSaveToken(family)}.${weightToSaveToken(family, weight)}`;
    if (altKey !== primaryKey && projects[altKey] !== undefined) delete projects[altKey];

    // Ensure mysterium map has at least base entry (1) for this combo so it shows up
    // Use save tokens to match observed save-file keys (e.g., StakeGun.Light -> Medium; StunGun.Light -> Medium)
    const unlocked = getUnlockedItemsMap(next);
    const famTokenForAdd = familyToSaveToken(family);
    const wtTokenForAdd = weightToSaveToken(family, weight);
    const unlockedKey = `Type.Item.Weapon.${famTokenForAdd}.${wtTokenForAdd}`;
    const current = unlocked[unlockedKey];
    if (typeof current !== "number" || current < 1) unlocked[unlockedKey] = 1;
    setWorkingJson(next);
  };

  // Remove all inventory entries for a given Family/Weight combo (ignores rarity)
  const removeInventoryForCombo = (family: WeaponFamily, weight: WeightClass) => {
    if (!workingJson) return;
    const next = structuredClone(workingJson);
    const { containers, details } = getInventoryArrays(next);
    const before = containers.length;
    const filtered = containers.filter((c) => {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseInventoryWeaponSourceHandle(sh);
      if (!parsed) return true;
      return !(parsed.family === family && parsed.weight === weight);
    });
    if (filtered.length !== before) {
      containers.splice(0, containers.length, ...filtered);
    }
    // Also remove from weapon details
    if (Array.isArray(details)) {
      const detailsFiltered = details.filter((d) => {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string") return true;
        const parsed = parseInventoryWeaponSourceHandle(sh);
        if (!parsed) return true;
        return !(parsed.family === family && parsed.weight === weight);
      });
      details.splice(0, details.length, ...detailsFiltered);
    }
    // Also remove Research and Unlocked keys for this combo, handling known save anomalies
    const famToken = familyToSaveToken(family);
    const baseWtToken = weightToSaveToken(family, weight);
    const wtTokens = new Set<string>([baseWtToken]);
    // Add observed anomaly tokens
    if (family === "Crossbow" && weight === "Heavy") wtTokens.add("Medium");
    if (family === "GrenadeLauncher" && weight === "Heavy") wtTokens.add("Medium");
    if (family === "StakeGun" && weight === "Light") wtTokens.add("Light").add("Medium");
    if (family === "StunGun" && weight === "Light") wtTokens.add("Light").add("Medium");
    if (family === "AutoRifle" && weight === "Exotic") wtTokens.add("Exotic").add("Bone");

    // Research keys (Nemesis special-case and alt variants) for each token
    const subsystems = next.Save?.Subsystems;
    const research = subsystems?.Research?.SaveLoadResearchedProjects as Record<string, number> | undefined;
    if (research) {
      const isNemesis = family === "LeverActionRifle" && weight === "Light";
      for (const wtToken of wtTokens) {
        const primaryKey = isNemesis ? `Research.LeverActionRifle.Light` : `Research.Weapon.${famToken}.${wtToken}`;
        const altKey = isNemesis ? `Research.Weapon.LeverActionRifle.Light` : `Research.${famToken}.${wtToken}`;
        if (primaryKey in research) delete research[primaryKey];
        if (altKey in research) delete research[altKey];
      }
    }
    // Unlocked mysterium entries for each token (also handle family token casing variants for StunGun)
    {
      const unlocked = getUnlockedItemsMap(next);
      const famTokens = new Set<string>([famToken]);
      if (family === "StunGun") famTokens.add("StunGun"); // some saves use capital G variant
      for (const famT of famTokens) {
        for (const wtToken of wtTokens) {
          const unlockedKey = `Type.Item.Weapon.${famT}.${wtToken}`;
          if (unlocked[unlockedKey] !== undefined) delete unlocked[unlockedKey];
        }
      }
    }
    // Remove any quest tier entries for this combo
    const quests = next.Save?.Subsystems?.Quest?.SaveLoadQuests;
    if (Array.isArray(quests)) {
      const beforeQ = quests.length;
      const filteredQ = quests.filter((q) => {
        const sh = q?.sourceHandle;
        if (typeof sh !== "string") return true;
        const parsed = parseWeaponQuestSourceHandle(sh);
        if (!parsed) return true;
        return !(parsed.family === family && parsed.weight === weight);
      });
      if (filteredQ.length !== beforeQ) {
        quests.splice(0, quests.length, ...filteredQ);
      }
    }
    setWorkingJson(next);
  };

  // Set mysterium tier (0..3) by writing 1..4 to ProgressManager IntegerMaps Unlocked.Items
  const setMysteriumTier = (family: WeaponFamily, weight: WeightClass, value: number) => {
    if (!workingJson) return;
    // Prevent writing tiers for demonic weapons
    const maybeWeapon = weaponByCombo.get(`${family}.${weight}`);
    if (maybeWeapon && (maybeWeapon as any).category === "DemonicWeapons") return;
    const tier = Math.max(0, Math.min(3, Math.round(value)));
    const next = structuredClone(workingJson);
    const unlocked = getUnlockedItemsMap(next);
    const famToken = familyToSaveToken(family);
    const wtToken = weightToSaveToken(family, weight);
    const key = `Type.Item.Weapon.${famToken}.${wtToken}`;
    unlocked[key] = tier + 1; // 1..4
    setWorkingJson(next);
  };

  const renderWeaponsSection = () => {
    if (!workingJson) return null;

    // Build list of currently available (in-inventory) combos, sorted by weapon name
    const availableCombos = Array.from(inventoryCountMap.entries())
      .filter(([, count]) => count > 0)
      .map(([key, count]) => ({ key, count, name: weaponByCombo.get(key)?.name ?? key }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    // Excluded IDs and addable flag are precomputed at top-level

    const openAdd = () => {
      if (!hasAddableWeapons) return; // nothing to add
      setShowAddWeaponModal(true);
    };
    const closeAdd = () => setShowAddWeaponModal(false);
    const handleAddSelect = (item: BaseItem | Bead) => {
      if (isWeapon(item)) {
        // Add and keep selector open to allow multiple additions
        addInventoryForWeapon(item);
        // If that was the last remaining selectable weapon, close the selector
        const remaining = allSelectableWeaponIds.filter((id) => ![...excludedIdsForAdd, item.id].includes(id));
        if (remaining.length === 0) closeAdd();
      }
    };

    // No hooks here (handled at top level)

    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Weapons</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3 w-14"></th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Mysterium Tier</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableCombos.map(({ key }) => {
                const [family, weight] = key.split(".") as [WeaponFamily, WeightClass];
                const weapon = weaponByCombo.get(key);
                const name = weapon?.name ?? key;
                // Demonic weapons have tier 0 only
                const isDemonic = (weapon as any)?.category === "DemonicWeapons";
                const tier = isDemonic ? 0 : (mysteriumTierMap.get(key) ?? 0);
                const stored = (workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map as Record<string, number> | undefined)?.[`Type.Item.Weapon.${family}.${weight}`];
                return (
                  <tr key={key} className="border-b border-gray-700">
                    <td className="py-2 px-3">
                      {weapon?.iconUrl ? (
                        <img
                          src={weapon.iconUrl}
                          alt={name}
                          className="w-12 h-12 object-contain rounded"
                        />
                      ) : (
                        <div className="w-12 h-12" />
                      )}
                    </td>
                    <td className="py-2 px-3 text-gray-200">{name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={0}
                        max={3}
                        step={1}
                        value={tier}
                        onChange={(e) => setMysteriumTier(family, weight, Number(e.target.value))}
                        disabled={isDemonic}
                        className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeInventoryForCombo(family, weight)}
                        className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center cursor-pointer"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {availableCombos.length === 0 && (
                <tr>
                  <td className="py-3 px-3 text-gray-400" colSpan={4}>No weapons in inventory. Add some with the + button.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add button: hide if there are no addable weapons left */}
        {hasAddableWeapons && (
          <div className="mt-3">
            <button
              onClick={openAdd}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              + Add weapon
            </button>
          </div>
        )}

        {/* Add Weapon Bottom-Sheet Overlay (stays open until X is clicked) */}
        {showAddWeaponModal && (
          <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div
              className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[50vh] md:h-[50vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              <img
                src="/images/texture-transparent.PNG"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
              />
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                  <h2 className="text-lg text-white font-semibold m-0">Add Weapon</h2>
                  <button
                    className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer"
                    onClick={closeAdd}
                    aria-label="Close item selector"
                    title="Close"
                  >
                    ×
                  </button>
                </div>
                <div className="px-4">
                  <ItemSelector
                    category="Weapons"
                    onItemSelect={handleAddSelect}
                    excludedItems={excludedIdsForAdd}
                    includeDemonicWeapons={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const openWithFSA = async () => {
    setError(null);
    setInfo(null);
    if (!fileHandle || !workingJson) {
      setError("No file opened with File System Access.");
      return;
    }
    try {
      type Writable = { write: (data: string) => Promise<void>; close: () => Promise<void> };
      type WritableHandle = FileSystemFileHandle & { createWritable: () => Promise<Writable> };
      const writable = await (fileHandle as WritableHandle).createWritable();
      await writable.write(JSON.stringify(workingJson, null, 2));
      await writable.close();
      setInfo("Saved changes to the original file.");
    } catch (e) {
      console.error(e);
      setError("Failed to save to the original file.");
    }
  };

  // Alias used by the UI button
  const saveToSameFile = async () => {
    await openWithFSA();
  };

  // Download as new JSON
  const downloadEdited = () => {
    if (!workingJson) return;
    const blob = new Blob([JSON.stringify(workingJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "witchfire-save-edited.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetChanges = () => {
    if (!loadedJson) return;
    setWorkingJson(structuredClone(loadedJson));
    setInfo("Reverted all changes to last loaded file.");
  };

  // When first loading a file, recompute derived values to ensure consistency
  useEffect(() => {
    if (workingJson) {
      // Work on a clone and ensure nested paths on a local any-typed ref
      const next = structuredClone(workingJson);
      next.Save = next.Save ?? {};
      next.Save.Player = next.Save.Player ?? {};
      next.Save.Player.AbilitySystem = next.Save.Player.AbilitySystem ?? {} as AbilitySystemContainer;
      next.Save.Player.AbilitySystem.SaveLoadPropertyValues =
        next.Save.Player.AbilitySystem.SaveLoadPropertyValues ?? ({
          FleshLevel: 0,
          MindLevel: 0,
          BloodLevel: 0,
          WitcheryLevel: 0,
          ArsenalLevel: 0,
          FaithLevel: 0,
          LevelPoints: 0,
        } as SaveLoadPropertyValues);
      // Recompute on load to sync fields
      recomputeLevels(next);
      setWorkingJson(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedJson]);

  const renderStatsTable = () => {
    if (!workingJson) return null;
    const slpv = getSLPV(workingJson);
    if (!slpv || !base || !absoluteStats) return null;

    const row = (key: StatKey) => {
      const absVal = absoluteStats[key];
      const min = base[key];
      const max = 100;
      const points = absVal - base[key];
      return (
        <tr key={key} className="border-b border-gray-700">
          <td className="py-2 px-3 text-gray-200">{STAT_LABELS[key]}</td>
          <td className="py-2 px-3 text-gray-400">{min}</td>
          <td className="py-2 px-3 text-gray-400">{points}</td>
          <td className="py-2 px-3">
            <input
              type="number"
              min={min}
              max={max}
              step={1}
              value={absVal}
              onChange={(e) => updateAbsoluteStat(key, Number(e.target.value))}
              className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a]"
            />
          </td>
        </tr>
      );
    };

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Stats</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3">Stat</th>
                <th className="py-2 px-3">Base</th>
                <th className="py-2 px-3">Points</th>
                <th className="py-2 px-3">Absolute</th>
              </tr>
            </thead>
            <tbody>
              {(["flesh", "mind", "blood", "witchery", "arsenal", "faith"] as StatKey[]).map(row)}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ============ Fetishes Section ============
  // Map FetishCode -> BaseItem
  const fetishByCode = useMemo(() => {
    const items = getAllFetishes();
    const map = new Map<string, BaseItem>();
    for (const it of items) {
      const code = getCodeForFetishItem(it);
      if (code) map.set(code, it);
    }
    return map;
  }, [workingJson]);

  // Parse mysterium tiers for Fetishes (UI 1..3 from stored 2..4)
  const fetishTierMap = useMemo(() => {
    const m = new Map<string, number>();
    const unlockedItems = workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map;
    if (unlockedItems && typeof unlockedItems === "object") {
      for (const [k, v] of Object.entries(unlockedItems as Record<string, number>)) {
        const code = parseFetishUnlockedKey(k);
        if (!code) continue;
        const stored = Number(v);
        const tier = Math.max(1, Math.min(3, stored - 1));
        m.set(code, tier);
      }
    }
    return m;
  }, [workingJson]);

  // Parse inventory fetish counts
  const fetishInventoryCountMap = useMemo(() => {
    const m = new Map<string, number>();
    const storage = workingJson?.PlayerController?.ItemStorage;
    const seen = new Set<string>();
    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh !== "string") continue;
        const code = parseFetishInventoryOrDetailsHandle(sh);
        if (code) {
          seen.add(sh);
          m.set(code, (m.get(code) ?? 0) + 1);
        }
      }
    }
    const abilityDetails = (storage as any)?.SaveLoadAbilityItemDataDetails as Array<AbilityItemDataDetail> | undefined;
    if (Array.isArray(abilityDetails)) {
      for (const d of abilityDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string" || seen.has(sh)) continue;
        const code = parseFetishInventoryOrDetailsHandle(sh);
        if (code) m.set(code, (m.get(code) ?? 0) + 1);
      }
    }
    // Deep scan
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          const code = parseFetishInventoryOrDetailsHandle(val);
          if (code) m.set(code, (m.get(code) ?? 0) + 1);
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }
    return m;
  }, [workingJson]);

  const fetishAvailableCodeSet = useMemo(() => {
    const set = new Set<string>();
    for (const code of fetishInventoryCountMap.keys()) set.add(code);
    for (const code of fetishTierMap.keys()) set.add(code);
    const projects = workingJson?.Save?.Subsystems?.Research?.SaveLoadResearchedProjects;
    if (projects && typeof projects === "object") {
      for (const k of Object.keys(projects as Record<string, number>)) {
        const code = parseFetishResearchKey(k);
        if (code) set.add(code);
      }
    }
    return set;
  }, [fetishInventoryCountMap, fetishTierMap, workingJson]);

  const excludedFetishesForAdd = useMemo(() => {
    const ids: string[] = [];
    for (const code of fetishAvailableCodeSet.values()) {
      const id = fetishByCode.get(code)?.id;
      if (typeof id === "string") ids.push(id);
    }
    return ids;
  }, [fetishAvailableCodeSet, fetishByCode]);

  const hasAddableFetishes = useMemo(() => {
    return getAllFetishes().some((it) => !excludedFetishesForAdd.includes(it.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedFetishesForAdd.join("|")]);

  const addInventoryForFetish = (item: BaseItem) => {
    if (!workingJson) return;
    const code = getCodeForFetishItem(item);
    if (!code) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);

    let maxId = 0;
    for (const c of containers) {
      if (typeof c.slotId === "number" && c.slotId > maxId) maxId = c.slotId;
      if (typeof c.detailsId === "number" && c.detailsId > maxId) maxId = c.detailsId;
    }
    const weaponDetails = (next.PlayerController?.ItemStorage?.SaveLoadWeaponDataDetails ?? []) as Array<WeaponDataDetail>;
    for (const d of weaponDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    for (const d of abilityDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    const nextId = maxId + 1;

    const detailsHandle = buildFetishDetailsHandle(code, "Rare");
    const containerHandle = buildFetishInventoryHandle(code, "Rare");

    abilityDetails.push({ detailsId: nextId, tierQuestId: -1, sourceHandle: detailsHandle });
    containers.push({
      slotId: nextId,
      detailsId: nextId,
      itemCount: 1,
      bStashed: false,
      dateTimeAdded: formatDateForSave(),
      sourceHandle: containerHandle,
    });

    ensureResearchPath(next);
    const projects = next.Save!.Subsystems!.Research!.SaveLoadResearchedProjects as Record<string, number>;
    projects[buildFetishResearchKey(code)] = 1;

    const unlocked = getUnlockedItemsMap(next);
    const unlockedKey = buildFetishUnlockedKey(code);
    const current = unlocked[unlockedKey];
    if (typeof current !== "number" || current < 2) unlocked[unlockedKey] = 2;

    setWorkingJson(next);
  };

  const removeInventoryForFetish = (code: FetishCode) => {
    if (!workingJson) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);
    const filteredC = containers.filter((c) => {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseFetishInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    containers.splice(0, containers.length, ...filteredC);
    const filteredD = abilityDetails.filter((d) => {
      const sh = d?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseFetishInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    abilityDetails.splice(0, abilityDetails.length, ...filteredD);

    const research = next.Save?.Subsystems?.Research?.SaveLoadResearchedProjects as Record<string, number> | undefined;
    if (research) {
      for (const k of Object.keys(research)) {
        const parsed = parseFetishResearchKey(k);
        if (parsed === code) delete research[k];
      }
    }
    const unlocked = getUnlockedItemsMap(next);
    for (const k of Object.keys(unlocked)) {
      const parsed = parseFetishUnlockedKey(k);
      if (parsed === code) delete unlocked[k];
    }

    const scrub = (val: unknown, obj: any, key: string | number | null) => {
      if (typeof val === "string") {
        const parsed = parseFetishInventoryOrDetailsHandle(val);
        if (parsed === code) {
          if (obj && key !== null) obj[key as any] = "";
        }
        return;
      }
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) scrub(val[i], val, i);
        return;
      }
      if (val && typeof val === "object") {
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) scrub(v, val as any, k);
      }
    };
    scrub(next, null as any, null);

    setWorkingJson(next);
  };

  const setFetishMysteriumTier = (code: FetishCode, value: number) => {
    if (!workingJson) return;
    const tier = Math.max(1, Math.min(3, Math.round(value)));
    const next = structuredClone(workingJson);
    const unlocked = getUnlockedItemsMap(next);
    const key = buildFetishUnlockedKey(code);
    unlocked[key] = tier + 1;
    setWorkingJson(next);
  };

  const renderFetishesSection = () => {
    if (!workingJson) return null;
    const present: Array<{ code: FetishCode; count: number; name: string }> = Array.from(fetishAvailableCodeSet.values())
      .map((code) => ({ code: code as FetishCode, count: fetishInventoryCountMap.get(code) ?? 0, name: (fetishByCode.get(code)?.name ?? code) as string }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const openAdd = () => {
      if (!hasAddableFetishes) return;
      setShowAddFetishModal(true);
    };
    const closeAdd = () => setShowAddFetishModal(false);
    const handleAddSelect = (item: BaseItem | Bead) => {
      if ((item as any)?.category === "Fetishes") {
        addInventoryForFetish(item as BaseItem);
        const remaining = getAllFetishes().filter((it) => ![...excludedFetishesForAdd, (item as BaseItem).id].includes(it.id));
        if (remaining.length === 0) closeAdd();
      }
    };

    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Fetishes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3 w-14"></th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Mysterium Tier</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {present.map(({ code }) => {
                const item = fetishByCode.get(code);
                const name = item?.name ?? code;
                const tier = fetishTierMap.get(code) ?? 1;
                return (
                  <tr key={code} className="border-b border-gray-700">
                    <td className="py-2 px-3">
                      {item?.iconUrl ? (
                        <img src={item.iconUrl} alt={name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12" />)
                      }
                    </td>
                    <td className="py-2 px-3 text-gray-200">{name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        max={3}
                        step={1}
                        value={tier}
                        onChange={(e) => setFetishMysteriumTier(code, Number(e.target.value))}
                        className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeInventoryForFetish(code)}
                        className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center cursor-pointer"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {present.length === 0 && (
                <tr>
                  <td className="py-3 px-3 text-gray-400" colSpan={4}>No fetishes in inventory. Add some with the + button.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasAddableFetishes && (
          <div className="mt-3">
            <button onClick={openAdd} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">+ Add fetish</button>
          </div>
        )}

        {showAddFetishModal && (
          <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[50vh] md:h-[50vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden">
              <img src="/images/texture-transparent.PNG" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                  <h2 className="text-lg text-white font-semibold m-0">Add Fetish</h2>
                  <button className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer" onClick={closeAdd} aria-label="Close item selector" title="Close">×</button>
                </div>
                <div className="px-4">
                  <ItemSelector
                    category="Fetishes"
                    onItemSelect={handleAddSelect}
                    excludedItems={excludedFetishesForAdd}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============ Rings Section ============
  const ringByCode = useMemo(() => {
    const items = getAllRings();
    const map = new Map<string, BaseItem>();
    for (const it of items) {
      const code = getCodeForRingItem(it);
      if (code) map.set(code, it);
    }
    return map;
  }, [workingJson]);

  const ringTierMap = useMemo(() => {
    const m = new Map<string, number>();
    const unlockedItems = workingJson?.Save?.GameInstance?.ProgressManager?.IntegerMaps?.["Progression.Category.Unlocked.Items"]?.map;
    if (unlockedItems && typeof unlockedItems === "object") {
      for (const [k, v] of Object.entries(unlockedItems as Record<string, number>)) {
        const code = parseRingUnlockedKey(k);
        if (!code) continue;
        const stored = Number(v);
        const tier = Math.max(1, Math.min(3, stored - 1));
        m.set(code, tier);
      }
    }
    return m;
  }, [workingJson]);

  const ringInventoryCountMap = useMemo(() => {
    const m = new Map<string, number>();
    const storage = workingJson?.PlayerController?.ItemStorage;
    const seen = new Set<string>();
    const containers = storage?.SaveLoadItemDataContainers;
    if (Array.isArray(containers)) {
      for (const c of containers) {
        const sh = c?.sourceHandle;
        if (typeof sh !== "string") continue;
        const code = parseRingInventoryOrDetailsHandle(sh);
        if (code) {
          seen.add(sh);
          m.set(code, (m.get(code) ?? 0) + 1);
        }
      }
    }
    const abilityDetails = (storage as any)?.SaveLoadAbilityItemDataDetails as Array<AbilityItemDataDetail> | undefined;
    if (Array.isArray(abilityDetails)) {
      for (const d of abilityDetails) {
        const sh = d?.sourceHandle;
        if (typeof sh !== "string" || seen.has(sh)) continue;
        const code = parseRingInventoryOrDetailsHandle(sh);
        if (code) m.set(code, (m.get(code) ?? 0) + 1);
      }
    }
    // Deep scan
    if (workingJson) {
      const visit = (val: unknown) => {
        if (typeof val === "string") {
          const code = parseRingInventoryOrDetailsHandle(val);
          if (code) m.set(code, (m.get(code) ?? 0) + 1);
          return;
        }
        if (Array.isArray(val)) {
          for (const v of val) visit(v);
          return;
        }
        if (val && typeof val === "object") {
          for (const v of Object.values(val as Record<string, unknown>)) visit(v);
        }
      };
      visit(workingJson);
    }
    return m;
  }, [workingJson]);

  const ringAvailableCodeSet = useMemo(() => {
    const set = new Set<string>();
    for (const code of ringInventoryCountMap.keys()) set.add(code);
    for (const code of ringTierMap.keys()) set.add(code);
    const projects = workingJson?.Save?.Subsystems?.Research?.SaveLoadResearchedProjects;
    if (projects && typeof projects === "object") {
      for (const k of Object.keys(projects as Record<string, number>)) {
        const code = parseRingResearchKey(k);
        if (code) set.add(code);
      }
    }
    return set;
  }, [ringInventoryCountMap, ringTierMap, workingJson]);

  const excludedRingsForAdd = useMemo(() => {
    const ids: string[] = [];
    for (const code of ringAvailableCodeSet.values()) {
      const id = ringByCode.get(code)?.id;
      if (typeof id === "string") ids.push(id);
    }
    return ids;
  }, [ringAvailableCodeSet, ringByCode]);

  const hasAddableRings = useMemo(() => {
    return getAllRings().some((it) => !excludedRingsForAdd.includes(it.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedRingsForAdd.join("|")]);

  const addInventoryForRing = (item: BaseItem) => {
    if (!workingJson) return;
    const code = getCodeForRingItem(item);
    if (!code) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);

    let maxId = 0;
    for (const c of containers) {
      if (typeof c.slotId === "number" && c.slotId > maxId) maxId = c.slotId;
      if (typeof c.detailsId === "number" && c.detailsId > maxId) maxId = c.detailsId;
    }
    const weaponDetails = (next.PlayerController?.ItemStorage?.SaveLoadWeaponDataDetails ?? []) as Array<WeaponDataDetail>;
    for (const d of weaponDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    for (const d of abilityDetails) {
      if (typeof d.detailsId === "number" && d.detailsId > maxId) maxId = d.detailsId;
    }
    const nextId = maxId + 1;

    const detailsHandle = buildRingDetailsHandle(code, "Rare");
    const containerHandle = buildRingInventoryHandle(code, "Rare");

    abilityDetails.push({ detailsId: nextId, tierQuestId: -1, sourceHandle: detailsHandle });
    containers.push({
      slotId: nextId,
      detailsId: nextId,
      itemCount: 1,
      bStashed: false,
      dateTimeAdded: formatDateForSave(),
      sourceHandle: containerHandle,
    });

    ensureResearchPath(next);
    const projects = next.Save!.Subsystems!.Research!.SaveLoadResearchedProjects as Record<string, number>;
    projects[buildRingResearchKey(code)] = 1;

    const unlocked = getUnlockedItemsMap(next);
    const unlockedKey = buildRingUnlockedKey(code);
    const current = unlocked[unlockedKey];
    if (typeof current !== "number" || current < 2) unlocked[unlockedKey] = 2;

    setWorkingJson(next);
  };

  const removeInventoryForRing = (code: RingCode) => {
    if (!workingJson) return;
    const next = structuredClone(workingJson);
    const { containers, abilityDetails } = getAbilityInventoryArrays(next);
    const filteredC = containers.filter((c) => {
      const sh = c?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseRingInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    containers.splice(0, containers.length, ...filteredC);
    const filteredD = abilityDetails.filter((d) => {
      const sh = d?.sourceHandle;
      if (typeof sh !== "string") return true;
      const parsed = parseRingInventoryOrDetailsHandle(sh);
      if (!parsed) return true;
      return parsed !== code;
    });
    abilityDetails.splice(0, abilityDetails.length, ...filteredD);

    const research = next.Save?.Subsystems?.Research?.SaveLoadResearchedProjects as Record<string, number> | undefined;
    if (research) {
      for (const k of Object.keys(research)) {
        const parsed = parseRingResearchKey(k);
        if (parsed === code) delete research[k];
      }
    }
    const unlocked = getUnlockedItemsMap(next);
    for (const k of Object.keys(unlocked)) {
      const parsed = parseRingUnlockedKey(k);
      if (parsed === code) delete unlocked[k];
    }
    const quests = next.Save?.Subsystems?.Quest?.SaveLoadQuests;
    if (Array.isArray(quests)) {
      const filteredQ = quests.filter((q) => {
        const sh = q?.sourceHandle;
        if (typeof sh !== "string") return true;
        const parsed = parseRingQuestHandle(sh);
        if (!parsed) return true;
        return parsed.code !== code;
      });
      quests.splice(0, quests.length, ...filteredQ);
    }

    const scrub = (val: unknown, obj: any, key: string | number | null) => {
      if (typeof val === "string") {
        const parsed = parseRingInventoryOrDetailsHandle(val);
        if (parsed === code) {
          if (obj && key !== null) obj[key as any] = "";
        }
        return;
      }
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) scrub(val[i], val, i);
        return;
      }
      if (val && typeof val === "object") {
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) scrub(v, val as any, k);
      }
    };
    scrub(next, null as any, null);

    setWorkingJson(next);
  };

  const setRingMysteriumTier = (code: RingCode, value: number) => {
    if (!workingJson) return;
    const tier = Math.max(1, Math.min(3, Math.round(value)));
    const next = structuredClone(workingJson);
    const unlocked = getUnlockedItemsMap(next);
    const key = buildRingUnlockedKey(code);
    unlocked[key] = tier + 1;
    setWorkingJson(next);
  };

  const renderRingsSection = () => {
    if (!workingJson) return null;
    const present: Array<{ code: RingCode; count: number; name: string }> = Array.from(ringAvailableCodeSet.values())
      .map((code) => ({ code: code as RingCode, count: ringInventoryCountMap.get(code) ?? 0, name: (ringByCode.get(code)?.name ?? code) as string }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    const openAdd = () => {
      if (!hasAddableRings) return;
      setShowAddRingModal(true);
    };
    const closeAdd = () => setShowAddRingModal(false);
    const handleAddSelect = (item: BaseItem | Bead) => {
      if ((item as any)?.category === "Rings") {
        addInventoryForRing(item as BaseItem);
        const remaining = getAllRings().filter((it) => ![...excludedRingsForAdd, (item as BaseItem).id].includes(it.id));
        if (remaining.length === 0) closeAdd();
      }
    };

    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Rings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-[540px] w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="py-2 px-3 w-14"></th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Mysterium Tier</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {present.map(({ code }) => {
                const item = ringByCode.get(code);
                const name = item?.name ?? code;
                const tier = ringTierMap.get(code) ?? 1;
                return (
                  <tr key={code} className="border-b border-gray-700">
                    <td className="py-2 px-3">
                      {item?.iconUrl ? (
                        <img src={item.iconUrl} alt={name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12" />)
                      }
                    </td>
                    <td className="py-2 px-3 text-gray-200">{name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        max={3}
                        step={1}
                        value={tier}
                        onChange={(e) => setRingMysteriumTier(code, Number(e.target.value))}
                        className="w-24 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#ddaf7a]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeInventoryForRing(code)}
                        className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center cursor-pointer"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {present.length === 0 && (
                <tr>
                  <td className="py-3 px-3 text-gray-400" colSpan={4}>No rings in inventory. Add some with the + button.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasAddableRings && (
          <div className="mt-3">
            <button onClick={openAdd} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">+ Add ring</button>
          </div>
        )}

        {showAddRingModal && (
          <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div className="relative pointer-events-auto bg-[#2a2a2a] border border-[#818181] h-[50vh] md:h-[50vh] rounded-lg mx-4 lg:mx-auto lg:max-w-[70%] mb-2 shadow-[0px_0px_40px_5px_rgba(0,0,0,0.95)] overflow-hidden">
              <img src="/images/texture-transparent.PNG" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 bg-[#2a2a2a]">
                  <h2 className="text-lg text-white font-semibold m-0">Add Ring</h2>
                  <button className="text-gray-300 hover:text-white text-2xl leading-none cursor-pointer" onClick={closeAdd} aria-label="Close item selector" title="Close">×</button>
                </div>
                <div className="px-4">
                  <ItemSelector
                    category="Rings"
                    onItemSelect={handleAddSelect}
                    excludedItems={excludedRingsForAdd}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Savefile Editor</h1>

      <div className="bg-[#30303071] border border-gray-700 rounded p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">Open Save File</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-300 mb-1">Choose JSON file</label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) onChooseFile(e.target.files[0]);
              }}
              className="block w-full text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#ddaf7a] file:text-black hover:file:bg-[#e8c295]"
            />
          </div>
          <div className="flex items-end">
            <button
              disabled={!isFSAAvailable}
              onClick={openWithFSA}
              className={`w-full md:w-auto px-4 py-2 rounded font-semibold ${
                isFSAAvailable ? "bg-[#ddaf7a] text-black hover:bg-[#e8c295]" : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isFSAAvailable ? "Open with File System Access" : "File System Access not supported"}
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-between gap-3">
            
            <div className="flex gap-2">
              {fileHandle && (
                <button
                  onClick={saveToSameFile}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Save to File
                </button>
              )}
              <button
                onClick={downloadEdited}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Download Edited Save
              </button>
              <button
                onClick={resetChanges}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        {info && <div className="mt-3 text-green-400">{info}</div>}
        {error && <div className="mt-3 text-red-400">{error}</div>}
      </div>

      {workingJson && (
        <div className="bg-[#30303071] border border-gray-700 rounded p-4">
          

          {renderStatsTable()}
          {renderWeaponsSection()}
          {renderLightSpellsSection()}
          {renderHeavySpellsSection()}
          {renderRelicsSection()}
          {renderFetishesSection()}
          {renderRingsSection()}
        </div>
      )}

      {/* Spacer below the card so page can scroll past the fixed bottom sheet, without extending the card itself */}
      {showAddWeaponModal && (
        <div aria-hidden className="pointer-events-none h-[49vh] md:h-[44vh]" />
      )}
      {showAddLightSpellModal && (
        <div aria-hidden className="pointer-events-none h-[49vh] md:h-[44vh]" />
      )}
      {showAddHeavySpellModal && (
        <div aria-hidden className="pointer-events-none h-[49vh] md:h-[44vh]" />
      )}
      {showAddRelicModal && (
        <div aria-hidden className="pointer-events-none h-[49vh] md:h-[44vh]" />
      )}
      {showAddFetishModal && (
        <div aria-hidden className="pointer-events-none h-[49vh] md:h-[44vh]" />
      )}
      {showAddRingModal && (
        <div aria-hidden className="pointer-events-none h-[49vh] md:h-[44vh]" />
      )}

      {!workingJson && (
        <div className="text-gray-400">Load a JSON save file to start editing stats. Gnosis fields are ignored.</div>
      )}
    </div>
  );
}
