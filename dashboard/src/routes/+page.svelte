<script lang="ts">
  import GlassCard from '$lib/components/GlassCard.svelte';
  import { TrendingUp, Calendar, Users, Brain } from 'lucide-svelte';

  // TODO: Load from dashboard-data.json
  const stats = {
    totalEntries: 0,
    dateRange: '2024-01-01 to 2025-12-31',
    avgMood: 0,
    avgEnergy: 0,
  };
</script>

<svelte:head>
  <title>Overview | Reflections</title>
</svelte:head>

<div class="space-y-8">
  <header>
    <h1 class="text-4xl font-bold mb-2">Overview</h1>
    <p class="text-white/70">Two-year journal analysis summary</p>
  </header>

  <!-- Stats grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <GlassCard>
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-lg gradient-autumn">
          <Calendar size={24} />
        </div>
        <div>
          <div class="text-2xl font-bold">{stats.totalEntries}</div>
          <div class="text-white/70 text-sm">Journal Entries</div>
        </div>
      </div>
    </GlassCard>

    <GlassCard>
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-lg gradient-spring">
          <TrendingUp size={24} />
        </div>
        <div>
          <div class="text-2xl font-bold">{stats.avgMood}/10</div>
          <div class="text-white/70 text-sm">Average Mood</div>
        </div>
      </div>
    </GlassCard>

    <GlassCard>
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-lg gradient-summer">
          <Brain size={24} />
        </div>
        <div>
          <div class="text-2xl font-bold">{stats.avgEnergy}/10</div>
          <div class="text-white/70 text-sm">Average Energy</div>
        </div>
      </div>
    </GlassCard>

    <GlassCard>
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-lg gradient-winter">
          <Users size={24} />
        </div>
        <div>
          <div class="text-2xl font-bold">--</div>
          <div class="text-white/70 text-sm">People Mentioned</div>
        </div>
      </div>
    </GlassCard>
  </div>

  <!-- Executive Summary -->
  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Executive Summary</h2>
    <p class="text-white/70">
      <!-- TODO: Load from synthesis data -->
      Run the pipeline to generate your two-year journal analysis.
    </p>
  </GlassCard>

  <!-- Milestone Timeline Preview -->
  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Key Milestones</h2>
    <div class="text-white/70">
      <!-- TODO: Load milestones from synthesis data -->
      <p>No milestones loaded yet.</p>
    </div>
  </GlassCard>
</div>
