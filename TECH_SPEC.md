# Reflections: Journal Insight Pipeline

A privacy-centric system for extracting, aggregating, and visualizing insights from 2 years of personal journal entries.

## Overview

**Goal:** Transform ~650 markdown journal entries (2024-2025) into structured insights, visualizations, and a formal "technical report" to inform 2026 New Year's resolutions.

**Privacy Model:** Zero data retention throughout. Raw journal text hits DeepSeek v3.2 via OpenRouter (ZDR mode → routes through Fireworks), gets immediately transformed to structured JSON, then raw text is never stored again.

---

## Data Source

### Journal Structure

```
Journal/
├── 2024/
│   ├── January/
│   │   ├── 2024-01-01.md
│   │   ├── 2024-01-02.md
│   │   └── ...
│   ├── February/
│   └── ... (by month)
└── 2025/
    ├── 2025-01-01.md
    ├── 2025-01-02.md
    └── ... (flat directory)
```

### File Format

- Markdown with YAML frontmatter (date_created, date_updated, tags, aliases)
- Meta Bind button blocks at top (to be stripped)
- `[[Internal Links]]` for people/places/things (some with folder paths)
- Filenames: `YYYY-MM-DD.md` (1-2 exceptions with titles, but date always present)

### Preprocessing Required

1. Strip Meta Bind button blocks (```meta-bind-button ... ```)
2. Normalize `[[Folder/Person]]` → `[[Person]]` 
3. Extract date from filename (handle edge cases)
4. Validate frontmatter dates match filename
5. Flag any entries missing dates for manual review

---

## Key Dates & Milestones

| Date | Event | Tracking Implications |
|------|-------|----------------------|
| Aug 15, 2024 | Started HRT | Begin hormone cycle tracking |
| Jan 1, 2025 | Started going by "Autumn" | Identity milestone marker |
| Pre-July 2024 | On Adderall | Baseline ADHD treatment |
| July-Oct 2024 | Atomoxetine trial | Monitor for mood/productivity dip |
| Nov 2025 | Started Guanfacine | Monitor for improvement correlation |

### Weekly Pattern

- **Tuesdays:** HRT injection day - expected energy dip
- **Wednesdays:** Expected recovery/boost day

---

## Extraction Schema (Phase 1)

Each journal entry → one structured JSON object:

```typescript
interface JournalExtraction {
  // Metadata
  date: string;                    // ISO date
  day_of_week: string;
  word_count: number;
  
  // Mood & Energy
  mood_score: number;              // 1-10 inferred
  energy_level: number;            // 1-10 inferred
  happiness_indicators: string[];  // specific phrases/events
  distress_indicators: string[];   // specific phrases/events
  
  // Sleep
  sleep_mentioned: boolean;
  sleep_quality: number | null;    // 1-10 if mentioned
  sleep_notes: string | null;
  
  // Health & HRT
  hrt_mentioned: boolean;
  hrt_notes: string | null;
  medication_mentions: string[];   // any meds referenced
  physical_health_notes: string[];
  
  // Social & Relationships  
  people_mentioned: {
    name: string;
    relationship_type: string;     // family, friend, partner, coworker, etc.
    sentiment: string;             // positive, negative, neutral, mixed
    interaction_type: string;      // in-person, text, call, thought-about
  }[];
  family_dynamics_notes: string | null;
  social_energy_spent: number;     // 1-10 estimate
  
  // Activities & Events
  activities: string[];
  major_events: string[];          // graduations, moves, milestones
  work_notes: string | null;
  creative_activities: string[];
  
  // Themes & Reflection
  dominant_themes: string[];       // max 5
  self_reflection_depth: number;   // 1-10
  future_oriented: boolean;        // planning/hoping vs reflecting
  gratitude_expressed: boolean;
  
  // Identity & Transition
  gender_identity_notes: string | null;
  dysphoria_mentioned: boolean;
  euphoria_mentioned: boolean;
  name_usage: string | null;       // which name used if relevant
  
  // Raw for aggregation
  key_quotes: string[];            // max 3 significant sentences
  summary: string;                 // 2-3 sentence summary
}
```

---

## Aggregation Tiers (Phase 2)

