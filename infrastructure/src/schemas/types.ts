/**
 * TypeScript interfaces for all extraction and aggregation schemas
 */

// ============================================================================
// Phase 1: Journal Extraction
// ============================================================================

export interface PersonMention {
  name: string;
  relationship_type: string; // family, friend, partner, coworker, etc.
  sentiment: string; // positive, negative, neutral, mixed
  interaction_type: string; // in-person, text, call, thought-about
}

export interface JournalExtraction {
  // Metadata
  date: string;
  day_of_week: string;
  word_count: number;

  // Mood & Energy
  mood_score: number; // 1-10 inferred
  energy_level: number; // 1-10 inferred
  happiness_indicators: string[];
  distress_indicators: string[];

  // Sleep
  sleep_mentioned: boolean;
  sleep_quality: number | null; // 1-10 if mentioned
  sleep_notes: string | null;

  // Health & HRT
  hrt_mentioned: boolean;
  hrt_notes: string | null;
  medication_mentions: string[];
  physical_health_notes: string[];

  // Social & Relationships
  people_mentioned: PersonMention[];
  family_dynamics_notes: string | null;
  social_energy_spent: number; // 1-10 estimate

  // Activities & Events
  activities: string[];
  major_events: string[];
  work_notes: string | null;
  creative_activities: string[];

  // Themes & Reflection
  dominant_themes: string[]; // max 5
  self_reflection_depth: number; // 1-10
  future_oriented: boolean;
  gratitude_expressed: boolean;

  // Identity & Transition
  gender_identity_notes: string | null;
  dysphoria_mentioned: boolean;
  euphoria_mentioned: boolean;
  name_usage: string | null;

  // Raw for aggregation
  key_quotes: string[]; // max 3 significant sentences
  summary: string; // 2-3 sentence summary
}

// ============================================================================
// Phase 2 Tier 1: Weekly Summaries
// ============================================================================

export interface WeeklySummary {
  week_start: string;
  week_end: string;

  avg_mood: number;
  avg_energy: number;
  avg_sleep_quality: number | null;

  mood_trend: 'improving' | 'declining' | 'stable' | 'volatile';

  people_seen: {
    name: string;
    count: number;
    avg_sentiment: number;
  }[];

  dominant_themes: string[];
  notable_events: string[];

  hrt_cycle_notes: string | null;

  narrative_summary: string;
}

// ============================================================================
// Phase 2 Tier 2: Monthly Summaries
// ============================================================================

export interface MonthlySummary {
  month: string; // "YYYY-MM"

  happiness_index: number;
  overall_trajectory: string;

  relationship_health: {
    family: number; // 1-10
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

// ============================================================================
// Phase 2 Tier 3: Quarterly Notepads
// ============================================================================

export interface QuarterlyNotepad {
  quarter: string; // "YYYY-QN"

  // Aggregated metrics
  happiness_trajectory: number[];
  energy_trajectory: number[];
  social_engagement_level: number;

  // Key narratives
  chapter_title: string;
  opening_state: string;
  closing_state: string;

  // Relationships
  most_mentioned_people: {
    name: string;
    total_mentions: number;
    trajectory: string;
  }[];
  family_dynamics_summary: string;

  // Health
  hrt_progress_notes: string | null;
  medication_changes: string[];
  sleep_trend: string;

  // Growth
  skills_developed: string[];
  challenges_overcome: string[];
  unresolved_threads: string[];

  // Full narrative
  narrative: string;
}

// ============================================================================
// Phase 2 Tier 4: Two-Year Synthesis
// ============================================================================

export interface TwoYearSynthesis {
  // The big picture
  thesis: string;

  // Identity journey
  pre_autumn_summary: string;
  post_autumn_summary: string;
  transition_narrative: string;

  // Metrics over time
  happiness_by_quarter: number[];
  energy_by_quarter: number[];
  social_engagement_by_quarter: number[];

  // Patterns discovered
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

  // Relationships
  relationship_arcs: {
    name: string;
    arc_summary: string;
    current_status: string;
  }[];

  family_journey: string;

  // Major events timeline
  milestones: {
    date: string;
    event: string;
    impact: string;
  }[];

  // For resolutions
  strengths_demonstrated: string[];
  recurring_challenges: string[];
  unfinished_business: string[];
  growth_areas: string[];

  // The report
  executive_summary: string;
  full_narrative: string;
}

// ============================================================================
// Pipeline Types
// ============================================================================

export interface ManifestEntry {
  date: string;
  originalPath: string;
  r2Key: string;
  wordCount: number;
  contentHash: string;
}

export interface Manifest {
  generatedAt: string;
  totalEntries: number;
  dateRange: {
    start: string;
    end: string;
  };
  entries: ManifestEntry[];
}
