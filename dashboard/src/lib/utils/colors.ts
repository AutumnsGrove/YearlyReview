/**
 * Color utilities for seasonal theming
 */

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export function getSeasonFromQuarter(quarter: string): Season {
  const q = quarter.split('-Q')[1];
  switch (q) {
    case '1':
      return 'winter';
    case '2':
      return 'spring';
    case '3':
      return 'summer';
    case '4':
      return 'autumn';
    default:
      return 'autumn';
  }
}

export function getSeasonFromMonth(month: number): Season {
  if (month >= 1 && month <= 3) return 'winter';
  if (month >= 4 && month <= 6) return 'spring';
  if (month >= 7 && month <= 9) return 'summer';
  return 'autumn';
}

export function getSeasonClass(season: Season): string {
  switch (season) {
    case 'winter':
      return 'gradient-winter';
    case 'spring':
      return 'gradient-spring';
    case 'summer':
      return 'gradient-summer';
    case 'autumn':
      return 'gradient-autumn';
  }
}

export function getSeasonColors(season: Season): { primary: string; secondary: string } {
  switch (season) {
    case 'winter':
      return { primary: '#0ea5e9', secondary: '#0369a1' };
    case 'spring':
      return { primary: '#22c55e', secondary: '#15803d' };
    case 'summer':
      return { primary: '#f59e0b', secondary: '#b45309' };
    case 'autumn':
      return { primary: '#a855f7', secondary: '#7c3aed' };
  }
}

export const chartColors = {
  mood: 'rgb(168, 85, 247)', // purple
  energy: 'rgb(251, 191, 36)', // amber
  sleep: 'rgb(59, 130, 246)', // blue
  social: 'rgb(34, 197, 94)', // green
};
