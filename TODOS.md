# Project TODO List

> Last updated: 2025-12-29

## Phase 0: Preprocessing (Local)

- [ ] Implement `scripts/preprocess.ts`:
  - [ ] Scan Journal/2024/ and Journal/2025/ directories
  - [ ] Strip Meta Bind button blocks (```meta-bind-button ... ```)
  - [ ] Normalize internal links ([[Folder/Person]] → [[Person]])
  - [ ] Extract date from filename (YYYY-MM-DD.md)
  - [ ] Validate frontmatter dates match filename
  - [ ] Flag entries missing dates for manual review
  - [ ] Generate manifest.json with entry metadata

- [ ] Implement `scripts/upload-to-r2.ts`:
  - [ ] Load R2 credentials from secrets.json
  - [ ] Upload preprocessed entries to reflections-journals bucket
  - [ ] Upload manifest.json

## Phase 1: Infrastructure Setup

- [ ] Set up Cloudflare resources:
  - [ ] Create R2 buckets (reflections-journals, reflections-outputs)
  - [ ] Create D1 database (reflections)
  - [ ] Apply schema.sql to D1
  - [ ] Create KV namespace for caching
  - [ ] Create queues (extraction-queue, aggregation-queue, DLQs)

- [ ] Configure secrets:
  - [ ] Set OPENROUTER_API_KEY via wrangler secret
  - [ ] Update wrangler.toml with database_id and KV id

## Phase 2: Extraction Worker

- [ ] Implement `infrastructure/src/extractor.ts`:
  - [ ] Fetch markdown from R2
  - [ ] Check KV cache for existing extraction
  - [ ] Call DeepSeek v3.2 via OpenRouter (ZDR mode)
  - [ ] Parse and validate JSON response
  - [ ] Store in D1 and KV cache
  - [ ] Implement retry with exponential backoff

- [ ] Implement `infrastructure/src/coordinator.ts`:
  - [ ] Read manifest.json from R2
  - [ ] Enqueue extraction jobs
  - [ ] Track progress across phases

## Phase 3: Aggregation Workers

- [ ] Implement Tier 1: Weekly aggregation
  - [ ] Query extractions for 7-day windows
  - [ ] Build weekly summary prompt
  - [ ] Store in weekly_summaries table

- [ ] Implement Tier 2: Monthly aggregation
  - [ ] Query weekly summaries for month
  - [ ] Build monthly summary prompt
  - [ ] Store in monthly_summaries table

- [ ] Implement Tier 3: Quarterly aggregation
  - [ ] Query monthly summaries for quarter
  - [ ] Build quarterly notepad prompt
  - [ ] Store in quarterly_notepads table

- [ ] Implement Tier 4: Two-year synthesis
  - [ ] Query all 8 quarterly notepads
  - [ ] Build synthesis prompt
  - [ ] Store in synthesis table

## Phase 4: Export & Dashboard

- [ ] Implement `infrastructure/src/exporter.ts`:
  - [ ] Query all D1 tables
  - [ ] Build dashboard-data.json
  - [ ] Upload to R2 outputs bucket

- [ ] Implement `scripts/export-data.ts`:
  - [ ] Download dashboard-data.json from R2
  - [ ] Save to dashboard/static/data/

- [ ] Complete dashboard implementation:
  - [ ] Wire up data stores to components
  - [ ] Implement Chart.js visualizations
  - [ ] Add data loading from dashboard-data.json
  - [ ] Test all routes with sample data

## Phase 5: PDF Report

- [ ] Implement `reports/generate-pdf.ts`:
  - [ ] Load synthesis data
  - [ ] Render HTML template with data
  - [ ] Convert to PDF (puppeteer or similar)
  - [ ] Save to reports/output/

## Testing & Validation

- [ ] Test preprocessing on sample journal entries
- [ ] Test extraction on 1 week of entries
- [ ] Validate aggregation tier outputs
- [ ] End-to-end pipeline test
- [ ] Dashboard visual QA

## Nice to Have (v2)

- [ ] Vectorize integration for semantic search
- [ ] Image analysis with VLM
- [ ] Incremental updates for new entries
- [ ] Real-time dashboard via Durable Objects WebSocket

---

## Completed

- [x] Initialize project structure
- [x] Create scripts/ placeholder files
- [x] Create infrastructure/ with wrangler.toml and schema.sql
- [x] Create infrastructure/src/ workers and lib scaffolds
- [x] Create all LLM prompt templates
- [x] Initialize SvelteKit dashboard with Tailwind
- [x] Create dashboard routes and components
- [x] Create reports/ directory structure
- [x] Update AGENT.md with project details
