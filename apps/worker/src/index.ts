import { ModerationWorker } from './queues/moderation.worker';
import { NotificationsWorker } from './queues/notifications.worker';
import { SurgeWorker } from './queues/surge.worker';
import { SafetyGuardWorker } from './queues/safety-guard.worker';
import { RecommendationsWorker } from './queues/recommendations.worker';
import { PrivacyWorker } from './queues/privacy.worker';
import { QueueName } from './types';

console.log('===========================================================');
console.log('🚀 PairUp Distributed Background Workers Online');
console.log('===========================================================');
console.log(`[QueueRegistered] ${QueueName.MODERATION} (Text/Image NSFW & Safety)`);
console.log(`[QueueRegistered] ${QueueName.NOTIFICATIONS} (Push/SMS/Email Delivery)`);
console.log(`[QueueRegistered] ${QueueName.ACTIVITY_SURGE} (Geo-Spatial Heatmap & Multipliers)`);
console.log(`[QueueRegistered] ${QueueName.SAFETY_GUARD} (Active Date Check-In & SOS Watchdog)`);
console.log(`[QueueRegistered] ${QueueName.RECOMMENDATIONS} (Compatibility Scoring)`);
console.log(`[QueueRegistered] ${QueueName.PRIVACY_COMPLIANCE} (DPDP / GDPR Data Purge)`);
console.log('===========================================================');

// Health check heartbeat for supervisor / Kubernetes
setInterval(() => {
  const memUsageMb = Math.round(process.memoryUsage().rss / 1024 / 1024);
  console.log(`[WorkerHeartbeat] Status: HEALTHY • RSS: ${memUsageMb} MB • Active Queues: 6`);
}, 60000);

export {
  ModerationWorker,
  NotificationsWorker,
  SurgeWorker,
  SafetyGuardWorker,
  RecommendationsWorker,
  PrivacyWorker
};
