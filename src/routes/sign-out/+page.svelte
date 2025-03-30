<script lang="ts">
  import { goto } from '$app/navigation';
  import { pb } from '$lib/pocketbase';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';

  async function logout() {
    pb.authStore.clear();
    await goto('/sign-in');
  }
</script>

<div class="flex h-screen items-center justify-center">
  <Card.Root class="mx-auto max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Log Out</Card.Title>
      <Card.Description>Click the button below to log out</Card.Description>
    </Card.Header>
    <Card.Content>
      <Button onclick={logout} class="w-full">Log Out</Button>
    </Card.Content>
  </Card.Root>
</div>
