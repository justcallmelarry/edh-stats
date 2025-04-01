<script lang="ts">
  import DatePicker from '$lib/components/DatePicker.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { type DateValue } from '@internationalized/date';
  import Input from '$lib/components/ui/input/input.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { X, User, Layers } from 'lucide-svelte';
  import IconComboBox from '$lib/components/IconComboBox.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

  export let isEdit: boolean = false;
  export let players: Array<{ pilot: string; deck: string }> = [];
  export let gameDate: DateValue | undefined;
  export let winner: string = 'draw';
  export let existingPilots: Array<{ id: string; name: string }> = [];
  export let existingDecks: Array<{ id: string; name: string }> = [];
  export let onSubmit: (data: {
    players: typeof players;
    gameDate: DateValue | undefined;
    winner: string;
  }) => Promise<void>;

  export let onDelete: (() => void) | undefined = undefined;

  export let isLoading: boolean = false;

  function addPlayer(): void {
    players = [...players, { pilot: '', deck: '' }];
  }

  function removePlayer(index: number): void {
    if (players.length > 3) {
      players = players.filter((_, i) => i !== index);
    }
  }

  $: winnerSelectContent = players.find((f) => f.pilot === winner)?.pilot ?? 'Select a winner';
</script>

<div class="mx-auto max-w-2xl">
  <form on:submit|preventDefault={() => onSubmit({ players, gameDate, winner })} class="space-y-6">
    <Card.Root class="mx-auto w-full max-w-2xl">
      <Card.Header>
        <Card.Title>Players</Card.Title>
      </Card.Header>
      <Card.Content class="px-2 md:px-6">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Pilot Name</Table.Head>
              <Table.Head>Deck Name</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each players as player, i}
              <Table.Row>
                <Table.Cell>
                  <div class="flex gap-1">
                    <IconComboBox icon={User} list={existingPilots} bind:value={player.pilot} />
                    <Input
                      id="pilot-{i}"
                      type="text"
                      placeholder={`Player ${i + 1}`}
                      bind:value={player.pilot}
                      class="input input-bordered w-full rounded-r-lg"
                      required
                    />
                  </div>
                </Table.Cell>
                <Table.Cell class="relative">
                  <div class="flex gap-1">
                    <IconComboBox icon={Layers} list={existingDecks} bind:value={player.deck} />
                    <Input
                      id="deck-{i}"
                      type="text"
                      bind:value={player.deck}
                      class="input input-bordered rounded-r-lg"
                      required
                    />
                    {#if players.length > 3}
                      <button
                        type="button"
                        class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                        on:click={() => removePlayer(i)}
                        disabled={isLoading}
                      >
                        <X size={12} />
                      </button>
                    {/if}
                  </div>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>

    <Card.Root class="mx-auto w-full max-w-2xl">
      <Card.Header>
        <Card.Title>Session Info</Card.Title>
      </Card.Header>
      <Card.Content class="px-2 md:px-6">
        <div class="flex flex-wrap justify-between gap-2">
          <DatePicker bind:value={gameDate} />
          <Select.Root type="single" name="winner-select" bind:value={winner}>
            <Select.Trigger class="w-[280px]">
              {winnerSelectContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each players as player}
                  {#if player.pilot}
                    <Select.Item value={player.pilot} label={player.pilot} />
                  {/if}
                {/each}
                <Select.Item value="draw" label="Draw" />
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </Card.Content>
    </Card.Root>

    <div class="flex gap-4">
      <Button variant="outline" onclick={addPlayer} disabled={isLoading}>Add Player</Button>
      {#if isEdit === false}
        <Button type="submit" disabled={isLoading}>Submit Game</Button>
      {:else}
        <Button type="submit" disabled={isLoading}>Edit Game</Button>
        {#if onDelete}
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button
                variant="destructive"
                onclick={(e) => e.preventDefault()}
                disabled={isLoading}
              >
                Delete Game
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Are you sure you wish to delete this game?</AlertDialog.Title>
                <AlertDialog.Description>
                  This will permanently delete this game and remove the data from our servers. This
                  action cannot be undone.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action onclick={() => onDelete?.()}>Confirm</AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        {/if}
      {/if}
    </div>
  </form>
</div>
