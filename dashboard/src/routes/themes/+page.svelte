<script lang="ts">
  import GlassCard from '$lib/components/GlassCard.svelte';
</script>

<svelte:head>
  <title>Themes | Reflections</title>
</svelte:head>

<div class="space-y-8">
  <header>
    <h1 class="text-4xl font-bold mb-2">Themes</h1>
    <p class="text-white/70">Dominant themes and their evolution over time</p>
  </header>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Theme Word Cloud</h2>
    <div class="h-64 flex items-center justify-center text-white/50">
      <!-- TODO: Word cloud visualization -->
      <p>Word cloud placeholder</p>
    </div>
  </GlassCard>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Strengths Demonstrated</h2>
      <div class="text-white/70">
        <!-- TODO: Load from synthesis -->
        <ul class="list-disc list-inside space-y-1">
          <li>Placeholder strength 1</li>
          <li>Placeholder strength 2</li>
        </ul>
      </div>
    </GlassCard>

    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Recurring Challenges</h2>
      <div class="text-white/70">
        <!-- TODO: Load from synthesis -->
        <ul class="list-disc list-inside space-y-1">
          <li>Placeholder challenge 1</li>
          <li>Placeholder challenge 2</li>
        </ul>
      </div>
    </GlassCard>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Unfinished Business</h2>
      <div class="text-white/70">
        <!-- TODO: Load from synthesis -->
        <p>No unfinished business data loaded yet.</p>
      </div>
    </GlassCard>

    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Growth Areas</h2>
      <div class="text-white/70">
        <!-- TODO: Load from synthesis -->
        <p>No growth areas data loaded yet.</p>
      </div>
    </GlassCard>
  </div>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Seasonal Patterns</h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-lg gradient-winter">
        <h3 class="font-semibold">Winter</h3>
        <p class="text-sm opacity-80">Q1</p>
      </div>
      <div class="p-4 rounded-lg gradient-spring">
        <h3 class="font-semibold">Spring</h3>
        <p class="text-sm opacity-80">Q2</p>
      </div>
      <div class="p-4 rounded-lg gradient-summer">
        <h3 class="font-semibold">Summer</h3>
        <p class="text-sm opacity-80">Q3</p>
      </div>
      <div class="p-4 rounded-lg gradient-autumn">
        <h3 class="font-semibold">Autumn</h3>
        <p class="text-sm opacity-80">Q4</p>
      </div>
    </div>
  </GlassCard>
</div>
