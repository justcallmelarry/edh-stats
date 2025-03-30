<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Users, MoreHorizontal, Calendar } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { toast } from 'svelte-sonner';

  interface Playgroup {
    id: string;
    name: string;
    members: string[];
    owner: string;
    pilots: number;
    latestGameDate: string | null;
  }

  let playgroups: Playgroup[] = [];
  let groupToLeave: Playgroup | null = null;

  onMount(async () => {
    try {
      const currentUser = pb.authStore.record;
      if (!currentUser) return;

      // Get base playgroups data
      const records = await pb.collection('playgroups').getList(1, 100, {
        expand: 'members'
      });
      const basePlaygroups = records.items as unknown as Playgroup[];

      // Enrich each playgroup with pilots count and latest game date
      const enrichedPlaygroups = await Promise.all(
        basePlaygroups.map(async (playgroup) => {
          try {
            // Get pilots count
            const pilots = await pb.collection('pilots').getList(1, 1, {
              filter: `playgroup = "${playgroup.id}"`,
              $cancelKey: `pilots-${playgroup.id}`
            });

            // Get latest game
            const games = await pb.collection('games').getList(1, 1, {
              filter: `playgroup = "${playgroup.id}"`,
              sort: '-date',
              $cancelKey: `games-${playgroup.id}`
            });

            return {
              ...playgroup,
              pilots: pilots?.totalItems ?? 0,
              latestGameDate: games?.items[0]?.date ?? null
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

<div class="mb-4 flex items-center justify-between">
  <h1 class="text-2xl font-bold">Your Playgroups</h1>
  <Button href="/groups/new">Create New</Button>
</div>
<div class="mt-4 flex flex-wrap justify-start gap-4">
  {#each playgroups as playgroup}
    <a href="/groups/{playgroup.id}" class="w-[calc(100%)] no-underline md:w-[calc(50%-0.5rem)]">
      <Card.Root class="w-full transition-colors hover:bg-muted/50">
        <div class="p-4">
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <h3 class="text-md font-semibold">{playgroup.name}</h3>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <button on:click|stopPropagation class="rounded-full p-1 hover:bg-muted">
                    <MoreHorizontal class="h-5 w-5" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <!-- <DropdownMenu.Item onclick={() => {
                        // Copy group link logic here
                        navigator.clipboard.writeText(`${window.location.origin}/group/${playgroup.id}`);
                      }}>
                        Copy group link
                      </DropdownMenu.Item> -->
                  <DropdownMenu.Item
                    class="text-destructive"
                    onclick={() => {
                      if (playgroup.owner === pb.authStore.record?.id) {
                        toast.error('You cannot leave groups you have created');
                        return;
                      }
                      groupToLeave = playgroup;
                    }}
                  >
                    Leave group
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center text-muted-foreground">
                <div><Users size={16} /></div>
                <span class="ml-1">{playgroup.pilots || 0}</span>
              </div>
              <div class="flex items-center text-sm text-muted-foreground">
                <div><Calendar size={16} /></div>
                <span class="ml-1"
                  >{playgroup.latestGameDate
                    ? new Date(playgroup.latestGameDate).toISOString().split('T')[0]
                    : 'No games yet'}</span
                >
              </div>
            </div>
          </div>
        </div>
      </Card.Root>
    </a>
  {/each}
</div>

<AlertDialog.Root open={!!groupToLeave}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Leave Group</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to leave this group? You'll need to be invited back to rejoin.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={() => (groupToLeave = null)}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action
        onclick={async () => {
          try {
            if (!groupToLeave) return;

            const updatedMembers = groupToLeave.members.filter(
              (id) => id !== pb.authStore.model?.id
            );

            await pb.collection('playgroups').update(groupToLeave.id, {
              members: updatedMembers
            });

            // Remove the group from the local state
            playgroups = playgroups.filter((g) => g.id !== groupToLeave?.id);
            groupToLeave = null;
          } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave group');
          }
        }}
      >
        Leave Group
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
