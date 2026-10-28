import { ModerationJobData } from '../types';

export class ModerationWorker {
  // Prohibited toxic and abusive patterns
  private static readonly HARASSMENT_KEYWORDS = [
    'hate', 'abusive', 'kill', 'threat', 'extort', 'blackmail', 'scam', 'send money', 'gpay', 'paytm to'
  ];

  private static readonly UNDERAGE_KEYWORDS = [
    'underage', 'school kid', 'minor', '16 yo', '17 yo', '15 yo', 'tenth class'
  ];

  public static async process(job: ModerationJobData): Promise<{
    approved: boolean;
    flagged: boolean;
    confidence: number;
    violationType?: string;
    actionTaken: 'APPROVE' | 'FLAG_FOR_HUMAN' | 'AUTO_SUSPEND';
  }> {
    const text = (job.content || '').toLowerCase();
    const isImage = job.targetType === 'IMAGE_UPLOAD';

    // 1. Underage Account Screening (Zero Tolerance)
    for (const keyword of this.UNDERAGE_KEYWORDS) {
      if (text.includes(keyword)) {
        return {
          approved: false,
          flagged: true,
          confidence: 0.98,
          violationType: 'UNDERAGE_ACCOUNT_SUSPECT',
          actionTaken: 'AUTO_SUSPEND'
        };
      }
    }

    // 2. Financial Scam & Commercial Solicitation
    for (const keyword of this.HARASSMENT_KEYWORDS) {
      if (text.includes(keyword)) {
        return {
          approved: false,
          flagged: true,
          confidence: 0.88,
          violationType: 'HARASSMENT_OR_FINANCIAL_FRAUD',
          actionTaken: 'FLAG_FOR_HUMAN'
        };
      }
    }

    // 3. Unsolicited contact detail exchange detection (Phone numbers / UPI handles)
    const phoneRegex = /(\+?91[\-\s]?)?[6-9]\d{9}/;
    const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/;

    if (phoneRegex.test(text) || upiRegex.test(text)) {
      if (job.targetType === 'PROFILE_BIO') {
        // Disallow public phone numbers and UPI in bio for safety
        return {
          approved: false,
          flagged: true,
          confidence: 0.95,
          violationType: 'PUBLIC_CONTACT_INFO_IN_BIO',
          actionTaken: 'FLAG_FOR_HUMAN'
        };
      }
    }

    // 4. Media photo hash analysis (Simulated NSFW & SafeSearch check)
    if (isImage && job.mediaUrl) {
      // In production, invoke AWS Rekognition / Google Vision API or open-source NSFWJS model
      const isKnownNsfwHash = job.mediaUrl.includes('flagged_unsafe_hash');
      if (isKnownNsfwHash) {
        return {
          approved: false,
          flagged: true,
          confidence: 0.99,
          violationType: 'EXPLICIT_OR_NSFW_MEDIA',
          actionTaken: 'AUTO_SUSPEND'
        };
      }
    }

    return {
      approved: true,
      flagged: false,
      confidence: 0.95,
      actionTaken: 'APPROVE'
    };
  }
}
