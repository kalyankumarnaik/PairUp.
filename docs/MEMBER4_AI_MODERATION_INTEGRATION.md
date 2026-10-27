# Member 4 Integration Guide — AI Recommendations & Content Moderation

**Author:** Member 1 (Platform Technical Lead)  
**Target:** Member 4 (AI Recommendations & Content Moderation Lead)  
**Scope:** Recommendation Engine Hook, Moderation Pipeline, User Safety Webhooks.

---

## 1. Architectural Responsibility & Boundaries

- **Member 1 (Core Backend):** Owns database tables, basic eligibility filtering (age, gender, distance, block list, account status), and transactional match creation.
- **Member 4 (You):** Owns vector embeddings (e.g. pgvector or external vector store), AI candidate re-ranking, automated content moderation (NLP toxicity detection, photo nudity screening), and safety escalation rules.

---

## 2. Pluggable AI Recommendation Hook (`IRecommendationProvider`)

Member 1 provides the default heuristic candidate filter in `DiscoveryService`. You can replace or augment the ranking algorithm by implementing `IRecommendationProvider`:

```typescript
import {
  IRecommendationProvider,
  DiscoveryFilterOptions,
  ScoredCandidate,
  RECOMMENDATION_PROVIDER_TOKEN,
} from '../discovery/contracts/recommendation-provider.interface';

@Injectable()
export class AIRecommendationEngine implements IRecommendationProvider {
  async getCandidates(options: DiscoveryFilterOptions): Promise<ScoredCandidate[]> {
    // 1. Fetch user interest & bio embedding vector
    // 2. Perform cosine similarity search across eligible candidates
    // 3. Return candidates ordered by compatibility score (0.0 - 1.0)
    return [
      {
        userId: 'candidate-uuid-1',
        score: 0.94,
        sharedInterestsCount: 4,
        matchReasons: ['Mutual love for hiking and coffee', 'High lifestyle compatibility'],
      },
    ];
  }
}
```

---

## 3. Pluggable Content Moderation Pipeline (`IModerationService`)

Member 1 provides the reporting endpoint `POST /api/v1/safety/reports`. When users submit reports, they are forwarded to `IModerationService`:

```typescript
import {
  IModerationService,
  ReportUserInput,
  ReportResult,
  MODERATION_SERVICE_TOKEN,
} from '../safety/contracts/moderation.interface';

@Injectable()
export class ContentModerationService implements IModerationService {
  async processReport(input: ReportUserInput): Promise<ReportResult> {
    // 1. Ingest report
    // 2. Run automated text / image screening
    // 3. If toxicity score > 0.85, trigger automated account suspension via Member 1's UsersService
    return {
      reportId: 'rep-uuid-1',
      status: 'PENDING_REVIEW',
      autoActionTaken: 'Flagged for human moderator review queue',
    };
  }
}
```

---

## 4. Reserved Database Tables for Member 4

- `user_recommendation_vectors`: Stores candidate embedding vectors and precomputed affinity scores.
- `moderation_reports`: Detailed moderation records, evidence links, and resolution audit trails.
- `content_flags`: Specific flags for profile photos, prompts, or messages.

### Migration Rules
- Foreign keys should reference `users.id` with `ON DELETE CASCADE`.
- Do not modify existing `users`, `profiles`, or `matches` column constraints without coordinating with Member 1.
