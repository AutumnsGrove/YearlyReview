<script lang="ts">
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
</script>

<svelte:head>
  <title>Timeline | Reflections</title>
</svelte:head>

<div class="space-y-8">
  <header>
    <h1 class="text-4xl font-bold mb-2">Timeline</h1>
    <p class="text-white/70">Scrollable journey through 2024-2025</p>
  </header>

  <GlassCard>
    <Timeline />
  </GlassCard>
</div>
