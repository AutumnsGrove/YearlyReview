/**
 * TypeScript types for dashboard data
 *
 * These mirror the infrastructure/src/schemas/types.ts definitions
 */

export interface PersonMention {
  name: string;
  relationship_type: string;
  sentiment: string;
  interaction_type: string;
}

export interface JournalExtraction {
  date: string;
  day_of_week: string;
  word_count: number;
  mood_score: number;
  energy_level: number;
  happiness_indicators: string[];
  distress_indicators: string[];
  sleep_mentioned: boolean;
  sleep_quality: number | null;
  sleep_notes: string | null;
  hrt_mentioned: boolean;
  hrt_notes: string | null;
  medication_mentions: string[];
  physical_health_notes: string[];
  people_mentioned: PersonMention[];
  family_dynamics_notes: string | null;
  social_energy_spent: number;
  activities: string[];
  major_events: string[];
  work_notes: string | null;
  creative_activities: string[];
  dominant_themes: string[];
  self_reflection_depth: number;
  future_oriented: boolean;
  gratitude_expressed: boolean;
  gender_identity_notes: string | null;
  dysphoria_mentioned: boolean;
  euphoria_mentioned: boolean;
  name_usage: string | null;
  key_quotes: string[];
  summary: string;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  avg_mood: number;
  avg_energy: number;
  avg_sleep_quality: number | null;
  mood_trend: 'improving' | 'declining' | 'stable' | 'volatile';
  people_seen: { name: string; count: number; avg_sentiment: number }[];
  dominant_themes: string[];
  notable_events: string[];
  hrt_cycle_notes: string | null;
  narrative_summary: string;
}

export interface MonthlySummary {
  month: string;
  happiness_index: number;
  overall_trajectory: string;
  relationship_health: {
    family: number;
    friends: number;
    romantic: number | null;
  };
  top_themes: string[];
  major_milestones: string[];
  challenges_faced: string[];
  wins: string[];
  medication_notes: string | null;
  sleep_pattern_summary: string;
  narrative_summary: string;
}

export interface QuarterlyNotepad {
  quarter: string;
  happiness_trajectory: number[];
  energy_trajectory: number[];
  social_engagement_level: number;
  chapter_title: string;
  opening_state: string;
  closing_state: string;
  most_mentioned_people: { name: string; total_mentions: number; trajectory: string }[];
  family_dynamics_summary: string;
  hrt_progress_notes: string | null;
  medication_changes: string[];
  sleep_trend: string;
  skills_developed: string[];
  challenges_overcome: string[];
  unresolved_threads: string[];
  narrative: string;
}

export interface TwoYearSynthesis {
  thesis: string;
  pre_autumn_summary: string;
  post_autumn_summary: string;
  transition_narrative: string;
  happiness_by_quarter: number[];
  energy_by_quarter: number[];
  social_engagement_by_quarter: number[];
  weekly_patterns: {
    best_days: string[];
    worst_days: string[];
    hrt_cycle_correlation: string;
  };
  seasonal_patterns: {
    best_season: string;
    worst_season: string;
    notes: string;
  };
  medication_correlations: {
    adderall_period: { dates: string; summary: string };
    atomoxetine_period: { dates: string; summary: string };
    guanfacine_period: { dates: string; summary: string };
  };
  relationship_arcs: { name: string; arc_summary: string; current_status: string }[];
  family_journey: string;
  milestones: { date: string; event: string; impact: string }[];
  strengths_demonstrated: string[];
  recurring_challenges: string[];
  unfinished_business: string[];
  growth_areas: string[];
  executive_summary: string;
  full_narrative: string;
}
