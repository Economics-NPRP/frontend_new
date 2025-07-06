'use client';

import { useParams } from 'next/navigation';
import { createContext, useCallback, useMemo, useState } from 'react';

import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAuctionsInCycle } from '@/lib/cycles';
import { IAuctionFilters } from '@/pages/marketplace/(home)/@catalogue/constants';
import { IAuctionData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAuctionsInCycleContext
	extends SortedOffsetPaginatedContextState<IAuctionData> {
	filters: IAuctionFilters;
	setAllFilters: (filters: IAuctionFilters) => void;
	setSingleFilter: (key: 'status' | 'owner', value: string) => void;
	setArrayFilter: (key: 'type' | 'sector', value: Array<string>) => void;
	addToFilterArray: (key: 'type' | 'sector', ...value: Array<string>) => void;
	removeFilter: (key: keyof IAuctionFilters, value?: string) => void;
}
const DefaultData: IPaginatedAuctionsInCycleContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionData>(1, 12, 'created_at', 'desc'),

	filters: {
		type: [],
		status: 'all',
		sector: [],
		owner: [],
	},
	setAllFilters: () => {},
	setSingleFilter: () => {},
	setArrayFilter: () => {},
	addToFilterArray: () => {},
	removeFilter: () => {},
};
const Context = createContext<IPaginatedAuctionsInCycleContext>(DefaultData);

export interface PaginatedAuctionsInCycleProviderProps extends SortedOffsetPaginatedProviderProps {
	defaultFilters?: IAuctionFilters;
}
export const PaginatedAuctionsInCycleProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	defaultFilters,
	children,
}: PaginatedAuctionsInCycleProviderProps) => {
	const { cycleId } = useParams();
	const [filters, setAllFilters] = useState(defaultFilters || DefaultData.filters);

	const removeFilter = useCallback<IPaginatedAuctionsInCycleContext['removeFilter']>(
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

	const setSingleFilter = useCallback<IPaginatedAuctionsInCycleContext['setSingleFilter']>(
		(key, value) => {
			setAllFilters((filters) => ({
				...filters,
				[key]: value,
			}));
		},
		[],
	);

	const setArrayFilter = useCallback<IPaginatedAuctionsInCycleContext['setArrayFilter']>(
		(key, value) => {
			setAllFilters((filters) => ({
				...filters,
				[key]: Array.from(new Set(value)),
			}));
		},
		[],
	);

	const addToFilterArray = useCallback<IPaginatedAuctionsInCycleContext['addToFilterArray']>(
		(key, ...value) => {
			setAllFilters((filters) => ({
				...filters,
				[key]: Array.from(new Set([...filters[key]!, ...value])),
			}));
		},
		[],
	);

	const queryKey = useMemo(
		() => [
			'dashboard',
			'admin',
			'paginatedAuctionsInCycle',
			cycleId as string,
			(filters.type || [])[0],
			filters.status,
		],
		[filters.type, filters.status],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedQueryProviderProps<IPaginatedAuctionsInCycleContext>['queryFn']
	>(
		() => (page, perPage, sortBy, sortDirection) => () =>
			throwError(
				getPaginatedAuctionsInCycle({
					cycleId: cycleId as string,
					page,
					perPage,
					sortBy,
					sortDirection,
					type: (filters.type || [])[0],
					isLive: filters.status === 'ongoing',
					hasEnded: filters.status === 'ended',
				}),
				`getPaginatedAuctionsInCycle:${cycleId}`,
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
			setAllFilters={setAllFilters}
			setSingleFilter={setSingleFilter}
			setArrayFilter={setArrayFilter}
			addToFilterArray={addToFilterArray}
			removeFilter={removeFilter}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedAuctionsInCycleContextData,
	Context as PaginatedAuctionsInCycleContext,
};
