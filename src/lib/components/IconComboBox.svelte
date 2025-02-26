<script lang="ts" generics="TData, TValue">
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { CircleHelp, type Icon as IconType } from 'lucide-svelte';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import * as Command from '$lib/components/ui/command/index.js';
  import { tick } from 'svelte';

  type SelectionComboboxProps<TData, TValue> = {
    icon: typeof IconType;
    list: string[];
    value: string;
  };

  let { value = $bindable(), icon, list }: SelectionComboboxProps<TData, TValue> = $props();

  let open = $state(false);

  function closeAndFocusTrigger() {
    open = false;
  }
</script>

<Popover.Root bind:open>
  {#if icon}
    {@const Icon = icon}
    <Popover.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
      <Icon />
    </Popover.Trigger>
  {:else}
    <Popover.Trigger><CircleHelp /></Popover.Trigger>
  {/if}
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." class="h-9" />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each list as entry}
            <Command.Item
              onSelect={() => {
                value = entry;
                closeAndFocusTrigger();
              }}>{entry}</Command.Item
            >
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
