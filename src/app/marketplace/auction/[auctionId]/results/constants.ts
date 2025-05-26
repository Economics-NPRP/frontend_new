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

	myBidsKey: undefined,
	setMyBidsKey: () => {},
	myBidsNavDirection: 'next',
	setMyBidsNavDirection: () => {},

	winningBidsPage: 1,
	setWinningBidsPage: () => {},

	resultsPerPage: 20,
	setResultsPerPage: () => {},

	bidsPerPage: 20,
	setBidsPerPage: () => {},

	openAuctionResults: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 20,
		resultCount: 0,
	},
	isOpenAuctionResultsLoading: true,
	isOpenAuctionResultsError: false,
	isOpenAuctionResultsSuccess: false,

	allBids: {
		ok: false,
		errors: [],
		results: [],
		perPage: 20,
		hasNext: false,
		totalCount: 0,
		isExact: true,
		resultCount: 0,
	},
	isAllBidsLoading: true,
	isAllBidsError: false,
	isAllBidsSuccess: false,

	myBids: {
		ok: false,
		errors: [],
		results: [],
		perPage: 20,
		hasNext: false,
		totalCount: 0,
		isExact: true,
		resultCount: 0,
	},
	isMyBidsLoading: true,
	isMyBidsError: false,
	isMyBidsSuccess: false,

	winningBids: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 20,
		resultCount: 0,
	},
	isWinningBidsLoading: true,
	isWinningBidsError: false,
	isWinningBidsSuccess: false,

	allWinningBids: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 10,
		resultCount: 0,
	},
	isAllWinningBidsLoading: true,
	isAllWinningBidsError: false,
	isAllWinningBidsSuccess: false,

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

	myBidsKey: string | undefined;
	setMyBidsKey: (bidId: string | undefined) => void;
	myBidsNavDirection: NavDirection;
	setMyBidsNavDirection: (direction: NavDirection) => void;

	winningBidsPage: number;
	setWinningBidsPage: (page: number) => void;

	resultsPerPage: number;
	setResultsPerPage: (perPage: number) => void;

	bidsPerPage: number;
	setBidsPerPage: (perPage: number) => void;

	openAuctionResults: OffsetPaginatedData<IAuctionResultsData>;
	isOpenAuctionResultsLoading?: boolean;
	isOpenAuctionResultsError?: boolean;
	isOpenAuctionResultsSuccess?: boolean;

	allBids: KeysetPaginatedData<IBidData>;
	isAllBidsLoading?: boolean;
	isAllBidsError?: boolean;
	isAllBidsSuccess?: boolean;

	myBids: KeysetPaginatedData<IBidData>;
	isMyBidsLoading?: boolean;
	isMyBidsError?: boolean;
	isMyBidsSuccess?: boolean;

	winningBids: OffsetPaginatedData<IBidData>;
	isWinningBidsLoading?: boolean;
	isWinningBidsError?: boolean;
	isWinningBidsSuccess?: boolean;

	allWinningBids: OffsetPaginatedData<IBidData>;
	isAllWinningBidsLoading?: boolean;
	isAllWinningBidsError?: boolean;
	isAllWinningBidsSuccess?: boolean;

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
