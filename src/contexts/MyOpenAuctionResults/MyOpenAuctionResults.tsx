'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext, useContext } from 'react';

import { MyUserProfileContext, QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getMyOpenAuctionResults } from '@/lib/results/open';
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
	const myUser = useContext(MyUserProfileContext);
	const { auctionId } = useParams();
	const { areResultsAvailable } = useAuctionAvailability();

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={[myUser.data.id, 'marketplace', auctionId as string, 'myOpenAuctionResults']}
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
