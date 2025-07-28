'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import {
	PaginatedAuctionsProviderProps,
	SortedOffsetPaginatedInfiniteQueryProvider,
	SortedOffsetPaginatedInfiniteQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAuctions } from '@/lib/auctions';
import { DefaultQueryFiltersData, IAuctionData, QueryFiltersData } from '@/schema/models';
import {
	SortedOffsetPaginatedInfiniteContextState,
	getDefaultSortedOffsetPaginatedInfiniteContextState,
} from '@/types';

export interface IInfinitePaginatedAuctionsContext
	extends SortedOffsetPaginatedInfiniteContextState<IAuctionData> {
	filters: QueryFiltersData;
	setAllFilters: (filters: QueryFiltersData) => void;
	removeFilter: (key: keyof QueryFiltersData, value?: string) => void;
}
const DefaultData: IInfinitePaginatedAuctionsContext = {
	...getDefaultSortedOffsetPaginatedInfiniteContextState<IAuctionData>(),

	filters: DefaultQueryFiltersData,
	setAllFilters: () => {},
	removeFilter: () => {},
};
const Context = createContext<IInfinitePaginatedAuctionsContext>(DefaultData);

export const InfinitePaginatedAuctionsProvider = ({
	defaultFilters,
	...props
}: PaginatedAuctionsProviderProps) => {
	const [filters, setAllFilters] = useState(defaultFilters || DefaultData.filters);

	const removeFilter = useCallback<IInfinitePaginatedAuctionsContext['removeFilter']>(
		(key, value) => {
			if (value) {
				setAllFilters((filters) => ({
					...filters,
					[key]: (filters[key] as Array<string>).filter((v) => v !== value),
				}));
			} else {
				setAllFilters((filters) => ({ ...filters, [key]: DefaultData.filters[key] }));
			}
		},
		[],
	);

	const queryKey = useMemo(
		() => ['marketplace', 'infinitePaginatedAuctions', JSON.stringify(filters)],
		[filters],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedInfiniteQueryProviderProps<IInfinitePaginatedAuctionsContext>['queryFn']
	>(
		() =>
			(perPage, sortBy, sortDirection) =>
			({ pageParam }) =>
				throwError(
					getPaginatedAuctions({
						page: (pageParam as number) || props.defaultPage,
						perPage,
						sortBy,
						sortDirection,
						type: filters.type,
						ownership: filters.ownership,
						isLive: filters.status !== 'ended',
						hasEnded: filters.status !== 'ongoing',
					}),
					'getInfinitePaginatedAuctions',
				),
		[filters],
	);

	return (
		<SortedOffsetPaginatedInfiniteQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id="infinitePaginatedAuctions"
			filters={filters}
			setAllFilters={setAllFilters}
			removeFilter={removeFilter}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultInfinitePaginatedAuctionsContextData,
	Context as InfinitePaginatedAuctionsContext,
};
