export const API_PREFIX = '/api/v1';

export const API_ROUTES = {
  // Authentication & Session
  AUTH: {
    SIGNUP: `${API_PREFIX}/auth/signup`,
    LOGIN: `${API_PREFIX}/auth/login`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    REQUEST_OTP: `${API_PREFIX}/auth/otp/request`,
    VERIFY_OTP: `${API_PREFIX}/auth/otp/verify`,
    ME: `${API_PREFIX}/auth/me`,
    CHANGE_PASSWORD: `${API_PREFIX}/auth/password/change`
  },

  // User Profile
  PROFILES: {
    MY_PROFILE: `${API_PREFIX}/profiles/me`,
    GET_BY_ID: (id: string) => `${API_PREFIX}/profiles/${id}`,
    UPDATE: `${API_PREFIX}/profiles/me`,
    UPLOAD_PHOTO: `${API_PREFIX}/profiles/me/photos`,
    DELETE_PHOTO: (photoId: string) => `${API_PREFIX}/profiles/me/photos/${photoId}`,
    REORDER_PHOTOS: `${API_PREFIX}/profiles/me/photos/reorder`,
    INTERESTS_LIST: `${API_PREFIX}/profiles/interests`
  },

  // Location Services
  LOCATION: {
    UPDATE: `${API_PREFIX}/location/update`,
    CURRENT: `${API_PREFIX}/location/me`,
    NEARBY_USERS: `${API_PREFIX}/location/nearby`,
    MANUAL_CITY: `${API_PREFIX}/location/city`
  },

  // Swipe, Matching & Discovery
  DISCOVERY: {
    FEED: `${API_PREFIX}/discovery/feed`,
    SWIPE: `${API_PREFIX}/discovery/swipe`,
    REWIND: `${API_PREFIX}/discovery/rewind`,
    MATCHES: `${API_PREFIX}/discovery/matches`,
    UNMATCH: (matchId: string) => `${API_PREFIX}/discovery/matches/${matchId}`,
    LIKES_RECEIVED: `${API_PREFIX}/discovery/likes-received`
  },

  // Real-Time Chat & Conversations
  CHAT: {
    CONVERSATIONS: `${API_PREFIX}/chat/conversations`,
    GET_CONVERSATION: (id: string) => `${API_PREFIX}/chat/conversations/${id}`,
    MESSAGES: (convId: string) => `${API_PREFIX}/chat/conversations/${convId}/messages`,
    SEND_MESSAGE: (convId: string) => `${API_PREFIX}/chat/conversations/${convId}/messages`,
    ADD_REACTION: (convId: string, msgId: string) =>
      `${API_PREFIX}/chat/conversations/${convId}/messages/${msgId}/reactions`,
    UPLOAD_VOICE: `${API_PREFIX}/chat/upload-voice`
  },

  // Calls & Signaling
  CALLS: {
    INITIATE: `${API_PREFIX}/calls/initiate`,
    RESPOND: (id: string) => `${API_PREFIX}/calls/${id}/respond`,
    END: (id: string) => `${API_PREFIX}/calls/${id}/end`
  },

  // Voice Rooms & Communities
  ROOMS: {
    LIST: `${API_PREFIX}/rooms`,
    CREATE: `${API_PREFIX}/rooms`,
    GET_BY_ID: (id: string) => `${API_PREFIX}/rooms/${id}`,
    JOIN: (id: string) => `${API_PREFIX}/rooms/${id}/join`,
    LEAVE: (id: string) => `${API_PREFIX}/rooms/${id}/leave`,
    RAISE_HAND: (id: string) => `${API_PREFIX}/rooms/${id}/raise-hand`
  },

  // Events
  EVENTS: {
    LIST: `${API_PREFIX}/events`,
    CREATE: `${API_PREFIX}/events`,
    GET_BY_ID: (id: string) => `${API_PREFIX}/events/${id}`,
    REGISTER: (id: string) => `${API_PREFIX}/events/${id}/register`,
    CANCEL_REGISTRATION: (id: string) => `${API_PREFIX}/events/${id}/register`
  },

  // Moderation & Safety
  SAFETY: {
    REPORT: `${API_PREFIX}/safety/report`,
    BLOCK: `${API_PREFIX}/safety/block`,
    UNBLOCK: (userId: string) => `${API_PREFIX}/safety/block/${userId}`,
    BLOCKED_USERS: `${API_PREFIX}/safety/blocked-users`
  },

  // AI Services
  AI: {
    COMPATIBILITY_REASONS: `${API_PREFIX}/ai/compatibility-reasons`,
    ICEBREAKERS: `${API_PREFIX}/ai/icebreakers`,
    PROFILE_SUGGESTIONS: `${API_PREFIX}/ai/profile-assist`
  },

  // Admin Dashboard
  ADMIN: {
    METRICS: `${API_PREFIX}/admin/metrics`,
    USERS: `${API_PREFIX}/admin/users`,
    USER_STATUS: (userId: string) => `${API_PREFIX}/admin/users/${userId}/status`,
    REPORTS: `${API_PREFIX}/admin/reports`,
    RESOLVE_REPORT: (reportId: string) => `${API_PREFIX}/admin/reports/${reportId}/resolve`,
    CATEGORIES: `${API_PREFIX}/admin/categories`,
    AUDIT_LOGS: `${API_PREFIX}/admin/audit-logs`
  }
} as const;
