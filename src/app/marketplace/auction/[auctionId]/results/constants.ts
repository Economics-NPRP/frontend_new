import { RefObject, createContext } from 'react';

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
	scrollToHistory: () => {},
	historyRef: { current: null } as RefObject<HTMLAnchorElement>,

	resultsPage: 1,
	setResultsPage: () => {},

	allBidsCursor: undefined,
	setAllBidsCursor: () => {},
	allBidsNavDirection: 'next',
	setAllBidsNavDirection: () => {},

	myBidsCursor: undefined,
	setMyBidsCursor: () => {},
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

	myBids: {
		ok: false,
		errors: [],
		results: [],
		perPage: 20,
		hasNext: false,
		hasPrev: false,
		cursorForNextPage: null,
		cursorForPrevPage: null,
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	scrollToHistory: (params: any) => void;
	historyRef: RefObject<HTMLAnchorElement>;

	resultsPage: number;
	setResultsPage: (page: number) => void;

	allBidsCursor: string | null | undefined;
	setAllBidsCursor: (bidId: string | null | undefined) => void;
	allBidsNavDirection: NavDirection;
	setAllBidsNavDirection: (direction: NavDirection) => void;

	myBidsCursor: string | null | undefined;
	setMyBidsCursor: (bidId: string | null | undefined) => void;
	myBidsNavDirection: NavDirection;
	setMyBidsNavDirection: (direction: NavDirection) => void;

	winningBidsPage: number;
	setWinningBidsPage: (page: number) => void;

	resultsPerPage: number;
	setResultsPerPage: (perPage: number) => void;

	bidsPerPage: number;
	setBidsPerPage: (perPage: number) => void;

	openAuctionResults: OffsetPaginatedData<IAuctionResultsData>;
	isOpenAuctionResultsLoading: boolean;
	isOpenAuctionResultsError: boolean;
	isOpenAuctionResultsSuccess: boolean;

	allBids: KeysetPaginatedData<IBidData>;
	isAllBidsLoading: boolean;
	isAllBidsError: boolean;
	isAllBidsSuccess: boolean;

	myBids: KeysetPaginatedData<IBidData>;
	isMyBidsLoading: boolean;
	isMyBidsError: boolean;
	isMyBidsSuccess: boolean;

	winningBids: OffsetPaginatedData<IBidData>;
	isWinningBidsLoading: boolean;
	isWinningBidsError: boolean;
	isWinningBidsSuccess: boolean;

	allWinningBids: OffsetPaginatedData<IBidData>;
	isAllWinningBidsLoading: boolean;
	isAllWinningBidsError: boolean;
	isAllWinningBidsSuccess: boolean;

	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading: boolean;
	isAuctionDataError: boolean;
	isAuctionDataSuccess: boolean;

	myOpenAuctionResults: ServerData<IMyAuctionResultsData>;
	isMyOpenAuctionResultsLoading: boolean;
	isMyOpenAuctionResultsError: boolean;
	isMyOpenAuctionResultsSuccess: boolean;
}

export const AuctionResultsContext = createContext<IAuctionResultsContext>(DEFAULT_CONTEXT);
