# PairUp Trust & Safety Architecture: Real-Time Guard & Moderation Pipeline

This document details the proactive safety systems, real-time threat mitigation, Date Guard check-in watchdog, emergency SOS protocol, and automated content moderation engines engineered for **PairUp**.

---

## 1. Safety Principles & Core Architecture

PairUp places user safety, dignity, and real-world security at the foundation of product architecture. Adult social discovery platforms carry inherent real-world risks (harassment, extortion, romance scams, underage grooming, and physical danger during in-person dates).

The **PairUp Safety Architecture** operates across four interconnected rings of protection:

```
+-----------------------------------------------------------------+
| Ring 4: Real-World In-Person Date Guard & Emergency SOS (112)   |
|   +-----------------------------------------------------------+ |
|   | Ring 3: Automated Behavioral Watchdog & Scammer Detection | |
|   |   +-----------------------------------------------------+ | |
|   |   | Ring 2: Media, Photo & Perceptual Hash Moderation   | | |
|   |   |   +-----------------------------------------------+ | | |
|   |   |   | Ring 1: Identity & 18+ Adult Gate Verification| | | |
|   |   |   +-----------------------------------------------+ | | |
|   |   +-----------------------------------------------------+ | |
|   +-----------------------------------------------------------+ |
+-----------------------------------------------------------------+
```

---

## 2. In-Person Date Guard & Safety Watchdog

The **Date Guard** subsystem provides intelligent scheduled monitoring during real-world dates:

### 2.1 Initialization & Scheduled Check-Ins
1. **Setup**: Before meeting a match in person, the member activates Date Guard with:
   - Match companion name & photo confirmation
   - Venue name & address / neighborhood
   - Emergency contact name & verified phone number (+91 India format)
   - Duration timer (e.g., 60, 90, or 120 minutes)
   - Discretionary safety notes
2. **Watchdog Execution**: Handled by `@pairup/worker: safety-guard.worker.ts` running BullMQ recurring cron sweeps every 60 seconds.
3. **Escalation Stages**:
   - **T-15 Minutes**: Gentle push reminder to verify all is going smoothly.
   - **T-0 Minutes (Timer Expiration)**: Check-in prompt displayed:
     - *"I'm Safe (+45m Extend)"*
     - *"Date Ended Safely (Conclude)"*
     - *"Need Excuse (Trigger Fake Incoming Phone Call)"*
     - *"EMERGENCY SOS"*
   - **T+10 Minutes (Overdue)**: If the user fails to respond within 10 minutes, high-priority automated SMS alerts are dispatched to the specified emergency contact containing the venue address, companion details, and time of departure.

### 2.2 Emergency SOS Trigger & National Helplines
When **EMERGENCY SOS** is tapped:
- An immediate distress broadcast is recorded with dispatch ID.
- SMS with GPS coordinates and live map link is sent to the designated emergency contact.
- One-tap direct dialers are presented for official 24x7 India helplines:
  - **112**: All-India National Emergency Unified Service
  - **1091**: Women's Helpline & Rapid Response
  - **1930**: National Cyber Crime Reporting Portal
  - **108**: Emergency Ambulance & Paramedics

---

## 3. Two-Tiered Automated & Human Content Moderation

### 3.1 Tier 1: Automated Pre-Ingestion Filters
Every piece of user-generated content (photos, prompts, bio, chat text) passes through automated filter engines:

| Category | Detection Technique | Action |
|---|---|---|
| **Underage Screening** | NLP regex + Date of birth calculation | Instant registration block |
| **Financial / UPI Solicitations** | Regex on `@okhdfcbank`, `paytm`, `gpay`, 10-digit phone patterns | Silent message quarantine & review |
| **Hate Speech & Harassment** | Multilingual BERT model (English, Hindi, Hinglish) | Shadow-hide message & penalize trust score |
| **Explicit / CSAM Imagery** | Perceptual Image Hash (PDQ / pHash) + Neural Net NSFW score | Immediate upload rejection & account quarantine |

### 3.2 Tier 2: Human Trust & Safety Operations
- **Moderator Dashboard**: Flagged items appear in the `/admin/reports` queue with full context, evidence attachments, and reported user history.
- **Service Level Agreements (SLAs)**:
  - Critical Harassment / Safety Threats: $< 15\text{ minutes}$ review time.
  - Profile Impersonation / Fake Photos: $< 2\text{ hours}$ review time.
  - Standard Spam / Solicitations: $< 6\text{ hours}$ review time.
- **Sanction Escalation Ladder**:
  1. *Warning Notice*: First-time minor offense.
  2. *72-Hour Read-Only Shadowban*: Account paused from swipe deck & nearby radar.
  3. *Permanent Device & Phone Hash Ban*: Complete exclusion across IP, device ID, and mobile number.

---

## 4. Screenshot & Profile Privacy Protection

- **Location Masking**: Precise GPS telemetry is never saved in query logs or API responses.
- **Incognito Browsing**: Allows subscribers to browse the swipe feed without appearing in nearby proximity radars.
- **Media Blur**: Blurred message attachments until explicitly accepted by both participants.
- **Screenshot Throttling**: Mobile client triggers system-level screenshot prevention flags (`FLAG_SECURE` on Android) on private chat and Date Guard views.
