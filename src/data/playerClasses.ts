export type PlayerClassKey =
  | 'AggroChaotic'
  | 'ThinkerPro'
  | 'AggroPro'
  | 'ThinkerChaotic'
  | 'Anointed'
  | 'Forsaken';

export interface PlayerClassInfo {
  key: PlayerClassKey;
  displayName: string; // e.g., Butcher, Hunter
  startingLevel: number;
  base: {
    flesh: number;
    mind: number;
    blood: number;
    witchery: number;
    arsenal: number;
    faith: number;
  };
}

// Derived directly from playerClasses.csv
// CSV columns: Class,SaveFileName,Flesh,Mind,Blood,Witchery,Arsenal,Faith,StartingLevel
const classesByKey: Record<PlayerClassKey, PlayerClassInfo> = {
  AggroChaotic: {
    key: 'AggroChaotic',
    displayName: 'Butcher',
    startingLevel: 6,
    base: { flesh: 14, mind: 13, blood: 14, witchery: 6, arsenal: 8, faith: 10 },
  },
  ThinkerPro: {
    key: 'ThinkerPro',
    displayName: 'Hunter',
    startingLevel: 6,
    base: { flesh: 9, mind: 12, blood: 16, witchery: 8, arsenal: 11, faith: 9 },
  },
  AggroPro: {
    key: 'AggroPro',
    displayName: 'Slayer',
    startingLevel: 6,
    base: { flesh: 13, mind: 8, blood: 12, witchery: 15, arsenal: 7, faith: 10 },
  },
  ThinkerChaotic: {
    key: 'ThinkerChaotic',
    displayName: 'Shadow',
    startingLevel: 6,
    base: { flesh: 8, mind: 11, blood: 8, witchery: 13, arsenal: 13, faith: 12 },
  },
  Anointed: {
    key: 'Anointed',
    displayName: 'Saint',
    startingLevel: 1,
    base: { flesh: 9, mind: 9, blood: 9, witchery: 9, arsenal: 9, faith: 15 },
  },
  Forsaken: {
    key: 'Forsaken',
    displayName: 'Penitent',
    startingLevel: 1,
    base: { flesh: 9, mind: 9, blood: 9, witchery: 9, arsenal: 15, faith: 9 },
  },
};

export function getPlayerClassKeyFromSave(playerClassField: string): PlayerClassKey | null {
  if (!playerClassField) return null;
  const key = playerClassField.split('.').pop() as PlayerClassKey | undefined;
  return key && key in classesByKey ? key : null;
}

export function getPlayerClassInfoByKey(key: PlayerClassKey): PlayerClassInfo {
  return classesByKey[key];
}

export function getPlayerClassInfoFromPlayerClass(playerClassField: string): PlayerClassInfo | null {
  const key = getPlayerClassKeyFromSave(playerClassField);
  return key ? classesByKey[key] : null;
}

export function listAllPlayerClasses(): PlayerClassInfo[] {
  return Object.values(classesByKey);
}
