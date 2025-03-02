<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import Spinner from '$lib/components/Spinner.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import { playerRankingColumns } from '../player-columns';
    import { deckRankingColumns } from '../deck-columns';
    import DataTable from '$lib/components/DataTable.svelte';
    import { page } from '$app/state';

    interface GameRow {
      game_id: string;
      pilot: string;  // This is just the ID
      deck: string;
      winner: boolean;
      expand: {
        pilot: {
          id: string;
          name: string;
        };
        deck: {
          id: string;
          name: string;
        };
      };
    }

    interface PlayerStats {
      wins: number;
      totalGames: Set<string>;
    }

    interface DeckStats {
      wins: number;
      totalGames: Set<string>;
    }

    interface PlayerRanking {
      pilot: string;
      wins: number;
      games: number;
      winRatio: number;
      score: number;
    }

    interface DeckRanking {
      deck: string;
      wins: number;
      games: number;
      winRatio: number;
      score: number;
    }

    let gameRows: GameRow[] = [];
    let isLoading = true;
    let playerRankings: PlayerRanking[] = [];
    let deckRankings: DeckRanking[] = [];

    onMount(async () => {
      try {
        gameRows = await pb.collection('games').getFullList(
            {
                filter: `playgroup = "${page.params.groupId}"`,
                expand: 'pilot,deck'
            }
        );
        calculateStats();
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        isLoading = false;
      }
    });

    function calculateStats() {
      const playerStats = gameRows.reduce((acc: Record<string, PlayerStats>, row: GameRow) => {
        const pilotName = row.expand.pilot.name;
        if (!acc[pilotName]) {
          acc[pilotName] = { wins: 0, totalGames: new Set() };
        }
        acc[pilotName].totalGames.add(row.game_id);
        if (row.winner) {
          acc[pilotName].wins++;
        }
        return acc;
      }, {});

      const deckStats = gameRows.reduce((acc: Record<string, DeckStats>, row: GameRow) => {
        const deckName = row.expand.deck.name;
        if (!acc[deckName]) {
          acc[deckName] = { wins: 0, totalGames: new Set() };
        }
        acc[deckName].totalGames.add(row.game_id);
        if (row.winner) {
          acc[deckName].wins++;
        }
        return acc;
      }, {});

      playerRankings = Object.entries(playerStats)
        .map(([pilot, stats]) => ({
          pilot,
          wins: stats.wins,
          games: stats.totalGames.size,
          winRatio: stats.wins / stats.totalGames.size,
          // @ts-ignore
          score: stats.totalGames.size * (stats.wins / stats.totalGames.size).toFixed(3)
        }))
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }

          return b.games - a.games;
        });

      deckRankings = Object.entries(deckStats)
        .map(([deck, stats]) => ({
          deck,
          wins: stats.wins,
          games: stats.totalGames.size,
          winRatio: stats.wins / stats.totalGames.size,
          // @ts-ignore
          score: stats.totalGames.size * (stats.wins / stats.totalGames.size).toFixed(3)
        }))
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }

          return b.games - a.games;
        });
    }
  </script>

  {#if isLoading}
    <Spinner />
  {:else}
    <div class="container mx-auto px-0 flex">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 w-full">
        <Card.Root class="mx-auto w-full max-w-2xl">
          <Card.Header>
            <Card.Title>Player Rankings</Card.Title>
          </Card.Header>
          <Card.Content class="px-2 md:px-6">
            <DataTable data={playerRankings} columns={playerRankingColumns} />
          </Card.Content>
        </Card.Root>
        <Card.Root class="mx-auto w-full max-w-2xl">
          <Card.Header>
            <Card.Title>Deck Rankings</Card.Title>
          </Card.Header>
          <Card.Content class="px-2 md:px-6">
            <DataTable data={deckRankings} columns={deckRankingColumns} />
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  {/if}
