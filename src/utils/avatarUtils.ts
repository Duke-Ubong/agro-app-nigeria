/**
 * High-resolution profile photos of diverse African individuals (male & female)
 * across farming, logistics, trade, cooperatives, and administration.
 * Inspired by the rich cultural diversity of African agricultural communities.
 */

export const NIGERIAN_MALE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', // Abebe Usman / Farmer
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=300&auto=format&fit=crop&q=80', // Alhaji Kabir / Merchant
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', // Babatunde / Transporter
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80', // Dr. Chidi Okafor / Institutional Lead
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', // Engr. Tariq / Technical Lead
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80', // Executive Buyer
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80', // Young Agronomist
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80', // Field Logistics Operator
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80', // Cluster Representative
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&auto=format&fit=crop&q=80', // Grain Supplier
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80', // Ministry Director
  'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=300&auto=format&fit=crop&q=80', // Cooperative Member
];

export const NIGERIAN_FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80', // Hajia Amina Bello / Cooperative Union
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80', // Mrs. Funke Akindele / Procurement Exec
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80', // Mrs. Blessing Adebayo / Ministry Director
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80', // Young Female Farmer
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80', // Cooperative Treasurer
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80', // Agro Merchant
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&auto=format&fit=crop&q=80', // Food Scientist
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', // Smallholder Farmer
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80', // Logistics Dispatcher
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=300&auto=format&fit=crop&q=80', // Seed Distributor
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', // Agronomy Researcher
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80', // Market Union Leader
];

export const DEFAULT_NIGERIAN_MALE_AVATAR = NIGERIAN_MALE_AVATARS[0];
export const DEFAULT_NIGERIAN_FEMALE_AVATAR = NIGERIAN_FEMALE_AVATARS[0];

/**
 * Detects whether a given name/role leans female or male, and returns a consistent
 * African profile picture from the curated collection based on a hash of the identifier.
 */
export const getNigerianAvatar = (
  identifier?: string,
  genderPreference?: 'male' | 'female' | 'auto'
): string => {
  if (!identifier) return DEFAULT_NIGERIAN_MALE_AVATAR;

  const lowerKey = identifier.toLowerCase();

  // Detect gender preference if set to auto
  let isFemale = genderPreference === 'female';
  if (genderPreference !== 'male' && genderPreference !== 'female') {
    const femaleKeywords = [
      'mrs',
      'ms',
      'miss',
      'hajia',
      'hajya',
      'amina',
      'funke',
      'blessing',
      'zainab',
      'chioma',
      'ngozi',
      'grace',
      'mary',
      'fatima',
      'hadiza',
      'halima',
      'aisha',
      'bello',
      'akindele',
      'adebayo',
      'cooperative',
      'union',
      'association',
    ];
    isFemale = femaleKeywords.some((kw) => lowerKey.includes(kw));
  }

  const pool = isFemale ? NIGERIAN_FEMALE_AVATARS : NIGERIAN_MALE_AVATARS;

  // Simple string hashing for deterministic avatar selection
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index];
};