### Tier 1: Weekly Summaries (7 days → 1 summary)

```typescript
interface WeeklySummary {
  week_start: string;
  week_end: string;
  
  avg_mood: number;
  avg_energy: number;
  avg_sleep_quality: number | null;
  
  mood_trend: 'improving' | 'declining' | 'stable' | 'volatile';
  
  people_seen: { name: string; count: number; avg_sentiment: number }[];
  
  dominant_themes: string[];
  notable_events: string[];
  
  hrt_cycle_notes: string | null;  // Tuesday/Wednesday pattern
  
  narrative_summary: string;       // 1 paragraph
}
```

### Tier 2: Monthly Summaries (4-5 weeks → 1 summary)

```typescript
interface MonthlySummary {
  month: string;                   // "2024-03"
  
  happiness_index: number;         // computed aggregate
  overall_trajectory: string;
  
  relationship_health: {
    family: number;                // 1-10
    friends: number;
    romantic: number | null;
  };
  
  top_themes: string[];
  major_milestones: string[];
  challenges_faced: string[];
  wins: string[];
  
  medication_notes: string | null;
  sleep_pattern_summary: string;
  
  narrative_summary: string;       // 2-3 paragraphs
}
```

### Tier 3: Quarterly Notepads (3 months → 1 notepad)

8 total: Q1-Q4 2024, Q1-Q4 2025

```typescript
interface QuarterlyNotepad {
  quarter: string;                 // "2024-Q1"
  
  // Aggregated metrics
  happiness_trajectory: number[];  // monthly scores
  energy_trajectory: number[];
  social_engagement_level: number;
  
  // Key narratives
  chapter_title: string;           // AI-generated thematic title
  opening_state: string;           // where was Autumn at quarter start
  closing_state: string;           // where was she at quarter end
  
  // Relationships
  most_mentioned_people: { name: string; total_mentions: number; trajectory: string }[];
  family_dynamics_summary: string;
  
  // Health
  hrt_progress_notes: string | null;
  medication_changes: string[];
  sleep_trend: string;
  
  // Growth
  skills_developed: string[];
  challenges_overcome: string[];
  unresolved_threads: string[];
  
  // Full narrative
  narrative: string;               // 4-6 paragraphs, story format
}
```

### Tier 4: Two-Year Synthesis

Final aggregation across all 8 quarterly notepads:

```typescript
interface TwoYearSynthesis {
  // The big picture
  thesis: string;                  // one sentence capturing the arc
  
  // Identity journey
  pre_autumn_summary: string;      // before Jan 1, 2025
  post_autumn_summary: string;     // after
  transition_narrative: string;    // the full story
  
  // Metrics over time
  happiness_by_quarter: number[];
  energy_by_quarter: number[];
  social_engagement_by_quarter: number[];
  
  // Patterns discovered
  weekly_patterns: {
    best_days: string[];
    worst_days: string[];
    hrt_cycle_correlation: string;
  };
  
  seasonal_patterns: {
    best_season: string;
    worst_season: string;
    notes: string;
  };
  
  medication_correlations: {
    adderall_period: { dates: string; summary: string };
    atomoxetine_period: { dates: string; summary: string };
    guanfacine_period: { dates: string; summary: string };
  };
  
  // Relationships
  relationship_arcs: {
    name: string;
    arc_summary: string;
    current_status: string;
  }[];
  
  family_journey: string;
  
  // Major events timeline
  milestones: { date: string; event: string; impact: string }[];
  
  // For resolutions
  strengths_demonstrated: string[];
  recurring_challenges: string[];
  unfinished_business: string[];
  growth_areas: string[];
  
  // The report
  executive_summary: string;       // 1 page
  full_narrative: string;          // multi-page story
}
```

---

## Architecture

### Cloudflare Resources

