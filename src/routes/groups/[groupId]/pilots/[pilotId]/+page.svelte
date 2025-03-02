<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { Layers } from 'lucide-svelte';
  import { PieChart } from 'layerchart';

  interface Deck {
    id: string;
    name: string;
    colors: Array<string>;
    games: number;
    wins: number;
  }

  interface GameRow {
    game_id: string;
    pilot: string; // This is just the ID
    deck: string;
    winner: boolean;
    expand: {
      deck: {
        id: string;
        name: string;
        colors: Array<string>;
      };
    };
  }

  let isLoading = $state(false);
  let decks: Deck[] = $state([]);
  let deckColors: Record<string, number> = $state({});

  async function fetchData() {
    isLoading = true;
    try {
      const result: Array<GameRow> = await pb.collection('games').getFullList({
        filter: `playgroup = "${page.params.groupId}" && pilot = "${page.params.pilotId}"`,
        expand: 'deck'
      });
      const uniqueDecks = new Map();
      result.forEach((record) => {
        const deck = record.expand?.deck;
        if (deck && !uniqueDecks.has(deck.id)) {
          uniqueDecks.set(deck.id, {
            id: deck.id,
            name: deck.name,
            colors: deck.colors,
            games: 0,
            wins: 0
          });
        }
        uniqueDecks.get(deck.id).games++;
        if (record.winner) {
          uniqueDecks.get(deck.id).wins++;
        }
      });

      decks = Array.from(uniqueDecks.values()).sort((a, b) => a.name.localeCompare(b.name));
      decks.forEach((deck) => {
        deck.colors.forEach((color) => {
          if (!deckColors[color]) {
            deckColors[color] = 0;
          }
          deckColors[color]++;
        });
      });
    } catch (err) {
      console.error('Error fetching pilots:', err);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchData();
  });

  const colorInfo: Record<string, Record<string, string>> = {
    W: {
      bg: 'bg-amber-300',
      hex: '#fcd34d',
      name: 'White'
    },
    U: {
      bg: 'bg-blue-500',
      hex: '#3b82f6',
      name: 'Blue'
    },
    B: {
      bg: 'bg-neutral-950',
      hex: '#0a0a0a',
      name: 'Black'
    },
    R: {
      bg: 'bg-red-600',
      hex: '#dc2626',
      name: 'Red'
    },
    G: {
      bg: 'bg-green-600',
      hex: '#16a34a',
      name: 'Green'
    },
    C: {
      bg: 'bg-slate-400',
      hex: '#94a3b8',
      name: 'Colorless'
    }
  };
</script>

<Card.Root class="mx-auto w-full mb-4">
  <Card.Header>
    <Card.Title>Pilot Info</Card.Title>
  </Card.Header>
  <Card.Content>
    <h4 class="scroll-m-20 text-sm font-semibold tracking-tight">Color Popularity</h4>
    <div class="h-[160px] w-[50%] p-4 border rounded overflow-auto bg-secondary">
      <PieChart
        data={Object.entries(deckColors).map(([name, value]) => ({
          key: name,
          name: colorInfo[name].name,
          value: value,
          color: colorInfo[name].hex
        }))}
        label="name"
        innerRadius={-20}
        cornerRadius={5}
        padAngle={0.02}
        renderContext="svg"
        c="color"
      />
    </div>
  </Card.Content>
</Card.Root>
<Card.Root class="mx-auto w-full mb-4">
  <Card.Header>
    <Card.Title>Pilot Decks</Card.Title>
  </Card.Header>
  <Card.Content>
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Cell>Deck</Table.Cell>
          <Table.Cell>Games</Table.Cell>
          <Table.Cell>Wins</Table.Cell>
          <Table.Cell class="flex justify-center">Colors</Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each decks as deck}
          <Table.Row>
            <Table.Cell>
              <div class="flex justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Layers class="h-4 w-4" />
                  {deck.name}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              {deck.games}
            </Table.Cell>
            <Table.Cell>
              {deck.wins} ({((deck.wins / deck.games) * 100).toFixed(1)}%)
            </Table.Cell>
            <Table.Cell>
              <div class="flex justify-center">
                <div class="flex rounded border bg-secondary p-1">
                  {#each deck.colors as color}
                    <div class="w-4 h-4 rounded-full drop-shadow-sm {colorInfo[color].bg}"></div>
                  {/each}
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
