<script lang="ts">
  import { User } from 'lucide-svelte';
  import Shimmer from './Shimmer.svelte';

  let { size = 16, winner = false, link = '#', pilot } = $props();
</script>

<div class="flex items-center gap-2">
  <div>
    <User {size} />
  </div>
  <a href={link}>
    {#if winner === true}
      <div class="font-semibold">
        <Shimmer>{pilot.name}</Shimmer>
      </div>
    {:else}
      <div>
        {pilot.name}
      </div>
    {/if}
  </a>
</div>