| Resource | Purpose |
|----------|---------|
| **R2 Bucket** `reflections-journals` | Raw markdown storage (upload only, never re-read after extraction) |
| **R2 Bucket** `reflections-outputs` | Final JSON exports, PDF, dashboard data |
| **D1 Database** `reflections` | Structured extractions, aggregations (intermediate) |
| **Queue** `extraction-queue` | Job queue for Phase 1 |
| **Queue** `aggregation-queue` | Job queue for Phase 2 tiers |
| **Worker** `reflections-extractor` | Processes extraction jobs |
| **Worker** `reflections-aggregator` | Processes aggregation jobs |
| **Durable Object** `ReflectionsCoordinator` | Orchestrates pipeline, tracks progress |

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 0: PREPROCESS                         │
├─────────────────────────────────────────────────────────────────────┤
│  Local script:                                                      │
│  1. Scan Journal/ directories                                       │
│  2. Strip Meta Bind blocks                                          │
│  3. Normalize internal links                                        │
│  4. Validate/fix dates                                              │
│  5. Upload to R2 (reflections-journals)                             │
│  6. Create manifest.json with all entry metadata                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 1: EXTRACTION (Parallel)                  │
├─────────────────────────────────────────────────────────────────────┤
│  Coordinator DO:                                                    │
│  1. Read manifest.json                                              │
│  2. Enqueue one job per entry → extraction-queue                    │
│                                                                     │
│  Extractor Worker (per job):                                        │
│  1. Fetch markdown from R2                                          │
│  2. Call DeepSeek v3.2 (OpenRouter ZDR)                             │
│  3. Parse structured JSON response                                  │
│  4. Insert into D1 `extractions` table                              │
│  5. Ack job                                                         │
│                                                                     │
│  Rate limiting: ~10 concurrent, respect OpenRouter limits           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   PHASE 2: AGGREGATION (Tiered)                     │
├─────────────────────────────────────────────────────────────────────┤
│  Coordinator DO triggers after Phase 1 complete:                    │
│                                                                     │
│  Tier 1 (Weekly):                                                   │
│  - Query D1 for 7-day windows                                       │
│  - Enqueue aggregation jobs                                         │
│  - Worker calls LLM with week's extractions → weekly summary        │
│  - Store in D1 `weekly_summaries`                                   │
│                                                                     │
│  Tier 2 (Monthly):                                                  │
│  - After all weeks done, query weekly summaries                     │
│  - LLM synthesizes → monthly summary                                │
│  - Store in D1 `monthly_summaries`                                  │
│                                                                     │
│  Tier 3 (Quarterly):                                                │
│  - After all months done, query monthly summaries                   │
│  - LLM synthesizes → quarterly notepad                              │
│  - Store in D1 `quarterly_notepads`                                 │
│                                                                     │
│  Tier 4 (Two-Year):                                                 │
│  - Query all 8 quarterly notepads                                   │
│  - LLM final synthesis → two_year_synthesis                         │
│  - Store in D1, export to R2                                        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PHASE 3: VISUALIZATION                         │
├─────────────────────────────────────────────────────────────────────┤
│  Export Worker:                                                     │
│  1. Query all D1 tables                                             │
│  2. Generate dashboard-data.json                                    │
│  3. Generate PDF report                                             │
│  4. Upload to R2 (reflections-outputs)                              │
│                                                                     │
│  SvelteKit Dashboard (local):                                       │
│  - Loads dashboard-data.json                                        │
│  - Interactive timeline                                             │
│  - Seasonal color theme                                             │
│  - Glassmorphism UI                                                 │
│  - Lucide icons                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (D1)

```sql
-- Raw extractions from Phase 1
CREATE TABLE extractions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  day_of_week TEXT,
  extraction_json TEXT NOT NULL,  -- full JournalExtraction
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extractions_date ON extractions(date);

-- Weekly summaries
CREATE TABLE weekly_summaries (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  summary_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Monthly summaries
CREATE TABLE monthly_summaries (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,  -- YYYY-MM
  summary_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Quarterly notepads
CREATE TABLE quarterly_notepads (
  id TEXT PRIMARY KEY,
  quarter TEXT NOT NULL,  -- YYYY-QN
  notepad_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Final synthesis
CREATE TABLE synthesis (
  id TEXT PRIMARY KEY DEFAULT 'main',
  synthesis_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline state
CREATE TABLE pipeline_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## LLM Configuration

### Provider

- **OpenRouter** with Zero Data Retention (`X-ZDR: true` header)
- Routes to Fireworks for DeepSeek models

### Model

- **DeepSeek v3.2** (`deepseek/deepseek-v3.2` on OpenRouter)
- NOT the Speciale variant, just base v3.2
- $0.224/M input, $0.32/M output (very cheap for ~650 entries)

### Prompts

#### Extraction Prompt (Phase 1)

```
You are analyzing a personal journal entry. Extract structured information according to the schema provided.

