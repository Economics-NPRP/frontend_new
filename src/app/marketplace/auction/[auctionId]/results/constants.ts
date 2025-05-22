import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData, IBidData } from '@/schema/models';
import {
	DefaultAuctionResultsData,
	IAuctionResultsData,
	OffsetPaginatedData,
	ServerData,
} from '@/types';

export const DEFAULT_CONTEXT: IAuctionResultsContext = {
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

	allBids: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 10,
		resultCount: 0,
	},
	isAllBidsLoading: true,
	isAllBidsError: false,
	isAllBidsSuccess: false,

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
		...DefaultAuctionResultsData,
	},
	isMyOpenAuctionResultsLoading: true,
	isMyOpenAuctionResultsError: false,
	isMyOpenAuctionResultsSuccess: false,
};

export interface IAuctionResultsContext {
	winningPage: number;
	setWinningPage: (page: number) => void;

	minePage: number;
	setMinePage: (page: number) => void;

	winningBids: OffsetPaginatedData<IBidData>;
	isWinningBidsLoading?: boolean;
	isWinningBidsError?: boolean;
	isWinningBidsSuccess?: boolean;

	allBids: OffsetPaginatedData<IBidData>;
	isAllBidsLoading?: boolean;
	isAllBidsError?: boolean;
	isAllBidsSuccess?: boolean;

	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading?: boolean;
	isAuctionDataError?: boolean;
	isAuctionDataSuccess?: boolean;

	myOpenAuctionResults: ServerData<IAuctionResultsData>;
	isMyOpenAuctionResultsLoading?: boolean;
	isMyOpenAuctionResultsError?: boolean;
	isMyOpenAuctionResultsSuccess?: boolean;
}

export const AuctionResultsContext = createContext<IAuctionResultsContext>(DEFAULT_CONTEXT);
