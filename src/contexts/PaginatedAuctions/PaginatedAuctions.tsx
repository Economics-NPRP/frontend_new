'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAuctions } from '@/lib/auctions';
import { DefaultQueryFiltersData, IAuctionData, QueryFiltersData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAuctionsContext extends SortedOffsetPaginatedContextState<IAuctionData> {
	filters: QueryFiltersData;
	setAllFilters: (filters: QueryFiltersData) => void;
	setSingleFilter: (key: 'type' | 'status' | 'owner', value: string) => void;
	setArrayFilter: (key: 'sector', value: Array<string>) => void;
	addToFilterArray: (key: 'sector', ...value: Array<string>) => void;
	removeFilter: (key: keyof QueryFiltersData, value?: string) => void;
	resetFilters: () => void;
}
const DefaultData: IPaginatedAuctionsContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionData>(1, 12, 'created_at', 'desc'),

	filters: DefaultQueryFiltersData,
	setAllFilters: () => {},
	setSingleFilter: () => {},
	setArrayFilter: () => {},
	addToFilterArray: () => {},
	removeFilter: () => {},
	resetFilters: () => {},
};
const Context = createContext<IPaginatedAuctionsContext>(DefaultData);

export interface PaginatedAuctionsProviderProps extends SortedOffsetPaginatedProviderProps {
	defaultFilters?: QueryFiltersData;
}
export const PaginatedAuctionsProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	defaultFilters,
	children,
}: PaginatedAuctionsProviderProps) => {
	const [filters, setAllFilters] = useState(defaultFilters || DefaultData.filters);

	const resetFilters = useCallback<IPaginatedAuctionsContext['resetFilters']>(() => {
		setAllFilters(DefaultData.filters);
	}, []);

	const removeFilter = useCallback<IPaginatedAuctionsContext['removeFilter']>((key, value) => {
		if (value) {
			setAllFilters((filters) => ({
				...filters,
				[key]: (filters[key] as Array<string>).filter((v) => v !== value),
			}));
		} else {
			setAllFilters((filters) => ({ ...filters, [key]: DefaultData.filters[key] }));
		}
	}, []);

	const setSingleFilter = useCallback<IPaginatedAuctionsContext['setSingleFilter']>(
		(key, value) => {
			setAllFilters((filters) => ({
				...filters,
				[key]: value,
			}));
		},
		[],
	);

	const setArrayFilter = useCallback<IPaginatedAuctionsContext['setArrayFilter']>(
		(key, value) => {
			//	@ts-expect-error - should be gone once we add a new type to array filter key
			setAllFilters((filters) => ({
				...filters,
				[key]: Array.from(new Set(value)),
			}));
		},
		[],
	);

	const addToFilterArray = useCallback<IPaginatedAuctionsContext['addToFilterArray']>(
		(key, ...value) => {
			//	@ts-expect-error - should be gone once we add a new type to array filter key
			setAllFilters((filters) => ({
				...filters,
				[key]: Array.from(new Set([...filters[key]!, ...value])),
			}));
		},
		[],
	);

	const queryKey = useMemo(
		() => ['marketplace', 'paginatedAuctions', JSON.stringify(filters)],
		[filters],
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
					type: filters.type,
					ownership: filters.ownership,
					isLive: filters.status === 'ongoing',
					hasEnded: filters.status === 'ended',
				}),
				'getPaginatedAuctions',
			),
		[filters],
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
			setAllFilters={setAllFilters}
			setSingleFilter={setSingleFilter}
			setArrayFilter={setArrayFilter}
			addToFilterArray={addToFilterArray}
			removeFilter={removeFilter}
			resetFilters={resetFilters}
		/>
	);
};

export { DefaultData as DefaultPaginatedAuctionsContextData, Context as PaginatedAuctionsContext };
