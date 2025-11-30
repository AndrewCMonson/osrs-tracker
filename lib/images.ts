/**
 * OSRS Wiki image URLs for skills, bosses, and account types
 */

import { SkillName } from '@/types/skills';
import { BossName } from '@/types/bosses';
import { AccountType } from '@/types/player';

const WIKI_BASE = 'https://oldschool.runescape.wiki/images';

/**
 * Skill icon URLs from OSRS Wiki
 */
export const SKILL_ICONS: Record<SkillName, string> = {
  attack: `${WIKI_BASE}/Attack_icon.png`,
  defence: `${WIKI_BASE}/Defence_icon.png`,
  strength: `${WIKI_BASE}/Strength_icon.png`,
  hitpoints: `${WIKI_BASE}/Hitpoints_icon.png`,
  ranged: `${WIKI_BASE}/Ranged_icon.png`,
  prayer: `${WIKI_BASE}/Prayer_icon.png`,
  magic: `${WIKI_BASE}/Magic_icon.png`,
  cooking: `${WIKI_BASE}/Cooking_icon.png`,
  woodcutting: `${WIKI_BASE}/Woodcutting_icon.png`,
  fletching: `${WIKI_BASE}/Fletching_icon.png`,
  fishing: `${WIKI_BASE}/Fishing_icon.png`,
  firemaking: `${WIKI_BASE}/Firemaking_icon.png`,
  crafting: `${WIKI_BASE}/Crafting_icon.png`,
  smithing: `${WIKI_BASE}/Smithing_icon.png`,
  mining: `${WIKI_BASE}/Mining_icon.png`,
  herblore: `${WIKI_BASE}/Herblore_icon.png`,
  agility: `${WIKI_BASE}/Agility_icon.png`,
  thieving: `${WIKI_BASE}/Thieving_icon.png`,
  slayer: `${WIKI_BASE}/Slayer_icon.png`,
  farming: `${WIKI_BASE}/Farming_icon.png`,
  runecraft: `${WIKI_BASE}/Runecraft_icon.png`,
  hunter: `${WIKI_BASE}/Hunter_icon.png`,
  construction: `${WIKI_BASE}/Construction_icon.png`,
  sailing: `${WIKI_BASE}/Sailing_icon.png`,
};

/**
 * Account type icons from OSRS Wiki
 */
export const ACCOUNT_TYPE_ICONS: Record<AccountType, string | null> = {
  normal: null, // No icon for normal accounts
  ironman: `${WIKI_BASE}/Ironman_chat_badge.png`,
  hardcore_ironman: `${WIKI_BASE}/Hardcore_ironman_chat_badge.png`,
  ultimate_ironman: `${WIKI_BASE}/Ultimate_ironman_chat_badge.png`,
  group_ironman: `${WIKI_BASE}/Group_ironman_chat_badge.png`,
  hardcore_group_ironman: `${WIKI_BASE}/Hardcore_group_ironman_chat_badge.png`,
  unranked_group_ironman: `${WIKI_BASE}/Unranked_group_ironman_chat_badge.png`,
  skiller: null,
  defence_pure: null,
};

/**
 * Boss icon URLs from OSRS Wiki
 * Pattern: Most bosses use {Boss_Name}.png (the monster image)
 * Some use _icon.png suffix for hiscores icons
 * Raids/activities use the final boss or a representative image
 */
