'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext, useContext } from 'react';

import { QueryProvider } from '@/contexts';
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
	const { auctionId } = useParams();
	const { currentUser } = useContext(CurrentUserContext);

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={[currentUser.id, 'marketplace', auctionId as string, 'myOpenAuctionResults']}
			queryFn={() => () => throwError(getMyOpenAuctionResults(auctionId as string))}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultMyOpenAuctionResultsContextData,
	Context as MyOpenAuctionResultsContext,
};
