/**
 * Monthly Aggregation Prompt (Tier 2)
 *
 * Synthesizes 4-5 weekly summaries into a MonthlySummary
 */

import type { WeeklySummary, MonthlySummary } from '../schemas/types';

const MONTHLY_SCHEMA = `{
  "month": "string (YYYY-MM)",
  "happiness_index": "number (1-10)",
  "overall_trajectory": "string",
  "relationship_health": {
    "family": "number (1-10)",
    "friends": "number (1-10)",
    "romantic": "number | null (1-10)"
  },
  "top_themes": "string[]",
  "major_milestones": "string[]",
  "challenges_faced": "string[]",
  "wins": "string[]",
  "medication_notes": "string | null",
  "sleep_pattern_summary": "string",
  "narrative_summary": "string (2-3 paragraphs)"
}`;

export function getMonthlyPrompt(
  month: string,
  weeklySummaries: WeeklySummary[]
): string {
  const weekliesSummary = weeklySummaries
    .map(
      (w) =>
        `Week ${w.week_start} - ${w.week_end}:
Mood: ${w.avg_mood}/10, Energy: ${w.avg_energy}/10
Trend: ${w.mood_trend}
Themes: ${w.dominant_themes.join(', ')}
Events: ${w.notable_events.join(', ') || 'None notable'}
Summary: ${w.narrative_summary}`
    )
    .join('\n\n---\n\n');

  return `You are synthesizing weekly summaries into a monthly summary.

Context:
- Author: Autumn (trans woman, she/her)
- Key dates to remember:
  - Aug 15, 2024: Started HRT
  - Jan 1, 2025: Started going by "Autumn"
  - July-Oct 2024: Atomoxetine trial
  - Nov 2025+: Started Guanfacine

Month: ${month}
Number of weeks: ${weeklySummaries.length}

Weekly Summaries:
${weekliesSummary}

Instructions:
- Compute overall happiness index from weekly moods
- Assess relationship health with family, friends, romantic partner
- Identify major milestones, challenges, and wins
- Note any medication-related patterns
- Write a 2-3 paragraph narrative capturing the month's arc

Respond with valid JSON matching this schema:
${MONTHLY_SCHEMA}`;
}

export function getMonthlySystemPrompt(): string {
  return `You are synthesizing weekly summaries into monthly summaries.
Look for month-long arcs and patterns.
Assess relationship health and identify milestones.
Always respond with valid JSON.`;
}
