<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import { playerRankingColumns } from './player-columns';
  import { deckRankingColumns } from './deck-columns';
  import DataTable from '$lib/components/DataTable.svelte';

  interface GameRow {
    game_id: string;
    pilot: string;
    deck: string;
    winner: boolean;
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
  }

  interface DeckRanking {
    deck: string;
    wins: number;
    games: number;
    winRatio: number;
  }

  let gameRows: GameRow[] = [];
  let isLoading = true;
  let playerRankings: PlayerRanking[] = [];
  let deckRankings: DeckRanking[] = [];

  onMount(async () => {
    try {
      gameRows = await pb.collection('games').getFullList();
      calculateStats();
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      isLoading = false;
    }
  });

  function calculateStats() {
    const playerStats = gameRows.reduce((acc: Record<string, PlayerStats>, row: GameRow) => {
      if (!acc[row.pilot]) {
        acc[row.pilot] = { wins: 0, totalGames: new Set() };
      }
      acc[row.pilot].totalGames.add(row.game_id);
      if (row.winner) {
        acc[row.pilot].wins++;
      }
      return acc;
    }, {});

    const deckStats = gameRows.reduce((acc: Record<string, DeckStats>, row: GameRow) => {
      if (!acc[row.deck]) {
        acc[row.deck] = { wins: 0, totalGames: new Set() };
      }
      acc[row.deck].totalGames.add(row.game_id);
      if (row.winner) {
        acc[row.deck].wins++;
      }
      return acc;
    }, {});

    playerRankings = Object.entries(playerStats)
      .map(([pilot, stats]) => ({
        pilot,
        wins: stats.wins,
        games: stats.totalGames.size,
        winRatio: stats.wins / stats.totalGames.size
      }))
      .sort((a, b) => {
        // First compare by winRatio
        if (b.winRatio !== a.winRatio) {
          return b.winRatio - a.winRatio;
        }
        // If winRatio is equal, compare by number of games
        return b.games - a.games;
      });

    deckRankings = Object.entries(deckStats)
      .map(([deck, stats]) => ({
        deck,
        wins: stats.wins,
        games: stats.totalGames.size,
        winRatio: stats.wins / stats.totalGames.size
      }))
      .sort((a, b) => {
        // First compare by winRatio
        if (b.winRatio !== a.winRatio) {
          return b.winRatio - a.winRatio;
        }
        // If winRatio is equal, compare by number of games
        return b.games - a.games;
      });
  }
</script>

{#if isLoading}
  <Spinner />
{:else}
  <div class="container mx-auto p-4 flex">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-2 w-full">
      <Card.Root class="mx-auto w-full max-w-2xl">
        <Card.Header>
          <Card.Title>Player Rankings</Card.Title>
        </Card.Header>
        <Card.Content>
          <DataTable data={playerRankings} columns={playerRankingColumns} />
        </Card.Content>
      </Card.Root>
      <Card.Root class="mx-auto w-full max-w-2xl">
        <Card.Header>
          <Card.Title>Deck Rankings</Card.Title>
        </Card.Header>
        <Card.Content>
          <DataTable data={deckRankings} columns={deckRankingColumns} />
        </Card.Content>
      </Card.Root>
    </div>
  </div>
{/if}
