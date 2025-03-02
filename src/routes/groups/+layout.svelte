<script lang="ts">
  import HomeNavBar from '$lib/components/HomeNavBar.svelte';

  let { children } = $props();
</script>

<HomeNavBar />
<div class="container mx-auto p-2 md:p-4">
  <div class="max-w-4xl mx-auto">
    {@render children?.()}
  </div>
</div>
