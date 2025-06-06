import { RefObject, createContext } from 'react';

export const DefaultAuctionResultsPageContextData: IAuctionResultsPageContext = {
	scrollToHistory: () => {},
	historyRef: { current: null } as RefObject<HTMLAnchorElement>,
};

export interface IAuctionResultsPageContext {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	scrollToHistory: (params: any) => void;
	historyRef: RefObject<HTMLAnchorElement>;
}

export const AuctionResultsPageContext = createContext<IAuctionResultsPageContext>(
	DefaultAuctionResultsPageContextData,
);
