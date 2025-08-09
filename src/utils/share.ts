import LZString from 'lz-string';
import { Loadout, BeadLoadout } from '@/types';

export type ShareCompactV1 = {
  v: 1;
  l: (string | null)[]; // loadout ids [primary, secondary, demonic, light, heavy, relic, fetish, ring]
  b: (string | null)[]; // bead ids [slot1..slot5]
};

const toArrays = (loadout: Loadout, beads: BeadLoadout) => {
  const l: (string | null)[] = [
    loadout.primaryWeapon?.id ?? null,
    loadout.secondaryWeapon?.id ?? null,
    loadout.demonicWeapon?.id ?? null,
    loadout.lightSpell?.id ?? null,
    loadout.heavySpell?.id ?? null,
    loadout.relic?.id ?? null,
    loadout.fetish?.id ?? null,
    loadout.ring?.id ?? null,
  ];
  const b: (string | null)[] = [
    beads.slot1?.id ?? null,
    beads.slot2?.id ?? null,
    beads.slot3?.id ?? null,
    beads.slot4?.id ?? null,
    beads.slot5?.id ?? null,
  ];
  return { l, b };
};

export const buildCompactShareParam = (loadout: Loadout, beads: BeadLoadout): string => {
  const { l, b } = toArrays(loadout, beads);
  const payload: ShareCompactV1 = { v: 1, l, b };
  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
};

export const parseCompactShareParam = (
  s: string
): { loadoutIds: (string | null)[]; beadIds: (string | null)[] } | null => {
  try {
    const json = LZString.decompressFromEncodedURIComponent(s);
    if (!json) return null;
    const obj = JSON.parse(json) as ShareCompactV1;
    if (obj.v !== 1 || !Array.isArray(obj.l) || !Array.isArray(obj.b)) return null;
    const l = obj.l.slice(0, 8) as (string | null)[];
    while (l.length < 8) l.push(null);
    const b = obj.b.slice(0, 5) as (string | null)[];
    while (b.length < 5) b.push(null);
    return { loadoutIds: l, beadIds: b };
  } catch {
    return null;
  }
};
