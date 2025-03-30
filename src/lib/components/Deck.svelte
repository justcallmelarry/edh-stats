<script lang="ts">
  import { Layers } from 'lucide-svelte';
  import Shimmer from './Shimmer.svelte';

  let { size = 16, winner = false, link = '#', text } = $props();
</script>

<div class="flex items-center gap-2">
  <div>
    <Layers {size} />
  </div>
  <a href={link}>
    {#if winner === true}
      <div class="font-semibold">
        <Shimmer>{text}</Shimmer>
      </div>
    {:else}
      <div>
        {text}
      </div>
    {/if}
  </a>
</div>
