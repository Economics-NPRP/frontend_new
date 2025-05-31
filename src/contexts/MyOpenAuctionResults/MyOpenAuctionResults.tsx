'use client';

import { BaseQueryContextProvider } from 'contexts/BaseContextProviders';
import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext } from 'react';

import { throwError } from '@/helpers';
import { getMyOpenAuctionResults } from '@/lib/results/open';
import {
	DefaultMyAuctionResultsData,
	IMyAuctionResultsData,
	ServerContextState,
	getDefaultContextState,
} from '@/types';

interface IContext extends ServerContextState<IMyAuctionResultsData> {}
const DefaultData = getDefaultContextState(DefaultMyAuctionResultsData);
const Context = createContext<IContext>(DefaultData);

export const MyOpenAuctionResultsProvider = ({ children }: PropsWithChildren) => {
	const { auctionId } = useParams();

	return (
		<BaseQueryContextProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', '@catalogue', 'myOpenAuctionResults', auctionId as string]}
			queryFn={() => throwError(getMyOpenAuctionResults(auctionId as string))}
			children={children}
		/>
	);
};

export type { IContext as IMyOpenAuctionResultsContext };
export {
	DefaultData as DefaultMyOpenAuctionResultsContextData,
	Context as MyOpenAuctionResultsContext,
};
