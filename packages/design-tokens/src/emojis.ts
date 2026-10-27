/**
 * PairUp AI - Curated Emoji System
 * Used for reactions, categories, celebratory moments, and empty states.
 */

export const emojis = {
  dating: ['💖', '💘', '🥰', '💞', '🌹', '💌'],
  friendship: ['🫶', '🤗', '😎', '🌈', '🥳'],
  location: ['📍', '🗺️', '☕', '🌇', '🏞️'],
  messaging: ['💬', '😂', '❤️', '🎙️', '✨'],
  gamingAndHobbies: ['🎮', '🎵', '🎨', '⚽', '📚'],
  voiceCommunities: ['🎧', '🎤', '🎶', '🔥'],
  reactions: ['❤️', '😂', '🔥', '😍', '👏', '🎉', '🤯', '💯'],
  categories: {
    dating: '💖',
    friendship: '🫶',
    nearby: '📍',
    voiceRooms: '🎧',
    events: '🎉',
    gaming: '🎮',
    musicMovies: '🎵',
    sports: '⚽',
    travel: '✈️',
    fitness: '🏃',
    books: '📚',
    foodCafes: '☕',
    technology: '💻',
    languageExchange: '🌎',
    studyPartners: '🎓',
    localCommunities: '🌈',
    artCreativity: '🎨'
  }
} as const;
