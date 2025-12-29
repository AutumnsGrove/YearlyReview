<script lang="ts">
  import GlassCard from '$lib/components/GlassCard.svelte';
  import { FileText, Download } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Report | Reflections</title>
</svelte:head>

<div class="space-y-8">
  <header class="flex items-center justify-between">
    <div>
      <h1 class="text-4xl font-bold mb-2">Report</h1>
      <p class="text-white/70">Reflections: A Technical Analysis of Two Years</p>
    </div>
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg gradient-purple-orange
             hover:opacity-90 transition-opacity"
    >
      <Download size={20} />
      <span>Download PDF</span>
    </button>
  </header>

  <GlassCard>
    <div class="flex items-center gap-3 mb-6">
      <FileText size={24} class="text-autumn-400" />
      <h2 class="text-2xl font-semibold">Executive Summary</h2>
    </div>
    <div class="prose prose-invert max-w-none">
      <!-- TODO: Load executive_summary from synthesis -->
      <p class="text-white/70">
        Run the pipeline to generate the executive summary.
      </p>
    </div>
  </GlassCard>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Table of Contents</h2>
    <nav class="space-y-2 text-white/70">
      <a href="#summary" class="block hover:text-white">1. Executive Summary</a>
      <a href="#methodology" class="block hover:text-white">2. Methodology</a>
      <a href="#timeline" class="block hover:text-white">3. Timeline of Major Events</a>
      <a href="#quantitative" class="block hover:text-white">4. Quantitative Analysis</a>
      <a href="#qualitative" class="block hover:text-white">5. Qualitative Analysis</a>
      <a href="#patterns" class="block hover:text-white">6. Pattern Discovery</a>
      <a href="#findings" class="block hover:text-white">7. Key Findings</a>
      <a href="#recommendations" class="block hover:text-white">8. Recommendations for 2026</a>
      <a href="#appendix" class="block hover:text-white">9. Appendix: Quarterly Summaries</a>
    </nav>
  </GlassCard>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Identity & Transition Journey</h2>
    <div class="space-y-4">
      <div>
        <h3 class="font-medium text-autumn-300">Pre-Autumn (2024)</h3>
        <p class="text-white/70">
          <!-- TODO: Load pre_autumn_summary from synthesis -->
          Summary will appear here after pipeline runs.
        </p>
      </div>
      <div>
        <h3 class="font-medium text-autumn-300">Post-Autumn (2025)</h3>
        <p class="text-white/70">
          <!-- TODO: Load post_autumn_summary from synthesis -->
          Summary will appear here after pipeline runs.
        </p>
      </div>
    </div>
  </GlassCard>

  <GlassCard>
    <h2 class="text-xl font-semibold mb-4">Full Narrative</h2>
    <div class="prose prose-invert max-w-none">
      <!-- TODO: Load full_narrative from synthesis -->
      <p class="text-white/70">
        The complete two-year narrative will appear here after the pipeline runs.
      </p>
    </div>
  </GlassCard>
</div>
