<script lang="ts">
  import { User } from 'lucide-svelte';
  import Shimmer from './Shimmer.svelte';

  let { size = 16, winner = false, text } = $props();
</script>

<div class="flex items-center gap-2">
  <div>
    <User {size} />
  </div>
  {#if winner === true}
    <div class="font-semibold">
      <Shimmer>{text}</Shimmer>
    </div>
  {:else}
    <div>
      {text}
    </div>
  {/if}
</div>
