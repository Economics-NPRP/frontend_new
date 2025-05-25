import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData, IBidData } from '@/schema/models';
import {
	DefaultAuctionResultsData,
	IAuctionResultsData,
	OffsetPaginatedData,
	ServerData,
} from '@/types';

export const DEFAULT_CONTEXT: IAuctionResultsContext = {
	resultsPage: 1,
	setResultsPage: () => {},

	bidsPage: 1,
	setBidsPage: () => {},

	auctionResults: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 10,
		resultCount: 0,
	},
	isAuctionResultsLoading: true,
	isAuctionResultsError: false,
	isAuctionResultsSuccess: false,

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
	resultsPage: number;
	setResultsPage: (page: number) => void;

	bidsPage: number;
	setBidsPage: (page: number) => void;

	auctionResults: OffsetPaginatedData<IAuctionResultsData>;
	isAuctionResultsLoading?: boolean;
	isAuctionResultsError?: boolean;
	isAuctionResultsSuccess?: boolean;

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
