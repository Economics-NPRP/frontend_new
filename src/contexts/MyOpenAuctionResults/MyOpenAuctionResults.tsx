'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';

import { MyUserProfileContext, QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getMyOpenAuctionResults } from '@/lib/results/open';
import {
	CoreProviderProps,
	DefaultMyAuctionResultsData,
	IMyAuctionResultsData,
	ServerContextState,
	getDefaultContextState,
} from '@/types';

export interface IMyOpenAuctionResultsContext extends ServerContextState<IMyAuctionResultsData> {}
const DefaultData = getDefaultContextState(DefaultMyAuctionResultsData);
const Context = createContext<IMyOpenAuctionResultsContext>(DefaultData);

export const MyOpenAuctionResultsProvider = ({
	id = 'myOpenAuctionResults',
	...props
}: CoreProviderProps) => {
	const myUser = useContext(MyUserProfileContext);
	const { auctionId } = useParams();
	const { areResultsAvailable } = useAuctionAvailability();

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={[myUser.data.id, 'marketplace', auctionId as string, 'myOpenAuctionResults']}
			queryFn={() => () =>
				throwError(
					getMyOpenAuctionResults(auctionId as string),
					`getMyOpenAuctionResults:${auctionId}`,
				)
			}
			id={id}
			disabled={!areResultsAvailable}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultMyOpenAuctionResultsContextData,
	Context as MyOpenAuctionResultsContext,
};
