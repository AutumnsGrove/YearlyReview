/**
 * Weekly Aggregation Prompt (Tier 1)
 *
 * Synthesizes 7 daily extractions into a WeeklySummary
 */

import type { JournalExtraction, WeeklySummary } from '../schemas/types';

const WEEKLY_SCHEMA = `{
  "week_start": "string (ISO date)",
  "week_end": "string (ISO date)",
  "avg_mood": "number (1-10)",
  "avg_energy": "number (1-10)",
  "avg_sleep_quality": "number | null",
  "mood_trend": "improving | declining | stable | volatile",
  "people_seen": [{ "name": "string", "count": "number", "avg_sentiment": "number (1-10)" }],
  "dominant_themes": "string[]",
  "notable_events": "string[]",
  "hrt_cycle_notes": "string | null",
  "narrative_summary": "string (1 paragraph)"
}`;

export function getWeeklyPrompt(
  weekStart: string,
  weekEnd: string,
  extractions: JournalExtraction[]
): string {
  const extractionsSummary = extractions
    .map(
      (e) =>
        `Date: ${e.date}
Mood: ${e.mood_score}/10, Energy: ${e.energy_level}/10
Themes: ${e.dominant_themes.join(', ')}
Summary: ${e.summary}`
    )
    .join('\n\n---\n\n');

  return `You are synthesizing a week of journal entries into a weekly summary.

Context:
- Author: Autumn (trans woman, she/her)
- HRT injection day is Tuesday - watch for energy patterns
- Wednesdays often show recovery/boost

Week: ${weekStart} to ${weekEnd}
Number of entries: ${extractions.length}

Daily Extractions:
${extractionsSummary}

Instructions:
- Calculate averages for mood, energy, sleep quality
- Identify mood trend (improving/declining/stable/volatile)
- Aggregate people seen across the week
- Note any HRT cycle patterns (Tuesday dip, Wednesday boost)
- Write a narrative paragraph capturing the week's story

Respond with valid JSON matching this schema:
${WEEKLY_SCHEMA}`;
}

export function getWeeklySystemPrompt(): string {
  return `You are synthesizing daily journal extractions into weekly summaries.
Focus on patterns, trends, and the overall narrative of the week.
Be concise but capture the essential story.
Always respond with valid JSON.`;
}
