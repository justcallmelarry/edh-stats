<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type PaginationState,
    getCoreRowModel,
    getPaginationRowModel
  } from '@tanstack/table-core';
  import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import Button from './ui/button/button.svelte';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    state: {
      get pagination() {
        return pagination;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });
</script>

<div>
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && 'selected'}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell class="p-2">
                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div>
      <small class="text-sm text-muted-foreground"
        >Page {pagination.pageIndex + 1} of {table.getPageCount()}</small
      >
    </div>
    <Button
      class="py-2"
      size="sm"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      <ChevronLeft />
    </Button>
    <Button
      class="py-2"
      size="sm"
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      <ChevronRight />
    </Button>
  </div>
</div>
