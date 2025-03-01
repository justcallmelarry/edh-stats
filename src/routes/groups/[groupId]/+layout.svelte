<script lang="ts">
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { page } from '$app/state';

  // Get the current path to determine active tab
  $: currentPath = page.url.pathname;
  $: activeTab = currentPath.includes('/add-game') ? 'add' : 'rankings';

  // Prevent default tab behavior
  const onValueChange = () => {
    // Do nothing - let the link handle navigation
  };
</script>

<div class="container mx-auto p-4">
  <Tabs.Root value={activeTab} class="w-full" onValueChange={onValueChange}>
    <Tabs.List class="grid w-full grid-cols-2 mb-4">
      <Tabs.Trigger value="rankings">
        <a href="/groups/{page.params.groupId}" class="w-full h-full flex items-center justify-center">
          Rankings
        </a>
      </Tabs.Trigger>
      <Tabs.Trigger value="add">
        <a href="/groups/{page.params.groupId}/add-game" class="w-full h-full flex items-center justify-center">
          Add New Game
        </a>
      </Tabs.Trigger>
    </Tabs.List>

    <slot />
  </Tabs.Root>
</div>