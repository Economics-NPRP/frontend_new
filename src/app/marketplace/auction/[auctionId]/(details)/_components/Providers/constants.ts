'use client';

import { DataTableSortStatus } from 'mantine-datatable';
import { createContext } from 'react';

import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import { DefaultAuctionData, IAuctionData, IBidData } from '@/schema/models';
import {
	DefaultMyAuctionResultsData,
	IMyAuctionResultsData,
	KeysetPaginatedData,
	OffsetPaginatedData,
	ServerData,
} from '@/types';
import { UseListStateHandlers } from '@mantine/hooks';

export const DEFAULT_AUCTION_DETAILS_CONTEXT: IAuctionDetailsContext = {
	auctionData: {
		ok: false,
		errors: [],
		...DefaultAuctionData,
	},
	isAuctionDataLoading: true,
	isAuctionDataError: false,
	isAuctionDataSuccess: false,

	myOpenAuctionResults: {
		ok: false,
		errors: [],
		...DefaultMyAuctionResultsData,
	},
	isMyOpenAuctionResultsLoading: true,
	isMyOpenAuctionResultsError: false,
	isMyOpenAuctionResultsSuccess: false,
};

export const DEFAULT_AUCTION_BIDS_CONTEXT: IAuctionBidsContext = {
	winningPage: 1,
	setWinningPage: () => {},

	minePage: 1,
	setMinePage: () => {},

	winningBids: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 10,
		resultCount: 0,
	},
	isWinningBidsLoading: true,
	isWinningBidsError: false,
	isWinningBidsSuccess: false,

	myBids: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 10,
		resultCount: 0,
	},
	isMyBidsLoading: true,
	isMyBidsError: false,
	isMyBidsSuccess: false,

	allBids: {
		ok: false,
		errors: [],
		results: [],
		perPage: 1,
		hasNext: false,
		hasPrev: false,
		cursorForNextPage: null,
		cursorForPrevPage: null,
		totalCount: 0,
		isExact: true,
		resultCount: 0,
	},
	isAllBidsLoading: true,
	isAllBidsError: false,
	isAllBidsSuccess: false,
};

export const DEFAULT_AUCTION_BIDDING_CONTEXT = {
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

export interface IAuctionDetailsContext {
	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading: boolean;
	isAuctionDataError: boolean;
	isAuctionDataSuccess: boolean;

	myOpenAuctionResults: ServerData<IMyAuctionResultsData>;
	isMyOpenAuctionResultsLoading: boolean;
	isMyOpenAuctionResultsError: boolean;
	isMyOpenAuctionResultsSuccess: boolean;
}

export interface IAuctionBidsContext {
	winningPage: number;
	setWinningPage: (page: number) => void;

	minePage: number;
	setMinePage: (page: number) => void;

	winningBids: OffsetPaginatedData<IBidData>;
	isWinningBidsLoading: boolean;
	isWinningBidsError: boolean;
	isWinningBidsSuccess: boolean;

	myBids: OffsetPaginatedData<IBidData>;
	isMyBidsLoading: boolean;
	isMyBidsError: boolean;
	isMyBidsSuccess: boolean;

	allBids: KeysetPaginatedData<IBidData>;
	isAllBidsLoading: boolean;
	isAllBidsError: boolean;
	isAllBidsSuccess: boolean;
}

export interface IAuctionBiddingContext {
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

export const AuctionDetailsContext = createContext<IAuctionDetailsContext>(
	DEFAULT_AUCTION_DETAILS_CONTEXT,
);
export const AuctionBidsContext = createContext<IAuctionBidsContext>(DEFAULT_AUCTION_BIDS_CONTEXT);
export const AuctionBiddingContext = createContext<IAuctionBiddingContext>(
	//	@ts-expect-error - cannot make default context for list handlers
	DEFAULT_AUCTION_BIDDING_CONTEXT,
);
