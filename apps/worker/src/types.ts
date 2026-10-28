export enum QueueName {
  MODERATION = 'moderation_queue',
  NOTIFICATIONS = 'notifications_queue',
  ACTIVITY_SURGE = 'activity_surge_queue',
  SAFETY_GUARD = 'safety_guard_queue',
  RECOMMENDATIONS = 'recommendations_queue',
  PRIVACY_COMPLIANCE = 'privacy_compliance_queue'
}

export interface ModerationJobData {
  jobId: string;
  targetId: string;
  targetType: 'PROFILE_BIO' | 'CHAT_MESSAGE' | 'IMAGE_UPLOAD' | 'VOICE_ROOM_TOPIC';
  userId: string;
  content: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface NotificationJobData {
  jobId: string;
  recipientId: string;
  type: 'MATCH_ALERT' | 'CHAT_MESSAGE' | 'VOICE_NOTE' | 'ACTIVITY_SURGE' | 'DATE_CHECKIN' | 'EMERGENCY_SOS';
  title: string;
  body: string;
  channel: 'PUSH' | 'SMS' | 'EMAIL';
  phone?: string;
  email?: string;
  data?: Record<string, any>;
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
}

export interface ActivitySurgeJobData {
  city: string;
  latitude: number;
  longitude: number;
  activeCount: number;
  timeBucket: string;
}

export interface SafetyGuardJobData {
  guardId: string;
  userId: string;
  partnerName: string;
  venue: string;
  emergencyContact: string;
  scheduledCheckInTime: string;
  status: 'PENDING' | 'CHECKED_IN' | 'ESCALATED' | 'RESOLVED';
}

export interface RecommendationJobData {
  userId: string;
  interests: string[];
  intention: string;
  city: string;
  preferredAgeMin: number;
  preferredAgeMax: number;
  refreshLimit: number;
}

export interface PrivacyComplianceJobData {
  task: 'PURGE_EXPIRED_OTPS' | 'PURGE_RAW_GPS_TELEMETRY' | 'PROCESS_ACCOUNT_DELETION' | 'ANONYMIZE_CALL_LOGS';
  olderThanHours?: number;
  userId?: string;
}
