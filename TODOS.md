# Project TODO List

> Last updated: 2025-12-29

---

## ⏳ NEXT STEPS FOR AGENT

**Current Status:** Phase 0 scripts are implemented and tested. Waiting for user to add journal entries.

**Before Phase 1:**
1. User needs to copy journal entries to `Journal/2024/` and `Journal/2025/`
2. Run `pnpm preprocess` to process journals and generate manifest
3. Set up `secrets.json` with Cloudflare R2 credentials (copy from `secrets_template.json`)
4. Run `pnpm upload` to upload preprocessed entries to R2

**Then proceed to Phase 1:** Set up Cloudflare infrastructure (R2 buckets, D1 database, queues)

---

## Phase 0: Preprocessing (Local) ✅ COMPLETE

- [x] Implement `scripts/preprocess.ts`:
  - [x] Scan Journal/2024/ and Journal/2025/ directories
  - [x] Strip Meta Bind button blocks (```meta-bind-button ... ```)
  - [x] Normalize internal links ([[Folder/Person]] → [[Person]])
  - [x] Extract date from filename (YYYY-MM-DD.md)
  - [x] Validate frontmatter dates match filename
  - [x] Flag entries missing dates for manual review
  - [x] Generate manifest.json with entry metadata
  - [x] Output cleaned entries to `preprocessed/` directory

- [x] Implement `scripts/upload-to-r2.ts`:
  - [x] Load R2 credentials from secrets.json
  - [x] Upload preprocessed entries to reflections-journals bucket
  - [x] Upload manifest.json
  - [x] Skip unchanged files (content hash comparison)
  - [x] Progress reporting

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
- [x] **Phase 0: Implement preprocess.ts** (2025-12-29)
- [x] **Phase 0: Implement upload-to-r2.ts** (2025-12-29)
- [x] Add @aws-sdk/client-s3 dependency for R2 uploads
- [x] Update .gitignore for preprocessed/ and Journal/ directories
