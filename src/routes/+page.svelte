<script>
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';

  async function onClick() {
    let route = '/sign-in';
    const hasSignedIn = localStorage.getItem('hasSignedIn') === 'true';
    if (hasSignedIn) {
      route = '/home';
    }
    await goto(route);
  }
</script>

<div class="h-screen flex items-center justify-center">
  <div class="max-w-3xl text-center">
    <h1 class="text-5xl font-bold">EDH Stats!</h1>
    <p class="py-6">Stats to prove that Sossen deserves being treated as archenemy.</p>
    <Button on:click={onClick}>Go to stats</Button>
  </div>
</div>
