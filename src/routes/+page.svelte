<script>
	import { goto } from '$app/navigation';

	async function onClick() {
		let route = '/sign-in';
		const hasSignedIn = localStorage.getItem('hasSignedIn') === 'true';
		if (hasSignedIn) {
			route = '/home';
		}
		await goto(route);
	}
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class=" max-w-3xl">
			<h1 class="text-5xl font-bold">EDH Stats!</h1>
			<p class="py-6">Stats to prove that Sossen deserves being treated as archenemy.</p>
			<button on:click={onClick} class="btn btn-primary">Go to stats</button>
		</div>
	</div>
</div>
