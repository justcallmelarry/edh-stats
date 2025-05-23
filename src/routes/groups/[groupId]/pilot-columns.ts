import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet, renderComponent } from '$lib/components/ui/data-table/index.js';
import Pilot from '$lib/components/Pilot.svelte';
import type { PilotType } from '$lib/types';

export type PlayerRanking = {
  pilot: PilotType;
  games: number;
  wins: number;
  winRatio: number;
  link: string;
};

export const playerRankingColumns: ColumnDef<PlayerRanking>[] = [
  {
    accessorKey: 'pilot',
    header: 'Pilot',
    cell: ({ row }) =>
      renderComponent(Pilot, {
        size: 16,
        link: row.getValue('link') as string,
        pilot: row.getValue('pilot')
      })
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
  },
  {
    accessorKey: 'link',
    enableHiding: true,
    header: () => null,
    cell: () => null
  }
];
