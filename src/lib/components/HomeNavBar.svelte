<script lang="ts">
  import Button from './ui/button/button.svelte';
  import LightSwitch from './LightSwitch.svelte';
  import { Banana } from 'lucide-svelte';
</script>

<div class="flex justify-between border p-4">
  <div class="flex">
    <span>
      <Banana size={32} />
    </span>
    <div class="w-8"></div>
  </div>
  <div class="flex">
    <Button variant="link" class="text-primary" href="/groups">Groups</Button>
    <LightSwitch />
  </div>
</div>
