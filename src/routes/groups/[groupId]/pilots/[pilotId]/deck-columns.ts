import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Deck = {
  name: string;
  games: number;
  wins: number;
  winRatio: number;
  colors: number;
};

export const deckColumns: ColumnDef<Deck>[] = [
  {
    accessorKey: 'deck',
    header: 'Deck',
    cell: ({ row }) => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="font-medium">${row.getValue('deck')}</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    }
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
    accessorKey: 'colors',
    header: () => {
      const centerHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">Colors</div>`
      }));
      return renderSnippet(centerHeaderSnippet, '');
    },
    cell: ({ row }) => {
      const percentHeaderSnippet = createRawSnippet(() => ({
        render: () => `<div class="text-center">${Number(row.getValue('colors')).toFixed(3)}</div>`
      }));
      return renderSnippet(percentHeaderSnippet, '');
    }
  }
];
