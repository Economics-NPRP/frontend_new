'use client';

import { DataTableSortStatus } from 'mantine-datatable';
import { createContext } from 'react';

import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import { UseListStateHandlers } from '@mantine/hooks';

//	@ts-expect-error - cannot make default context for list handlers
export const DefaultAuctionDetailsPageContextData: IAuctionBiddingContext = {
	isBidsDrawerOpen: false,
	openBidsDrawer: () => {},
	closeBidsDrawer: () => {},

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

export interface IAuctionDetailsPageContext {
	isBidsDrawerOpen: boolean;
	openBidsDrawer: () => void;
	closeBidsDrawer: () => void;

	bids: BidTableData[];
	bidsHandlers: UseListStateHandlers<BidTableData>;
	bidConfirmationModalOpened: boolean;
	bidConfirmationModalActions: { open: () => void; close: () => void };

	selectedBids: BidTableData[];
	selectedBidsHandlers: UseListStateHandlers<BidTableData>;

	deletingBids: BidTableData[];
	deletingBidsHandlers: UseListStateHandlers<BidTableData>;
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

	resetState: () => void;
}

export const AuctionDetailsPageContext = createContext<IAuctionDetailsPageContext>(
	DefaultAuctionDetailsPageContextData,
);
