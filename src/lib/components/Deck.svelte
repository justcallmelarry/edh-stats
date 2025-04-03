<script lang="ts">
  import { Layers, TriangleAlert } from 'lucide-svelte';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import Shimmer from './Shimmer.svelte';

  let { size = 16, winner = false, link = '#', deck } = $props();
</script>

<div class="flex items-center gap-2">
  <div>
    <Layers {size} />
  </div>
  <a href={link} class="flex items-center gap-2">
    {#if winner === true}
      <div class="font-semibold">
        <Shimmer>{deck.name}</Shimmer>
      </div>
    {:else}
      <div>
        {deck.name}
      </div>
    {/if}
    {#if deck.colors.length === 0}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger><TriangleAlert {size} class="text-destructive" /></Tooltip.Trigger>
          <Tooltip.Content class="bg-destructive">
            <p>Missing information</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    {/if}
  </a>
</div>
