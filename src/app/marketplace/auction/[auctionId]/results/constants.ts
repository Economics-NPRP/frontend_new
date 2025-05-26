import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData, IBidData } from '@/schema/models';
import {
	DefaultMyAuctionResultsData,
	IAuctionResultsData,
	IMyAuctionResultsData,
	KeysetPaginatedData,
	NavDirection,
	OffsetPaginatedData,
	ServerData,
} from '@/types';

export const DEFAULT_CONTEXT: IAuctionResultsContext = {
	resultsPage: 1,
	setResultsPage: () => {},

	allBidsKey: undefined,
	setAllBidsKey: () => {},
	allBidsNavDirection: 'next',
	setAllBidsNavDirection: () => {},

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
		perPage: 10,
		hasNext: false,
		totalCount: 0,
		isExact: true,
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
		...DefaultMyAuctionResultsData,
	},
	isMyOpenAuctionResultsLoading: true,
	isMyOpenAuctionResultsError: false,
	isMyOpenAuctionResultsSuccess: false,
};

export interface IAuctionResultsContext {
	resultsPage: number;
	setResultsPage: (page: number) => void;

	allBidsKey: string | undefined;
	setAllBidsKey: (bidId: string | undefined) => void;
	allBidsNavDirection: NavDirection;
	setAllBidsNavDirection: (direction: NavDirection) => void;

	auctionResults: OffsetPaginatedData<IAuctionResultsData>;
	isAuctionResultsLoading?: boolean;
	isAuctionResultsError?: boolean;
	isAuctionResultsSuccess?: boolean;

	allBids: KeysetPaginatedData<IBidData>;
	isAllBidsLoading?: boolean;
	isAllBidsError?: boolean;
	isAllBidsSuccess?: boolean;

	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading?: boolean;
	isAuctionDataError?: boolean;
	isAuctionDataSuccess?: boolean;

	myOpenAuctionResults: ServerData<IMyAuctionResultsData>;
	isMyOpenAuctionResultsLoading?: boolean;
	isMyOpenAuctionResultsError?: boolean;
	isMyOpenAuctionResultsSuccess?: boolean;
}

export const AuctionResultsContext = createContext<IAuctionResultsContext>(DEFAULT_CONTEXT);
