// Curated word lists for friendly room codes
// Format: Adjective-PluralNoun-Number (e.g., happy-lions-42)

const ADJECTIVES = [
  'happy', 'brave', 'fast', 'red', 'cool', 'silly', 'wild', 'calm', 'brightly',
  'sunny', 'rainy', 'stormy', 'cloudy', 'windy', 'snowy', 'foggy', 'misty',
  'quick', 'slow', 'lazy', 'sleepy', 'tired', 'awake', 'alert', 'sharp',
  'soft', 'hard', 'smooth', 'rough', 'fuzzy', 'furry', 'hairy', 'bald',
  'big', 'small', 'tiny', 'huge', 'massive', 'mini', 'micro', 'mega',
  'sweet', 'sour', 'bitter', 'salty', 'spicy', 'mild', 'hot', 'cold',
  'warm', 'fresh', 'stale', 'new', 'old', 'young', 'ancient', 'modern',
  'loud', 'quiet', 'noisy', 'silent', 'musical', 'rhythmic', 'melodic',
  'sharp', 'dull', 'blunt', 'pointed', 'round', 'square', 'triangular',
  'golden', 'silver', 'bronze', 'copper', 'iron', 'steel', 'wooden',
  'plastic', 'glass', 'crystal', 'diamond', 'ruby', 'emerald', 'sapphire',
  'brave', 'cowardly', 'fearless', 'scared', 'nervous', 'calm', 'angry',
  'joyful', 'sad', 'melancholy', 'cheerful', 'gloomy', 'bright', 'dark'
];

const NOUNS = [
  // Fantasy & Magic
  'wizards', 'mages', 'sorcerers', 'warlocks', 'witches', 'druids', 'shamans',
  'enchanters', 'conjurers', 'illusionists', 'alchemists', 'mystics', 'oracles',
  // Warriors & Fighters
  'knights', 'paladins', 'warriors', 'gladiators', 'champions', 'berserkers',
  'samurai', 'ronin', 'spartans', 'vikings', 'crusaders', 'templars', 'sentinels',
  // Rogues & Shadows
  'ninjas', 'assassins', 'rogues', 'thieves', 'bandits', 'outlaws', 'rebels',
  'phantoms', 'shadows', 'specters', 'wraiths', 'ghosts', 'spirits', 'haunters',
  // Adventurers & Explorers
  'pirates', 'buccaneers', 'corsairs', 'privateers', 'sailors', 'voyagers',
  'explorers', 'wanderers', 'nomads', 'drifters', 'seekers', 'pathfinders',
  // Mythical Beings
  'dragons', 'phoenixes', 'unicorns', 'griffins', 'hydras', 'basilisks',
  'chimeras', 'sphinxes', 'cyclopes', 'titans', 'giants', 'golems', 'gargoyles',
  // Celestial & Divine
  'angels', 'seraphs', 'celestials', 'guardians', 'protectors', 'watchers',
  'prophets', 'sages', 'seers', 'visionaries', 'dreamers', 'stargazers',
  // Robots & Sci-Fi
  'robots', 'androids', 'cyborgs', 'mechs', 'automatons', 'synthetics',
  'replicants', 'drones', 'sentries', 'circuits', 'pilots', 'cadets',
  // Heroes & Legends
  'heroes', 'legends', 'icons', 'mavericks', 'trailblazers', 'pioneers',
  'vanguards', 'elites', 'aces', 'prodigies', 'virtuosos', 'maestros',
  // Tricksters & Jesters
  'tricksters', 'jesters', 'jokers', 'pranksters', 'wildcards', 'rascals',
  'scoundrels', 'mischief', 'imps', 'gremlins', 'sprites', 'pixies', 'fairies',
  // Cosmic & Mysterious
  'cosmonauts', 'starfarers', 'voyagers', 'travelers', 'dimensionals', 'eternals'
];

/**
 * Generates a friendly room ID in the format: adjective-noun-number
 * Example: happy-lions-42
 */
export function generateRoomId(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 90) + 10; // 10-99
  
  return `${adjective}-${noun}-${number}`;
}

/**
 * Formats a room ID for display in the lobby
 * Example: happy-lions-42 -> Happy Lions [42]
 */
export function formatRoomId(roomId: string): string {
  const parts = roomId.split('-');
  if (parts.length !== 3) return roomId; // Fallback for invalid format
  
  const [adjective, noun, number] = parts;
  
  // Capitalize first letter of each word
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
  const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1);
  
  return `${capitalizedAdjective} ${capitalizedNoun} [${number}]`;
}

/**
 * Normalizes user input to match the canonical room ID format
 * - Converts to lowercase
 * - Replaces any sequence of non-alphanumeric characters with a single hyphen
 * - Example: "Happy Lions 42" -> "happy-lions-42"
 * - Example: "Happy-Lions-42" -> "happy-lions-42"
 * - Example: "Happy__Lions--42" -> "happy-lions-42"
 */
export function normalizeRoomId(input: string): string {
  // Convert to lowercase
  let normalized = input.toLowerCase();
  
  // Replace any sequence of non-alphanumeric characters with a single hyphen
  normalized = normalized.replace(/[^a-z0-9]+/g, '-');
  
  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, '');
  
  return normalized;
}
