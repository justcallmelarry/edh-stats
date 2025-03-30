import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet, renderComponent } from '$lib/components/ui/data-table/index.js';
import Pilot from '$lib/components/Pilot.svelte';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PlayerRanking = {
  pilot: string;
  games: number;
  wins: number;
  winRatio: number;
};

export const playerRankingColumns: ColumnDef<PlayerRanking>[] = [
  {
    accessorKey: 'pilot',
    header: 'Pilot',
    cell: ({ row }) => renderComponent(Pilot, { size: 16, text: row.getValue('pilot') })
  },
  {
    accessorKey: 'games',
    header: () => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">Games</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    },
    cell: ({ row }) => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">${row.getValue('games')}</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    }
  },
  {
    accessorKey: 'wins',
    header: () => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">Wins</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    },
    cell: ({ row }) => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">${row.getValue('wins')}</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    }
  },
  {
    accessorKey: 'winRatio',
    header: () => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">%</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    },
    cell: ({ row }) => {
      const percentHeaderSnippet = createRawSnippet(() => ({
        render: () =>
          `<div class="text-center">${(Number(row.getValue('winRatio')) * 100).toFixed(1)}%</div>`
      }));
      return renderSnippet(percentHeaderSnippet, '');
    }
  }
];
