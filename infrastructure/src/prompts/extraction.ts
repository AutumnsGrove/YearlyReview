/**
 * Extraction Prompt (Phase 1)
 *
 * Converts raw journal entries into structured JournalExtraction JSON
 */

import type { JournalExtraction } from '../schemas/types';

const EXTRACTION_SCHEMA = `{
  "date": "string (ISO date)",
  "day_of_week": "string",
  "word_count": "number",
  "mood_score": "number (1-10)",
  "energy_level": "number (1-10)",
  "happiness_indicators": "string[]",
  "distress_indicators": "string[]",
  "sleep_mentioned": "boolean",
  "sleep_quality": "number | null (1-10)",
  "sleep_notes": "string | null",
  "hrt_mentioned": "boolean",
  "hrt_notes": "string | null",
  "medication_mentions": "string[]",
  "physical_health_notes": "string[]",
  "people_mentioned": [{ "name": "string", "relationship_type": "string", "sentiment": "string", "interaction_type": "string" }],
  "family_dynamics_notes": "string | null",
  "social_energy_spent": "number (1-10)",
  "activities": "string[]",
  "major_events": "string[]",
  "work_notes": "string | null",
  "creative_activities": "string[]",
  "dominant_themes": "string[] (max 5)",
  "self_reflection_depth": "number (1-10)",
  "future_oriented": "boolean",
  "gratitude_expressed": "boolean",
  "gender_identity_notes": "string | null",
  "dysphoria_mentioned": "boolean",
  "euphoria_mentioned": "boolean",
  "name_usage": "string | null",
  "key_quotes": "string[] (max 3)",
  "summary": "string (2-3 sentences)"
}`;

export function getExtractionPrompt(date: string, content: string): string {
  return `You are analyzing a personal journal entry. Extract structured information according to the schema provided.

Context:
- Author: Autumn (trans woman, she/her)
- Before January 1, 2025, she went by a different name
- Started HRT on August 15, 2024 (weekly injections on Tuesdays)
- Medication history: Adderall → Atomoxetine (July-Oct 2024) → Guanfacine (Nov 2025+)

Instructions:
- Infer mood/energy from tone, word choice, activities described
- Note any mentions of sleep, health, medications
- Identify people mentioned and relationship context
- Extract themes without over-interpreting
- Be conservative with scores (don't default to 5)
- If something isn't mentioned, use null
- For people_mentioned, relationship_type can be: family, friend, partner, coworker, acquaintance, other
- For people_mentioned, sentiment can be: positive, negative, neutral, mixed
- For people_mentioned, interaction_type can be: in-person, text, call, video, thought-about, mentioned

Entry Date: ${date}
Entry Content:
${content}

Respond with valid JSON matching this schema:
${EXTRACTION_SCHEMA}`;
}

export function getExtractionSystemPrompt(): string {
  return `You are a careful analyst extracting structured data from personal journal entries.
Be thorough but don't fabricate information that isn't present.
Use null for fields where information isn't available.
Always respond with valid JSON.`;
}
