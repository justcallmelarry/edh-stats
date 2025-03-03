<script lang="ts">
  import { User } from 'lucide-svelte';

  let { size = 16, text } = $props();
</script>

<div class="flex items-center gap-2">
  <div>
    <User {size} />
  </div>
  <div>
    {text}
  </div>
</div>
