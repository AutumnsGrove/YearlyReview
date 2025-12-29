<script lang="ts">
  import GlassCard from '$lib/components/GlassCard.svelte';
</script>

<svelte:head>
  <title>Relationships | Reflections</title>
</svelte:head>

<div class="space-y-8">
  <header>
    <h1 class="text-4xl font-bold mb-2">Relationships</h1>
    <p class="text-white/70">People mentioned and relationship arcs</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Most Mentioned People</h2>
      <div class="text-white/70">
        <!-- TODO: Load from synthesis data -->
        <p>No relationship data loaded yet.</p>
      </div>
    </GlassCard>

    <GlassCard>
      <h2 class="text-xl font-semibold mb-4">Family Journey</h2>
      <div class="text-white/70">
        <!-- TODO: Load from synthesis data -->
        <p>No family journey data loaded yet.</p>
      </div>
    </GlassCard>
  </div>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Relationship Arcs</h2>
    <div class="text-white/70">
      <!-- TODO: Load relationship arcs from synthesis data -->
      <p>No relationship arcs loaded yet.</p>
    </div>
  </GlassCard>
</div>
