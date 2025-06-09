'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext, useContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
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
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);
	const { areResultsAvailable } = useAuctionAvailability();

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
