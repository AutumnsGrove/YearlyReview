<script lang="ts">
  import { data } from '$lib/stores/data';
  import { getSeasonClass } from '$lib/utils/colors';

  // TODO: Load quarterly notepads from data store
  const quarters = [
    { id: '2024-Q1', title: 'Q1 2024', season: 'winter' },
    { id: '2024-Q2', title: 'Q2 2024', season: 'spring' },
    { id: '2024-Q3', title: 'Q3 2024', season: 'summer' },
    { id: '2024-Q4', title: 'Q4 2024', season: 'autumn' },
    { id: '2025-Q1', title: 'Q1 2025', season: 'winter' },
    { id: '2025-Q2', title: 'Q2 2025', season: 'spring' },
    { id: '2025-Q3', title: 'Q3 2025', season: 'summer' },
    { id: '2025-Q4', title: 'Q4 2025', season: 'autumn' },
  ];
</script>

<div class="relative">
  <!-- Timeline line -->
  <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20"></div>

  <!-- Timeline items -->
  <div class="space-y-8">
    {#each quarters as quarter}
      <div class="relative flex items-start gap-6 pl-4">
        <!-- Timeline dot -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center z-10
                 {getSeasonClass(quarter.season)}"
        >
          <div class="w-3 h-3 rounded-full bg-white"></div>
        </div>

        <!-- Content -->
        <div class="flex-1 pb-8">
          <h3 class="text-lg font-semibold mb-2">{quarter.title}</h3>
          <div class="glass p-4 rounded-lg">
            <p class="text-white/70 text-sm">
              <!-- TODO: Load chapter_title and narrative from quarterly notepad -->
              Timeline data will appear here after pipeline runs.
            </p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