export const BOSS_ICONS: Record<BossName, string> = {
  abyssal_sire: `${WIKI_BASE}/Abyssal_Sire.png`,
  alchemical_hydra: `${WIKI_BASE}/Alchemical_Hydra_%28serpentine%29.png`,
  amoxliatl: `${WIKI_BASE}/Amoxliatl.png`,
  araxxor: `${WIKI_BASE}/Araxxor.png`,
  artio: `${WIKI_BASE}/Artio.png`,
  barrows_chests: `${WIKI_BASE}/Chest_%28Barrows%29.png`,
  bryophyta: `${WIKI_BASE}/Bryophyta.png`,
  callisto: `${WIKI_BASE}/Callisto.png`,
  calvarion: `${WIKI_BASE}/Calvar%27ion.png`,
  cerberus: `${WIKI_BASE}/Cerberus.png`,
  chambers_of_xeric: `${WIKI_BASE}/Great_Olm.png`,
  chambers_of_xeric_challenge_mode: `${WIKI_BASE}/Great_Olm.png`,
  chaos_elemental: `${WIKI_BASE}/Chaos_Elemental.png`,
  chaos_fanatic: `${WIKI_BASE}/Chaos_Fanatic.png`,
  commander_zilyana: `${WIKI_BASE}/Commander_Zilyana.png`,
  corporeal_beast: `${WIKI_BASE}/Corporeal_Beast.png`,
  crazy_archaeologist: `${WIKI_BASE}/Crazy_archaeologist.png`,
  dagannoth_prime: `${WIKI_BASE}/Dagannoth_Prime.png`,
  dagannoth_rex: `${WIKI_BASE}/Dagannoth_Rex.png`,
  dagannoth_supreme: `${WIKI_BASE}/Dagannoth_Supreme.png`,
  deranged_archaeologist: `${WIKI_BASE}/Deranged_archaeologist.png`,
  doom_of_mokhaiotl: `${WIKI_BASE}/Doom_of_Mokhaiotl.png`,
  duke_sucellus: `${WIKI_BASE}/Duke_Sucellus.png`,
  general_graardor: `${WIKI_BASE}/General_Graardor.png`,
  giant_mole: `${WIKI_BASE}/Giant_Mole.png`,
  grotesque_guardians: `${WIKI_BASE}/Dawn.png`,
  hespori: `${WIKI_BASE}/Hespori.png`,
  kalphite_queen: `${WIKI_BASE}/Kalphite_Queen.png`,
  king_black_dragon: `${WIKI_BASE}/King_Black_Dragon.png`,
  kraken: `${WIKI_BASE}/Kraken.png`,
  kreearra: `${WIKI_BASE}/Kree%27arra.png`,
  kril_tsutsaroth: `${WIKI_BASE}/K%27ril_Tsutsaroth.png`,
  lunar_chests: `${WIKI_BASE}/Lunar_Chest_%28closed%29.png`,
  mimic: `${WIKI_BASE}/The_Mimic.png`,
  nex: `${WIKI_BASE}/Nex.png`,
  nightmare: `${WIKI_BASE}/The_Nightmare.png`,
  phosanis_nightmare: `${WIKI_BASE}/The_Nightmare.png`,
  obor: `${WIKI_BASE}/Obor.png`,
  phantom_muspah: `${WIKI_BASE}/Phantom_Muspah_%28ranged%29.png`,
  sarachnis: `${WIKI_BASE}/Sarachnis.png`,
  scorpia: `${WIKI_BASE}/Scorpia.png`,
  scurrius: `${WIKI_BASE}/Scurrius.png`,
  shellbane_gryphon: `${WIKI_BASE}/Shellbane_Gryphon.png`,
  skotizo: `${WIKI_BASE}/Skotizo.png`,
  sol_heredit: `${WIKI_BASE}/Sol_Heredit.png`,
  spindel: `${WIKI_BASE}/Spindel.png`,
  tempoross: `${WIKI_BASE}/Tempoross.png`,
  the_gauntlet: `${WIKI_BASE}/Crystalline_Hunllef.png`,
  the_corrupted_gauntlet: `${WIKI_BASE}/Corrupted_Hunllef.png`,
  the_hueycoatl: `${WIKI_BASE}/The_Hueycoatl.png`,
  the_leviathan: `${WIKI_BASE}/The_Leviathan.png`,
  the_royal_titans: `${WIKI_BASE}/Eldric_the_Ice_King.png`,
  the_whisperer: `${WIKI_BASE}/The_Whisperer.png`,
  theatre_of_blood: `${WIKI_BASE}/Verzik_Vitur.png`,
  theatre_of_blood_hard_mode: `${WIKI_BASE}/Verzik_Vitur.png`,
  thermonuclear_smoke_devil: `${WIKI_BASE}/Thermonuclear_smoke_devil.png`,
  tombs_of_amascut: `${WIKI_BASE}/Tumeken%27s_Warden.png`,
  tombs_of_amascut_expert: `${WIKI_BASE}/Tumeken%27s_Warden.png`,
  tzkal_zuk: `${WIKI_BASE}/TzKal-Zuk.png`,
  tztok_jad: `${WIKI_BASE}/TzTok-Jad.png`,
  vardorvis: `${WIKI_BASE}/Vardorvis.png`,
  venenatis: `${WIKI_BASE}/Venenatis.png`,
  vetion: `${WIKI_BASE}/Vet%27ion.png`,
  vorkath: `${WIKI_BASE}/Vorkath.png`,
  wintertodt: `${WIKI_BASE}/Doors_of_Dinh.png`,
  yama: `${WIKI_BASE}/Yama.png`,
  zalcano: `${WIKI_BASE}/Zalcano.png`,
  zulrah: `${WIKI_BASE}/Zulrah_%28serpentine%29.png`,
};

/**
 * Get skill icon URL
 */
export function getSkillIcon(skill: SkillName): string {
  return SKILL_ICONS[skill];
}

/**
 * Get boss icon URL
 */
export function getBossIcon(boss: BossName): string {
  return BOSS_ICONS[boss];
}

/**
 * Get account type icon URL (returns null for normal accounts)
 */
export function getAccountTypeIcon(accountType: AccountType): string | null {
  return ACCOUNT_TYPE_ICONS[accountType];
}

