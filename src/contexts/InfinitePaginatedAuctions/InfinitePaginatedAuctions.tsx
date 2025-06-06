'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import {
	SortedOffsetPaginatedInfiniteQueryProvider,
	SortedOffsetPaginatedInfiniteQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAuctions } from '@/lib/auctions';
import { IAuctionFilters } from '@/pages/marketplace/(home)/@catalogue/constants';
import { IAuctionData } from '@/schema/models';
import {
	SortedOffsetPaginatedInfiniteContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedInfiniteContextState,
} from '@/types';

export interface IInfinitePaginatedAuctionsContext
	extends SortedOffsetPaginatedInfiniteContextState<IAuctionData> {
	filters: IAuctionFilters;
	setFilters: (filters: IAuctionFilters) => void;
	removeFilter: (key: keyof IAuctionFilters, value?: string) => void;
}
const DefaultData: IInfinitePaginatedAuctionsContext = {
	...getDefaultSortedOffsetPaginatedInfiniteContextState<IAuctionData>(),

	filters: {
		type: [],
		status: 'all',
		sector: [],
		owner: [],
	},
	setFilters: () => {},
	removeFilter: () => {},
};
const Context = createContext<IInfinitePaginatedAuctionsContext>(DefaultData);

export const InfinitePaginatedAuctionsProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	children,
}: SortedOffsetPaginatedProviderProps) => {
	const [filters, setFilters] = useState(DefaultData.filters);

	const removeFilter = useCallback<IInfinitePaginatedAuctionsContext['removeFilter']>(
		(key, value) => {
			if (value) {
				setFilters((filters) => ({
					...filters,
					[key]: (filters[key] as Array<string>).filter((v) => v !== value),
				}));
			} else {
				setFilters((filters) => ({ ...filters, [key]: DefaultData.filters[key] }));
			}
		},
		[],
	);

	const queryKey = useMemo(
		() => ['marketplace', 'infinitePaginatedAuctions', (filters.type || [])[0], filters.status],
		[filters.type, filters.status],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedInfiniteQueryProviderProps<IInfinitePaginatedAuctionsContext>['queryFn']
	>(
		() =>
			(perPage, sortBy, sortDirection) =>
			({ pageParam }) =>
				throwError(
					getPaginatedAuctions({
						page: (pageParam as number) || defaultPage,
						perPage,
						sortBy,
						sortDirection,
						type: (filters.type || [])[0],
						isLive: filters.status !== 'ended',
						hasEnded: filters.status !== 'ongoing',
					}),
				),
		[filters.type, filters.status],
	);

	return (
		<SortedOffsetPaginatedInfiniteQueryProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
			defaultSortBy={defaultSortBy}
			defaultSortDirection={defaultSortDirection}
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			children={children}
			filters={filters}
			setFilters={setFilters}
			removeFilter={removeFilter}
		/>
	);
};

export {
	DefaultData as DefaultInfinitePaginatedAuctionsContextData,
	Context as InfinitePaginatedAuctionsContext,
};
