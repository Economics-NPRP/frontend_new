'use client';

import { DataTableSortStatus } from 'mantine-datatable';
import { Ref, createContext } from 'react';

import { BiddingTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import { UseListStateHandlers } from '@mantine/hooks';

//	@ts-expect-error - cannot make default context for list handlers
export const DefaultAuctionDetailsPageContextData: IAuctionBiddingContext = {
	isBidsDrawerOpen: false,
	openBidsDrawer: () => {},
	closeBidsDrawer: () => {},

	scrollToBidding: () => {},
	biddingTableRef: {} as Ref<HTMLTableElement>,

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

	scrollToBidding: () => void;
	biddingTableRef: Ref<HTMLTableElement>;

	bids: BiddingTableData[];
	bidsHandlers: UseListStateHandlers<BiddingTableData>;
	bidConfirmationModalOpened: boolean;
	bidConfirmationModalActions: { open: () => void; close: () => void };

	selectedBids: BiddingTableData[];
	selectedBidsHandlers: UseListStateHandlers<BiddingTableData>;

	deletingBids: BiddingTableData[];
	deletingBidsHandlers: UseListStateHandlers<BiddingTableData>;
	deleteModalOpened: boolean;
	deleteModalActions: { open: () => void; close: () => void };

	editingBid: number;
	setEditingBid: (bidId: number) => void;
	editModalOpened: boolean;
	editModalActions: { open: () => void; close: () => void };

	sortStatus: DataTableSortStatus<BiddingTableData>;
	setSortStatus: (sortStatus: DataTableSortStatus<BiddingTableData>) => void;

	totalPermits: number;
	grandTotal: number;

	resetState: () => void;
}

export const AuctionDetailsPageContext = createContext<IAuctionDetailsPageContext>(
	DefaultAuctionDetailsPageContextData,
);
