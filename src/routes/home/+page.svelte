<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';

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

  // Pagination variables
  const itemsPerPage = 10;
  let currentPlayerPage = 1;
  let currentDeckPage = 1;

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

    playerRankings = Object.entries(playerStats).map(([pilot, stats]) => ({
      pilot,
      wins: stats.wins,
      games: stats.totalGames.size,
      winRatio: stats.wins / stats.totalGames.size
    })).sort((a, b) => {
      // First compare by winRatio
      if (b.winRatio !== a.winRatio) {
        return b.winRatio - a.winRatio;
      }
      // If winRatio is equal, compare by number of games
      return b.games - a.games;
    });

    deckRankings = Object.entries(deckStats).map(([deck, stats]) => ({
      deck,
      wins: stats.wins,
      games: stats.totalGames.size,
      winRatio: stats.wins / stats.totalGames.size
    })).sort((a, b) => {
      // First compare by winRatio
      if (b.winRatio !== a.winRatio) {
        return b.winRatio - a.winRatio;
      }
      // If winRatio is equal, compare by number of games
      return b.games - a.games;
    });
  }

  // Pagination helper functions
  function getPageItems<T>(items: T[], currentPage: number): T[] {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }

  $: totalPlayerPages = Math.ceil(playerRankings.length / itemsPerPage);
  $: totalDeckPages = Math.ceil(deckRankings.length / itemsPerPage);

  $: paginatedPlayerRankings = getPageItems(playerRankings, currentPlayerPage);
  $: paginatedDeckRankings = getPageItems(deckRankings, currentDeckPage);
</script>

{#if isLoading}
  <p>Loading...</p>
{:else}
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="rounded-lg shadow p-4">
        <h2 class="text-xl font-bold mb-4">Player Rankings</h2>
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left">Pilot</th>
              <th class="text-right">Games</th>
              <th class="text-right">Wins</th>
              <th class="text-right">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {#each paginatedPlayerRankings as { pilot, games, wins, winRatio }}
              <tr>
                <td>{pilot}</td>
                <td class="text-right">{games}</td>
                <td class="text-right">{wins}</td>
                <td class="text-right">{(winRatio * 100).toFixed(1)}%</td>
              </tr>
            {/each}
            {#if paginatedPlayerRankings.length < itemsPerPage}
              {#each Array(itemsPerPage - paginatedPlayerRankings.length) as _}
                <tr>
                  <td colspan="4">&nbsp;</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
        <div class="mt-4 flex justify-between items-center">
          <button
            class="btn btn-primary"
            disabled={currentPlayerPage === 1}
            on:click={() => currentPlayerPage--}
          >
            Prev
          </button>
          <span class="text-xs">Page {currentPlayerPage} of {Math.max(1, totalPlayerPages)}</span>
          <button
            class="btn btn-primary"
            disabled={currentPlayerPage === Math.max(1, totalPlayerPages)}
            on:click={() => currentPlayerPage++}
          >
            Next
          </button>
        </div>
      </div>

      <div class="rounded-lg shadow p-4">
        <h2 class="text-xl font-bold mb-4">Deck Rankings</h2>
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left">Deck</th>
              <th class="text-right">Games</th>
              <th class="text-right">Wins</th>
              <th class="text-right">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {#each paginatedDeckRankings as { deck, games, wins, winRatio }}
              <tr>
                <td>{deck}</td>
                <td class="text-right">{games}</td>
                <td class="text-right">{wins}</td>
                <td class="text-right">{(winRatio * 100).toFixed(1)}%</td>
              </tr>
            {/each}
            {#if paginatedDeckRankings.length < itemsPerPage}
              {#each Array(itemsPerPage - paginatedDeckRankings.length) as _}
                <tr>
                  <td colspan="4">&nbsp;</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
        <div class="mt-4 flex justify-between items-center">
          <button
            class="btn btn-primary"
            disabled={currentDeckPage === 1}
            on:click={() => currentDeckPage--}
          >
            Prev
          </button>
          <span class="text-xs">Page {currentDeckPage} of {Math.max(1, totalDeckPages)}</span>
          <button
            class="btn btn-primary"
            disabled={currentDeckPage === Math.max(1, totalDeckPages)}
            on:click={() => currentDeckPage++}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}