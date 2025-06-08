'use client';

import { useParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';

import { SingleAuctionContext, SortedOffsetPaginatedQueryProvider } from '@/contexts';
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
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();

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
			disabled={!areResultsAvailable}
			children={children}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedOpenAuctionResultsContextData,
	Context as PaginatedOpenAuctionResultsContext,
};
