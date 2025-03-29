<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { User, Layers, Trophy } from 'lucide-svelte';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import Pilot from '$lib/components/Pilot.svelte';
  import Deck from '$lib/components/Deck.svelte';

  interface Game {
    id: string;
    date: string;
    winner: string;
  }
  interface GameRow {
    id: string;
    pilot: string;
    deck: string;
    expand: {
      pilot: { name: string };
      deck: { name: string };
      game: { id: string; date: string; winner: string };
    };
  }

  interface GamePlayer {
    pilot: string;
    deck: string;
    isWinner: boolean;
  }

  interface GroupedGame {
    date: string;
    players: Array<GamePlayer>;
  }

  let games: GroupedGame[] = $state([]);
  let isLoading = $state(false);
  const GAMES_PER_PAGE = 300;

  async function fetchGames() {
    isLoading = true;
    try {
      const resultList = await pb.collection('games').getList(1, GAMES_PER_PAGE, {
        filter: `playgroup = "${page.params.groupId}"`,
        sort: '-date,-created'
      });

      // Group records by game_id
      const gameGroups: Record<string, GroupedGame> = {};

      for (const record of resultList.items) {
        const gameRows = await pb.collection('game_rows').getFullList({
          filter: `game = "${record.id}"`,
          expand: 'pilot,deck'
        });
        const gameRecord = record as unknown as Game;

        if (!gameGroups[gameRecord.id]) {
          gameGroups[gameRecord.id] = {
            date: gameRecord.date,
            players: []
          };
        }

        for (const row of gameRows) {
          gameGroups[gameRecord.id].players.push({
            pilot: row.expand?.pilot.name,
            deck: row.expand?.deck.name,
            isWinner: row.pilot == record.winner
          });
        }

        gameGroups[gameRecord.id].players.sort((a, b) => {
          if (a.isWinner && !b.isWinner) return -1;
          if (!a.isWinner && b.isWinner) return 1;
          if (a.pilot.toLowerCase() < b.pilot.toLowerCase()) return -1;
          if (a.pilot.toLowerCase() > b.pilot.toLowerCase()) return 1;
          if (a.deck.toLowerCase() < b.deck.toLowerCase()) return -1;
          if (a.deck.toLowerCase() > b.deck.toLowerCase()) return 1;
          return 0;
        });
      }

      games = Object.values(gameGroups);
    } catch (err) {
      console.error('Error fetching games:', err);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchGames();
  });
</script>

{#snippet gameRow(player: GamePlayer)}
  <Table.Cell>
    <div class="flex items-center">
      <Pilot text={player.pilot} />
    </div>
  </Table.Cell>
  <Table.Cell>
    <div class="flex items-center justify-between gap-2">
      <Deck text={player.deck} />
      {#if player.isWinner}
        <div><Trophy size={16} class="text-yellow-500" /></div>
      {/if}
    </div>
  </Table.Cell>
{/snippet}

<div class="container mx-auto grid w-full grid-cols-1 lg:grid-cols-2 gap-2 px-0">
  {#each games as game}
    <Card.Root class="mx-auto w-full max-w-2xl mb-4">
      <Card.Header>
        <Card.Title>Game from {game.date}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Pilot</Table.Head>
              <Table.Head>Deck</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each game.players as player}
              {#if player.isWinner}
                <Table.Row class="font-semibold">
                  {@render gameRow(player)}
                </Table.Row>
              {:else}
                <Table.Row>
                  {@render gameRow(player)}
                </Table.Row>
              {/if}
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
