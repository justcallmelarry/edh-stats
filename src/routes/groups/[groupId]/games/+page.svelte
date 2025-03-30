<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { Pen, Trophy } from 'lucide-svelte';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import Pilot from '$lib/components/Pilot.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import TextSeparator from '$lib/components/TextSeparator.svelte';

  interface Game {
    id: string;
    date: string;
    winner: string;
  }

  interface DBRecord {
    id: string;
    name: string;
  }

  interface GamePlayer {
    pilot: DBRecord;
    deck: DBRecord;
    isWinner: boolean;
  }

  interface GroupedGame {
    id: string;
    date: string;
    players: Array<GamePlayer>;
  }

  let games: Record<string, GroupedGame[]> = $state({});
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
            id: gameRecord.id,
            date: gameRecord.date,
            players: []
          };
        }

        for (const row of gameRows) {
          gameGroups[gameRecord.id].players.push({
            pilot: {
              id: row.expand?.pilot.id,
              name: row.expand?.pilot.name
            },
            deck: {
              id: row.expand?.deck.id,
              name: row.expand?.deck.name
            },
            isWinner: row.pilot == record.winner
          });
        }

        gameGroups[gameRecord.id].players.sort((a, b) => {
          if (a.isWinner && !b.isWinner) return -1;
          if (!a.isWinner && b.isWinner) return 1;
          if (a.pilot.name.toLowerCase() < b.pilot.name.toLowerCase()) return -1;
          if (a.pilot.name.toLowerCase() > b.pilot.name.toLowerCase()) return 1;
          if (a.deck.name.toLowerCase() < b.deck.name.toLowerCase()) return -1;
          if (a.deck.name.toLowerCase() > b.deck.name.toLowerCase()) return 1;
          return 0;
        });
      }

      for (const game of Object.values(gameGroups)) {
        if (!games[game.date]) {
          games[game.date] = [];
        }
        games[game.date].push(game);
      }
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
      <Pilot
        link={`/groups/${page.params.groupId}/pilots/${player.pilot.id}`}
        text={player.pilot.name}
        winner={player.isWinner}
      />
    </div>
  </Table.Cell>
  <Table.Cell>
    <div class="flex items-center justify-between gap-2">
      <Deck text={player.deck.name} winner={player.isWinner} />
      {#if player.isWinner}
        <div><Trophy size={16} class="text-yellow-500" /></div>
      {/if}
    </div>
  </Table.Cell>
{/snippet}

<div class="container mx-auto w-full px-0">
  {#each Object.entries(games) as [date, gameList]}
    <TextSeparator>{date}</TextSeparator>
    <div class="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
      {#each gameList as game}
        <Card.Root class="mx-auto mb-4 w-full max-w-2xl">
          <Card.Header class="mb-2 flex flex-row items-center justify-between">
            <Card.Title>Game #{games[date].length - gameList.indexOf(game)}</Card.Title>
            <Button
              aria-label="Edit Game"
              size={'icon'}
              variant="ghost"
              href={`/groups/${page.params.groupId}/games/${game.id}/edit`}
            >
              <Pen class="text-neutral-500" />
            </Button>
          </Card.Header>
          <Card.Content class="pt-0">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Pilot</Table.Head>
                  <Table.Head>Deck</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each game.players as player}
                  <Table.Row>
                    {@render gameRow(player)}
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {/each}
</div>
{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
