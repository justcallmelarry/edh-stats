<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button/button.svelte';
  import type { LayoutProps } from './$types';
  import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';

  // Get the active tab from the page data
  let { children }: LayoutProps = $props();

  const navigationItems = [
    { slug: 'rankings', label: 'Rankings', href: `/groups/${page.params.groupId}` },
    { slug: 'games', label: 'Game History', href: `/groups/${page.params.groupId}/games` },
    { slug: 'add-game', label: 'Add Game', href: `/groups/${page.params.groupId}/games/new` },
    { slug: 'pilots', label: 'Pilots', href: `/groups/${page.params.groupId}/pilots` }
  ];

  onMount(async () => {
    // Check if the groupId exists in the groups collection
    const groupId = page.params.groupId;
    try {
      const groupExists = await pb.collection('playgroups').getOne(groupId);
    } catch (error) {
      goto('/404');
    }
  });
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
