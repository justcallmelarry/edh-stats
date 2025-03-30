<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import Button from '$lib/components/ui/button/button.svelte';

  let isLoading = $state(false);
  let groupId = $state('');
  let groupName = $state('');
  let inviteResult = $state('');

  async function doInvite() {
    isLoading = true;
    try {
      let result = await pb.send(`/api/invite/${page.params.inviteCode}`, {
        method: 'POST'
      });
      groupName = result.playgroup_name;
      groupId = result.playgroup_id;
      inviteResult = result.message;
    } catch (err) {
      toast.error((err as Error).message);
      goto('/404');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    doInvite();
  });
</script>

<div class="flex min-h-screen justify-center bg-background p-4">
  <Card.Root class="h-[280px] max-w-md">
    <Card.Header>
      <Card.Title>{groupName}</Card.Title>
    </Card.Header>
    <Card.Content class="h-full w-full">
      <div class="flex flex-col content-between">
        <div class="pb-32">{inviteResult}</div>
        <Button href="/groups/{groupId}">Go to group</Button>
      </div>
    </Card.Content>
  </Card.Root>
</div>

{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
