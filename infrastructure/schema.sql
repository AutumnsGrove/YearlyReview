-- Reflections D1 Schema
-- Run with: wrangler d1 execute reflections --file=schema.sql

-- Raw extractions from Phase 1
CREATE TABLE IF NOT EXISTS extractions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  day_of_week TEXT,
  extraction_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_extractions_date ON extractions(date);

-- Weekly summaries (Tier 1)
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  summary_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weekly_week_start ON weekly_summaries(week_start);

-- Monthly summaries (Tier 2)
CREATE TABLE IF NOT EXISTS monthly_summaries (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  summary_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_monthly_month ON monthly_summaries(month);

-- Quarterly notepads (Tier 3)
CREATE TABLE IF NOT EXISTS quarterly_notepads (
  id TEXT PRIMARY KEY,
  quarter TEXT NOT NULL,
  notepad_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quarterly_quarter ON quarterly_notepads(quarter);

-- Final synthesis (Tier 4)
CREATE TABLE IF NOT EXISTS synthesis (
  id TEXT PRIMARY KEY DEFAULT 'main',
  synthesis_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline state tracking
CREATE TABLE IF NOT EXISTS pipeline_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Job tracking for idempotency
CREATE TABLE IF NOT EXISTS job_status (
  job_id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  input_hash TEXT,
  result_id TEXT,
  error TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_status_type ON job_status(job_type, status);
