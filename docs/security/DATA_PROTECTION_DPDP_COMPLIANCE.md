# PairUp Data Protection & Regulatory Compliance Specification
## Alignment with India's Digital Personal Data Protection Act (DPDP Act 2023) & GDPR

This document specifies the technical implementations, data governance frameworks, security safeguards, and privacy lifecycle operations ensuring **PairUp** complies with India's **Digital Personal Data Protection Act (DPDP 2023)** and global privacy standards.

---

## 1. Regulatory Context & Data Fiduciary Obligations

Under the DPDP Act 2023, PairUp operates as a **Data Fiduciary**, collecting personal data from adult users (**Data Principals**) located predominantly within the territory of India.

Core architectural requirements enforced:
1. **Notice & Explicit Consent**: Clear, itemized, multilingual consent notices presented before processing personal data.
2. **Adult Verification Gate**: Strict prohibition against processing data of children (under 18 years of age) under Section 9 of the DPDP Act.
3. **Purpose Limitation**: Personal data (photos, location, chat telemetry) collected solely for social matching, communication, and safety enforcement.
4. **Storage Limitation & Right to Erasure**: Automatic purging of ephemeral telemetry and one-tap account deletion.
5. **Grievance Redressal**: Formal designated Data Protection Officer (DPO) and rapid resolution workflow.

---

## 2. Consent Management Architecture

### 2.1 Consent Ledger Record
All consent events are immutably logged with timestamp, user agent, IP address, and policy version:

```typescript
export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'LOCATION_TRACKING' | 'SAFETY_DATE_GUARD';
  policyVersion: '2026.1';
  grantedAt: string;
  ipAddressMasked: string; // e.g. "49.37.***.***"
  deviceFingerprint: string;
  isWithdrawn: boolean;
  withdrawnAt?: string;
}
```

### 2.2 Withdrawal of Consent
Under Section 6(4) of the DPDP Act, a Data Principal has the right to withdraw consent as easily as it was given. When consent is withdrawn:
- Location tracking stops immediately.
- The user's profile is removed from active matching indices (`isPaused = true`).
- A 30-day grace period begins, after which unassociated telemetry is permanently purged.

---

## 3. Storage Limitation & Automated Retention Watchdog

The `@pairup/worker: privacy.worker.ts` executes recurring BullMQ cleanup jobs to purge expired telemetry:

| Data Class | Retention Period | Purge Action |
|---|---|---|
| **One-Time Passwords (OTPs)** | 10 minutes | Hard delete from Redis / MemoryStore |
| **Raw GPS Coordinates** | 24 hours | Replaced with coarse city/state centroid |
| **Temporary Signaling Packets (WebRTC)** | 10 minutes after call ends | Memory queue dropped |
| **Date Guard Finished Sessions** | 30 days | Archived with companion name masked |
| **Deleted Accounts** | 14-day recovery buffer, then hard purge | Complete irreversible database deletion |

---

## 4. Right to Erasure ("Right to Be Forgotten") Pipeline

When a member triggers **Delete Account** from Settings (`/settings`):
1. **Immediate Revocation**: Active JWT tokens and refresh sessions are invalidated immediately across all devices.
2. **Profile Anonymization**: Profile card is delisted from discovery feeds, swipe decks, and proximity radars.
3. **Object Storage Purge**: Stored photos, audio voice notes, and avatars in S3/MinIO buckets are hard-deleted.
4. **Foreign Key Cascade**: All rows in `user_likes`, `user_passes`, `matches`, `chat_messages`, and `call_sessions` are cascades deleted or anonymized with tombstone markers (`[User Deleted]`).

---

## 5. Security Safeguards & Encryption Standards

Under Section 8(5) of the DPDP Act, PairUp maintains reasonable security safeguards:

- **Data in Transit**: Enforced TLS 1.3 with modern cipher suites (`TLS_AES_256_GCM_SHA384`, `ECDHE-ECDSA-AES256-GCM-SHA384`) and HSTS enabled.
- **Data at Rest**: PostgreSQL database storage encrypted using AES-256. Profile photos in object storage encrypted using S3 server-side encryption (`SSE-S3` or `SSE-KMS`).
- **Secret Management**: Passwords hashed with **Argon2id** or **bcrypt** with a minimum work factor of 10. API secrets and JWT private keys injected via hardened environment variables.

---

## 6. Grievance Redressal & Contact Information

In compliance with DPDP Rule 5(2), PairUp has designated a Grievance Redressal Officer:

- **Designated Grievance Officer**: Priya Swaminathan, Legal & Trust Compliance Lead
- **Email**: `grievance-officer@pairup.internal` / `dpo@pairup.internal`
- **Address**: PairUp Technologies India Pvt. Ltd., Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India
- **Resolution Timeline**: All user grievance submissions received through `/safety/report` or direct email are acknowledged within 24 hours and fully investigated within 7 working days.
