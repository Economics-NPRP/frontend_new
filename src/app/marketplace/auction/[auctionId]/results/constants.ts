import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData } from '@/schema/models';
import { ServerData } from '@/types';

export const DEFAULT_CONTEXT: IAuctionResultsContext = {
	auctionData: {
		ok: false,
		errors: [],
		...DefaultAuctionData,
	},
	isAuctionDataLoading: true,
	isAuctionDataError: false,
	isAuctionDataSuccess: false,
};

export interface IAuctionResultsContext {
	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading?: boolean;
	isAuctionDataError?: boolean;
	isAuctionDataSuccess?: boolean;
}

export const AuctionResultsContext = createContext<IAuctionResultsContext>(DEFAULT_CONTEXT);
