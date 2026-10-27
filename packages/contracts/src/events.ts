export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  ERROR: 'error',

  // Presence
  USER_ONLINE: 'presence:user_online',
  USER_OFFLINE: 'presence:user_offline',
  SUBSCRIBE_PRESENCE: 'presence:subscribe',

  // Chat
  JOIN_CONVERSATION: 'chat:join',
  LEAVE_CONVERSATION: 'chat:leave',
  NEW_MESSAGE: 'chat:message_received',
  MESSAGE_SENT: 'chat:message_sent',
  MESSAGE_DELIVERED: 'chat:message_delivered',
  MESSAGE_READ: 'chat:message_read',
  TYPING_START: 'chat:typing_start',
  TYPING_STOP: 'chat:typing_stop',
  MESSAGE_REACTION: 'chat:message_reaction',

  // Matches
  NEW_MATCH: 'match:created',

  // Calls
  CALL_INVITE: 'call:invite',
  CALL_ACCEPTED: 'call:accepted',
  CALL_DECLINED: 'call:declined',
  CALL_ENDED: 'call:ended',
  CALL_SIGNAL: 'call:signal',

  // Voice Rooms
  ROOM_JOINED: 'room:user_joined',
  ROOM_LEFT: 'room:user_left',
  ROOM_HAND_RAISED: 'room:hand_raised',
  ROOM_SPEAKER_PROMOTED: 'room:speaker_promoted',
  ROOM_MUTED: 'room:user_muted'
} as const;
