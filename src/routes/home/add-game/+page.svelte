<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import DatePicker from '$lib/components/DatePicker.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { type DateValue, getLocalTimeZone } from '@internationalized/date';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import Input from '$lib/components/ui/input/input.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { X } from 'lucide-svelte';

  interface Player {
    pilot: string;
    deck: string;
  }

  let players: Player[] = $state([
    { pilot: '', deck: '' },
    { pilot: '', deck: '' },
    { pilot: '', deck: '' },
    { pilot: '', deck: '' }
  ]);
  let gameDate: DateValue | undefined = $state(undefined);
  let winner: string = $state('draw');

  let existingPilots: string[] = $state([]);
  let existingDecks: string[] = $state([]);

  async function fetchExistingData() {
    try {
      const records = await pb.collection('games').getFullList();
      existingPilots = [...new Set(records.map((record) => record.pilot))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
      existingDecks = [...new Set(records.map((record) => record.deck))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    } catch (err) {
      console.error('Error fetching existing data:', err);
    }
  }

  onMount(() => {
    fetchExistingData();
  });

  function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  function addPlayer(): void {
    players = [...players, { pilot: '', deck: '' }];
  }

  function removePlayer(index: number): void {
    if (players.length > 3) {
      players = players.filter((_, i) => i !== index);
    }
  }

  async function handleSubmit(): Promise<void> {
    try {
      const gameId = generateId();

      if (!gameDate) {
        toast.error('Please select a date');
        return;
      }
      let localDate = gameDate.toDate(getLocalTimeZone());
      localDate.setHours(12);
      const formattedDate = gameDate ? localDate.toISOString() : new Date().toISOString();

      for await (let player of players) {
        let data = {
          date: formattedDate.split('T')[0],
          game_id: gameId,
          pilot: player.pilot,
          deck: player.deck,
          winner: winner !== 'draw' && winner === player.pilot
        };
        await pb.collection('games').create(data);
      }

      players = [
        { pilot: '', deck: '' },
        { pilot: '', deck: '' },
        { pilot: '', deck: '' },
        { pilot: '', deck: '' }
      ];
      winner = 'draw';
      toast.success('Game added!');
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  }

  const winnerSelectContent = $derived(
    players.find((f) => f.pilot === winner)?.pilot ?? 'Select a winner'
  );
</script>

<div class="container mx-auto p-4">
  <div class="mx-auto max-w-2xl p-4">
    <form onsubmit={handleSubmit} class="space-y-6">
      <Card.Root class="mx-auto w-full max-w-2xl">
        <Card.Header>
          <Card.Title>Players</Card.Title>
        </Card.Header>
        <Card.Content>
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
                    <Input
                      id="pilot-{i}"
                      type="text"
                      placeholder={`Player ${i + 1}`}
                      bind:value={player.pilot}
                      class="input input-bordered w-full"
                      list="pilot-options"
                      required
                    />
                  </Table.Cell>
                  <Table.Cell class="relative">
                    <Input
                      id="deck-{i}"
                      type="text"
                      bind:value={player.deck}
                      class="input input-bordered w-[98%]"
                      list="deck-options"
                      required
                    />
                    {#if players.length > 3}
                      <button
                        type="button"
                        class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-200 hover:bg-red-300"
                        onclick={() => removePlayer(i)}
                      >
                        <X size={12} />
                      </button>
                    {/if}
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
        <Card.Content>
          <div class="flex justify-between flex-wrap gap-2">
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
        <Button variant="outline" onclick={addPlayer}>Add Player</Button>
        <Button type="submit">Submit Game</Button>
      </div>
    </form>
  </div>
</div>

<datalist id="pilot-options">
  {#each existingPilots as pilot}
    <option value={pilot}>{pilot}</option>
  {/each}
</datalist>
<datalist id="deck-options">
  {#each existingDecks as deck}
    <option value={deck}>{deck}</option>
  {/each}
</datalist>
