<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import {
    Home,
    Clock,
    Users,
    Heart,
    Tag,
    FileText,
  } from 'lucide-svelte';

  interface NavItem {
    href: string;
    label: string;
    icon: typeof Home;
  }

  const navItems: NavItem[] = [
    { href: '/', label: 'Overview', icon: Home },
    { href: '/timeline', label: 'Timeline', icon: Clock },
    { href: '/relationships', label: 'Relationships', icon: Users },
    { href: '/health', label: 'Health', icon: Heart },
    { href: '/themes', label: 'Themes', icon: Tag },
    { href: '/report', label: 'Report', icon: FileText },
  ];

  let { children } = $props();
</script>

<div class="min-h-screen flex">
  <!-- Sidebar -->
  <aside class="w-64 glass-dark p-6 flex flex-col gap-6">
    <div class="text-2xl font-bold gradient-purple-orange bg-clip-text text-transparent">
      Reflections
    </div>

    <nav class="flex flex-col gap-2">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                 {$page.url.pathname === item.href
                   ? 'bg-white/20 text-white'
                   : 'text-white/70 hover:text-white hover:bg-white/10'}"
        >
          <svelte:component this={item.icon} size={20} />
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="mt-auto text-sm text-white/50">
      2024-2025 Journal Analysis
    </div>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-8 overflow-auto">
    {@render children()}
  </main>
</div>
