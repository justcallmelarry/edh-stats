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
  import * as Select from '$lib/components/ui/select/index.js';
  import { toast } from 'svelte-sonner';
  import type { DeckType } from '$lib/types';

  let isLoading = $state(false);
  let deck: DeckType = $state({ id: '', name: '', colors: [] });

  async function fetchData() {
    isLoading = true;
    try {
      let result = await pb.collection('decks').getOne(page.params.deckId);
      deck = {
        id: result.id,
        name: result.name,
        colors: result.colors
      };
    } catch (err) {
      toast.error((err as Error).message);
      goto('/404');
    } finally {
      isLoading = false;
    }
  }

  async function updateDeck() {
    let error = '';
    try {
      await pb.collection('decks').update(deck.id, {
        name: deck.name,
        colors: deck.colors
      });
    } catch (err) {
      error = (err as Error).message;
    }
    if (error !== '') {
      toast.error(error);
    } else {
      toast.success('Deck updated!');
    }
  }

  onMount(() => {
    fetchData();
  });
</script>

<Card.Root class="mx-auto mb-4 w-full">
  <Card.Header>
    <Card.Title>Deck Info</Card.Title>
  </Card.Header>
  <Card.Content>
    <form onsubmit={() => updateDeck()}>
      <div class="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label for="deck-name">Name</Label>
        <Input
          id="deck-name"
          type="text"
          bind:value={deck.name}
          class="input input-bordered w-full rounded-r-lg"
          required
        />
      </div>
      <div class="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label for="colors">Colors</Label>
        <Select.Root type="multiple" name="colors" bind:value={deck.colors}>
          <Select.Trigger>
            {deck.colors}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Item value="W" label="White" />
              <Select.Item value="U" label="Blue" />
              <Select.Item value="B" label="Black" />
              <Select.Item value="R" label="Red" />
              <Select.Item value="G" label="Green" />
              <Select.Item value="C" label="Colorless" />
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      <Button type="submit">Save</Button>
    </form>
  </Card.Content>
</Card.Root>

{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
