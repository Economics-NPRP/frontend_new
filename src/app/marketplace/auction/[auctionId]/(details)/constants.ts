import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData } from '@/schema/models';
import { DefaultMyAuctionResultsData, IMyAuctionResultsData, ServerData } from '@/types';

export const DEFAULT_CONTEXT: IAuctionDetailsContext = {
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

export const AuctionDetailsContext = createContext<IAuctionDetailsContext>(DEFAULT_CONTEXT);
