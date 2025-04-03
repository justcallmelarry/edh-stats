import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import Deck from '$lib/components/Deck.svelte';
import type { DeckType } from '$lib/types';

export type DeckRanking = {
  deck: DeckType;
  games: number;
  wins: number;
  winRatio: number;
  link: string;
};

export const deckRankingColumns: ColumnDef<DeckRanking>[] = [
  {
    accessorKey: 'deck',
    header: 'Deck',
    cell: ({ row }) =>
      renderComponent(Deck, {
        size: 16,
        deck: row.getValue('deck'),
        link: row.getValue('link') as string
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
