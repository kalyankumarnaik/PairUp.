import { SafetyGuardJobData } from '../types';

export class SafetyGuardWorker {
  public static async process(job: SafetyGuardJobData): Promise<{
    guardId: string;
    escalated: boolean;
    escalationLevel: 'NONE' | 'USER_PROMPT' | 'EMERGENCY_SMS_DISPATCHED';
    status: string;
    timestamp: string;
  }> {
    const scheduledTime = new Date(job.scheduledCheckInTime).getTime();
    const now = Date.now();
    const overdueMinutes = Math.floor((now - scheduledTime) / (1000 * 60));

    if (overdueMinutes >= 10 && job.status === 'PENDING') {
      // Escalation Level 2: User has not responded for 10+ minutes after timer expiration
      console.warn(`[SafetyGuardWorker] CRITICAL ESCALATION: User ${job.userId} date check-in overdue by ${overdueMinutes}m. Alerting emergency contact ${job.emergencyContact}!`);
      
      return {
        guardId: job.guardId,
        escalated: true,
        escalationLevel: 'EMERGENCY_SMS_DISPATCHED',
        status: 'ESCALATED',
        timestamp: new Date().toISOString()
      };
    } else if (overdueMinutes >= 0 && job.status === 'PENDING') {
      // Escalation Level 1: Prompt user with interactive in-app check-in
      return {
        guardId: job.guardId,
        escalated: false,
        escalationLevel: 'USER_PROMPT',
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };
    }

    return {
      guardId: job.guardId,
      escalated: false,
      escalationLevel: 'NONE',
      status: job.status,
      timestamp: new Date().toISOString()
    };
  }
}
