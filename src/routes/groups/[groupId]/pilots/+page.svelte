<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { pb } from '$lib/pocketbase';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { ChevronRight } from 'lucide-svelte';
  import Pilot from '$lib/components/Pilot.svelte';

  interface PilotInterface {
    id: string;
    name: string;
  }

  let isLoading = $state(false);
  let pilots: PilotInterface[] = $state([]);

  async function fetchGames() {
    isLoading = true;
    try {
      const result = await pb.collection('pilots').getFullList({
        filter: `playgroup = "${page.params.groupId}"`,
        sort: 'name'
      });
      pilots = result.map((record) => ({
        id: record.id,
        name: record.name
      }));
    } catch (err) {
      console.error('Error fetching pilots:', err);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchGames();
  });
</script>

<Card.Root class="mx-auto w-full mb-4">
  <Card.Content>
    <Table.Root>
      <Table.Body>
        {#each pilots as pilot}
          <Table.Row>
            <Table.Cell>
              <a href={`/groups/${page.params.groupId}/pilots/${pilot.id}`}>
                <div class="flex justify-between gap-2">
                  <div class="flex items-center">
                    <Pilot text={pilot.name} />
                  </div>
                  <div><ChevronRight size={16} /></div>
                </div>
              </a>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

{#if isLoading}
  <div class="flex justify-center">
    <Spinner />
  </div>
{/if}
