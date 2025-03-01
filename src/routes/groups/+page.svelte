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
    pilots: number;
    latestGameDate: string | null;
  }

  let playgroups: Playgroup[] = [];

  onMount(async () => {
    try {
      const currentUser = pb.authStore.model;
      if (!currentUser) return;

      // Get base playgroups data
      const records = await pb.collection('playgroups').getList();
      const basePlaygroups = records.items as unknown as Playgroup[];

      // Enrich each playgroup with pilots count and latest game date
      const enrichedPlaygroups = await Promise.all(
        basePlaygroups.map(async (playgroup) => {
          try {
            // Get pilots count
            const pilotsResult = await pb.collection('pilots').getList(1, 1, {
              filter: `playgroup = "${playgroup.id}"`,
              $cancelKey: `pilots-${playgroup.id}`
            });

            // Get latest game
            const gamesResult = await pb.collection('games').getList(1, 1, {
              filter: `playgroup = "${playgroup.id}"`,
              sort: '-date',
              $cancelKey: `games-${playgroup.id}`
            });

            return {
              ...playgroup,
              pilots: pilotsResult?.totalItems ?? 0,
              latestGameDate: gamesResult?.items[0]?.date ?? null
            };
          } catch (err) {
            console.error(`Error enriching playgroup ${playgroup.id}:`, err);
            // Return playgroup with default values if enrichment fails
            return {
              ...playgroup,
              pilots: 0,
              latestGameDate: null
            };
          }
        })
      );

      // Sort by latest game date
      playgroups = enrichedPlaygroups.sort((a, b) => {
        if (!a.latestGameDate) return 1;
        if (!b.latestGameDate) return -1;
        return new Date(b.latestGameDate).getTime() - new Date(a.latestGameDate).getTime();
      });
    } catch (error) {
      console.error('Error fetching playgroups:', error);
      playgroups = [];
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
                    <span class="ml-1">{playgroup.pilots || 0}</span>
                  </div>
                  <div class="flex items-center text-muted-foreground text-sm">
                    <Calendar class="h-4 w-4" />
                    <span class="ml-1">{playgroup.latestGameDate ? new Date(playgroup.latestGameDate).toISOString().split('T')[0] : 'No games yet'}</span>
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
