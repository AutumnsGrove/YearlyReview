/**
 * Aggregation Worker
 *
 * Processes aggregation jobs from the queue:
 * - Tier 1: Weekly summaries (7 days → 1 summary)
 * - Tier 2: Monthly summaries (4-5 weeks → 1 summary)
 * - Tier 3: Quarterly notepads (3 months → 1 notepad)
 * - Tier 4: Two-year synthesis
 */

import type { Env } from './index';
import type {
  WeeklySummary,
  MonthlySummary,
  QuarterlyNotepad,
  TwoYearSynthesis,
} from './schemas/types';
import { callOpenRouter } from './lib/openrouter';

interface AggregationJob {
  type: 'aggregation';
  tier: 'weekly' | 'monthly' | 'quarterly' | 'synthesis';
  rangeStart: string;
  rangeEnd: string;
}

export async function handleAggregation(
  message: Message,
  env: Env
): Promise<void> {
  const job = message.body as AggregationJob;

  // TODO: Implement aggregation logic based on tier
  // 1. Query D1 for input data (previous tier or extractions)
  // 2. Build prompt for the tier
  // 3. Call OpenRouter
  // 4. Store result in appropriate D1 table

  console.log(`Processing ${job.tier} aggregation for ${job.rangeStart} - ${job.rangeEnd}`);
}
