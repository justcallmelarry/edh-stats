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

  interface GameRow {
    id: string;
    game_id: string;
    date: string;
    pilot: string;
    deck: string;
    winner: boolean;
    expand: {
      pilot: { name: string };
      deck: { name: string };
    };
  }

  interface GroupedGame {
    date: string;
    players: Array<{
      pilot: string;
      deck: string;
      isWinner: boolean;
    }>;
  }

  let games: GroupedGame[] = $state([]);
  let isLoading = $state(false);
  const GAMES_PER_PAGE = 300;

  async function fetchGames() {
    isLoading = true;
    try {
      const resultList = await pb.collection('games').getList(1, GAMES_PER_PAGE, {
        filter: `playgroup = "${page.params.groupId}"`,
        expand: 'pilot,deck',
        sort: '-date,-created'
      });

      // Group records by game_id
      const gameGroups = resultList.items.reduce<Record<string, GroupedGame>>((acc, record) => {
        const gameRecord = record as unknown as GameRow;
        if (!acc[gameRecord.game_id]) {
          acc[gameRecord.game_id] = {
            date: gameRecord.date,
            players: []
          };
        }

        acc[gameRecord.game_id].players.push({
          pilot: gameRecord.expand.pilot.name,
          deck: gameRecord.expand.deck.name,
          isWinner: gameRecord.winner
        });

        return acc;
      }, {});

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

{#snippet gameRow(player: any)}
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
