import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData, IBidData } from '@/schema/models';
import { OffsetPaginatedData, ServerData } from '@/types';

export const DEFAULT_CONTEXT: IAuctionDetailsContext = {
	winningPage: 1,
	setWinningPage: () => {},

	minePage: 1,
	setMinePage: () => {},

	auctionData: {
		ok: false,
		errors: [],
		...DefaultAuctionData,
	},
	isAuctionDataLoading: true,
	isAuctionDataError: false,
	isAuctionDataSuccess: false,

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
};

export interface IAuctionDetailsContext {
	winningPage: number;
	setWinningPage: (page: number) => void;

	minePage: number;
	setMinePage: (page: number) => void;

	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading?: boolean;
	isAuctionDataError?: boolean;
	isAuctionDataSuccess?: boolean;

	winningBids: OffsetPaginatedData<IBidData>;
	isWinningBidsLoading?: boolean;
	isWinningBidsError?: boolean;
	isWinningBidsSuccess?: boolean;

	myBids: OffsetPaginatedData<IBidData>;
	isMyBidsLoading?: boolean;
	isMyBidsError?: boolean;
	isMyBidsSuccess?: boolean;
}

export const AuctionDetailsContext = createContext<IAuctionDetailsContext>(DEFAULT_CONTEXT);
