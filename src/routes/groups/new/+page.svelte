<script lang="ts">
  import { goto } from '$app/navigation';
  import { pb } from '$lib/pocketbase';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let name = '';
  let error = '';

  async function handleSubmit() {
    try {
      const currentUser = pb.authStore.record;
      if (!currentUser) {
        error = 'You must be logged in to create a playgroup';
        return;
      }

      const data = {
        name,
        owner: currentUser?.id || '',
        members: [currentUser?.id || '']
      };

      await pb.collection('playgroups').create(data);
      goto('/groups');
    } catch (err) {
      console.error('Error creating playgroup:', err);
      error = 'Failed to create playgroup';
    }
  }
</script>

<div class="container mx-auto p-4">
  <Card.Root class="mx-auto max-w-md">
    <Card.Header>
      <Card.Title>Create New Playgroup</Card.Title>
      <Card.Description
        >Create a new playgroup to start tracking games with friends</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Playgroup Name</Label>
          <Input type="text" id="name" bind:value={name} required />
        </div>
        {#if error}
          <p class="text-sm text-red-500">{error}</p>
        {/if}
        <div class="flex justify-end space-x-2">
          <Button variant="outline" href="/groups">Cancel</Button>
          <Button type="submit">Create Playgroup</Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
