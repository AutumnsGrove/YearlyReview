/**
 * Data Store
 *
 * Loads and manages dashboard data from dashboard-data.json
 */

import { writable, derived } from 'svelte/store';
import type {
  TwoYearSynthesis,
  QuarterlyNotepad,
  MonthlySummary,
  WeeklySummary,
  JournalExtraction,
} from './types';

interface DashboardData {
  generatedAt: string | null;
  synthesis: TwoYearSynthesis | null;
  quarterlyNotepads: QuarterlyNotepad[];
  monthlySummaries: MonthlySummary[];
  weeklySummaries: WeeklySummary[];
  extractions: JournalExtraction[];
}

const initialData: DashboardData = {
  generatedAt: null,
  synthesis: null,
  quarterlyNotepads: [],
  monthlySummaries: [],
  weeklySummaries: [],
  extractions: [],
};

export const data = writable<DashboardData>(initialData);
export const isLoaded = writable(false);
export const loadError = writable<string | null>(null);

export async function loadDashboardData(): Promise<void> {
  try {
    const response = await fetch('/data/dashboard-data.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    const jsonData = await response.json();
    data.set(jsonData);
    isLoaded.set(true);
  } catch (error) {
    loadError.set(error instanceof Error ? error.message : 'Unknown error');
    console.error('Failed to load dashboard data:', error);
  }
}

// Derived stores for convenience
export const synthesis = derived(data, ($data) => $data.synthesis);
export const quarterlyNotepads = derived(data, ($data) => $data.quarterlyNotepads);
export const monthlySummaries = derived(data, ($data) => $data.monthlySummaries);

export const totalEntries = derived(data, ($data) => $data.extractions.length);

export const averageMood = derived(data, ($data) => {
  if ($data.extractions.length === 0) return 0;
  const sum = $data.extractions.reduce((acc, e) => acc + e.mood_score, 0);
  return Math.round((sum / $data.extractions.length) * 10) / 10;
});

export const averageEnergy = derived(data, ($data) => {
  if ($data.extractions.length === 0) return 0;
  const sum = $data.extractions.reduce((acc, e) => acc + e.energy_level, 0);
  return Math.round((sum / $data.extractions.length) * 10) / 10;
});
