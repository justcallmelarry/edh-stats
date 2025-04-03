<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import { playerRankingColumns as pilotRankingColumns } from './pilot-columns';
  import { deckRankingColumns } from './deck-columns';
  import DataTable from '$lib/components/DataTable.svelte';
  import { page } from '$app/state';
  import type { DeckType, PilotType } from '$lib/types';

  interface GameRow {
    pilot: string; // This is just the ID
    deck: string;
    expand: {
      pilot: {
        id: string;
        name: string;
      };
      deck: {
        id: string;
        name: string;
        colors: string[];
      };
      game: {
        id: string;
        date: string;
        winner: string;
      };
    };
  }


  interface DeckStats {
    deck: DeckType;
    wins: number;
    totalGames: Set<string>;
  }


  interface PilotStats {
    pilot: PilotType;
    wins: number;
    totalGames: Set<string>;
  }

  interface PlayerRanking {
    pilot: PilotType;
    wins: number;
    games: number;
    winRatio: number;
    link: string;
  }

  interface DeckRanking {
    deck: DeckType;
    wins: number;
    games: number;
    winRatio: number;
    link: string;
  }

  let gameRows: GameRow[] = [];
  let isLoading = true;
  let playerRankings: PlayerRanking[] = [];
  let deckRankings: DeckRanking[] = [];

  onMount(async () => {
    try {
      gameRows = await pb.collection('game_rows').getFullList({
        filter: `playgroup = "${page.params.groupId}"`,
        expand: 'pilot,deck,game'
      });
      calculateStats();
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      isLoading = false;
    }
  });

  function calculateStats() {
    const playerStats = gameRows.reduce((acc: Record<string, PilotStats>, row: GameRow) => {
      const pilotName = row.expand.pilot.name;
      if (!acc[pilotName]) {
        acc[pilotName] = { pilot: row.expand.pilot, wins: 0, totalGames: new Set() };
      }
      acc[pilotName].totalGames.add(row.expand.game.id);
      if (row.expand.game.winner == row.pilot) {
        acc[pilotName].wins++;
      }
      return acc;
    }, {});

    const deckStats = gameRows.reduce((acc: Record<string, DeckStats>, row: GameRow) => {
      const deckName = row.expand.deck.name;
      if (!acc[deckName]) {
        acc[deckName] = { deck: row.expand.deck, wins: 0, totalGames: new Set() };
      }
      acc[deckName].totalGames.add(row.expand.game.id);
      if (row.expand.game.winner == row.pilot) {
        acc[deckName].wins++;
      }
      return acc;
    }, {});

    playerRankings = Object.entries(playerStats)
      .map(([pilot, stats]) => ({
        pilot: stats.pilot,
        wins: stats.wins,
        games: stats.totalGames.size,
        winRatio: stats.wins / stats.totalGames.size,
        link: `/groups/${page.params.groupId}/pilots/${stats.pilot.id}`
        // @ts-ignore
      }))
      .sort((a, b) => {
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        return b.games - a.games;
      });

    deckRankings = Object.entries(deckStats)
      .map(([deck, stats]) => ({
        deck: stats.deck,
        wins: stats.wins,
        games: stats.totalGames.size,
        winRatio: stats.wins / stats.totalGames.size,
        link: `/groups/${page.params.groupId}/decks/${stats.deck.id}/edit`
      }))
      .sort((a, b) => {
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        return b.games - a.games;
      });
  }
</script>

{#if isLoading}
  <Spinner />
{:else}
  <div class="grid w-full grid-cols-1 gap-2">
    <Card.Root class="mx-auto w-full">
      <Card.Header>
        <Card.Title>Player Rankings</Card.Title>
      </Card.Header>
      <Card.Content class="px-2 md:px-6">
        <DataTable data={playerRankings} columns={pilotRankingColumns} />
      </Card.Content>
    </Card.Root>
    <Card.Root class="mx-auto w-full">
      <Card.Header>
        <Card.Title>Deck Rankings</Card.Title>
      </Card.Header>
      <Card.Content class="px-2 md:px-6">
        <DataTable data={deckRankings} columns={deckRankingColumns} />
      </Card.Content>
    </Card.Root>
  </div>
{/if}