Context:
- Author: Autumn (trans woman, she/her)
- Before January 1, 2025, she went by a different name
- Started HRT on August 15, 2024 (weekly injections on Tuesdays)
- Medication history: Adderall → Atomoxetine (July-Oct 2024) → Guanfacine (Nov 2025+)

Instructions:
- Infer mood/energy from tone, word choice, activities described
- Note any mentions of sleep, health, medications
- Identify people mentioned and relationship context
- Extract themes without over-interpreting
- Be conservative with scores (don't default to 5)
- If something isn't mentioned, use null

Entry Date: {date}
Entry Content:
{content}

Respond with valid JSON matching this schema:
{schema}
```

#### Aggregation Prompts

(Similar structure, providing context + previous tier data + asking for synthesis)

---

## Dashboard Design

### Tech Stack

- SvelteKit (static build for local hosting)
- Tailwind CSS
- Lucide Svelte icons
- Chart.js or D3 for visualizations

### Visual Theme

- **Glassmorphism:** frosted glass cards, subtle blur
- **Seasonal palette:**
  - Winter (Q1): cool blues, silver
  - Spring (Q2): soft greens, pink
  - Summer (Q3): warm yellows, orange
  - Fall (Q4): deep purple, amber, brown
- **Accent:** purple/orange gradient for interactive elements

### Pages

1. **Overview:** Two-year summary, key metrics, milestone timeline
2. **Timeline:** Scrollable vertical timeline with seasonal sections
3. **Relationships:** Network graph or list of people + arcs
4. **Health:** HRT tracking, sleep trends, medication periods
5. **Themes:** Word clouds, dominant theme evolution
6. **Report:** Embedded PDF or formatted narrative view

---

## PDF Report Structure

"Reflections: A Technical Analysis of Two Years"

1. **Executive Summary** (1 page)
2. **Methodology** (brief: data collection, extraction, aggregation)
3. **Timeline of Major Events**
4. **Quantitative Analysis**
   - Mood & Energy Trends (charts)
   - Sleep Patterns
   - Social Engagement Metrics
5. **Qualitative Analysis**
   - Identity & Transition Journey
   - Relationship Dynamics
   - Family Narrative
   - Career & Purpose Evolution
6. **Pattern Discovery**
   - Weekly Cycles (Tuesday/Wednesday HRT)
   - Seasonal Effects
   - Medication Correlations
7. **Key Findings**
8. **Recommendations for 2026** (data-driven)
9. **Appendix: Quarterly Summaries**

---

## Project Structure

```
reflections/
├── TECH_SPEC.md
├── secrets.template.json
├── package.json
│
├── scripts/
│   ├── preprocess.ts          # Phase 0: local preprocessing
│   ├── upload-to-r2.ts        # Upload journals to R2
│   └── export-data.ts         # Download final data from R2
│
├── infrastructure/
│   ├── wrangler.toml          # All Cloudflare config
│   ├── schema.sql             # D1 schema
│   │
│   ├── src/
│   │   ├── coordinator.ts     # Durable Object
│   │   ├── extractor.ts       # Extraction worker
│   │   ├── aggregator.ts      # Aggregation worker
│   │   ├── exporter.ts        # Final export worker
│   │   │
│   │   ├── prompts/
│   │   │   ├── extraction.ts
│   │   │   ├── weekly.ts
│   │   │   ├── monthly.ts
│   │   │   ├── quarterly.ts
│   │   │   └── synthesis.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── types.ts       # All TypeScript interfaces
│   │   │
│   │   └── lib/
│   │       ├── openrouter.ts  # API client
│   │       ├── r2.ts          # R2 helpers
│   │       └── d1.ts          # D1 helpers
│   │
│   └── deploy.sh              # All wrangler commands
│
├── dashboard/
│   ├── package.json
│   ├── svelte.config.js
│   ├── tailwind.config.js
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   ├── +page.svelte           # Overview
│   │   │   ├── timeline/+page.svelte
│   │   │   ├── relationships/+page.svelte
│   │   │   ├── health/+page.svelte
│   │   │   ├── themes/+page.svelte
│   │   │   └── report/+page.svelte
│   │   │
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── GlassCard.svelte
│   │   │   │   ├── Timeline.svelte
│   │   │   │   ├── MoodChart.svelte
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   └── data.ts
│   │   │   │
│   │   │   └── utils/
│   │   │       └── colors.ts          # Seasonal palette
│   │   │
│   │   └── app.css                    # Tailwind + glassmorphism
│   │
│   └── static/
│       └── data/
│           └── dashboard-data.json    # Loaded at runtime
│
└── reports/
    ├── generate-pdf.ts                # PDF generation script
    └── templates/
        └── report.html                # HTML template for PDF
```

---

## Secrets Template

```json
{
  "OPENROUTER_API_KEY": "sk-or-...",
  "CLOUDFLARE_ACCOUNT_ID": "...",
  "CLOUDFLARE_API_TOKEN": "...",
  "R2_ACCESS_KEY_ID": "...",
  "R2_SECRET_ACCESS_KEY": "..."
}
```

---

## Deployment Script (deploy.sh)

```bash
#!/bin/bash
set -e

echo "Creating R2 buckets..."
wrangler r2 bucket create reflections-journals
wrangler r2 bucket create reflections-outputs

echo "Creating D1 database..."
wrangler d1 create reflections
wrangler d1 execute reflections --file=schema.sql

echo "Creating Queues..."
wrangler queues create extraction-queue
wrangler queues create aggregation-queue

echo "Deploying workers..."
wrangler deploy

echo "Done! Run 'pnpm preprocess' to start the pipeline."
```

---

## Cost Analysis

### Phase 1: Extraction

| Metric | Estimate |
|--------|----------|
| Entries | ~650 |
| Avg entry length | ~800 words → ~1,200 tokens |
| System prompt + schema | ~1,500 tokens |
| Total input per entry | ~2,700 tokens |
| Output per entry | ~800 tokens (structured JSON) |
| **Total input tokens** | ~1.75M |
| **Total output tokens** | ~520K |

**Phase 1 Cost:**
- Input: 1.75M × $0.224/M = **$0.39**
- Output: 520K × $0.32/M = **$0.17**
- **Total: ~$0.56**

### Phase 2: Aggregation

| Tier | Count | Avg Input | Avg Output | Input Total | Output Total |
|------|-------|-----------|------------|-------------|--------------|
| Weekly | ~104 | 6K | 1.5K | 624K | 156K |
| Monthly | 24 | 8K | 2K | 192K | 48K |
| Quarterly | 8 | 10K | 3K | 80K | 24K |
| Synthesis | 1 | 25K | 5K | 25K | 5K |
| **Totals** | | | | **921K** | **233K** |

**Phase 2 Cost:**
- Input: 921K × $0.224/M = **$0.21**
- Output: 233K × $0.32/M = **$0.07**
- **Total: ~$0.28**

### Grand Total

| Phase | Cost |
|-------|------|
| Extraction | $0.56 |
| Aggregation | $0.28 |
| Buffer (retries, edge cases) | $0.16 |
| **Total** | **~$1.00** |

---

## Rate Limiting Strategy

### OpenRouter Limits

- Free tier: 20 req/min, 200 req/day
- Paid tier: 500 req/min (with credits)

### Implementation

```typescript
// infrastructure/src/lib/rate-limiter.ts

interface RateLimiterConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
  retryAfterMs: number;
  maxRetries: number;
}

