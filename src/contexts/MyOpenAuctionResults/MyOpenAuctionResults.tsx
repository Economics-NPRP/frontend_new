'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
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
	const { auctionId } = useParams();

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', '@catalogue', 'myOpenAuctionResults', auctionId as string]}
			queryFn={() => throwError(getMyOpenAuctionResults(auctionId as string))}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultMyOpenAuctionResultsContextData,
	Context as MyOpenAuctionResultsContext,
};
