<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { type DateValue, getLocalTimeZone } from '@internationalized/date';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';
  import GameForm from '$lib/components/GameForm.svelte';
  import { getColors } from '$lib/scryfall';
  import { sortColors } from '$lib/mtg';

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

  onMount(() => {
    fetchExistingData();
  });

  async function handleSubmit(): Promise<void> {
    try {
      isLoading = true;
      if (!gameDate) {
        toast.error('Please select a date');
        return;
      }
      let localDate = gameDate.toDate(getLocalTimeZone());
      localDate.setHours(12);
      const formattedDate = gameDate ? localDate.toISOString() : new Date().toISOString();

      // Create game record with relations
      let data = {
        date: formattedDate.split('T')[0],
        playgroup: page.params.groupId
      };
      let game = await pb.collection('games').create(data);

      let winnerID = '';

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
          let colors = await getColors(player.deck);
          colors = sortColors(colors);

          deckRecord = await pb.collection('decks').create({
            name: player.deck,
            playgroup: page.params.groupId,
            colors: colors
          });
        }

        let gameRowData = {
          playgroup: page.params.groupId,
          game: game.id,
          pilot: pilotRecord?.id,
          deck: deckRecord?.id
        };
        await pb.collection('game_rows').create(gameRowData);

        if (winner === player.pilot) {
          winnerID = pilotRecord?.id || '';
        }
      }

      if (winnerID) {
        await pb.collection('games').update(game.id, { winner: winnerID });
      }
      // Reset form
      players = [
        { pilot: '', deck: '' },
        { pilot: '', deck: '' },
        { pilot: '', deck: '' },
        { pilot: '', deck: '' }
      ];
      winner = 'draw';
      toast.success('Game added!');

      // Refresh the existing data lists
      await fetchExistingData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      isLoading = false;
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
  {isLoading}
/>
