<script lang="ts">
  import { Layers } from 'lucide-svelte';

  let { size = 16, text } = $props();
</script>

<div class="flex items-center gap-2">
  <div>
    <Layers {size} />
  </div>
  <div>
    {text}
  </div>
</div>
