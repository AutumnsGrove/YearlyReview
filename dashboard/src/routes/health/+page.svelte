<script lang="ts">
  import GlassCard from '$lib/components/GlassCard.svelte';
  import MoodChart from '$lib/components/MoodChart.svelte';
</script>

<svelte:head>
  <title>Health | Reflections</title>
</svelte:head>

<div class="space-y-8">
  <header>
    <h1 class="text-4xl font-bold mb-2">Health</h1>
    <p class="text-white/70">HRT tracking, sleep trends, and medication correlations</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Mood Over Time</h2>
      <MoodChart />
    </GlassCard>

    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Energy Over Time</h2>
      <div class="h-64 flex items-center justify-center text-white/50">
        <!-- TODO: Energy chart component -->
        <p>Chart placeholder</p>
      </div>
    </GlassCard>
  </div>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">HRT Timeline</h2>
    <div class="text-white/70">
      <p class="mb-2"><strong>Started:</strong> August 15, 2024</p>
      <p class="mb-2"><strong>Injection Day:</strong> Tuesdays</p>
      <p class="mb-4"><strong>Pattern:</strong> Tuesday dip → Wednesday recovery</p>
      <!-- TODO: Load HRT progress notes from synthesis -->
    </div>
  </GlassCard>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <GlassCard>
      <h3 class="text-lg font-semibold mb-3">Adderall Period</h3>
      <p class="text-white/70 text-sm">Pre-July 2024</p>
      <!-- TODO: Load from synthesis -->
    </GlassCard>

    <GlassCard>
      <h3 class="text-lg font-semibold mb-3">Atomoxetine Trial</h3>
      <p class="text-white/70 text-sm">July - October 2024</p>
      <!-- TODO: Load from synthesis -->
    </GlassCard>

    <GlassCard>
      <h3 class="text-lg font-semibold mb-3">Guanfacine Period</h3>
      <p class="text-white/70 text-sm">November 2025+</p>
      <!-- TODO: Load from synthesis -->
    </GlassCard>
  </div>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Sleep Patterns</h2>
    <div class="text-white/70">
      <!-- TODO: Load sleep trend from synthesis -->
      <p>No sleep data loaded yet.</p>
    </div>
  </GlassCard>
</div>
