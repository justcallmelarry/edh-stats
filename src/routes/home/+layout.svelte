<script lang="ts">
  import HomeNavBar from "$lib/components/HomeNavBar.svelte";

  let { children } = $props();
</script>


<HomeNavBar />
{@render children?.()}
