/**
 * D1 Database Helpers
 *
 * Utilities for reading/writing to D1 database
 */

import type {
  JournalExtraction,
  WeeklySummary,
  MonthlySummary,
  QuarterlyNotepad,
  TwoYearSynthesis,
} from '../schemas/types';

// ============================================================================
// Extractions
// ============================================================================

export async function storeExtraction(
  db: D1Database,
  date: string,
  extraction: JournalExtraction
): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO extractions (id, date, day_of_week, extraction_json)
       VALUES (?, ?, ?, ?)`
    )
    .bind(
      `extraction-${date}`,
      date,
      extraction.day_of_week,
      JSON.stringify(extraction)
    )
    .run();
}

export async function getExtraction(
  db: D1Database,
  date: string
): Promise<JournalExtraction | null> {
  const result = await db
    .prepare('SELECT extraction_json FROM extractions WHERE date = ?')
    .bind(date)
    .first<{ extraction_json: string }>();

  if (!result) return null;
  return JSON.parse(result.extraction_json);
}

export async function getExtractionsInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<JournalExtraction[]> {
  const results = await db
    .prepare(
      'SELECT extraction_json FROM extractions WHERE date >= ? AND date <= ? ORDER BY date'
    )
    .bind(startDate, endDate)
    .all<{ extraction_json: string }>();

  return results.results.map((r) => JSON.parse(r.extraction_json));
}

// ============================================================================
// Weekly Summaries
// ============================================================================

export async function storeWeeklySummary(
  db: D1Database,
  summary: WeeklySummary
): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO weekly_summaries (id, week_start, week_end, summary_json)
       VALUES (?, ?, ?, ?)`
    )
    .bind(
      `weekly-${summary.week_start}`,
      summary.week_start,
      summary.week_end,
      JSON.stringify(summary)
    )
    .run();
}

export async function getWeeklySummariesForMonth(
  db: D1Database,
  month: string
): Promise<WeeklySummary[]> {
  // month is "YYYY-MM"
  const startDate = `${month}-01`;
  const nextMonth = incrementMonth(month);
  const endDate = `${nextMonth}-01`;

  const results = await db
    .prepare(
      'SELECT summary_json FROM weekly_summaries WHERE week_start >= ? AND week_start < ? ORDER BY week_start'
    )
    .bind(startDate, endDate)
    .all<{ summary_json: string }>();

  return results.results.map((r) => JSON.parse(r.summary_json));
}

// ============================================================================
// Monthly Summaries
// ============================================================================

export async function storeMonthlySummary(
  db: D1Database,
  summary: MonthlySummary
): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO monthly_summaries (id, month, summary_json)
       VALUES (?, ?, ?)`
    )
    .bind(`monthly-${summary.month}`, summary.month, JSON.stringify(summary))
    .run();
}

export async function getMonthlySummariesForQuarter(
  db: D1Database,
  quarter: string
): Promise<MonthlySummary[]> {
  // quarter is "YYYY-QN"
  const [year, q] = quarter.split('-Q');
  const quarterNum = parseInt(q);
  const startMonth = (quarterNum - 1) * 3 + 1;

  const months = [0, 1, 2].map((offset) => {
    const month = startMonth + offset;
    return `${year}-${month.toString().padStart(2, '0')}`;
  });

  const results = await db
    .prepare(
      `SELECT summary_json FROM monthly_summaries
       WHERE month IN (?, ?, ?) ORDER BY month`
    )
    .bind(...months)
    .all<{ summary_json: string }>();

  return results.results.map((r) => JSON.parse(r.summary_json));
}

// ============================================================================
// Quarterly Notepads
// ============================================================================

export async function storeQuarterlyNotepad(
  db: D1Database,
  notepad: QuarterlyNotepad
): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO quarterly_notepads (id, quarter, notepad_json)
       VALUES (?, ?, ?)`
    )
    .bind(`quarterly-${notepad.quarter}`, notepad.quarter, JSON.stringify(notepad))
    .run();
}

export async function getAllQuarterlyNotepads(
  db: D1Database
): Promise<QuarterlyNotepad[]> {
  const results = await db
    .prepare('SELECT notepad_json FROM quarterly_notepads ORDER BY quarter')
    .all<{ notepad_json: string }>();

  return results.results.map((r) => JSON.parse(r.notepad_json));
}

// ============================================================================
// Synthesis
// ============================================================================

export async function storeSynthesis(
  db: D1Database,
  synthesis: TwoYearSynthesis
): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO synthesis (id, synthesis_json)
       VALUES ('main', ?)`
    )
    .bind(JSON.stringify(synthesis))
    .run();
}

export async function getSynthesis(
  db: D1Database
): Promise<TwoYearSynthesis | null> {
  const result = await db
    .prepare('SELECT synthesis_json FROM synthesis WHERE id = ?')
    .bind('main')
    .first<{ synthesis_json: string }>();

  if (!result) return null;
  return JSON.parse(result.synthesis_json);
}

// ============================================================================
// Helpers
// ============================================================================

function incrementMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  if (m === 12) {
    return `${year + 1}-01`;
  }
  return `${year}-${(m + 1).toString().padStart(2, '0')}`;
}
