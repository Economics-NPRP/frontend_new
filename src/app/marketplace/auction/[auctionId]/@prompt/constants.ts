import { DataTableSortStatus } from 'mantine-datatable';
import { createContext } from 'react';

import { UseListStateHandlers } from '@mantine/hooks';

import { BidTableData } from './types';

export const DEFAULT_CONTEXT = {
	bids: [],

	selectedBids: [],

	deletingBids: [],

	editingBid: -1,

	sortStatus: {
		columnAccessor: 'bid',
		direction: 'desc',
	},
	setSortStatus: () => {},

	totalPermits: 0,
	grandTotal: 0,
};

export interface IAuctionBiddingContext {
	bids: BidTableData[];
	bidsHandlers: UseListStateHandlers<BidTableData>;

	selectedBids: BidTableData[];
	selectedBidsHandlers: UseListStateHandlers<BidTableData>;

	deletingBids: number[];
	deletingBidsHandlers: UseListStateHandlers<number>;
	deleteModalOpened: boolean;
	deleteModalActions: { open: () => void; close: () => void };

	editingBid: number;
	setEditingBid: (bidId: number) => void;
	editModalOpened: boolean;
	editModalActions: { open: () => void; close: () => void };

	sortStatus: DataTableSortStatus<BidTableData>;
	setSortStatus: (sortStatus: DataTableSortStatus<BidTableData>) => void;

	totalPermits: number;
	grandTotal: number;
}

//	@ts-expect-error - cannot make default context for list handlers
export const AuctionBiddingContext = createContext<IAuctionBiddingContext>(DEFAULT_CONTEXT);
