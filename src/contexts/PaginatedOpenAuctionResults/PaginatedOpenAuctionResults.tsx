'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { SortedOffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedOpenAuctionResults } from '@/lib/results/open';
import {
	IAuctionResultsData,
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedOpenAuctionResultsContext
	extends SortedOffsetPaginatedContextState<IAuctionResultsData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IAuctionResultsData>();
const Context = createContext<IPaginatedOpenAuctionResultsContext>(DefaultData);

export const PaginatedOpenAuctionResultsProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	children,
}: SortedOffsetPaginatedProviderProps) => {
	const { auctionId } = useParams();

	return (
		<SortedOffsetPaginatedQueryProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
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
				)
			}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedOpenAuctionResultsContextData,
	Context as PaginatedOpenAuctionResultsContext,
};
