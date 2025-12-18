'use client';

import { useParams } from 'next/navigation';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { createContext, useCallback, useMemo } from 'react';

import { SectorList } from '@/constants/SectorData';
import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { useConditionalQueryStates } from '@/hooks';
import { getPaginatedAuctionsInCycle } from '@/lib/cycles';
import {
	AuctionJoinedStatusListFilter,
	AuctionOwnershipListFilter,
	AuctionStatusListFilter,
	AuctionTypeListFilter,
	DefaultQueryFiltersData,
	IAuctionData,
	QueryFiltersData,
} from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAuctionsInCycleContext
	extends SortedOffsetPaginatedContextState<IAuctionData> {
	filters: QueryFiltersData;
	setAllFilters: (filters: QueryFiltersData) => void;
	setSingleFilter: (
		key: 'type' | 'status' | 'joined' | 'ownership',
		value: string | undefined,
	) => void;
	setArrayFilter: (key: 'sector', value: Array<string>) => void;
	addToFilterArray: (key: 'sector', ...value: Array<string>) => void;
	removeFilter: (key: keyof QueryFiltersData, value?: string) => void;
	resetFilters: () => void;
}
const DefaultData: IPaginatedAuctionsInCycleContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAuctionData>(1, 12, 'created_at', 'desc'),

	filters: DefaultQueryFiltersData,
	setAllFilters: () => {},
	setSingleFilter: () => {},
	setArrayFilter: () => {},
	addToFilterArray: () => {},
	removeFilter: () => {},
	resetFilters: () => {},
};
const Context = createContext<IPaginatedAuctionsInCycleContext>(DefaultData);

export interface PaginatedAuctionsInCycleProviderProps extends SortedOffsetPaginatedProviderProps {
	defaultFilters?: QueryFiltersData;
}
export const PaginatedAuctionsInCycleProvider = ({
	defaultFilters,
	syncWithSearchParams,
	id = 'paginatedAuctionsInCycle',
	...props
}: PaginatedAuctionsInCycleProviderProps) => {
	const { cycleId } = useParams();

	const [, setPage] = useQueryState(
		'page',
		parseAsInteger.withDefault(props.defaultPage || DefaultData.page),
	);
	const [filters, setAllFilters] = useConditionalQueryStates<QueryFiltersData>({
		type: parseAsStringLiteral(AuctionTypeListFilter),
		status: parseAsStringLiteral(AuctionStatusListFilter),
		sector: parseAsArrayOf(parseAsStringLiteral(SectorList)),
		joined: parseAsStringLiteral(AuctionJoinedStatusListFilter),
		ownership: parseAsStringLiteral(AuctionOwnershipListFilter),
		ownerId: parseAsString,

		defaultValue: defaultFilters || DefaultData.filters,
		syncWithSearchParams,

		//	Go back to the first page when filters change
		onValueChange: () => setPage(props.defaultPage || DefaultData.page),
	});

	const resetFilters = useCallback<IPaginatedAuctionsInCycleContext['resetFilters']>(
		() => setAllFilters(DefaultData.filters),
		[],
	);

	const removeFilter = useCallback<IPaginatedAuctionsInCycleContext['removeFilter']>(
		(key, value) => {
			if (value)
				setAllFilters({
					...filters,
					[key]: (filters[key] as Array<string>).filter((v) => v !== value),
				});
			else setAllFilters({ ...filters, [key]: DefaultData.filters[key] });
		},
		[filters],
	);

	const setSingleFilter = useCallback<IPaginatedAuctionsInCycleContext['setSingleFilter']>(
		(key, value) =>
			setAllFilters({
				...filters,
				[key]: value || DefaultData.filters[key],
			}),
		[filters],
	);

	const setArrayFilter = useCallback<IPaginatedAuctionsInCycleContext['setArrayFilter']>(
		(key, value) =>
			setAllFilters({
				...filters,
				//	@ts-expect-error - should be gone once we add a new type to array filter key
				[key]: Array.from(new Set(value)),
			}),
		[filters],
	);

	const addToFilterArray = useCallback<IPaginatedAuctionsInCycleContext['addToFilterArray']>(
		(key, ...value) =>
			setAllFilters({
				...filters,
				//	@ts-expect-error - should be gone once we add a new type to array filter key
				[key]: Array.from(new Set([...filters[key]!, ...value])),
			}),
		[filters],
	);

	const queryKey = useMemo(
		() => [
			'dashboard',
			'admin',
			cycleId as string,
			'paginatedAuctionsInCycle',
			JSON.stringify(filters),
		],
		[filters],
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
					type: filters.type,
					ownership: filters.ownership,
					isLive: filters.status === 'ongoing',
					hasEnded: filters.status === 'ended',
				}),
				`getPaginatedAuctionsInCycle:${cycleId}`,
			),
		[filters],
	);

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id={id}
			syncWithSearchParams={syncWithSearchParams}
			filters={filters}
			setAllFilters={setAllFilters}
			setSingleFilter={setSingleFilter}
			setArrayFilter={setArrayFilter}
			addToFilterArray={addToFilterArray}
			removeFilter={removeFilter}
			resetFilters={resetFilters}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedAuctionsInCycleContextData,
	Context as PaginatedAuctionsInCycleContext,
};
