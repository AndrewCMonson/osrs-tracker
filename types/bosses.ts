/**
 * OSRS Boss definitions and types
 */

export const BOSSES = [
  'abyssal_sire',
  'alchemical_hydra',
  'amoxliatl',
  'araxxor',
  'artio',
  'barrows_chests',
  'bryophyta',
  'callisto',
  'calvarion',
  'cerberus',
  'chambers_of_xeric',
  'chambers_of_xeric_challenge_mode',
  'chaos_elemental',
  'chaos_fanatic',
  'commander_zilyana',
  'corporeal_beast',
  'crazy_archaeologist',
  'dagannoth_prime',
  'dagannoth_rex',
  'dagannoth_supreme',
  'deranged_archaeologist',
  'doom_of_mokhaiotl',
  'duke_sucellus',
  'general_graardor',
  'giant_mole',
  'grotesque_guardians',
  'hespori',
  'kalphite_queen',
  'king_black_dragon',
  'kraken',
  'kreearra',
  'kril_tsutsaroth',
  'lunar_chests',
  'mimic',
  'nex',
  'nightmare',
  'phosanis_nightmare',
  'obor',
  'phantom_muspah',
  'sarachnis',
  'scorpia',
  'scurrius',
  'shellbane_gryphon',
  'skotizo',
  'sol_heredit',
  'spindel',
  'tempoross',
  'the_gauntlet',
  'the_corrupted_gauntlet',
  'the_hueycoatl',
  'the_leviathan',
  'the_royal_titans',
  'the_whisperer',
  'theatre_of_blood',
  'theatre_of_blood_hard_mode',
  'thermonuclear_smoke_devil',
  'tombs_of_amascut',
  'tombs_of_amascut_expert',
  'tzkal_zuk',
  'tztok_jad',
  'vardorvis',
  'venenatis',
  'vetion',
  'vorkath',
  'wintertodt',
  'yama',
  'zalcano',
  'zulrah',
] as const;

export type BossName = (typeof BOSSES)[number];

export interface BossData {
  name: BossName;
  rank: number;
  killCount: number;
}

export type PlayerBosses = Record<BossName, BossData>;

// Human-readable boss names
export const BOSS_DISPLAY_NAMES: Record<BossName, string> = {
  abyssal_sire: 'Abyssal Sire',
  alchemical_hydra: 'Alchemical Hydra',
  amoxliatl: 'Amoxliatl',
  araxxor: 'Araxxor',
  artio: 'Artio',
  barrows_chests: 'Barrows Chests',
  bryophyta: 'Bryophyta',
  callisto: 'Callisto',
  calvarion: "Calvar'ion",
  cerberus: 'Cerberus',
  chambers_of_xeric: 'Chambers of Xeric',
  chambers_of_xeric_challenge_mode: 'Chambers of Xeric (CM)',
  chaos_elemental: 'Chaos Elemental',
  chaos_fanatic: 'Chaos Fanatic',
  commander_zilyana: 'Commander Zilyana',
  corporeal_beast: 'Corporeal Beast',
  crazy_archaeologist: 'Crazy Archaeologist',
  dagannoth_prime: 'Dagannoth Prime',
  dagannoth_rex: 'Dagannoth Rex',
  dagannoth_supreme: 'Dagannoth Supreme',
  deranged_archaeologist: 'Deranged Archaeologist',
  doom_of_mokhaiotl: 'Doom of Mokhaiotl',
  duke_sucellus: 'Duke Sucellus',
  general_graardor: 'General Graardor',
  giant_mole: 'Giant Mole',
  grotesque_guardians: 'Grotesque Guardians',
  hespori: 'Hespori',
  kalphite_queen: 'Kalphite Queen',
  king_black_dragon: 'King Black Dragon',
  kraken: 'Kraken',
  kreearra: "Kree'arra",
  kril_tsutsaroth: "K'ril Tsutsaroth",
  lunar_chests: 'Lunar Chests',
  mimic: 'Mimic',
  nex: 'Nex',
  nightmare: 'Nightmare',
  phosanis_nightmare: "Phosani's Nightmare",
  obor: 'Obor',
  phantom_muspah: 'Phantom Muspah',
  sarachnis: 'Sarachnis',
  scorpia: 'Scorpia',
  scurrius: 'Scurrius',
  shellbane_gryphon: 'Shellbane Gryphon',
  skotizo: 'Skotizo',
  sol_heredit: 'Sol Heredit',
  spindel: 'Spindel',
  tempoross: 'Tempoross',
  the_gauntlet: 'The Gauntlet',
  the_corrupted_gauntlet: 'The Corrupted Gauntlet',
  the_hueycoatl: 'The Hueycoatl',
  the_leviathan: 'The Leviathan',
  the_royal_titans: 'The Royal Titans',
  the_whisperer: 'The Whisperer',
  theatre_of_blood: 'Theatre of Blood',
  theatre_of_blood_hard_mode: 'Theatre of Blood (HM)',
  thermonuclear_smoke_devil: 'Thermonuclear Smoke Devil',
  tombs_of_amascut: 'Tombs of Amascut',
  tombs_of_amascut_expert: 'Tombs of Amascut (Expert)',
  tzkal_zuk: 'TzKal-Zuk',
  tztok_jad: 'TzTok-Jad',
  vardorvis: 'Vardorvis',
  venenatis: 'Venenatis',
  vetion: "Vet'ion",
  vorkath: 'Vorkath',
  wintertodt: 'Wintertodt',
  yama: 'Yama',
  zalcano: 'Zalcano',
  zulrah: 'Zulrah',
};

// KC thresholds for milestones
export const KC_THRESHOLDS = [1, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000] as const;

/**
 * Get the next KC milestone for a boss
 */
export function getNextKcMilestone(currentKc: number): number | null {
  for (const threshold of KC_THRESHOLDS) {
    if (currentKc < threshold) {
      return threshold;
    }
  }
  return null;
}

/**
 * Get all achieved KC milestones
 */
export function getAchievedKcMilestones(currentKc: number): number[] {
  return KC_THRESHOLDS.filter((threshold) => currentKc >= threshold);
}

/**
 * Format kill count
 */
export function formatKc(kc: number): string {
  if (kc >= 10_000) {
    return `${(kc / 1000).toFixed(1)}K`;
  }
  return kc.toLocaleString();
}

