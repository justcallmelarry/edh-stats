<script lang="ts">
  import Button from './ui/button/button.svelte';
  import LightSwitch from './LightSwitch.svelte';
  import { Banana, House, Plus } from 'lucide-svelte';
</script>

<div class="flex justify-between bg-secondary p-4">
  <div class="flex">
    <span>
      <Banana size={32} />
    </span>
    <div class="w-8"></div>
    <Button variant="link" class="text-foreground" href="/home"><House /> Home</Button>
    <Button variant="link" class="text-foreground" href="/home/add-game"><Plus />Add Game</Button>
  </div>
  <div class="flex">
    <LightSwitch />
  </div>
</div>
