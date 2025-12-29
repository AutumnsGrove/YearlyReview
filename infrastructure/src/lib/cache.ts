/**
 * Cache Helpers
 *
 * KV-based caching for extraction results to enable idempotent reruns
 */

import type { JournalExtraction } from '../schemas/types';

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function extractionCacheKey(entryDate: string, contentHash: string): string {
  return `extract:${entryDate}:${contentHash.slice(0, 16)}`;
}

export function aggregationCacheKey(
  tier: string,
  range: string,
  inputHash: string
): string {
  return `agg:${tier}:${range}:${inputHash.slice(0, 16)}`;
}

export async function getCachedExtraction(
  cache: KVNamespace,
  date: string,
  contentHash: string
): Promise<JournalExtraction | null> {
  const key = extractionCacheKey(date, contentHash);
  const cached = await cache.get(key, 'json');
  return cached as JournalExtraction | null;
}

export async function setCachedExtraction(
  cache: KVNamespace,
  date: string,
  contentHash: string,
  extraction: JournalExtraction
): Promise<void> {
  const key = extractionCacheKey(date, contentHash);
  await cache.put(key, JSON.stringify(extraction), {
    expirationTtl: CACHE_TTL_SECONDS,
  });
}
