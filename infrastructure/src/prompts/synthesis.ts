/**
 * Two-Year Synthesis Prompt (Tier 4)
 *
 * Final aggregation across all 8 quarterly notepads
 */

import type { QuarterlyNotepad, TwoYearSynthesis } from '../schemas/types';

const SYNTHESIS_SCHEMA = `{
  "thesis": "string (one sentence capturing the arc)",
  "pre_autumn_summary": "string (before Jan 1, 2025)",
  "post_autumn_summary": "string (after Jan 1, 2025)",
  "transition_narrative": "string (the full identity journey)",
  "happiness_by_quarter": "number[]",
  "energy_by_quarter": "number[]",
  "social_engagement_by_quarter": "number[]",
  "weekly_patterns": {
    "best_days": "string[]",
    "worst_days": "string[]",
    "hrt_cycle_correlation": "string"
  },
  "seasonal_patterns": {
    "best_season": "string",
    "worst_season": "string",
    "notes": "string"
  },
  "medication_correlations": {
    "adderall_period": { "dates": "string", "summary": "string" },
    "atomoxetine_period": { "dates": "string", "summary": "string" },
    "guanfacine_period": { "dates": "string", "summary": "string" }
  },
  "relationship_arcs": [{ "name": "string", "arc_summary": "string", "current_status": "string" }],
  "family_journey": "string",
  "milestones": [{ "date": "string", "event": "string", "impact": "string" }],
  "strengths_demonstrated": "string[]",
  "recurring_challenges": "string[]",
  "unfinished_business": "string[]",
  "growth_areas": "string[]",
  "executive_summary": "string (1 page equivalent)",
  "full_narrative": "string (multi-page story)"
}`;

export function getSynthesisPrompt(notepads: QuarterlyNotepad[]): string {
  const notepadsSummary = notepads
    .map(
      (n) =>
        `Quarter ${n.quarter}: "${n.chapter_title}"
Opening: ${n.opening_state}
Closing: ${n.closing_state}
Key people: ${n.most_mentioned_people.map((p) => `${p.name} (${p.trajectory})`).join(', ')}
Family: ${n.family_dynamics_summary}
HRT: ${n.hrt_progress_notes || 'N/A'}
Challenges overcome: ${n.challenges_overcome.join(', ') || 'None listed'}
Unresolved: ${n.unresolved_threads.join(', ') || 'None listed'}
Narrative excerpt: ${n.narrative.slice(0, 500)}...`
    )
    .join('\n\n===\n\n');

  return `You are writing the final two-year synthesis of Autumn's journal journey (2024-2025).

This is a "technical report" meant to inform 2026 New Year's resolutions with data-driven insights.

Context:
- Author: Autumn (trans woman, she/her)
- Key dates:
  - Pre-July 2024: On Adderall (baseline)
  - July-Oct 2024: Atomoxetine trial (watch for mood/productivity dip)
  - Aug 15, 2024: Started HRT (weekly Tuesday injections)
  - Jan 1, 2025: Started going by "Autumn" (identity milestone)
  - Nov 2025: Started Guanfacine (watch for improvement)

Quarterly Notepads:
${notepadsSummary}

Instructions:
- Write a single "thesis" sentence capturing the two-year arc
- Separate pre-Autumn (2024) and post-Autumn (2025) summaries
- Write a compelling transition_narrative covering the identity journey
- Identify weekly patterns (best/worst days, HRT cycle effects)
- Identify seasonal patterns
- Correlate medication periods with mood/productivity
- Track key relationship arcs
- Chronicle the family journey
- List major milestones with their impact
- Identify strengths, challenges, unfinished business, and growth areas
- Write a ~1 page executive summary
- Write a multi-page full_narrative telling Autumn's story

Respond with valid JSON matching this schema:
${SYNTHESIS_SCHEMA}`;
}

export function getSynthesisSystemPrompt(): string {
  return `You are writing the definitive two-year analysis of Autumn's journey.
This is both a data-driven report and a compelling personal narrative.
Be thorough, insightful, and forward-looking.
The goal is to inform 2026 resolutions with concrete, actionable insights.
Always respond with valid JSON.`;
}
