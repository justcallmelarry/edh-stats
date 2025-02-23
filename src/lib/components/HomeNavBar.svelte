<script lang="ts">
  import Button from './ui/button/button.svelte';
  import LightSwitch from './LightSwitch.svelte';
  import Banana from 'lucide-svelte/icons/banana';
</script>

<div class="flex justify-between bg-secondary p-4">
  <div class="flex">
    <span id="logo">
      <Banana size={32} />
    </span>
    <Button variant="link" href="/home">Home</Button>
    <Button variant="link" href="/home/add-game">Add Game</Button>
  </div>
  <div class="flex">
    <LightSwitch />
  </div>
</div>
