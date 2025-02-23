<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  import Check from 'lucide-svelte/icons/check';

  let visible = false;

  onMount(() => {
    visible = true;
  });

  async function onClick() {
    let route = '/sign-in';
    const hasSignedIn = localStorage.getItem('hasSignedIn') === 'true';
    if (hasSignedIn) {
      route = '/home';
    }
    await goto(route);
  }
</script>

<main class="min-h-screen flex flex-col md:flex-row">
  <div
    class="w-full md:w-1/2 bg-cover bg-center"
    style="background-image: url('/assets/edh.jpg');"
  ></div>

  <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
    {#if visible}
      <div transition:fade={{ duration: 500 }}>
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to EDH Stats
        </h1>

        <p class="leading-7 [&:not(:first-child)]:mt-6 pb-4">
          Track your Commander games, analyze your performance, and improve your deck-building
          skills.
        </p>

        <ul class="mb-8">
          <li class="flex items-center mb-3">
            <Check color="#22c55e" />&nbsp;Record game results and track win rates
          </li>
          <li class="flex items-center mb-3">
            <Check color="#22c55e" />&nbsp;Analyze commander performance and popularity
          </li>
          <li class="flex items-center mb-3">
            <Check color="#22c55e" />&nbsp;Visualize your playgroup's meta with detailed charts
          </li>
        </ul>

        <div class="space-x-4">
          <Button onclick={onClick}>View Stats</Button>
        </div>
      </div>
    {/if}
  </div>
</main>
