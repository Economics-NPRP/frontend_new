import { createContext } from 'react';

import { IBidData } from '@/schema/models';
import { KeysetPaginatedData, OffsetPaginatedData } from '@/types';

export const DEFAULT_CONTEXT: IBidTableContext = {
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

export interface IBidTableContext {
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

export const BidTableContext = createContext<IBidTableContext>(DEFAULT_CONTEXT);
