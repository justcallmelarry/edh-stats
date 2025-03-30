<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Check } from 'lucide-svelte';
  import { pb } from '$lib/pocketbase';

  let visible = false;

  onMount(() => {
    visible = true;
  });

  async function onClick() {
    let route = '/groups';

    try {
      // validate server-side the auth state
      pb.authStore.isValid && (await pb.collection('users').authRefresh());
    } catch (error) {
      pb.authStore.clear();
      route = '/sign-in';
    }

    await goto(route);
  }
</script>

<main class="flex min-h-screen flex-col md:flex-row">
  <div
    class="w-full bg-cover bg-center md:w-1/2"
    style="background-image: url('/assets/edh.jpg');"
  ></div>

  <div class="flex w-full flex-col justify-center p-8 md:w-1/2">
    {#if visible}
      <div transition:fade={{ duration: 500 }}>
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to EDH Stats
        </h1>

        <p class="pb-4 leading-7 [&:not(:first-child)]:mt-6">
          Track your Commander games, analyze your performance, and improve your deck-building
          skills.
        </p>

        <ul class="mb-8">
          <li class="mb-3 flex items-center">
            <Check color="#22c55e" />&nbsp;Record game results and track win rates
          </li>
          <li class="mb-3 flex items-center">
            <Check color="#22c55e" />&nbsp;Analyze commander performance and popularity
          </li>
          <li class="mb-3 flex items-center">
            <Check color="#22c55e" />&nbsp;Visualize your playgroup's meta with detailed charts
          </li>
        </ul>

        <div class="space-x-4">
          <Button onclick={onClick}>Go to playgroups</Button>
        </div>
      </div>
    {/if}
  </div>
</main>
