<script lang="ts">
  import HomeNavBar from '$lib/components/HomeNavBar.svelte';
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';

  let { children } = $props();

  onMount(async () => {
    try {
      // validate server-side the auth state
      pb.authStore.isValid && (await pb.collection('users').authRefresh());
    } catch (error) {
      pb.authStore.clear();
    }

    if (!pb.authStore.isValid) {
      await goto('/sign-in');
    }

    if (!pb.authStore.record?.verified) {
      toast.error('Your email is not yet verified');
      await goto('/sign-in');
    }
  });
</script>

<HomeNavBar />
<div class="container mx-auto p-2 md:p-4">
  <div class="mx-auto max-w-4xl">
    {@render children?.()}
  </div>
</div>
