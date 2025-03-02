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
  import { X, User, Layers } from 'lucide-svelte';
  import IconComboBox from '$lib/components/IconComboBox.svelte';
  import { page } from '$app/state';

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

  let existingPilots: Array<{ id: string; name: string }> = $state([]);
  let existingDecks: Array<{ id: string; name: string }> = $state([]);

  async function fetchExistingData() {
    try {
      const pilots = await pb.collection('pilots').getFullList({
        filter: `playgroup = "${page.params.groupId}"`
      });

      existingPilots = [
        ...new Set(
          pilots.map((record) => ({
            id: record.pilot,
            name: record.name || ''
          }))
        )
      ]
        .filter((pilot) => pilot.name)
        .sort((a, b) => a.name.localeCompare(b.name));

      const decks = await pb.collection('decks').getFullList({
        filter: `playgroup = "${page.params.groupId}"`
      });

      existingDecks = [
        ...new Set(
          decks.map((record) => ({
            id: record.id,
            name: record.name
          }))
        )
      ]
        .filter((deck) => deck.name)
        .sort((a, b) => a.name.localeCompare(b.name));
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

      // Process each player's data
      for await (let player of players) {
        // Check if pilot exists by name, create if not
        let pilotRecord = await pb
          .collection('pilots')
          .getFirstListItem(`name = "${player.pilot}" && playgroup = "${page.params.groupId}"`)
          .catch(() => null);

        let pilotId;
        if (!pilotRecord) {
          pilotRecord = await pb.collection('pilots').create({
            name: player.pilot,
            pilot: generateId(), // Generate a new pilot ID
            playgroup: page.params.groupId
          });
        }
        pilotId = pilotRecord?.id;

        // Check if deck exists by name, create if not
        let deckRecord = await pb
          .collection('decks')
          .getFirstListItem(`name = "${player.deck}" && playgroup = "${page.params.groupId}"`)
          .catch(() => null);

        let deckId;
        if (!deckRecord) {
          deckRecord = await pb.collection('decks').create({
            name: player.deck,
            playgroup: page.params.groupId
          });
        }
        deckId = deckRecord?.id;

        // Create game record with relations
        let data = {
          date: formattedDate.split('T')[0],
          game_id: gameId,
          pilot: pilotId,
          deck: deckId,
          winner: winner !== 'draw' && winner === player.pilot,
          playgroup: page.params.groupId
        };
        await pb.collection('games').create(data);
      }

      // Reset form
      players = [
        { pilot: '', deck: '' },
        { pilot: '', deck: '' },
        { pilot: '', deck: '' },
        { pilot: '', deck: '' }
      ];
      winner = 'draw';
      toast.success('Game added!');

      // Refresh the existing data lists
      await fetchExistingData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  }

  const winnerSelectContent = $derived(
    players.find((f) => f.pilot === winner)?.pilot ?? 'Select a winner'
  );
</script>

<div class="mx-auto max-w-2xl">
  <form onsubmit={handleSubmit} class="space-y-6">
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
                        class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
                        onclick={() => removePlayer(i)}
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
