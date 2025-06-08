'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';

import { QueryProvider, SingleAuctionContext } from '@/contexts';
import { throwError } from '@/helpers';
import { getMyOpenAuctionResults } from '@/lib/results/open';
import { CurrentUserContext } from '@/pages/globalContext';
import {
	DefaultMyAuctionResultsData,
	IMyAuctionResultsData,
	ServerContextState,
	getDefaultContextState,
} from '@/types';

export interface IMyOpenAuctionResultsContext extends ServerContextState<IMyAuctionResultsData> {}
const DefaultData = getDefaultContextState(DefaultMyAuctionResultsData);
const Context = createContext<IMyOpenAuctionResultsContext>(DefaultData);

export const MyOpenAuctionResultsProvider = ({ children }: PropsWithChildren) => {
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);

	//	TODO: for sealed auctions, wait till authority publishes results
	const areResultsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			(auction.data.type === 'open' ||
				(auction.data.type === 'sealed' &&
					new Date(auction.data.endDatetime).getTime() < Date.now())),
		[auction.data.type, auction.data.endDatetime],
	);

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={[currentUser.id, 'marketplace', auctionId as string, 'myOpenAuctionResults']}
			queryFn={() => () => throwError(getMyOpenAuctionResults(auctionId as string))}
			disabled={!areResultsAvailable}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultMyOpenAuctionResultsContextData,
	Context as MyOpenAuctionResultsContext,
};
