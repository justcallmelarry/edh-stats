<script lang="ts">
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { page } from '$app/state';

  // Get the active tab from the page data
  $: activeTab = page.data.tab ?? 'rankings'; // default to rankings if not specified

  // Prevent default tab behavior
  const onValueChange = () => {
    // Do nothing - let the link handle navigation
  };
</script>

<div class="container mx-auto p-4">
  <Tabs.Root value={activeTab} class="w-full" onValueChange={onValueChange}>
    <Tabs.List class="grid w-full grid-cols-3 mb-4">
      <Tabs.Trigger value="rankings">
        <a href="/groups/{page.params.groupId}" class="w-full h-full flex items-center justify-center">
          Rankings
        </a>
      </Tabs.Trigger>
      <Tabs.Trigger value="games">
        <a href="/groups/{page.params.groupId}/games" class="w-full h-full flex items-center justify-center">
          Game History
        </a>
      </Tabs.Trigger>
      <Tabs.Trigger value="add-game">
        <a href="/groups/{page.params.groupId}/add-game" class="w-full h-full flex items-center justify-center">
          Add New Game
        </a>
      </Tabs.Trigger>
    </Tabs.List>

    <slot />
  </Tabs.Root>
</div>