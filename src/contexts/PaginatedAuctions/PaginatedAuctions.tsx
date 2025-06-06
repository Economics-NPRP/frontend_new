'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAuctions } from '@/lib/auctions';
import { IAuctionFilters } from '@/pages/marketplace/(home)/@catalogue/constants';
import { IAuctionData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAuctionsContext extends SortedOffsetPaginatedContextState<IAuctionData> {
	filters: IAuctionFilters;
	setFilters: (filters: IAuctionFilters) => void;
	removeFilter: (key: keyof IAuctionFilters, value?: string) => void;
}
const DefaultData: IPaginatedAuctionsContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionData>(),

	filters: {
		type: [],
		status: 'all',
		sector: [],
		owner: [],
	},
	setFilters: () => {},
	removeFilter: () => {},
};
const Context = createContext<IPaginatedAuctionsContext>(DefaultData);

export const PaginatedAuctionsProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	children,
}: SortedOffsetPaginatedProviderProps) => {
	const [filters, setFilters] = useState(DefaultData.filters);

	const removeFilter = useCallback<IPaginatedAuctionsContext['removeFilter']>((key, value) => {
		if (value) {
			setFilters((filters) => ({
				...filters,
				[key]: (filters[key] as Array<string>).filter((v) => v !== value),
			}));
		} else {
			setFilters((filters) => ({ ...filters, [key]: DefaultData.filters[key] }));
		}
	}, []);

	const queryKey = useMemo(
		() => ['marketplace', 'paginatedAuctions', (filters.type || [])[0], filters.status],
		[filters.type, filters.status],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedQueryProviderProps<IPaginatedAuctionsContext>['queryFn']
	>(
		() => (page, perPage, sortBy, sortDirection) => () =>
			throwError(
				getPaginatedAuctions({
					page,
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
		<SortedOffsetPaginatedQueryProvider
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

export { DefaultData as DefaultPaginatedAuctionsContextData, Context as PaginatedAuctionsContext };
