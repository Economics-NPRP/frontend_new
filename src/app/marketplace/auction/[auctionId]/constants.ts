import { createContext } from 'react';

import { DefaultAuctionData, IAuctionData } from '@/schema/models';
import { ServerData } from '@/types';

export const DEFAULT_CONTEXT: IAuctionDetailsContext = {
	auctionData: {
		ok: false,
		errors: [],
		...DefaultAuctionData,
	},
	isAuctionDataLoading: true,
	isAuctionDataError: false,
	isAuctionDataSuccess: false,
};

export interface IAuctionDetailsContext {
	auctionData: ServerData<IAuctionData>;
	isAuctionDataLoading?: boolean;
	isAuctionDataError?: boolean;
	isAuctionDataSuccess?: boolean;
}

export const AuctionDetailsContext = createContext<IAuctionDetailsContext>(DEFAULT_CONTEXT);
