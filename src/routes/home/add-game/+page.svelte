<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Datepicker, Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Player {
		pilot: string;
		deck: string;
	}

	function getCurrentDate(): Date {
		return new Date();
	}

	let players: Player[] = [
		{ pilot: '', deck: '' },
		{ pilot: '', deck: '' },
		{ pilot: '', deck: '' },
		{ pilot: '', deck: '' }
	];
	let gameDate: Date = getCurrentDate();
	let winner: string = 'draw';
	let showSuccess = false;
	let showError = false;
	let error = '';

	let existingPilots: string[] = [];
	let existingDecks: string[] = [];

	async function fetchExistingData() {
		try {
			const records = await pb.collection('games').getFullList();
			existingPilots = [...new Set(records.map((record) => record.pilot))]
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b));
			existingDecks = [...new Set(records.map((record) => record.deck))]
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b));
		} catch (err) {
			console.error('Error fetching existing data:', err);
		}
	}

	onMount(() => {
		fetchExistingData();
	});

	function generateId(): string {
		return Math.random().toString(36).substring(2) + Date.now().toString(36);
	}

	function addPlayer(): void {
		players = [...players, { pilot: '', deck: '' }];
	}

	function removePlayer(index: number): void {
		if (players.length > 3) {
			players = players.filter((_, i) => i !== index);
		}
	}

	async function handleSubmit(): Promise<void> {
		try {
			const gameId = generateId();

			// update the hours to 12 so that we avoid conversion between UTC and local timezone
			gameDate.setHours(12);
			const formattedDate = gameDate.toISOString().split('T')[0];

			for await (let player of players) {
				let data = {
					date: formattedDate,
					game_id: gameId,
					pilot: player.pilot,
					deck: player.deck,
					winner: winner !== 'draw' && winner === player.pilot
				};
				await pb.collection('games').create(data);
			}

			players = [
				{ pilot: '', deck: '' },
				{ pilot: '', deck: '' },
				{ pilot: '', deck: '' },
				{ pilot: '', deck: '' }
			];
			winner = 'draw';
			showSuccess = true;
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			showError = true;
		}
	}
</script>

<div class="container mx-auto p-4">
	{#if showSuccess}
		<Alert color="green" dismissable bind:open={showSuccess}>
			<span class="font-medium">Success!</span> Game data successfully saved.
		</Alert>
	{/if}

	{#if error}
		<Alert color="red" dismissable bind:open={showError}>
			<span class="font-medium">Error!</span>
			{error}
		</Alert>
	{/if}

	<div class="p-4 max-w-2xl mx-auto">
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<div class="form-control">
				<label for="game-date" class="label">
					<span class="label-text">Game Date</span>
				</label>
				<Datepicker bind:value={gameDate} required />
			</div>

			<div class="space-y-4">
				<h2 class="text-xl font-semibold">Players</h2>
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Pilot Name</th>
								<th>Deck Name</th>
								{#if players.length > 3}
									<th class="w-16"></th>
								{/if}
							</tr>
						</thead>
						<tbody>
							{#each players as player, i}
								<tr>
									<td>
										<input
											id="pilot-{i}"
											type="text"
											placeholder={`Player ${i + 1}`}
											bind:value={player.pilot}
											class="input input-bordered w-full"
											list="pilot-options"
											required
										/>
									</td>
									<td>
										<input
											id="deck-{i}"
											type="text"
											bind:value={player.deck}
											class="input input-bordered w-full"
											list="deck-options"
											required
										/>
									</td>
									{#if players.length > 3}
										<td>
											<button
												type="button"
												class="btn btn-square btn-sm btn-error"
												on:click={() => removePlayer(i)}
											>
												×
											</button>
										</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="space-y-4">
				<h2 class="text-xl font-semibold">Winner</h2>
				<div class="card bg-base-200 p-4">
					<div class="form-control">
						<label for="winner-select" class="label">
							<span class="label-text">Who won?</span>
						</label>
						<select
							id="winner-select"
							class="select select-bordered w-full"
							bind:value={winner}
							required
						>
							{#each players as player}
								{#if player.pilot}
									<option value={player.pilot}>
										{player.pilot}
									</option>
								{/if}
							{/each}
							<option value="draw">Draw</option>
						</select>
					</div>
				</div>
			</div>

			<div class="flex gap-4">
				<button type="button" class="btn btn-secondary" on:click={addPlayer}> Add Player </button>
				<button type="submit" class="btn btn-primary"> Submit Game </button>
			</div>
		</form>
	</div>
</div>

<datalist id="pilot-options">
	{#each existingPilots as pilot}
		<option value={pilot}>{pilot}</option>
	{/each}
</datalist>
<datalist id="deck-options">
	{#each existingDecks as deck}
		<option value={deck}>{deck}</option>
	{/each}
</datalist>