const OPENROUTER_LIMITS: RateLimiterConfig = {
  requestsPerMinute: 50,  // conservative, well under 500
  requestsPerDay: 5000,   // won't hit this with ~650 entries
  retryAfterMs: 2000,
  maxRetries: 3,
};
```

### Queue Configuration

```toml
# wrangler.toml

[[queues.consumers]]
queue = "extraction-queue"
max_batch_size = 5          # process 5 at a time
max_batch_timeout = 30      # wait up to 30s to fill batch
max_retries = 3
dead_letter_queue = "extraction-dlq"

[[queues.consumers]]
queue = "aggregation-queue"
max_batch_size = 1          # sequential for aggregation
max_retries = 3
dead_letter_queue = "aggregation-dlq"
```

### Backoff Strategy

- On 429: exponential backoff starting at 2s, max 60s
- On 5xx: retry up to 3 times with 5s delay
- On parse error: log to DLQ, continue pipeline

---

## Caching Strategy

### Cache Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        CACHE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  L1: Worker Cache API (per-colo, ~seconds)                     │
│  └─ Hot path: manifest, config, prompts                        │
│                                                                 │
│  L2: KV Store (global, ~minutes)                               │
│  └─ Extraction results (keyed by entry hash)                   │
│  └─ Aggregation results (keyed by date range)                  │
│                                                                 │
│  L3: D1 (persistent)                                           │
│  └─ All structured data                                        │
│  └─ Pipeline state                                             │
│                                                                 │
│  L4: R2 (cold storage)                                         │
│  └─ Raw journals (write-once)                                  │
│  └─ Final exports                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cache Keys

```typescript
// Extraction cache - skip LLM if already processed
const extractionCacheKey = (entryDate: string, contentHash: string) =>
  `extract:${entryDate}:${contentHash.slice(0, 16)}`;

