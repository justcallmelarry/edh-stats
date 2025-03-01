<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Users, MoreHorizontal, Calendar } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  interface Playgroup {
    id: string;
    name: string;
    members: string[];
    owner: string;
  }

  let playgroups: Playgroup[] = [];

  onMount(async () => {
    try {
      const currentUser = pb.authStore.model;
      if (!currentUser) return;

      const records = await pb.collection('playgroups').getList();

      playgroups = records.items as unknown as Playgroup[];
    } catch (error) {
      console.error('Error fetching playgroups:', error);
    }
  });
</script>

<div class="container mx-auto p-4">
  <div class="mx-auto max-w-2xl p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Your Playgroups</h1>
      <Button href="/groups/new">Create New</Button>
    </div>
    <div class="mt-4 flex flex-wrap gap-4 justify-start">
      {#each playgroups as playgroup}
        <a
          href="/groups/{playgroup.id}"
          class="w-[calc(50%-0.5rem)] no-underline"
        >
          <Card.Root class="w-full transition-colors hover:bg-muted/50">
            <div class="p-4">
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">{playgroup.name}</h3>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button
                        on:click|stopPropagation
                        class="hover:bg-muted rounded-full p-1"
                      >
                        <MoreHorizontal class="h-5 w-5" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item onclick={() => {
                        // Copy group link logic here
                        navigator.clipboard.writeText(`${window.location.origin}/group/${playgroup.id}`);
                      }}>
                        Copy group link
                      </DropdownMenu.Item>
                      <DropdownMenu.Item class="text-destructive" onclick={() => {
                        // Leave group logic here
                      }}>
                        Leave group
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center text-muted-foreground">
                    <Users class="h-4 w-4" />
                    <span class="ml-1">{playgroup.members.length}</span>
                  </div>
                  <div class="flex items-center text-muted-foreground text-sm">
                    <Calendar class="h-4 w-4" />
                    <span class="ml-1">{new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Root>
        </a>
      {/each}
    </div>
  </div>
</div>
