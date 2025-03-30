<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { Layers } from 'lucide-svelte';
  import { PieChart } from 'layerchart';
  import { goto } from '$app/navigation';

  interface Deck {
    id: string;
    name: string;
    colors: Array<string>;
    games: number;
    wins: number;
  }

  interface GameRow {
    pilot: string; // This is just the ID
    deck: string;
    expand: {
      deck: {
        id: string;
        name: string;
        colors: Array<string>;
      };
      game: {
        id: string;
        date: string;
        winner: string;
      };
    };
  }

  let isLoading = $state(false);
  let decks: Deck[] = $state([]);
  let deckColors: Record<string, number> = $state({});
  let gameColors: Record<string, number> = $state({});
  let pilotName = $state('');

  async function fetchData() {
    isLoading = true;
    try {
      const pilot = await pb.collection('pilots').getOne(page.params.pilotId);
      pilotName = pilot.name;

      const result: Array<GameRow> = await pb.collection('game_rows').getFullList({
        filter: `playgroup = "${page.params.groupId}" && pilot = "${page.params.pilotId}"`,
        expand: 'deck,game'
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
        if (record.expand.game.winner == pilot.id) {
          uniqueDecks.get(deck.id).wins++;
        }

        deck.colors.forEach((color) => {
          if (!gameColors[color]) {
            gameColors[color] = 0;
          }
          gameColors[color]++;
        });
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
      goto('/404');
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

<Card.Root class="mx-auto mb-4 w-full">
  <Card.Header>
    <Card.Title>Pilot Info - {pilotName}</Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-row">
      <div class="w-[50%] overflow-auto">
        <h4 class="flex scroll-m-20 flex-row text-sm font-semibold tracking-tight">
          Color Popularity (Unique)
        </h4>
        <div class="h-[160px] rounded border bg-secondary p-4">
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
      </div>
      <div class="w-[50%] overflow-auto">
        <h4 class="flex scroll-m-20 flex-row text-sm font-semibold tracking-tight">
          Color Popularity (Cumulative)
        </h4>
        <div class="h-[160px] rounded border bg-secondary p-4">
          <PieChart
            data={Object.entries(gameColors).map(([name, value]) => ({
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
      </div>
    </div>
  </Card.Content>
</Card.Root>
<Card.Root class="mx-auto mb-4 w-full">
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
                  <div><Layers size={16} /></div>
                  {deck.name}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              {deck.games}
            </Table.Cell>
            <Table.Cell>
              {deck.wins}&nbsp;({((deck.wins / deck.games) * 100).toFixed(1)}%)
            </Table.Cell>
            <Table.Cell>
              <div class="flex justify-center">
                {#each deck.colors as color}
                  <div
                    class="h-4 w-4 rounded-full bg-gradient-to-tl from-secondary dark:from-slate-400 {colorInfo[
                      color
                    ].bg}"
                  ></div>
                {/each}
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

<style>
  .mtg-color {
    background: linear-gradient(-45deg, #eee 40%, #fafafa 50%, #eee 60%);
  }
</style>
