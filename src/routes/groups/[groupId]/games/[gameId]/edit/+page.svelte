<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { type DateValue, parseDate, getLocalTimeZone } from '@internationalized/date';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';
  import GameForm from '$lib/components/GameForm.svelte';
  import { goto } from '$app/navigation';

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
  let isLoading = $state(false);

  async function fetchExistingData() {
    try {
      isLoading = true;
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
    } finally {
      isLoading = false;
    }
  }

  async function fetchGameData() {
    try {
      isLoading = true;
      const game = await pb.collection('games').getOne(page.params.gameId, { expand: 'winner' });
      const gameRows = await pb.collection('game_rows').getFullList({
        filter: `game = "${page.params.gameId}"`,
        expand: 'pilot,deck'
      });

      // Populate game data
      gameDate = parseDate(game.date);
      winner = game.expand?.winner?.name || 'draw';

      // Populate players
      players = gameRows.map((row) => ({
        pilot: row.expand?.pilot.name || '',
        deck: row.expand?.deck.name || ''
      }));
      // Ensure at least 3 players
      while (players.length < 3) {
        players.push({ pilot: '', deck: '' });
      }
    } catch (err) {
      console.error('Error fetching game data:', err);
      toast.error('Failed to load game data');
    } finally {
      isLoading = false;
    }
  }

  async function deleteGame() {
    try {
      isLoading = true;
      // Delete all game rows associated with the game
      const gameRows = await pb.collection('game_rows').getFullList({
        filter: `game = "${page.params.gameId}"`
      });
      for (const row of gameRows) {
        await pb.collection('game_rows').delete(row.id);
      }

      // Delete the game itself
      await pb.collection('games').delete(page.params.gameId);

      toast.success('Game deleted successfully');
      goto(`/groups/${page.params.groupId}/games`);
    } catch (err) {
      console.error('Error deleting game:', err);
      toast.error('Failed to delete game');
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchExistingData();
    fetchGameData();
  });

  async function handleSubmit(): Promise<void> {
    try {
      if (!gameDate) {
        toast.error('Please select a date');
        return;
      }
      let localDate = gameDate.toDate(getLocalTimeZone());
      localDate.setHours(12);
      const formattedDate = gameDate ? localDate.toISOString() : new Date().toISOString();

      let winnerID = '';

      // Delete existing game rows
      const existingRows = await pb.collection('game_rows').getFullList({
        filter: `game = "${page.params.gameId}"`
      });
      for (const row of existingRows) {
        await pb.collection('game_rows').delete(row.id);
      }

      // Process each player's data
      for await (let player of players) {
        // Check if pilot exists by name, create if not
        let pilotRecord = await pb
          .collection('pilots')
          .getFirstListItem(`name = "${player.pilot}" && playgroup = "${page.params.groupId}"`)
          .catch(() => null);

        if (!pilotRecord) {
          pilotRecord = await pb.collection('pilots').create({
            name: player.pilot,
            playgroup: page.params.groupId
          });
        }

        // Check if deck exists by name, create if not
        let deckRecord = await pb
          .collection('decks')
          .getFirstListItem(`name = "${player.deck}" && playgroup = "${page.params.groupId}"`)
          .catch(() => null);

        if (!deckRecord) {
          deckRecord = await pb.collection('decks').create({
            name: player.deck,
            playgroup: page.params.groupId
          });
        }

        let gameRowData = {
          playgroup: page.params.groupId,
          game: page.params.gameId,
          pilot: pilotRecord?.id,
          deck: deckRecord?.id
        };
        await pb.collection('game_rows').create(gameRowData);

        if (winner === player.pilot) {
          winnerID = pilotRecord?.id || '';
        }
      }

      // Update game record
      let data = {
        date: formattedDate.split('T')[0],
        winner: winnerID
      };
      await pb.collection('games').update(page.params.gameId, data);
      toast.success('Game updated!');
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  }
</script>

<GameForm
  bind:players
  bind:gameDate
  bind:winner
  {existingPilots}
  {existingDecks}
  onSubmit={handleSubmit}
  isEdit={true}
  onDelete={deleteGame}
  {isLoading}
/>
