/**
 * Quarterly Aggregation Prompt (Tier 3)
 *
 * Synthesizes 3 monthly summaries into a QuarterlyNotepad
 */

import type { MonthlySummary, QuarterlyNotepad } from '../schemas/types';

const QUARTERLY_SCHEMA = `{
  "quarter": "string (YYYY-QN)",
  "happiness_trajectory": "number[] (monthly scores)",
  "energy_trajectory": "number[]",
  "social_engagement_level": "number (1-10)",
  "chapter_title": "string (thematic title)",
  "opening_state": "string (where was Autumn at quarter start)",
  "closing_state": "string (where was she at quarter end)",
  "most_mentioned_people": [{ "name": "string", "total_mentions": "number", "trajectory": "string" }],
  "family_dynamics_summary": "string",
  "hrt_progress_notes": "string | null",
  "medication_changes": "string[]",
  "sleep_trend": "string",
  "skills_developed": "string[]",
  "challenges_overcome": "string[]",
  "unresolved_threads": "string[]",
  "narrative": "string (4-6 paragraphs, story format)"
}`;

export function getQuarterlyPrompt(
  quarter: string,
  monthlySummaries: MonthlySummary[]
): string {
  const monthliesSummary = monthlySummaries
    .map(
      (m) =>
        `Month ${m.month}:
Happiness: ${m.happiness_index}/10
Trajectory: ${m.overall_trajectory}
Themes: ${m.top_themes.join(', ')}
Milestones: ${m.major_milestones.join(', ') || 'None'}
Challenges: ${m.challenges_faced.join(', ') || 'None'}
Wins: ${m.wins.join(', ') || 'None'}
Summary: ${m.narrative_summary}`
    )
    .join('\n\n---\n\n');

  return `You are synthesizing monthly summaries into a quarterly "notepad" - a chapter in Autumn's story.

Context:
- Author: Autumn (trans woman, she/her)
- This is one of 8 quarters spanning 2024-2025
- Key milestones:
  - Q3 2024: Started HRT (Aug 15)
  - Q1 2025: Started going by "Autumn" (Jan 1)
  - Q3-Q4 2024: Atomoxetine trial period
  - Q4 2025: Started Guanfacine

Quarter: ${quarter}

Monthly Summaries:
${monthliesSummary}

Instructions:
- Create a compelling "chapter_title" that captures this quarter's theme
- Describe opening and closing states - how Autumn evolved
- Track most mentioned people and their relationship trajectories
- Note HRT progress if this quarter includes Aug 2024 onwards
- Identify skills developed, challenges overcome, and unresolved threads
- Write a 4-6 paragraph narrative in story format

Respond with valid JSON matching this schema:
${QUARTERLY_SCHEMA}`;
}

export function getQuarterlySystemPrompt(): string {
  return `You are writing quarterly "chapters" of Autumn's two-year journey.
Create compelling narratives with clear story arcs.
Give each quarter a thematic title that captures its essence.
Always respond with valid JSON.`;
}
