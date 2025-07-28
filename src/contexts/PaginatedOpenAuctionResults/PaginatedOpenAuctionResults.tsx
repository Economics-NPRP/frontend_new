'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { SortedOffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getPaginatedOpenAuctionResults } from '@/lib/results/open';
import {
	IAuctionResultsData,
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedOpenAuctionResultsContext
	extends SortedOffsetPaginatedContextState<IAuctionResultsData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IAuctionResultsData>(
	1,
	20,
	'permits_reserved',
	'desc',
);
const Context = createContext<IPaginatedOpenAuctionResultsContext>(DefaultData);

export const PaginatedOpenAuctionResultsProvider = ({
	id = 'paginatedOpenAuctionResults',
	...props
}: SortedOffsetPaginatedProviderProps) => {
	const { auctionId } = useParams();
	const { areResultsAvailable } = useAuctionAvailability();

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['marketplace', auctionId as string, 'paginatedOpenAuctionResults']}
			queryFn={(page, perPage, sortBy, sortDirection) => () =>
				throwError(
					getPaginatedOpenAuctionResults({
						auctionId: auctionId as string,
						page,
						perPage,
						sortBy,
						sortDirection,
					}),
					`getPaginatedOpenAuctionResults:${auctionId}`,
				)
			}
			id={id}
			disabled={!areResultsAvailable}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedOpenAuctionResultsContextData,
	Context as PaginatedOpenAuctionResultsContext,
};
