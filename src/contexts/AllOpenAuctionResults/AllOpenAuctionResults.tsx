'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { OffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getPaginatedOpenAuctionResults } from '@/lib/results/open';
import {
	IAuctionResultsData,
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IAllOpenAuctionResultsContext
	extends SortedOffsetPaginatedContextState<IAuctionResultsData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IAuctionResultsData>();
const Context = createContext<IAllOpenAuctionResultsContext>(DefaultData);

export const AllOpenAuctionResultsProvider = ({
	defaultSortBy,
	defaultSortDirection,
	children,
}: SortedOffsetPaginatedProviderProps) => {
	const { auctionId } = useParams();
	const { areResultsAvailable } = useAuctionAvailability();

	return (
		<OffsetPaginatedQueryProvider
			defaultPage={1}
			defaultPerPage={100} //	TODO: check why backend is limiting to 100
			defaultSortBy={defaultSortBy}
			defaultSortDirection={defaultSortDirection}
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', auctionId as string, 'paginatedOpenAuctionResults']}
			queryFn={(page, perPage) => () =>
				throwError(
					getPaginatedOpenAuctionResults({
						auctionId: auctionId as string,
						page,
						perPage,
					}),
					`getAllOpenAuctionResults:${auctionId}`,
				)
			}
			disabled={!areResultsAvailable}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultAllOpenAuctionResultsContextData,
	Context as AllOpenAuctionResultsContext,
};
