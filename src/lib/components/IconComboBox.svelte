<script lang="ts" generics="TData, TValue">
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { CircleHelp, type Icon as IconType } from 'lucide-svelte';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import * as Command from '$lib/components/ui/command/index.js';

  type ListItem = {
    id: string;
    name: string;
  };

  type IconComboboxProps<TData, TValue> = {
    icon: typeof IconType;
    list: ListItem[];
    value: string;
  };

  let { value = $bindable(), icon, list }: IconComboboxProps<TData, TValue> = $props();

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
      <Command.Input placeholder="Search items..." class="h-9" />
      <Command.List>
        <Command.Empty>No such item.</Command.Empty>
        <Command.Group>
          {#each list as entry}
            <Command.Item
              onSelect={() => {
                value = entry.name;
                closeAndFocusTrigger();
              }}
            >
              {entry.name}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