// Aggregation cache - skip if inputs unchanged
const aggregationCacheKey = (tier: string, range: string, inputHash: string) =>
  `agg:${tier}:${range}:${inputHash.slice(0, 16)}`;

// Content hash for cache invalidation
const hashContent = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
```

### KV Namespace

```toml
# wrangler.toml

[[kv_namespaces]]
binding = "CACHE"
id = "..."  # created by wrangler
```

### Cache Logic

```typescript
// Before LLM call
async function extractWithCache(
  entry: JournalEntry,
  env: Env
): Promise<JournalExtraction> {
  const contentHash = await hashContent(entry.content);
  const cacheKey = extractionCacheKey(entry.date, contentHash);
  
  // Check KV cache
  const cached = await env.CACHE.get(cacheKey, 'json');
  if (cached) {
    console.log(`Cache hit: ${entry.date}`);
    return cached as JournalExtraction;
  }
  
  // Call LLM
  const result = await callDeepSeek(entry, env);
  
  // Store in KV (7 day TTL - longer than pipeline needs)
  await env.CACHE.put(cacheKey, JSON.stringify(result), {
    expirationTtl: 60 * 60 * 24 * 7,
  });
  
  // Also store in D1 for persistence
  await storeExtraction(env.DB, entry.date, result);
  
  return result;
}
```

### Idempotency

Pipeline is fully idempotent:
- Re-running skips already-processed entries (cache hit)
- Content changes trigger re-extraction (hash mismatch)
- Aggregations recompute only if inputs changed
- Safe to interrupt and resume at any point

### Cache Warming

```typescript
// Optional: pre-warm cache from D1 on worker start
async function warmCache(env: Env): Promise<void> {
  const existing = await env.DB.prepare(
    'SELECT date, extraction_json FROM extractions'
  ).all();
  
  for (const row of existing.results) {
    const extraction = JSON.parse(row.extraction_json);
    const hash = await hashContent(extraction.original_content_hash);
    const key = extractionCacheKey(row.date, hash);
    await env.CACHE.put(key, row.extraction_json, {
      expirationTtl: 60 * 60 * 24 * 7,
    });
  }
}
```

---

## Deferred to v2

1. **Vectorize integration** - semantic search over entries ("find entries similar to X")
2. **Image analysis** - VLM processing of journal images
3. **Incremental updates** - delta processing for new entries
4. **Real-time dashboard** - live updates via Durable Objects WebSocket

---

## Next Steps

1. [ ] Initialize project structure
2. [ ] Write preprocessing script
3. [ ] Set up Cloudflare infrastructure
4. [ ] Implement extraction worker + prompts
5. [ ] Test on 1 week of entries
6. [ ] Implement aggregation tiers
7. [ ] Build dashboard shell
8. [ ] Full pipeline run
9. [ ] PDF generation
10. [ ] Review & iterate
