/**
 * Extraction Worker
 *
 * Processes extraction jobs from the queue:
 * 1. Fetch markdown from R2
 * 2. Check cache for existing extraction
 * 3. Call DeepSeek v3.2 via OpenRouter
 * 4. Parse structured JSON response
 * 5. Store in D1 and cache
 */

import type { Env } from './index';
import type { JournalExtraction } from './schemas/types';
import { callOpenRouter } from './lib/openrouter';
import { getExtractionPrompt } from './prompts/extraction';

interface ExtractionJob {
  type: 'extraction';
  date: string;
  r2Key: string;
  contentHash: string;
}

export async function handleExtraction(
  message: Message,
  env: Env
): Promise<void> {
  const job = message.body as ExtractionJob;

  // TODO: Implement extraction logic
  // 1. Check KV cache for existing extraction
  // 2. If cache miss, fetch from R2
  // 3. Call OpenRouter with extraction prompt
  // 4. Parse and validate response
  // 5. Store in D1 and KV cache

  console.log(`Processing extraction for ${job.date}`);
}
