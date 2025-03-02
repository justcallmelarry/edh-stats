<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { LayoutProps } from './$types';
  import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

  // Get the active tab from the page data
  let { children }: LayoutProps = $props();

  const navigationItems = [
    { slug: 'rankings', label: 'Rankings', href: `/groups/${page.params.groupId}` },
    { slug: 'games', label: 'Game History', href: `/groups/${page.params.groupId}/games` },
    { slug: 'add-game', label: 'Add Game', href: `/groups/${page.params.groupId}/add-game` },
    { slug: 'pilots', label: 'Pilots', href: `/groups/${page.params.groupId}/pilots` }
  ];
</script>

<ScrollArea orientation="both" scrollbarXClasses="invisible">
  <div class="mb-4 flex items-center overflow-y-auto md:pb-0">
    {#each navigationItems as item}
      <Button
        href={item.href}
        class="w-full h-full flex items-center justify-center"
        variant={page.data.tab === item.slug ? 'outline' : 'ghost'}
      >
        {item.label}
      </Button>
    {/each}
  </div>
</ScrollArea>
{@render children?.()}
