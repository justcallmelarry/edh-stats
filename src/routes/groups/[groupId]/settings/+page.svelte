<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { goto } from '$app/navigation';
  import Input from '$lib/components/ui/input/input.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { toast } from 'svelte-sonner';
  import { Check, Copy, Save } from 'lucide-svelte';

  let isLoading = $state(false);
  let playgroupName = $state('');
  let inviteUrl = $state('');
  let copied = $state(false);

  function copyToClipboard() {
    let el = document.getElementById('inviteLink');
    //@ts-ignore
    el.select();
    document.execCommand('copy');
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 3000);
    toast.success('Link copied!');
  }

  async function fetchData() {
    isLoading = true;
    try {
      let result = await pb.collection('playgroups').getOne(page.params.groupId);
      playgroupName = result.name;
      let baseUrl = page.url.origin;
      inviteUrl = `${baseUrl}/invite/${result.invite_key}`;
    } catch (err) {
      toast.error((err as Error).message);
      goto('/404');
    } finally {
      isLoading = false;
    }
  }

  async function updateName() {
    let error = '';
    try {
      await pb.collection('playgroups').update(page.params.groupId, {
        name: playgroupName
      });
    } catch (err) {
      error = (err as Error).message;
    }
    if (error !== '') {
      toast.error(error);
    } else {
      toast.success('Name updated!');
    }
  }

  onMount(() => {
    fetchData();
  });
</script>

<Card.Root class="mx-auto mb-4 w-full">
  <Card.Header>
    <Card.Title>Group Info</Card.Title>
  </Card.Header>
  <Card.Content class="flex flex-col flex-wrap gap-4">
    <form onsubmit={() => updateName()}>
      <div class="mb-4 flex max-w-md flex-row items-end">
        <div>
          <Label for="playgroup-name">Name</Label>
          <Input
            id="playgroup-name"
            type="text"
            bind:value={playgroupName}
            class="input input-bordered w-full rounded-r-lg"
            required
          />
        </div>
        <Button type="submit" size="icon">
          <Save size={16} />
        </Button>
      </div>
    </form>
    <div class="mb-4 flex max-w-md flex-row items-end">
      <div>
        <Label for="invite-url">Invite URL:</Label>
        <Input id="inviteLink" value={inviteUrl} readonly />
      </div>
      <Button size="icon" onclick={() => copyToClipboard()}>
        {#if copied}
          <Check size={16} />
        {:else}
          <Copy size={16} />
        {/if}
      </Button>
    </div>
  </Card.Content>
</Card.Root>

{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
